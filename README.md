# Murad Hasil — AI Developer Portfolio

> Full-stack portfolio with a RAG-powered AI chatbot that knows everything about my work and experience.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![Python](https://img.shields.io/badge/Python-3.12-3776AB?logo=python)](https://python.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://typescriptlang.org)

## Live Demo

| Service | URL |
|---------|-----|
| Frontend | https://muradhasil.dev *(coming soon)* |
| Backend API | https://mb-murad-portfolio-v2.hf.space |
| API Docs | `/docs` |

## What This Portfolio Does

- **Projects showcase** — 4 featured AI projects with filter tabs and case study pages
- **RAG Chatbot** — Ask anything about my skills, projects, or services. Powered by Groq (Llama-3.3-70b) + Qdrant vector search
- **Contact form** — Rate-limited form with reference number tracking
- **Dark/light mode** — Persistent theme toggle
- **Mobile responsive** — Tested at 375px and 1280px

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS, Framer Motion |
| Backend | FastAPI, Python 3.12, SQLModel |
| Database | Neon PostgreSQL |
| Vector DB | Qdrant Cloud |
| AI/LLM | Groq (Llama-3.3-70b), fastembed (BAAI/bge-small-en-v1.5) |
| Deployment | Vercel (frontend), Hugging Face Spaces (backend) |
| CI/CD | GitHub Actions |

## Project Structure

```
portfolio-v2/
├── frontend/          # Next.js 15 app
├── backend/           # FastAPI app
├── context/           # Content files (projects, skills, RAG knowledge base)
├── scripts/           # RAG seeding and update scripts
├── mcp-server/        # MCP server for portfolio management
├── specs/             # Spec-driven development artifacts
└── tests/             # E2E test results and screenshots
```

## Quick Start

### Backend
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # fill in your keys
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
# create .env.local with BACKEND_URL=http://localhost:8000
npm run dev
```

### Seed RAG Knowledge Base
```bash
cd backend
python ../scripts/seed-rag.py
```

## Environment Variables

### Backend `.env`
```
DATABASE_URL=postgresql://...        # Neon pooled URL
DATABASE_DIRECT_URL=postgresql://... # Neon direct URL (for Alembic)
QDRANT_URL=https://...
QDRANT_API_KEY=...
GROQ_API_KEY=...
ALLOWED_ORIGINS=http://localhost:3000
```

### Frontend `.env.local`
```
BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Deployment

Backend is deployed on Hugging Face Spaces (Docker).
Frontend deploys automatically to Vercel on push to `main`.

## Contact

**Murad Hasil** — AI Automation Engineer & Full-Stack Developer

- Email: mbmuradhasil@gmail.com
- LinkedIn: https://www.linkedin.com/in/muradhasil/
- GitHub: https://github.com/Murad-Hasil
- WhatsApp: +923142241393
