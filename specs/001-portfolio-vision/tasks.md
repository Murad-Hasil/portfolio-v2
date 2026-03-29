# Tasks: Portfolio Vision

**Input**: Design documents from `/specs/001-portfolio-vision/`
**Prerequisites**: plan.md ✅ spec.md ✅ research.md ✅ data-model.md ✅ contracts/ ✅ quickstart.md ✅

**Tests**: No TDD requested — Playwright MCP E2E verification after each section (per constitution Principle III).

**Organization**: Tasks grouped by user story for independent implementation and testing.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, folder structure, and root configuration.

- [x] T001 Create complete folder structure per plan.md (context/, frontend/, backend/, mcp-server/, scripts/, .github/workflows/)
- [x] T002 Initialize Next.js 15 App Router project in frontend/ with TypeScript strict mode (`npx create-next-app@latest frontend --typescript --tailwind --app --no-src-dir` then move to frontend/src/)
- [x] T003 [P] Initialize FastAPI backend in backend/ — create backend/app/__init__.py, backend/app/main.py skeleton, backend/requirements.txt with all dependencies from plan.md
- [x] T004 [P] Create root package.json with `dev` script using concurrently to run frontend (port 3000) and backend (port 8000) simultaneously
- [x] T005 [P] Create root .gitignore covering node_modules, .venv, __pycache__, .env, .env.local, .next, dist
- [x] T006 [P] Create frontend/tsconfig.json with strict: true, paths alias (@/ → src/)
- [x] T007 [P] Install frontend dependencies: Tailwind CSS 4, shadcn/ui, Framer Motion, next-themes (`npm install framer-motion next-themes`)
- [x] T008 [P] Create backend Python virtual environment and install requirements: fastapi uvicorn sqlmodel alembic psycopg2-binary slowapi fastembed qdrant-client groq openai python-dotenv

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that ALL user stories depend on — content files, DB schema, backend/frontend shells, design system.

⚠️ **CRITICAL**: No user story work can begin until this phase is complete.

- [x] T009 Create context/murad-profile.md with full profile from Portfolio-Spec.md Section 6.1 (name, title, email, WhatsApp, GitHub, summary, education, stats: 2+ years, 10+ projects, 20+ tech, 4 hackathons)
- [x] T010 [P] Create context/skills-manifest.json with all 5 categories from Portfolio-Spec.md Section 6.2 (ai_and_agents, frontend, backend, devops_and_cloud, automation — exact items and levels)
- [x] T011 [P] Create context/projects-manifest.json with all 4 projects from Portfolio-Spec.md Section 6.3 (crm-digital-fte, todo-cloud-ai, personal-ai-employee, ai-chatbot-demo — all fields)
- [x] T012 [P] Create context/services-manifest.json with 4 services: AI Chatbot & Agent Development, Business Automation, Full-Stack Web Apps, RAG / Knowledge Base Systems (name, target_client, deliverables[3], cta: "#contact")
- [x] T013 [P] Create context/brand-voice.md from Portfolio-Spec.md Section 6.4 (target audience, tone rules, what to emphasize, what to avoid, copy examples)
- [x] T014 Create context/rag-knowledge-base/ directory and 6 knowledge base files: about.md, skills.md, projects.md, services.md, faq.md, contact.md — fill each with real, detailed content about Murad (use context/ manifest files as source)
- [x] T015 Create backend/app/models.py with 4 SQLModel table definitions: Contact, ChatSession, ChatMessage, PageView — all fields per data-model.md
- [x] T016 [P] Initialize Alembic in backend/ (`alembic init alembic`) and configure alembic/env.py to use DATABASE_URL from env and import SQLModel metadata
- [x] T017 Create backend/app/providers/llm.py — get_llm_client() returning AsyncGroq or AsyncOpenAI based on LLM_PROVIDER env var
- [x] T018 [P] Create backend/app/providers/embeddings.py — get_embedding(text: str) → list[float] using fastembed BAAI/bge-small-en-v1.5 or OpenAI text-embedding-3-small based on EMBEDDING_PROVIDER env var
- [x] T019 Create backend/app/main.py — FastAPI app with CORS (ALLOWED_ORIGINS from env), slowapi Limiter on app.state, lifespan context manager, include all routers, GET /health endpoint
- [x] T020 Create frontend/src/styles/globals.css with all design system CSS custom properties from Portfolio-Spec.md Section 8.2 (--bg-primary #08080F, --accent-cyan #00D4FF, --accent-indigo #6366F1, all dark + light mode tokens)
- [x] T021 [P] Create frontend/src/app/layout.tsx — root layout with ThemeProvider (next-themes), Google Fonts (Space Grotesk, Inter, JetBrains Mono), SEO metadata defaults, JSON-LD Person schema for Murad
- [x] T022 [P] Create backend/.env.example and frontend/.env.local.example with all required variables per quickstart.md env reference table (DATABASE_URL, QDRANT_URL, QDRANT_API_KEY, LLM_PROVIDER, GROQ_API_KEY, GROQ_MODEL, EMBEDDING_PROVIDER, EMBEDDING_MODEL, ALLOWED_ORIGINS, BACKEND_URL, NEXT_PUBLIC_SITE_URL)

**Checkpoint**: Foundation ready — run `npm run dev` from root, verify both servers start. Run `curl http://localhost:8000/health`.

---

## Phase 3: User Story 1 — Client Evaluates Developer at a Glance (Priority: P1) 🎯 MVP

**Goal**: A first-time visitor sees Murad's role, tech stack, and proof of work within 30 seconds without scrolling past the hero.

**Independent Test**: Visit http://localhost:3000. Without scrolling, verify: (1) title visible, (2) tech stack pills visible, (3) two CTA buttons visible. Scroll to Projects — verify featured project cards with tech tags and metrics.

### Implementation for User Story 1

- [x] T023 [US1] Create frontend/src/components/layout/Navbar.tsx — sticky navbar with: "MH" monogram + "Murad Hasil" text, nav links (Projects, Skills, Services, About, Contact), Resume download button, GitHub icon, dark/light mode toggle, mobile hamburger using shadcn Sheet — backdrop blur on scroll
- [x] T024 [P] [US1] Create frontend/src/components/layout/Footer.tsx — footer with name, tagline, social links (GitHub, LinkedIn, WhatsApp, Email), copyright
- [x] T025 [US1] Create frontend/src/components/sections/Hero.tsx — hero section reading from context/murad-profile.md via API: headline "AI Automation Engineer & Full-Stack Developer", TypeAnimation rotating 4 roles, value proposition, tech stack pills (Next.js FastAPI OpenAI Kubernetes MCP), primary CTA "Hire Me on Upwork" + secondary "See My Work", social links, subtle dot-grid background (radial-gradient, opacity 0.15), Framer Motion stagger entrance animation
- [x] T026 Create backend/app/routers/projects.py — GET /projects (reads context/projects-manifest.json, returns all projects) and GET /projects/{slug} (returns single project, 404 if not found)
- [x] T027 [P] [US1] Create frontend/src/app/api/projects/route.ts — Route Handler proxying GET to BACKEND_URL/projects using server-side BACKEND_URL env var
- [x] T028 [P] [US1] Create frontend/src/app/api/projects/[slug]/route.ts — Route Handler proxying GET /projects/{slug}, forwards 404 from backend
- [x] T029 [US1] Create frontend/src/components/sections/Projects.tsx — Projects section: fetches from /api/projects, shows featured first, filter tabs (All | AI Agents | Full-Stack + AI | AI Automation | AI / Frontend), project cards (title, description, tech pills in [bracket] JetBrains Mono format, category badge, live demo link or "Local Deployment" badge, GitHub link), hover: border-color → --accent-cyan + glow, Framer Motion fadeInUp stagger
- [x] T030 [P] [US1] Create frontend/src/app/projects/[slug]/page.tsx — dynamic project case study page: fetches /api/projects/[slug], displays hero image, title, problem, solution, tech stack badges, metrics list, highlights list, links section, back button, unique SEO meta per project, generateStaticParams for all slugs
- [X] T031 Create backend/app/routers/skills.py — GET /skills (reads context/skills-manifest.json, returns all categories)
- [X] T032 [P] [US1] Create frontend/src/app/api/skills/route.ts — Route Handler proxying GET to BACKEND_URL/skills
- [x] T033 [US1] Create frontend/src/components/sections/Skills.tsx — Skills section: fetches from /api/skills, category tabs (AI & Agents | Frontend | Backend | DevOps & Cloud | Automation), skill items with name + proficiency dots (advanced=3 dots cyan, intermediate=2 dots), Framer Motion stagger on tab switch, mobile: horizontal scrollable tabs + 2-column grid
- [x] T034 [US1] Create frontend/src/components/sections/Services.tsx — Services section: reads from context/services-manifest.json (served statically or via API), 4 service cards (icon, name, target client, 3 deliverables, "Get Quote" button → #contact), hover: card lift + gradient border
- [x] T035 [US1] Create frontend/src/components/sections/About.tsx — About section: reads from context/murad-profile.md via API, profile photo (public/profile/murad.jpg), bio paragraph from brand-voice.md tone, 4 stat counters (2+ Years, 10+ Projects, 20+ Technologies, 4 Hackathons), GIAIC education badge, location, Download Resume + View Projects buttons — NO testimonials section
- [x] T036 [US1] Create frontend/src/app/page.tsx — home page assembling all sections in order: Hero, Projects, Skills, Services, About, Contact (placeholder for US3), ChatWidget (placeholder for US2)
- [x] T037 [US1] Playwright MCP verification — screenshot Navbar + Hero at 1440px and 375px, verify: title visible, tech pills visible, two CTAs above fold on mobile, dark/light toggle works, Projects section cards render with tech pills, Skills tabs all 5 work

**Checkpoint**: US1 complete — http://localhost:3000 shows full page, hero passes 30-second test, projects and skills browsable.

---

## Phase 4: User Story 2 — AI Chatbot (Priority: P2)

**Goal**: Floating chat widget answers visitor questions accurately from Murad's knowledge base via RAG pipeline.

**Independent Test**: Open chat widget → ask "What AI projects have you built?" → verify response contains real project details. Ask unknown question → verify fallback message with email. Test on mobile viewport.

### Implementation for User Story 2

- [x] T038 [US2] Create scripts/seed-rag.py — reads all .md files from context/rag-knowledge-base/, splits into 500-token chunks with 50-token overlap, generates embeddings via providers/embeddings.py get_embedding(), creates/recreates Qdrant collection "portfolio-knowledge" (size=384 for fastembed, size=1536 for openai), upserts all chunks with payload (text, source, chunk_index, embedding_provider), prints progress and final vector count
- [x] T039 [US2] Run seed-rag.py locally (EMBEDDING_PROVIDER=fastembed) — verify Qdrant collection populated with expected chunk count, fix any errors before proceeding
- [x] T040 Create backend/app/routers/chat.py — POST /chat endpoint: validate UUID session_id, save user message to chat_messages, get_embedding(message), search Qdrant top 5 chunks (cosine), fetch last 10 messages for history, build prompt (system + context + history + message), call LLM via get_llm_client() (max_tokens=300), save response with tokens_used, return {message, session_id, sources}. GET /chat/{session_id}: return full message history or 404. Handle Qdrant/LLM unavailability with 503
- [x] T041 [P] [US2] Create frontend/src/app/api/chat/route.ts — Route Handler proxying POST /chat and GET /chat/{session_id} to backend, passes session_id from request
- [x] T042 [US2] Create frontend/src/components/ChatWidget.tsx — floating button (bottom-right, chat icon + "Ask me anything" tooltip), slide-up panel (400px wide 500px tall desktop, fullscreen mobile), panel header "Ask about Murad" + close, message list (user right-aligned, bot left-aligned with avatar), 3-dot typing indicator, text input + send button, 4 suggested questions when empty, generates UUID session_id on first load stored in sessionStorage, Framer Motion slide-up animation
- [x] T043 [US2] Wire ChatWidget into frontend/src/app/page.tsx (replace placeholder)
- [x] T044 [US2] Playwright MCP verification — click chat button, verify panel opens; type "What AI projects have you built?", verify response appears with project details; ask unknown question, verify fallback message; test on 375px mobile viewport

**Checkpoint**: US2 complete — chatbot opens, answers from knowledge base, falls back gracefully.

---

## Phase 5: User Story 3 — Contact Form (Priority: P3)

**Goal**: Visitor submits enquiry, receives reference number. Invalid input shows inline errors. Rate limit enforced.

**Independent Test**: Submit form with valid data → verify YYYYMMDD-XXXX reference number. Submit with invalid email → verify inline error. Submit 4th time same session → verify rate limit message.

### Implementation for User Story 3

- [x] T045 Create backend/app/routers/contact.py — POST /contact: Pydantic ContactForm model (name, email, subject, service enum, message min 20 chars), generate reference (YYYYMMDD-XXXX format, sequential suffix), save to contacts table, return 201 {success, reference, message}. Apply @limiter.limit("3/hour") decorator using client IP. Sanitise inputs before storage. Return 422 for validation, 429 for rate limit
- [x] T046 [P] [US3] Create frontend/src/app/api/contact/route.ts — Route Handler proxying POST /contact to backend, forwards validation errors and 429 to client
- [x] T047 [US3] Create frontend/src/components/sections/Contact.tsx — Contact section: left side (email, WhatsApp, location, GitHub, LinkedIn links), right side form (name, email, subject, service dropdown, message textarea min 20 chars), react-hook-form + zod validation, submit with loading spinner, success state showing reference number, error state showing friendly message, rate limit message. Wire into frontend/src/app/page.tsx (replace placeholder)
- [x] T048 [US3] Playwright MCP verification — fill and submit valid form, screenshot success state with reference number; submit with invalid email, screenshot inline error; attempt 4th submission, verify rate limit message

**Checkpoint**: US3 complete — contact form submits, reference number returned, validation and rate limit working.

---

## Phase 6: User Story 4 — MCP Server Portfolio Management (Priority: P4)

**Goal**: Murad can add projects and rebuild RAG via CLI without code changes.

**Independent Test**: Run add_project tool with new project data → verify project appears in GET /projects. Run rebuild_rag → verify Qdrant chunk count increases. Run add_project with missing fields → verify error lists missing fields.

### Implementation for User Story 4

- [x] T049 Create backend/app/routers/analytics.py — POST /analytics/pageview: accepts {page, referrer?}, stores in page_views table (no IP stored), always returns 204 No Content
- [x] T050 [P] [US4] Create mcp-server/server.py — Python MCP SDK server exposing 6 tools per contracts/mcp-tools.md: add_project (update projects-manifest.json), update_skills (update skills-manifest.json), get_contact_submissions (query PostgreSQL contacts table, last N days), get_chat_analytics (aggregate chat_messages stats), update_profile (update murad-profile.md field), rebuild_rag (subprocess call to seed-rag.py, handle dimension mismatch by deleting+recreating collection). All tools: typed inputs, structured JSON returns, graceful error handling
- [x] T051 [P] [US4] Create mcp-server/requirements.txt (mcp, requests, psycopg2-binary, python-dotenv) and mcp-server/README.md (setup steps, tool descriptions, how to connect to Claude Code)
- [x] T052 [US4] Create .claude/mcp-config.json with portfolio MCP server and Playwright MCP server entries per quickstart.md. Create scripts/update-project.py as convenience wrapper calling add_project + prompting for rebuild_rag
- [x] T053 [US4] Manual verification — run add_project tool with a test project entry, verify it appears in GET /api/projects response; run rebuild_rag, verify new chunks in Qdrant; run add_project with missing fields, verify error response

**Checkpoint**: US4 complete — MCP tools functional, portfolio updatable without code changes.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Deployment, SEO, CI/CD, production build verification, full E2E test pass.

- [X] T054 [P] Create backend/Dockerfile (python:3.12-slim, copy requirements.txt + install, copy app/, CMD uvicorn app.main:app --host 0.0.0.0 --port $PORT) and backend/railway.json (healthcheckPath: "/health", healthcheckTimeout: 30, startCommand using $PORT)
- [X] T055 [P] Create .github/workflows/deploy.yml — on push to main: job 1 lint (eslint frontend), job 2 test (pytest backend/tests/), job 3 deploy-vercel (npx vercel --prod --token $VERCEL_TOKEN using VERCEL_ORG_ID + VERCEL_PROJECT_ID secrets), job 4 deploy-railway (curl POST $RAILWAY_DEPLOY_WEBHOOK). On PR: lint + test only. Add DEPLOYMENT_GUIDE.md listing all required GitHub secrets
- [X] T056 Update frontend/src/app/layout.tsx — add complete SEO metadata (title template, description from brand-voice.md, OG tags, Twitter card, canonical URL), JSON-LD Person schema with Murad's details from context/murad-profile.md
- [X] T057 [P] Create frontend/next.config.ts — production settings: image domains whitelist, output configuration, env var BACKEND_URL passed to server components
- [X] T058 [P] Create frontend/next-sitemap.config.js — sitemap generation including all project slugs from projects-manifest.json
- [X] T059 Run Alembic migration against Neon PostgreSQL (alembic upgrade head) — verify all 4 tables created: contacts, chat_sessions, chat_messages, page_views
- [X] T060 Full Playwright MCP E2E test suite — run all 10 tests per Portfolio-Spec.md Section 15: (1) homepage loads < 2s hero visible, (2) nav links scroll correctly, (3) Projects filter tabs, (4) Skills all 5 tabs, (5) contact valid submit → reference number, (6) contact invalid email → error, (7) chat open + message response, (8) mobile 375px all sections, (9) dark mode toggle, (10) resume download. Document results in tests/e2e/results.md with screenshots
- [X] T061 Run `npm run build` in frontend/ — verify production build completes with zero TypeScript errors and zero ESLint errors. Fix any issues found
- [X] T062 [P] Run pytest in backend/ — verify all endpoint tests pass. Fix any issues found
- [X] T063 Run Lighthouse audit on http://localhost:3000 production build — verify score ≥ 90 on desktop. Document score and any improvements made

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 completion — BLOCKS all user stories
- **Phase 3 (US1)**: Depends on Phase 2 — can start after foundational complete
- **Phase 4 (US2)**: Depends on Phase 2 + T026 (backend /chat needs /projects for context seeding)
- **Phase 5 (US3)**: Depends on Phase 2 — independent of US1 and US2
- **Phase 6 (US4)**: Depends on Phase 2 + Phase 4 (rebuild_rag needs seed-rag.py from US2)
- **Phase 7 (Polish)**: Depends on all user story phases complete

### User Story Dependencies

- **US1 (P1)**: Depends on Phase 2 only. Independent from US2, US3, US4
- **US2 (P2)**: Depends on Phase 2. Independent from US1 (chatbot works without full UI)
- **US3 (P3)**: Depends on Phase 2. Independent from US1 and US2
- **US4 (P4)**: Depends on seed-rag.py from US2 (T038); otherwise independent

### Within Each Phase

- All [P]-marked tasks can run in parallel
- Models before services before endpoints (backend)
- Context files before components (frontend reads context/)
- Seed RAG (T038-T039) before /chat endpoint implementation (T040)

---

## Parallel Opportunities

### Phase 2 Foundational — run in parallel groups:

```bash
# Group A (content files — all parallel):
T009 murad-profile.md
T010 skills-manifest.json
T011 projects-manifest.json
T012 services-manifest.json
T013 brand-voice.md

# Group B (backend infra — parallel with Group A):
T015 models.py
T016 Alembic init
T017 providers/llm.py
T018 providers/embeddings.py

# Group C (frontend infra — parallel with Group A+B):
T020 globals.css
T021 layout.tsx
T022 .env.example files
```

### Phase 3 US1 — backend + frontend parallel:

```bash
# Backend (can start immediately after T019):
T026 routers/projects.py
T031 routers/skills.py

# Frontend (can start after T026/T031):
T027 api/projects/route.ts      # parallel with T028
T028 api/projects/[slug]/route.ts
T032 api/skills/route.ts

# UI sections (parallel with each other after context files ready):
T023 Navbar.tsx
T024 Footer.tsx
T025 Hero.tsx
T033 Skills.tsx
T034 Services.tsx
T035 About.tsx
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL)
3. Complete Phase 3: US1 (Hero + Projects + Skills + Services + About)
4. **STOP and VALIDATE**: Visit http://localhost:3000, run Playwright screenshots, verify 30-second test passes
5. Deploy US1 to Vercel + Railway for stakeholder review

### Incremental Delivery

1. Setup + Foundational → dev environment running
2. US1 → Hero + full page visible → deploy (MVP)
3. US2 → Chatbot live → deploy (key differentiator live)
4. US3 → Contact form → deploy (lead capture working)
5. US4 → MCP tools → portfolio self-maintainable
6. Polish → production-ready deploy

---

## Notes

- [P] = parallelizable (different files, no blocking dependency)
- [USN] = maps to User Story N from spec.md
- Each phase ends with a Playwright MCP checkpoint screenshot
- Constitution Principle III requires Playwright screenshots at 1440px + 375px after EVERY component
- Context files in context/ are read-only during implementation — updated only via MCP tools (US4)
- Never hardcode content — always read from context/ files
- TypeScript strict mode: zero `any` types allowed
- All FastAPI endpoints: Pydantic models for request/response, proper HTTP status codes
