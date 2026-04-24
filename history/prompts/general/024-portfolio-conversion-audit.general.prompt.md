---
id: "024"
title: Portfolio Conversion Audit
stage: general
date: 2026-04-23
surface: agent
model: claude-sonnet-4-6
feature: none
branch: main
user: Murad Hasil
command: "Portfolio conversion audit prompt (senior AI product consultant persona)"
labels: ["audit", "conversion", "portfolio", "copywriting", "ux"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - frontend/src/components/sections/Hero.tsx
  - frontend/src/components/sections/About.tsx
  - frontend/src/components/sections/Services.tsx
  - frontend/src/components/sections/Contact.tsx
  - context/projects-manifest.json
  - context/murad-profile.md
  - context/brand-voice.md
tests:
  - n/a
---

## Prompt

You are a senior AI product consultant and conversion-focused portfolio reviewer.

Your task is to deeply analyze a developer portfolio and generate a structured, brutally honest audit report.

Focus on:
- Client conversion (not design aesthetics)
- Clarity of positioning
- Business value communication
- Trust and credibility signals
- Real-world usefulness (not just technical showcase)

[Full prompt included analysis requirements across: Hero, Positioning, Services, Projects, Trust Signals, CTA, and overall score — with structured output format]

## Response snapshot

Full structured audit covering:

1. HERO — Value prop sub-copy is strong but H1 repeats the eyebrow role twice. TypeAnimation and tech pills are developer-facing, not client-facing. Dual CTA exits site immediately.

2. POSITIONING — Dual identity (AI Automation + Full-Stack) splits the pitch. Four About stats are weak trust signals ("5+ Hackathons", "100% Self-Taught", "2+ Years", "20+ Technologies") — none map to client outcomes.

3. SERVICES — "For:" labels are effective. "RAG / Knowledge Base Systems" title is jargon. No pricing anchor anywhere. "Get Quote" → anonymous form = drop-off. No urgency/scarcity signal.

4. PROJECTS — CRM Digital FTE ($75K → $1K framing) is strongest asset. Personal AI Employee has good metrics. Todo App (learning demo) and Physical AI Textbook (hackathon/robotics) are off-target and dilute credibility with SMB clients.

5. TRUST — No testimonials at all. No Fiverr social proof on portfolio. Strong technical screenshots (k8s pods, DB schemas, live logs) are above average. "Self-Taught" stat is a trust negative.

6. CTA — "Let's Work Together" is generic. Post-submit journey undefined. No low-commitment CTA (e.g., Calendly). "Subject" field is odd in a consultation context.

7. SCORE: 5.5/10. Gap to 8/10 = one testimonial + remove learning projects + "$75K → $1K" story visible on card + replace 4 stats with client-outcome metrics.

Specific fix table provided for: H1 rewrite, stat replacements, RAG rename, contact copy, project repositioning, pricing anchor direction.

## Outcome

- ✅ Impact: Comprehensive conversion audit delivered with scored sections and an actionable fix table
- 🧪 Tests: n/a — analysis task
- 📁 Files: no files modified; read-only audit
- 🔁 Next prompts: Implement H1 rewrite, replace About stats, rename RAG service, rewrite contact section copy, reframe or remove Todo/Textbook projects
- 🧠 Reflection: The portfolio has strong technical substance but weak positioning clarity. The biggest single win is adding one real testimonial. Second biggest is dropping the two non-client projects from the featured grid.

## Evaluation notes (flywheel)

- Failure modes observed: none — analysis only
- Graders run and results (PASS/FAIL): n/a
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): Rewrite H1 from role label to outcome statement and A/B test whether scroll depth to Projects section increases
