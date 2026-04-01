<!--
SYNC IMPACT REPORT
==================
Version change: 1.1.0 → 1.2.0
Modified sections:
  - Principle VI (RAG Chatbot): added planned improvements — streaming responses
    and conversation memory; added note that /chat endpoint upgrade tracked in
    specs/002-chatbot-rag/
  - Known Platform Constraints: added RAG chunking strategy note
  - Version policy footer updated
Added sections: none
Removed: N/A
Deferred TODOs (carried forward):
  - Upwork/Fiverr profile URLs: add to context/murad-profile.md when available
  - LinkedIn URL: marked in murad-profile.md as [your LinkedIn URL]
  - Conversation memory (Redis/DB backend): deferred — tracked in specs/002-chatbot-rag/tasks.md
-->

# Murad Hasil Portfolio v2 — Constitution

## Core Principles

### I. Spec-First Mandate

Before writing any code or component, the agent MUST:

1. Read the relevant spec file in `/specs/` for the feature being built.
2. Read all context files relevant to the feature (`context/murad-profile.md`,
   `context/skills-manifest.json`, `context/projects-manifest.json`,
   `context/brand-voice.md`).
3. If the spec is unclear or contradictory, create a discovery entry in
   `/specs/discovery-log.md` and surface the ambiguity to the user before
   proceeding.

No code may be written without a spec backing it. The spec is the contract;
the code is the fulfillment.

**Rationale**: This portfolio is built spec-first to demonstrate the same
methodology Murad sells to clients. Skipping spec review produces drift between
intent and implementation and destroys the proof-of-methodology narrative.

### II. Content Authenticity

- All visible copy MUST be professional English targeting international clients
  (Upwork / Fiverr).
- Data (projects, skills, services, stats) MUST be read from `context/` files.
  Hardcoding content in components is PROHIBITED.
- Placeholder content (Lorem ipsum, fake metrics, "[your LinkedIn URL]") MUST
  NOT appear in any rendered output.
- A testimonials section MUST NOT be created — no real testimonials exist yet.
- Stats MUST match `context/murad-profile.md` exactly:
  - Experience: 2+ Years
  - Projects Completed: 10+
  - Technologies Used: 20+
  - Hackathons Completed: 4

**Rationale**: International clients judge credibility on first impression.
Inaccurate or placeholder content immediately signals unprofessionalism.

### III. Design System Compliance

All UI components MUST conform to the "Robotic but Professional" design system
(reference: Vercel Dashboard + Linear App aesthetic). Non-negotiable rules:

**Colors** — use only defined CSS custom properties:
- `--accent-cyan: #00D4FF` (primary CTA, highlights)
- `--accent-indigo: #6366F1` (tags, badges)
- `--bg-primary: #08080F` (dark mode base)
- No purple-to-pink gradients, no coral/warm reds, no yellow accents.

**Typography**:
- Headings: Space Grotesk
- Body: Inter
- Code / tech tags: JetBrains Mono

**Components**:
- Cards: `border-radius: 8px` (`rounded-lg`), 1px border, cyan glow on hover.
- Buttons: `border-radius: 6px` (`rounded-md`). No `rounded-full` except tag
  pills.
- Tech pills: JetBrains Mono, `[bracket]` format, indigo tint background.
- Animations: Framer Motion, max `y: 20`, max `scale: 1.02`, MUST respect
  `prefers-reduced-motion`.

After building any component, the agent MUST use Playwright MCP to screenshot
at 1440px (desktop) and 375px (mobile) and verify compliance.

**Rationale**: The design system is the portfolio's professional signal. One
inconsistent component undermines the entire impression.

### IV. Type Safety & Code Quality

- TypeScript `strict` mode: ALWAYS enabled in `tsconfig.json`.
- `any` types: PROHIBITED. Use proper interfaces and generics.
- All FastAPI request/response bodies MUST use Pydantic models.
- `console.log` statements: PROHIBITED in production code.
- All API responses MUST use proper HTTP status codes.
- Rate limiting MUST be applied to user-facing POST endpoints
  (e.g., `/contact`: max 3 submissions per IP per hour).

**Rationale**: Type safety and clean code are the baseline for production-grade
work. This portfolio is proof of skill — low-quality code directly contradicts
the value proposition.

### V. Accessibility & Responsiveness

- WCAG 2.1 AA: MINIMUM compliance for all components.
- Mobile-first: all layouts designed for 375px upward.
- Tap targets: minimum 44×44px for all interactive elements.
- No horizontal scroll at any breakpoint (375px / 768px / 1440px).
- `prefers-reduced-motion`: MUST be respected in all Framer Motion animations.
- Contrast: all text must pass AA ratio against its background.

**Rationale**: International freelancing clients may access the portfolio from
any device. A broken mobile layout or inaccessible form costs a real lead.

### VI. RAG Chatbot Grounding

The portfolio chatbot MUST:

- Answer ONLY from the knowledge base (`context/rag-knowledge-base/`).
- When information is not in the knowledge base, respond exactly:
  `"I don't have that information. Please contact Murad directly at
  mbmuradhasil@gmail.com"`
- NEVER promise availability, pricing, or timelines on behalf of Murad.
- Maintain a professional, helpful, concise tone.
- Store all chat history in PostgreSQL `chat_messages` table with `tokens_used`.

LLM and embedding providers are switchable via environment variables only —
no code changes needed to switch between Groq and OpenAI:
- `LLM_PROVIDER=groq` → Llama 3.3 70B (free tier default)
- `LLM_PROVIDER=openai` → GPT-4o-mini (paid upgrade)
- `EMBEDDING_PROVIDER=fastembed` → BAAI/bge-small-en (local, 384 dims, default)
- `EMBEDDING_PROVIDER=openai` → text-embedding-3-small (1536 dims)

**Note**: Switching embedding provider requires re-running `scripts/seed-rag.py`
and recreating the Qdrant collection (dimension mismatch).

**Current RAG pipeline state** (as of v1.2.0):
- Chunking: word-count (375 words, 40 word overlap) — sufficient for current corpus size (15 vectors)
- Retrieval: pure vector search (cosine similarity, top 5 chunks)
- Memory: stateless — each request is independent (no conversation history sent to LLM)
- Streaming: not yet implemented — response returned in single batch

**Planned improvements** (tracked in `specs/002-chatbot-rag/`):
- Streaming responses via Server-Sent Events (SSE) — approved, next to implement
- Conversation memory (last N turns) — approved, next to implement after streaming
- Hybrid search / reranking — deferred until corpus exceeds ~200 vectors

**Knowledge base update protocol**: After editing any file in
`context/rag-knowledge-base/`, ALWAYS re-run `scripts/seed-rag.py` to refresh
Qdrant. Also grep all KB files for stale references before declaring an update
complete.

**Rationale**: The chatbot is the portfolio's key differentiator. Hallucination
or incorrect promises would damage Murad's professional reputation with clients.

### VII. Secrets & Environment Hygiene

- Secrets and API keys MUST NEVER be hardcoded. Use `.env` files only.
- `.env` files MUST be in `.gitignore`. Only `.env.example` is committed.
- All required environment variables MUST be documented in `.env.example` with
  placeholder values and comments explaining each variable.
- Production environment variables MUST be set in the deployment platform
  (Vercel for frontend, Hugging Face Spaces for backend) — never in committed files.

**Rationale**: A portfolio is a public-facing project. Leaked credentials in a
public GitHub repo would be immediately exploited and cause real damage.

## Tech Stack & Architecture

This is the authoritative technology stack. Deviations require updating this
constitution.

| Layer | Technology | Notes |
|---|---|---|
| Frontend | Next.js 16.2.1 (App Router) + TypeScript | `/frontend/` |
| Styling | Tailwind CSS 4 + shadcn/ui | Design system tokens in `globals.css` |
| Animations | Framer Motion | See Principle III for constraints |
| Backend | FastAPI (Python 3.12) + SQLModel | `/backend/` |
| Database | Neon PostgreSQL | Tables: contacts, chat_sessions, chat_messages, page_views |
| Vector DB | Qdrant Cloud | Collection: `portfolio-knowledge` |
| LLM | Groq (Llama 3.3 70B) → OpenAI GPT-4o-mini | Switchable via `LLM_PROVIDER` |
| Embeddings | fastembed (local) → OpenAI text-embedding-3-small | Switchable via `EMBEDDING_PROVIDER` |
| Email | Resend HTTP API | `onboarding@resend.dev` → account email. User-Agent: `python-resend/1.0` required |
| Browser Testing | Playwright MCP | Required after every UI component |
| Frontend Deploy | Vercel | Auto-deploys on push to `main` |
| Backend Deploy | Hugging Face Spaces | Docker container, port 7860. Deploy via git subtree (see below) |
| CI/CD | GitHub Actions | `.github/workflows/deploy.yml` — lint + test + auto-deploy to HF |
| MCP Server | Python MCP SDK | `/mcp-server/` — 6 portfolio management tools |

**Architecture**: Next.js (Vercel) ↔ HTTPS ↔ FastAPI (HF Spaces) ↔ Neon PostgreSQL
FastAPI also connects to Qdrant Cloud and LLM/embedding provider APIs.

## Deployment Architecture

### Frontend (Vercel)
- Auto-deploys on every push to `main` — no manual step needed.
- Live URL: `https://muradhasil.vercel.app` (or custom domain when configured)
- Environment variables set in Vercel dashboard: `BACKEND_URL`, `NEXT_PUBLIC_SITE_URL`

### Backend (Hugging Face Spaces)
- Space: `https://huggingface.co/spaces/Mb-Murad/portfolio-v2`
- Live URL: `https://mb-murad-portfolio-v2.hf.space`
- Runtime: Docker container from `/backend/Dockerfile`, port 7860
- **Deploy command** (local): `git subtree push --prefix=backend hf main`
- **Deploy via CI**: GitHub Actions `deploy-backend` job runs automatically on push to `main`
  (requires `HUGGINGFACE_TOKEN` secret in GitHub repo settings)
- **Setup HF remote** (first time or after cloning):
  ```
  git remote add hf https://Mb-Murad:<YOUR_TOKEN>@huggingface.co/spaces/Mb-Murad/portfolio-v2
  ```

### How to generate HUGGINGFACE_TOKEN
1. Go to https://huggingface.co → Settings → Access Tokens
2. Create new token with **Write** permission
3. Add to GitHub: repo Settings → Secrets and variables → Actions → `HUGGINGFACE_TOKEN`

### Keep-Alive
Backend sleeps after ~15 minutes of inactivity on HF free tier.
GitHub Actions cron (`.github/workflows/keep-alive.yml`) pings `/health` every 8 minutes.

---

## Known Platform Constraints

These are hard-won lessons from production debugging. Future agents MUST read this before troubleshooting email, DB, or HTTP issues.

### HF Spaces — Outbound Port Blocking
- **Ports 587 and 465 are BLOCKED** on HF Spaces (and most cloud platforms).
- This means Gmail SMTP and any SMTP-based email sending WILL FAIL silently or with connection refused.
- **Solution**: Use HTTP-based email APIs only (Resend, SendGrid, Mailgun, etc.)

### Resend API — Cloudflare WAF Block
- Python's `urllib.request` sends no User-Agent by default.
- Cloudflare (in front of `api.resend.com`) returns **error code 1010** (client banned by signature).
- **Solution**: Always include `"User-Agent": "python-resend/1.0"` in the request headers.
- This is already in `backend/app/routers/contact.py` — do NOT remove it.

### Resend API — Sender Restrictions (No Custom Domain)
- `onboarding@resend.dev` can only send TO the Resend account's registered email.
- Sending to any other address with this from-address returns **403 Forbidden**.
- **Current setup**: `NOTIFY_EMAIL` must equal the Resend account email (`mbmuradhasil@gmail.com`).
- **Upgrade path**: Verify a custom domain on Resend → change `from` to `noreply@yourdomain.com`.

### Neon PostgreSQL — Idle Connection Timeouts
- Neon closes idle connections after a short timeout (serverless behavior).
- SQLAlchemy will throw `SSL connection has been closed unexpectedly` on the next query.
- **Solution**: Engine must be created with `pool_pre_ping=True, pool_recycle=300`.
- This is already configured in `backend/app/database.py` — do NOT remove these params.
- Use `DATABASE_URL` (pooled) for app queries. Use `DATABASE_DIRECT_URL` for Alembic migrations.

### RAG Knowledge Base — Partial Updates
- When replacing a project or technology, ALL knowledge base files must be updated.
- References can exist in: `projects.md`, `faq.md`, `skills.md`, `about.md`.
- **Always grep ALL files** in `context/rag-knowledge-base/` before declaring an update complete.
- After updating any KB file, re-run `scripts/seed-rag.py` to refresh Qdrant vectors.

---

## Environment Variables

### HF Spaces (Backend) — Required
| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Neon pooled connection URL (use for app queries) |
| `DATABASE_DIRECT_URL` | Neon direct URL (use for Alembic migrations only) |
| `QDRANT_URL` | Qdrant Cloud cluster URL |
| `QDRANT_API_KEY` | Qdrant API key |
| `GROQ_API_KEY` | Groq API key (default LLM provider) |
| `RESEND_API_KEY` | Resend API key for email notifications |
| `NOTIFY_EMAIL` | Email to receive contact form notifications (must match Resend account email) |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins (e.g., `https://muradhasil.vercel.app`) |

### HF Spaces (Backend) — Optional
| Variable | Description | Default |
|----------|-------------|---------|
| `LLM_PROVIDER` | `groq` or `openai` | `groq` |
| `GROQ_MODEL` | Groq model name | `llama-3.3-70b-versatile` |
| `OPENAI_API_KEY` | OpenAI key (if LLM_PROVIDER=openai) | — |
| `OPENAI_MODEL` | OpenAI model name | `gpt-4o-mini` |
| `EMBEDDING_PROVIDER` | `fastembed` or `openai` | `fastembed` |
| `EMBEDDING_MODEL` | Model name for embeddings | `BAAI/bge-small-en-v1.5` |

### Vercel (Frontend) — Required
| Variable | Description |
|----------|-------------|
| `BACKEND_URL` | HF Spaces URL: `https://mb-murad-portfolio-v2.hf.space` |
| `NEXT_PUBLIC_SITE_URL` | Public site URL for OG tags and canonical links |

### Removed (no longer used)
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` — removed when migrating from SMTP to Resend

---

## Development Workflow

### File Creation Rules
- Frontend components: `/frontend/src/components/`
- Backend routes: `/backend/app/routers/`
- Context data: `/context/` (read-only during build; update via MCP tools)
- Never create files outside the defined folder structure.
- After implementing a feature, update the relevant spec file in `/specs/`.

### When Stuck
1. Document the blocker in `/specs/discovery-log.md`.
2. Try one alternative approach.
3. If still blocked, stop and surface a clear summary to the user.
   Do not brute-force or bypass constraints.

### Update Protocol (adding new projects)
1. Update `context/projects-manifest.json` with project metadata.
2. Update `context/rag-knowledge-base/projects.md` with detailed writeup.
3. Re-run `scripts/seed-rag.py` to refresh Qdrant vectors.
4. Use Playwright MCP to verify the new project appears and chatbot answers
   correctly about it.

### Sub-Agent Roles (available when needed)
- `uiux-agent`: design system compliance review + Playwright screenshots
- `content-writer`: brand voice review against `context/brand-voice.md`
- `seo-specialist`: meta tags, JSON-LD, sitemap review
- `code-reviewer`: production quality audit
- `accessibility-auditor`: WCAG 2.1 AA verification

## Governance

- This constitution supersedes all other practices, conventions, and
  preferences for this project.
- `Portfolio-Spec.md` is the **source of truth for requirements**. This
  constitution governs **how** those requirements are implemented.
- All significant architectural decisions MUST be proposed as ADRs. Run
  `/sp.adr <decision-title>` after user consent. Never auto-create ADRs.
- Amendments to this constitution require:
  1. Updating this file with a new version number.
  2. Updating the Sync Impact Report comment at the top.
  3. Updating `Portfolio-Spec.md` version history table.
  4. Propagating changes to any affected spec/plan/tasks files.
- Version policy: MAJOR for principle removals/redefinitions, MINOR for new
  principles or sections, PATCH for clarifications and wording fixes.
- Compliance is verified by the agent before each `/sp.plan` execution
  (Constitution Check gate in `plan-template.md`).

**Version**: 1.2.0 | **Ratified**: 2026-03-23 | **Last Amended**: 2026-04-01
