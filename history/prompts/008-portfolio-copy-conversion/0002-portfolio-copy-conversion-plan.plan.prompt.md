---
id: "0002"
title: Portfolio Copy Conversion Plan
stage: plan
date: 2026-04-24
surface: agent
model: claude-sonnet-4-6
feature: 008-portfolio-copy-conversion
branch: 008-portfolio-copy-conversion
user: Murad Hasil
command: /sp.plan Feature 008-portfolio-copy-conversion — copy-only update across 11 files, 35 FRs locked
labels: ["plan", "copy", "conversion", "portfolio", "hero", "about", "services", "contact", "footer", "chatwidget", "rag"]
links:
  spec: specs/008-portfolio-copy-conversion/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/008-portfolio-copy-conversion/plan.md
  - specs/008-portfolio-copy-conversion/research.md
  - specs/008-portfolio-copy-conversion/spec.md
tests:
  - n/a — plan stage
---

## Prompt

Feature 008-portfolio-copy-conversion — Portfolio Copy Conversion.

Read the full spec at specs/008-portfolio-copy-conversion/spec.md before planning. All 30 FRs are locked with exact before/after values. No ambiguity remains.

Copy-only update across 9 files, 18 text nodes. Goal: raise portfolio conversion rating from 5.5/10 to 8–9/10. Zero UI changes, zero routing changes, zero schema changes.

Files in scope: Hero.tsx, About.tsx, Services.tsx, Contact.tsx, Footer.tsx, ChatWidget.tsx, Skills.tsx, projects-manifest.json, murad-profile.md.

## Response snapshot

Plan written covering:
- Technical context: TypeScript/Next.js frontend, Markdown/JSON context files
- Constitution check: 7 principles evaluated — PASS with one pre-existing violation documented (hardcoded content in components — not worsened by this feature)
- Critical discovery: RAG knowledge base files (rag-knowledge-base/about.md, services.md, contact.md, faq.md) contain stale copy that would cause chatbot inconsistency. Added FR-031–035 to spec. Constitution mandates seed-rag.py re-run after KB edits.
- Execution order: 5 groups (standalone components → Hero → Services/Contact → data files → RAG KB)
- Implementation detail for FR-014: WhatsApp note requires conditional render inside map, not a simple text replacement
- Acceptance verification: 6 checks (TypeScript compile, Playwright screenshot, routing, RAG chatbot, bio preservation, form schema)

## Outcome

- ✅ Impact: Complete implementation plan written with 35 FRs mapped to 14 execution steps across 11 files
- 🧪 Tests: n/a — plan stage
- 📁 Files: specs/008-portfolio-copy-conversion/plan.md, research.md, spec.md (updated with FR-031–035)
- 🔁 Next prompts: /sp.tasks → /sp.implement
- 🧠 Reflection: RAG KB discovery was the key addition — without it, chatbot would answer "Full-Stack Developer" and "RAG / Knowledge Base Systems" while portfolio shows updated copy. Constitution's mandate to grep all KB files before declaring updates complete caught this correctly.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): constitution check — PASS (with documented pre-existing violation)
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): Run /sp.tasks and verify each task has exact before/after values embedded
