# Murad Hasil — AI Developer Portfolio

> Full-stack portfolio with a RAG-powered AI chatbot that knows everything about my work and experience.

[![CI/CD](https://github.com/Murad-Hasil/portfolio-v2/actions/workflows/deploy.yml/badge.svg)](https://github.com/Murad-Hasil/portfolio-v2/actions/workflows/deploy.yml)
[![Next.js](https://img.shields.io/badge/Next.js-16.2.1-black?logo=next.js)](https://nextjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![Python](https://img.shields.io/badge/Python-3.12-3776AB?logo=python)](https://python.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://typescriptlang.org)

## Live Demo

| Service | URL |
|---------|-----|
| Frontend | https://murad-hasil-portfolio-v2-xi.vercel.app |
| Backend API | https://mb-murad-portfolio-v2.hf.space |
| API Docs (Swagger) | https://mb-murad-portfolio-v2.hf.space/docs |

## Features

- **Projects showcase** — Featured AI projects with filter tabs and case study pages
- **RAG Chatbot** — Ask anything about my skills, projects, or services. Powered by Groq (Llama-3.3-70b) + Qdrant vector search
- **Contact form** — Rate-limited (3/hour) with reference number tracking and email notifications via Resend
- **Dark/light mode** — Persistent theme toggle
- **Mobile responsive** — Tested at 375px and 1280px
- **Error boundaries** — Custom 404 and error pages

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16.2.1, TypeScript, Tailwind CSS v4, Framer Motion |
| Backend | FastAPI, Python 3.12, SQLModel |
| Database | Neon PostgreSQL |
| Vector DB | Qdrant Cloud |
| AI/LLM | Groq (Llama-3.3-70b), fastembed (BAAI/bge-small-en-v1.5) |
| Email | Resend HTTP API |
| Deployment | Vercel (frontend), Hugging Face Spaces (backend) |
| CI/CD | GitHub Actions (lint → test → deploy) |

## Project Structure

```
portfolio-v2/
├── frontend/          # Next.js 16.2.1 app (TypeScript, Tailwind, Framer Motion)
├── backend/           # FastAPI app (Python 3.12, SQLModel, RAG pipeline)
├── context/           # Single source of truth: projects, skills, RAG knowledge base
├── scripts/           # RAG seeding and content sync scripts
├── specs/             # Spec-driven development artifacts (spec, plan, tasks)
├── history/           # Prompt History Records (PHRs) and ADRs
└── .specify/          # SpecKit Plus templates and constitution
```

## Quick Start

### Backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # fill in your keys (see Environment Variables below)
uvicorn app.main:app --reload
# → http://localhost:8000
```

### Frontend

```bash
cd frontend
npm install
# create .env.local — see Environment Variables below
npm run dev
# → http://localhost:3000
```

### Seed RAG Knowledge Base

```bash
cd backend && source .venv/bin/activate
python ../scripts/seed-rag.py
```

## Environment Variables

### Backend `.env`

```env
# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
DATABASE_DIRECT_URL=postgresql://user:pass@host/db?sslmode=require

# Qdrant (Vector DB)
QDRANT_URL=https://your-cluster.qdrant.io
QDRANT_API_KEY=your_qdrant_api_key

# LLM (Groq)
GROQ_API_KEY=gsk_your_groq_api_key
LLM_PROVIDER=groq
GROQ_MODEL=llama-3.3-70b-versatile

# Embeddings
EMBEDDING_PROVIDER=fastembed
EMBEDDING_MODEL=BAAI/bge-small-en-v1.5

# Email (Resend)
RESEND_API_KEY=re_your_resend_api_key
NOTIFY_EMAIL=your@email.com

# CORS
ALLOWED_ORIGINS=http://localhost:3000
```

### Frontend `.env.local`

```env
BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Testing

### Frontend (Vitest)

```bash
cd frontend
npm test          # run once
npm run test:watch  # watch mode
```

### Backend (pytest)

```bash
cd backend && source .venv/bin/activate
pytest tests/ -v
```

## Deployment

### Automated (CI/CD)

Every push to `main` triggers GitHub Actions:
1. **Lint** — ESLint + frontend unit tests
2. **Test** — pytest with real database/API connections
3. **Deploy** — Backend subtree pushed to HF Spaces; frontend auto-deploys on Vercel

Required GitHub Secrets: `DATABASE_URL`, `QDRANT_URL`, `QDRANT_API_KEY`, `OPENAI_API_KEY`, `GROQ_API_KEY`, `HUGGINGFACE_TOKEN`

### Manual Backend Deploy

```bash
git subtree push --prefix=backend hf main
```

> The `hf` remote points to `https://huggingface.co/spaces/Mb-Murad/portfolio-v2`.
> Set it up once: `git remote add hf https://Mb-Murad:<HF_TOKEN>@huggingface.co/spaces/Mb-Murad/portfolio-v2`

### Update Content (Projects / Skills / RAG)

```bash
# 1. Edit source files
#    context/projects-manifest.json  — projects
#    context/skills-manifest.json    — skills
#    context/rag-knowledge-base/     — chatbot knowledge

# 2. Sync to frontend + backend
bash scripts/sync-context.sh

# 3. Re-seed RAG
cd backend && source .venv/bin/activate
python ../scripts/seed-rag.py

# 4. Commit and push
git add . && git commit -m "content: update projects/skills"
git push origin main
```

## Known Platform Constraints

| Platform | Constraint | Solution |
|----------|-----------|----------|
| HF Spaces | Outbound port 587/465 blocked | Use Resend HTTP API, not SMTP |
| Resend API | Cloudflare WAF blocks default `urllib` User-Agent | Set `User-Agent: python-resend/1.0` |
| Neon PostgreSQL | Closes idle connections after ~5 min | `pool_pre_ping=True, pool_recycle=300` |
| HF Spaces free tier | Container sleeps after 48h idle | First request may take 30-60s to wake |

## Contact

**Murad Hasil** — AI Automation Engineer & Full-Stack Developer

- Email: mbmuradhasil@gmail.com
- LinkedIn: https://www.linkedin.com/in/muradhasil/
- GitHub: https://github.com/Murad-Hasil
- WhatsApp: +923142241393
