# Murad Hasil — Projects

## Project 1: CRM Digital FTE — Omnichannel AI Customer Success Agent

**Category**: AI Agents | **Status**: Completed | **Featured**: Yes

### What It Does
An autonomous AI customer success agent that handles Gmail, WhatsApp, and Web Form channels simultaneously — 24/7 without human intervention. It resolves customer queries, identifies the same customer across channels, escalates based on sentiment, and logs everything to a custom PostgreSQL CRM.

### The Business Problem
A SaaS company needs 24/7 customer support across 3 channels but human FTEs cost $75,000/year each. This Digital FTE operates at under $1,000/year while handling the same volume.

### Technical Solution
Built with the OpenAI Agents SDK, the agent uses 5 specialized MCP tools for CRM operations. Kafka event streaming decouples the 3 input channels so they process independently. Customer identity resolution uses pgvector similarity search to match the same person across Gmail, WhatsApp, and web form. Deployed on Kubernetes with HPA auto-scaling from 3 to 30 pods based on message queue depth.

### Technologies Used
OpenAI Agents SDK, FastAPI, PostgreSQL (with pgvector), Qdrant, Kafka, Next.js, Docker, Kubernetes, Twilio, Gmail API

### Measurable Outcomes
- Handles 3 channels simultaneously with no message loss
- P95 response time under 3 seconds
- Cross-channel customer identification accuracy above 95%
- 24/7 uptime with Kubernetes auto-scaling

---

## Project 2: Todo App → Cloud-Native AI Agent (Spec-Driven Evolution)

**Category**: Full-Stack + AI | **Status**: Completed | **Featured**: Yes

### What It Does
A 5-phase demonstration of how a software system evolves from a basic Python CLI to a fully cloud-native AI agent deployed on Kubernetes. Each phase is a complete, working system — not a refactor of the previous one.

### The Business Problem
Demonstrating spec-driven development methodology from first principles to production — showing how disciplined engineering leads to maintainable, scalable systems.

### Technical Solution
Phase 1: Python CLI todo manager. Phase 2: FastAPI + Next.js web app with PostgreSQL. Phase 3: AI chatbot interface using OpenAI Agents SDK with natural language task management ("Reschedule all morning meetings to 2 PM"). Phase 4: Local Kubernetes with Minikube. Phase 5: Cloud Kubernetes on Neon PostgreSQL with Kafka event streaming and Dapr service mesh.

### Technologies Used
Python, Next.js, FastAPI, SQLModel, Neon PostgreSQL, OpenAI Agents SDK, MCP, Docker, Minikube, Kubernetes, Kafka, Dapr, GitHub Actions

### Measurable Outcomes
- 5 complete, independently deployable evolution phases
- Natural language task management with structured output
- Full CI/CD with GitHub Actions from PR to production
- Production Kubernetes deployment on cloud

---

## Project 3: Personal AI Employee — Autonomous Digital FTE

**Category**: AI Automation | **Status**: Completed | **Featured**: Yes

### What It Does
A 24/7 autonomous AI agent that manages personal and business affairs — monitoring Gmail and WhatsApp, processing incoming messages, generating weekly CEO briefing reports, conducting subscription audits, and handling routine tasks with human-in-the-loop safety for sensitive operations.

### The Business Problem
Repetitive personal and business tasks consume 10-15 hours weekly. A human VA costs $4,000-$8,000/month and works only 40 hours/week. This AI Employee costs $500-$2,000/month and works 168 hours/week.

### Technical Solution
Python file watchers monitor Gmail and WhatsApp in real-time. Claude Code acts as the orchestrating agent with custom MCP servers for each integration. Obsidian serves as the knowledge base and task management layer. HITL (Human-in-the-Loop) approval workflow triggers for sensitive operations like sending emails or making purchases. Every Monday, a CEO Briefing report is generated summarising the week's activity.

### Technologies Used
Claude Code, Python, MCP Servers, Playwright, Obsidian, Gmail API, WhatsApp API

### Deployment Note
Local deployment (not cloud-hosted). GitHub repository and architecture walkthrough available on request.

### Measurable Outcomes
- 168 hours/week of autonomous operation
- 85-90% cost savings per task compared to human VA
- HITL safety prevents unauthorised actions
- Weekly CEO Briefing report generated automatically

---

## Project 4: Physical AI & Humanoid Robotics Textbook

**Category**: Full-Stack + AI | **Status**: Completed | **Featured**: Yes

### What It Does
A production-grade AI-native textbook platform teaching Physical AI and Humanoid Robotics across 13 weeks. Covers ROS 2, Gazebo, NVIDIA Isaac Sim, and a Conversational Humanoid capstone. Features a RAG chatbot (highlight any text → Ask AI), hardware-aware personalization across 3 rig profiles, and one-click Roman Urdu translation for Pakistani learners.

### The Business Problem
Physical AI — AI systems that operate in the real physical world — is the next frontier after LLMs, yet no structured, accessible textbook exists for it. Existing robotics courses are scattered, assume identical hardware for every learner, and offer zero in-context AI help when a student gets stuck. Pakistani learners face an additional barrier: dense English-only material with no mechanism for real-time clarification in their native language.

### Technical Solution
Four progressive modules: (1) ROS 2 — the Robotic Nervous System; (2) Gazebo & Unity — physics simulation with LiDAR, depth cameras, and IMUs; (3) NVIDIA Isaac — photorealistic sim, Isaac ROS, hardware-accelerated VSLAM, Nav2 path planning, and sim-to-real RL; (4) Conversational Humanoid capstone integrating LLMs for natural language robot interaction. RAG chatbot built with LangChain + Qdrant + Groq LLaMA 3.3 70B with FastEmbed. Hardware-aware personalization at signup across 3 rig profiles (RTX Sim Workstation / Jetson Edge Kit / Unitree G1 Robot). JWT auth with 3-step hardware onboarding. Admin dashboard for curriculum ingestion and Qdrant reindexing.

### Technologies Used
Docusaurus v3, React 19, TypeScript, Tailwind CSS, FastAPI, Python 3.12, LangChain, Sentence Transformers, FastEmbed, Qdrant Cloud, Groq API (LLaMA 3.3 70B), Neon PostgreSQL, SQLAlchemy, PyJWT, GitHub Actions, GitHub Pages, Docker, Hugging Face Spaces

### Measurable Outcomes
- 13-week curriculum across 4 modules (ROS 2 → Gazebo → Isaac → Conversational Humanoid)
- 180 vectors indexed in Qdrant Cloud for RAG across all 13 weeks
- 12-table Neon PostgreSQL schema (users, profiles, sessions, curriculum)
- 3 hardware profiles with fully personalized content paths
- All Panaversity Hackathon I bonus deliverables completed: Auth + Personalization + Urdu Translation

### Live Demo
Live URL: https://Murad-Hasil.github.io/physical-ai-humanoid-robotics-textbook/
GitHub: https://github.com/Murad-Hasil/physical-ai-humanoid-robotics-textbook
