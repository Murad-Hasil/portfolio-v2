---
id: "0002"
title: Services CTA Update Plan
stage: plan
date: 2026-04-24
surface: agent
model: claude-sonnet-4-6
feature: 009-services-cta-update
branch: 009-services-cta-update
user: Murad Hasil
command: /sp.plan
labels: ["plan", "copy", "cta", "services", "about", "hero", "contact", "footer"]
links:
  spec: specs/009-services-cta-update/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/009-services-cta-update/plan.md
  - history/prompts/009-services-cta-update/0002-services-cta-update-plan.plan.prompt.md
tests:
  - null
---

## Prompt

Feature: 009-portfolio-services-cta-update
Read spec at: specs/009-portfolio-services-cta-update/spec.md

Generate the full implementation plan. This is a 5-file, 6-FR-group change. All copy/data — zero schema changes, zero routing changes, zero new packages.

Files in scope:
  1. frontend/src/components/sections/Hero.tsx       (CHANGE 1: CTA swap)
  2. frontend/src/components/sections/Contact.tsx    (CHANGE 2: Fiverr CTA add)
  3. frontend/src/components/layout/Footer.tsx       (CHANGE 3: Fiverr link add)
  4. frontend/src/components/sections/Services.tsx   (CHANGE 4: full card redesign — type + data + render)
  5. frontend/src/components/sections/About.tsx      (CHANGE 5: stats + CHANGE 6: bio para 3)

Key architectural decisions to address in the plan:
  - Services.tsx: Service type changes (target_client+deliverables[] → description+outcome). Confirm no other file imports or depends on this type.
  - About.tsx stats: value+label → text-only. Confirm the card render block handles both cleanly (no leftover DOM nodes).
  - Footer.tsx: Fiverr icon — confirm lucide-react has a suitable icon or plan the ExternalLink fallback.
  - Contact.tsx: Fiverr CTA placement — must not disrupt the existing lg:col-span-2 left panel layout.

Execution order: plan as 3 parallel groups where possible.
Acceptance checks to include: tsc --noEmit, visual spot-check at 1440px and 375px (mobile), all 5 CTAs (WhatsApp hero, Fiverr contact, Fiverr footer) render with correct href values.

## Response snapshot

Generated full implementation plan at specs/009-services-cta-update/plan.md. Pre-flight confirmed: Service type is local to Services.tsx only, ExternalLink is available in lucide-react and already used in Projects.tsx, Footer as const compatible, Contact lg:col-span-2 flex-col absorbs new block cleanly. Three parallel execution groups: A (Hero+Footer — data swaps), B (Contact+About — block insert + render replace), C (Services — type+data+full card rewrite). Full acceptance gate defined: tsc --noEmit, 3 href spot-checks, visual at 1440px+375px, contact form regression.

## Outcome

- ✅ Impact: Full implementation plan ready for /sp.tasks or direct implementation
- 🧪 Tests: tsc --noEmit, href spot-check, visual at 1440px + 375px, contact form regression
- 📁 Files: specs/009-services-cta-update/plan.md
- 🔁 Next prompts: /sp.tasks or /sp.implement
- 🧠 Reflection: All 5 files read before planning; all architectural questions resolved by grep before writing — no assumptions required.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): all pre-flight checks PASS
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): null
