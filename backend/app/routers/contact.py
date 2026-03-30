"""contact.py — POST /contact: contact form submission with rate limiting."""

import logging
import os
import re
import smtplib
from datetime import datetime, timezone
from email.mime.text import MIMEText
from typing import Literal

from fastapi import APIRouter, BackgroundTasks, HTTPException, Request, Response
from pydantic import BaseModel, EmailStr, field_validator
from sqlmodel import Session, func, select

from app._limiter import limiter
from app.database import get_engine
from app.models import Contact

log = logging.getLogger(__name__)

router = APIRouter(prefix="/contact", tags=["contact"])

ServiceEnum = Literal["AI Chatbot", "Automation", "Web App", "RAG System", "Other"]

_TAG_RE = re.compile(r"<[^>]+>")


def _sanitise(text: str) -> str:
    """Strip HTML tags and trim whitespace."""
    return _TAG_RE.sub("", text).strip()


class ContactForm(BaseModel):
    name: str
    email: EmailStr
    subject: str
    service: ServiceEnum
    message: str

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("name is required")
        if len(v) > 100:
            raise ValueError("name must be ≤ 100 characters")
        return v

    @field_validator("subject")
    @classmethod
    def validate_subject(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("subject is required")
        if len(v) > 200:
            raise ValueError("subject must be ≤ 200 characters")
        return v

    @field_validator("message")
    @classmethod
    def validate_message(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 20:
            raise ValueError("message must be at least 20 characters")
        return v


def _send_notification(contact: Contact) -> None:
    """Send email notification to site owner — runs in background."""
    smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USER", "")
    smtp_pass = os.getenv("SMTP_PASS", "")
    notify_email = os.getenv("NOTIFY_EMAIL", smtp_user)

    if not smtp_user or not smtp_pass:
        log.warning("SMTP credentials not configured — skipping email notification")
        return

    body = (
        f"New contact form submission\n"
        f"Reference: {contact.reference}\n\n"
        f"Name:    {contact.name}\n"
        f"Email:   {contact.email}\n"
        f"Service: {contact.service}\n"
        f"Subject: {contact.subject}\n\n"
        f"Message:\n{contact.message}\n"
    )
    msg = MIMEText(body)
    msg["Subject"] = f"[Portfolio] New message from {contact.name} ({contact.reference})"
    msg["From"] = smtp_user
    msg["To"] = notify_email

    try:
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_pass)
            server.sendmail(smtp_user, [notify_email], msg.as_string())
        log.info("Notification email sent for %s", contact.reference)
    except Exception as exc:  # noqa: BLE001
        log.error("Failed to send notification email: %s", exc)


def _generate_reference(db: Session) -> str:
    """Generate a YYYYMMDD-XXXX reference for today, sequential per day."""
    today = datetime.now(timezone.utc).strftime("%Y%m%d")
    prefix = f"{today}-"
    count = db.exec(
        select(func.count(Contact.id)).where(Contact.reference.startswith(prefix))
    ).one()
    return f"{prefix}{(count + 1):04d}"


@router.post("", status_code=201)
@limiter.limit("3/hour")
async def post_contact(
    request: Request,
    body: ContactForm,
    response: Response,
    background_tasks: BackgroundTasks,
) -> dict:
    try:
        engine = get_engine()
    except RuntimeError:
        raise HTTPException(status_code=503, detail="Service temporarily unavailable.")

    with Session(engine) as db:
        reference = _generate_reference(db)
        ip = request.client.host if request.client else None
        contact = Contact(
            name=_sanitise(body.name),
            email=str(body.email),
            subject=_sanitise(body.subject),
            service=body.service,
            message=_sanitise(body.message),
            reference=reference,
            ip_address=ip,
        )
        db.add(contact)
        db.commit()
        db.refresh(contact)

    background_tasks.add_task(_send_notification, contact)
    response.status_code = 201
    return {
        "success": True,
        "reference": reference,
        "message": "Thank you! Murad will respond within 24-48 hours.",
    }
