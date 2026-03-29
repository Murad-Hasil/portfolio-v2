"""database.py — SQLModel engine + session factory.

Uses DATABASE_URL from env. Calls create_all on first access to ensure
tables exist during development (Alembic migration handles production).
"""

import os

from sqlmodel import Session, SQLModel, create_engine

_engine = None
_tables_created = False


def get_engine():
    global _engine, _tables_created
    if _engine is None:
        url = os.getenv("DATABASE_URL")
        if not url:
            raise RuntimeError("DATABASE_URL not set")
        _engine = create_engine(url)
    if not _tables_created:
        # Import models to register metadata before create_all
        from app import models  # noqa: F401

        SQLModel.metadata.create_all(_engine)
        _tables_created = True
    return _engine


def get_session():
    with Session(get_engine()) as session:
        yield session
