# Murad Hasil — Projects

## Project 1: CRM Digital FTE — Omnichannel AI Customer Success Agent

**Category**: AI Agents | **Status**: Completed | **Featured**: Yes

**GitHub**: https://github.com/Murad-Hasil/crm-digital-fte

### What It Does
An autonomous AI customer success agent that handles Gmail, WhatsApp, and Web Form channels simultaneously — 24/7 without human intervention. It resolves customer queries, identifies the same customer across channels, escalates based on sentiment or keyword triggers, and logs everything to a custom PostgreSQL CRM with pgvector.

### The Business Problem
A SaaS company needs 24/7 customer support across 3 channels but human FTEs cost $75,000/year each. This Digital FTE operates at under $1,000/year while handling the same volume with no downtime and no sick days.

### Technical Solution
Built with the OpenAI Agents SDK, the agent uses Groq LLaMA 3.3 70B as the model and exposes 5 function_tools for CRM operations. AIOKafka event streaming (topic: fte.tickets.incoming, acks=all, idempotent producer) decouples the 3 input channels so they process independently. Customer identity resolution uses a customer_identifiers table to match the same person across Gmail, WhatsApp, and web form. Pre-LLM guardrails intercept pricing inquiries, aggressive language, and legal threats before they reach the AI model. Deployed on Kubernetes with dual HPA: API pods scale 3→20, worker pods scale 3→30, both triggered at 70% CPU.

### Technologies Used
OpenAI Agents SDK, Groq LLaMA 3.3 70B, FastAPI, PostgreSQL with pgvector, AIOKafka, Next.js, Docker, Kubernetes, Twilio, Gmail API (Pub/Sub push), sentence-transformers (all-MiniLM-L6-v2)

### The 5 Agent Tools
1. **search_knowledge_base** — pgvector cosine similarity search with ILIKE keyword fallback; uses all-MiniLM-L6-v2 embeddings
2. **create_ticket** — always called first; inserts into tickets table linked to conversation and customer
3. **get_customer_history** — fetches last 20 messages across ALL channels for the same customer (cross-channel context)
4. **escalate_to_human** — triggers on pricing inquiry, aggressive language, or legal threats; updates ticket status to 'escalated'
5. **send_response** — channel-aware formatting: email gets formal greeting + sign-off, WhatsApp capped at 300 chars, web form triggers email notification

### Database Schema
8 PostgreSQL tables: customers, customer_identifiers, conversations, messages, tickets, knowledge_base (with VECTOR(1536) pgvector column), channel_configs, agent_metrics

### Key Highlights
- 5 function_tools via @function_tool decorator (OpenAI Agents SDK) — not MCP
- Pre-LLM guardrails: keyword check for pricing_inquiry, aggressive_language, legal_threat — agent never sees escalation-worthy messages
- Cross-channel identity resolution via customer_identifiers table — same customer on email and WhatsApp recognized as one record
- contextvars processing context: customer_id, conversation_id, channel set once per Kafka message — no parameter threading
- asyncio.Queue fallback for Hugging Face Spaces deployment — no Java/Kafka required in cloud demo
- Dual HPA: API pods 3→20, Worker pods 3→30 (separate policies — workers scale more aggressively for LLM calls)

### Measurable Outcomes
- 3 channels handled simultaneously — Gmail (Pub/Sub push), WhatsApp (Twilio), Web Form
- Idempotent Kafka producer (acks=all) — zero duplicate ticket processing
- API HPA: 3→20 pods, Worker HPA: 3→30 pods (70% CPU trigger)
- Under $1,000/year operating cost vs $75,000/year for a human FTE

---

## Project 2: Todo App → Cloud-Native AI Agent (Spec-Driven Evolution)

**Category**: Full-Stack + AI | **Status**: Completed | **Featured**: Yes

**Live Demo**: https://murad-hasil-todo-ai.vercel.app
**GitHub**: https://github.com/Murad-Hasil/Todo-AI-Assistant

### Hackathon Context
Panaversity Hackathon II submission. The goal was to master spec-driven development by evolving a simple CLI app into a fully distributed, event-driven, Kubernetes-deployed AI agent. Every phase has its own spec, plan, tasks, and PHR history record.

### What It Does
A 5-phase demonstration of how a software system evolves from a basic Python CLI to a fully cloud-native AI agent deployed on Kubernetes. Users manage tasks with natural language ("Add a high priority task: finish the project report by Friday", "Electric bill wali task complete kar do") via an AI chatbot with full multi-user JWT authentication and Roman Urdu support.

### Technical Solution
Agent: OpenAI Agents SDK on Groq LLaMA 3.3 70B. Tools exposed via FastMCP server (MCPServerStdio). Singleton MCPServerStdio pattern — the MCP subprocess is connected once at first request and reused across all subsequent requests, avoiding the 20-second Python subprocess startup overhead per chat request. parallel_tool_calls=False required for Groq llama-3.3-70b tool call stability. max_turns=5 per chat cycle. Backend rate limiting via slowapi (chat: 10/min, tasks: 30/min).

Reminder scheduling: Dapr Jobs API + dateparser converts natural language times to UTC datetime → Dapr one-shot job fires callback → DB polling delivers OS-level browser notification.

Kafka event streaming via publish_task_event() on every CRUD operation decouples the notification service.

### Technologies Used
Python 3.12, Next.js 15, FastAPI, SQLModel, Neon PostgreSQL, OpenAI Agents SDK, FastMCP (MCPServerStdio), Groq LLaMA 3.3 70B, Alembic, Docker, Minikube, Kubernetes, Kafka, Dapr Jobs API, slowapi

### The 6 MCP Tools
1. **add_task** — create task with title, priority (low/medium/high), tags, due_date
2. **list_tasks** — list tasks with status filter, sorted by priority and due date
3. **complete_task** — mark a task as done by ID or title match
4. **delete_task** — delete a task by ID or title
5. **update_task** — update any field on an existing task
6. **schedule_reminder** — schedule a Dapr Jobs one-shot reminder for a task

### Database Models
5 SQLModel tables: Task, Conversation, Message (MessageRole enum), UserNotification, (Conversation for chat history)

### Key Highlights
- Singleton MCPServerStdio pattern — avoids 20-second subprocess startup per chat request; health-checked and auto-reconnects on failure
- Dapr Jobs API for reminder scheduling: dateparser converts natural language times to UTC → Dapr fires callback → browser notification delivered via DB polling
- Roman Urdu support — agent detects Roman Urdu input and responds in-kind ('Electric bill wali task complete kar do')
- parallel_tool_calls=False for Groq stability; 3-attempt retry loop on tool_use_failed errors
- Kafka event streaming via publish_task_event() on every CRUD operation
- Alembic migrations for production schema evolution

### Measurable Outcomes
- 5 complete evolution phases with individual spec, plan, tasks, and PHR history records
- 6 FastMCP tools via MCPServerStdio singleton
- Natural language task management in English and Roman Urdu
- Vercel auto-deploy on push to main; backend deployed via HF Space

---

## Project 3: Personal AI Employee — Autonomous Digital FTE

**Category**: AI Automation | **Status**: Completed | **Featured**: Yes

**GitHub**: https://github.com/Murad-Hasil/personal-ai-employee

### What It Does
A production-grade, local-first autonomous AI system built in 4 progressive tiers. Handles email triage, Odoo invoicing, social media drafting, and CEO briefings. Two agents coordinate via atomic os.rename() filesystem claims — no message broker, no database needed for coordination. Every irreversible action requires explicit human approval.

### The Business Problem
Small business owners spend 15-20 hours/week on repetitive administrative tasks — email triage, invoice entry, social media, financial reporting. A human VA costs $4,000–$8,000/month and works 40 hrs/week. Autonomous AI tools either lack safety controls or require expensive cloud infrastructure.

### Technical Solution
4-tier architecture: Lightweight Groq cloud agent handles high-frequency triage 24/7 via PM2 on a cloud VM; local Claude Sonnet 4.6 agent executes sensitive operations (Odoo XML-RPC, Gmail API) that require local credentials. Two agents coordinate via atomic os.rename() — when an agent claims a task file, it renames it atomically; the OS guarantees only one agent can rename a file, preventing double-processing across 2 agents with zero broker or database.

A heartbeat TTL thread writes a Unix timestamp every 30 seconds; if an agent crashes, stale claims are auto-reclaimed after 30 minutes. The Brain class accepts LLM_PROVIDER env var to switch between Anthropic/Groq/OpenRouter with zero code changes.

### Technologies Used
Python 3.12, Claude Sonnet 4.6, Groq Llama-3, OpenRouter, Anthropic SDK, Playwright, Obsidian Vault (9 canonical folders), Gmail API, Odoo XML-RPC, PM2, uv, pytest, Git

### The 4 Tiers
- **T1 Bronze** — Obsidian vault with 9 canonical folders (Needs_Action, In_Progress, Pending_Approval, Done, Logs, Plans, Briefings, Approved, Rejected). File watcher detects new tasks, parses YAML front-matter, routes to skill handlers.
- **T2 Silver** — Gmail via MCP server. Emails polled every 60s, triaged by Claude (urgent/routine/ignore), draft replies written to Pending_Approval. No email sent without human approval.
- **T3 Gold** — Odoo invoice processing (NLP extraction → draft creation → HITL → confirm), social media automation via Playwright (LinkedIn, Instagram, X), weekly CEO briefing generator, financial BI dashboard, JSON Lines audit trail with 100MB auto-rotation.
- **T4 Platinum** — Distributed dual-agent: cloud Groq for triage, local Claude for sensitive execution. Atomic os.rename() coordination. Heartbeat TTL reclaims stale tasks. LLM_PROVIDER env var switches providers.

### Key Highlights
- Atomic multi-agent coordination via os.rename() — no database, no message broker, pure filesystem; OS guarantees only one agent claims each task
- Provider-agnostic Brain class: swap Claude ↔ Groq ↔ OpenRouter via single LLM_PROVIDER env var
- Domain-based security routing: cloud VM holds only Groq key — Odoo and Gmail credentials never leave local machine
- Human-in-the-Loop as architectural guarantee: no code path bypasses the Pending_Approval gate
- Heartbeat TTL thread: background thread writes Unix timestamp every 30s; stale claims auto-reclaimed after 30 min
- Structured JSON Lines audit trail: every external action logged with timestamp, actor, target, and outcome

### Measurable Outcomes
- 168 hours/week autonomous operation vs 40 hrs/week for a human VA
- ~90% cost reduction: $50–200/month LLM costs vs $4,000–8,000/month human VA
- End-to-end email triage under 2 seconds via Groq Llama-3
- 13/13 unit tests pass — Brain routing, atomic claim, domain handoff, vault sync
- Zero double-processing across 2 agents — guaranteed by os.rename() atomicity
- Stale task auto-reclaim in 30 minutes via heartbeat TTL thread

---

## Project 4: Physical AI & Humanoid Robotics Textbook

**Category**: Full-Stack + AI | **Status**: Completed | **Featured**: Yes

**Live Demo**: https://Murad-Hasil.github.io/physical-ai-humanoid-robotics-textbook/
**GitHub**: https://github.com/Murad-Hasil/physical-ai-humanoid-robotics-textbook
**Backend**: https://huggingface.co/spaces/Mb-Murad/physical-ai-backend

### Hackathon Context
Panaversity Hackathon I submission. All 3 bonus deliverables completed: JWT Auth with hardware profiling, hardware-aware content personalization, and Roman Urdu translation.

### What It Does
A full-stack AI-native textbook platform teaching Physical AI and Humanoid Robotics across 13 weeks. Features a RAG chatbot (highlight any text → Ask AI for instant clarification from Groq LLaMA 3.3 70B), hardware-aware personalization across 3 rig profiles, and one-click Roman Urdu chapter translation for Pakistani learners. Backend deployed on Hugging Face Spaces.

### Technical Solution
RAG pipeline: FastEmbed (BAAI/bge-small-en-v1.5, 384-dim vectors) embeds queries → Qdrant Cloud cosine search on collection 'physical-ai-docusaurus-textbook' → Groq LLaMA 3.3 70B generates contextual answer.

GrokClient auto-detects provider from API key prefix: gsk_ routes to Groq API (maps grok-beta → llama-3.3-70b-versatile), xai- routes to xAI Grok API — same code, zero configuration change needed.

Hardware-aware personalization: At signup, students select their rig (RTX Sim Workstation, Jetson Edge Kit, or Unitree G1 Robot). StudentProfile and HardwareConfig records store preferences; every chapter and exercise adapts content to the selected hardware profile.

### Technologies Used
Docusaurus v3, React 19, TypeScript, Tailwind CSS, FastAPI, Python 3.12, FastEmbed (BAAI/bge-small-en-v1.5), Qdrant Cloud, Groq LLaMA 3.3 70B, SQLAlchemy, Alembic, PyJWT, GitHub Actions, GitHub Pages, Docker, Hugging Face Spaces

### Database Models
9 SQLAlchemy models: User, StudentProfile, HardwareConfig, CurriculumProgress, ChatSession, ChatMessage, CurriculumWeek, IngestionLog, ReindexJob

### API Routes
auth, hardware, chat, admin, user_profiles, personalization, translations, curriculum

### 13-Week Curriculum Modules
- **Module 1 — ROS 2** (Weeks 1–5): nodes, topics, services, URDF, Python-ROS controllers
- **Module 2 — Gazebo & Unity** (Weeks 6–7): physics simulation, LiDAR, depth cameras, IMUs
- **Module 3 — NVIDIA Isaac** (Weeks 8–10): photorealistic sim, Isaac ROS, hardware-accelerated VSLAM, Nav2, sim-to-real RL
- **Module 4 — Conversational Humanoid capstone** (Weeks 11–13): LLMs for natural language robot interaction

### Key Highlights
- RAG pipeline: FastEmbed (BAAI/bge-small-en-v1.5) → Qdrant cosine search → Groq LLaMA 3.3 70B; highlight any text → Ask AI
- GrokClient auto-detects provider from API key prefix (gsk_ → Groq, xai- → xAI) — zero config change to switch
- Hardware-aware onboarding: StudentProfile + HardwareConfig records drive content personalization per rig
- One-click Roman Urdu translation via translations API endpoint backed by Groq
- Admin dashboard with curriculum ingestion pipeline and Qdrant reindexing endpoint
- Full CI/CD: GitHub Actions auto-deploys Docusaurus to GitHub Pages; backend on HF Spaces

### Measurable Outcomes
- 13-week curriculum across 4 modules (ROS 2 → Gazebo → Isaac → Conversational Humanoid)
- Qdrant Cloud collection with BAAI/bge-small-en-v1.5 384-dim vectors
- 9 SQLAlchemy models for user management, curriculum tracking, and chat history
- 3 hardware profiles with fully personalized content paths
- All Hackathon I bonus deliverables completed: Auth + Personalization + Urdu Translation
