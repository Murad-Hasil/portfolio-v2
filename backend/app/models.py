from datetime import datetime, timezone
from typing import Optional

from sqlmodel import Field, SQLModel


def _now() -> datetime:
    return datetime.now(timezone.utc)


class Contact(SQLModel, table=True):
    __tablename__ = "contacts"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(max_length=100)
    email: str = Field(max_length=255)
    subject: str = Field(max_length=200)
    service: str = Field(max_length=50)
    message: str
    reference: str = Field(unique=True, max_length=20)
    ip_address: Optional[str] = Field(default=None, max_length=45)
    created_at: datetime = Field(default_factory=_now)


class ChatSession(SQLModel, table=True):
    __tablename__ = "chat_sessions"

    id: Optional[int] = Field(default=None, primary_key=True)
    session_id: str = Field(unique=True, max_length=36)
    created_at: datetime = Field(default_factory=_now)
    messages_count: int = Field(default=0)


class ChatMessage(SQLModel, table=True):
    __tablename__ = "chat_messages"

    id: Optional[int] = Field(default=None, primary_key=True)
    session_id: str = Field(max_length=36, foreign_key="chat_sessions.session_id")
    role: str = Field(max_length=10)  # "user" | "assistant"
    content: str
    tokens_used: Optional[int] = Field(default=None)
    created_at: datetime = Field(default_factory=_now)


class PageView(SQLModel, table=True):
    __tablename__ = "page_views"

    id: Optional[int] = Field(default=None, primary_key=True)
    page: str = Field(max_length=100)
    referrer: Optional[str] = Field(default=None, max_length=500)
    country: Optional[str] = Field(default=None, max_length=2)
    created_at: datetime = Field(default_factory=_now)
