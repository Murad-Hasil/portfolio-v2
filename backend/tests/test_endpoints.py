"""Basic endpoint smoke tests."""

import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_projects_list():
    response = client.get("/projects")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0


def test_projects_slug_valid():
    response = client.get("/projects/crm-digital-fte")
    assert response.status_code == 200
    project = response.json()
    assert project["slug"] == "crm-digital-fte"


def test_projects_slug_not_found():
    response = client.get("/projects/nonexistent-slug")
    assert response.status_code == 404


def test_skills_list():
    response = client.get("/skills")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, dict)
    assert "skills" in data


def test_contact_invalid_email():
    response = client.post("/contact", json={
        "name": "Test User",
        "email": "not-an-email",
        "subject": "Test",
        "service": "AI Chatbot",
        "message": "This is a test message that is long enough.",
    })
    assert response.status_code == 422


def test_contact_valid_submission():
    response = client.post("/contact", json={
        "name": "Test User",
        "email": "test@example.com",
        "subject": "Test Subject",
        "service": "AI Chatbot",
        "message": "This is a test message that is long enough to pass validation.",
    })
    # 201 = success, 429 = rate limited — both are acceptable in CI
    assert response.status_code in (201, 429)
