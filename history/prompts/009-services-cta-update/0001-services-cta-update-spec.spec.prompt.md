---
id: "0001"
title: Services CTA Update Spec
stage: spec
date: 2026-04-24
surface: agent
model: claude-sonnet-4-6
feature: 009-services-cta-update
branch: 009-services-cta-update
user: Murad Hasil
command: /sp.specify
labels: ["spec", "copy", "cta", "services", "about", "hero", "contact", "footer"]
links:
  spec: specs/009-services-cta-update/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/009-services-cta-update/spec.md
  - specs/009-services-cta-update/checklists/requirements.md
  - history/prompts/009-services-cta-update/0001-services-cta-update-spec.spec.prompt.md
tests:
  - null
---

## Prompt

Feature 009: portfolio-services-cta-update
Branch: 009-portfolio-services-cta-update (branch off main after 008 is merged)

This feature continues from 008-portfolio-copy-conversion (completed). Six copy and CTA changes.
All changes are copy/data changes. Zero new components, zero routing changes, zero form schema changes.

---

## CHANGE 1 — Hero.tsx: Primary CTA → WhatsApp

File: frontend/src/components/sections/Hero.tsx

Current primary CTA:
  text: "Hire Me on Fiverr"
  href: "https://www.fiverr.com/murad_hasil"
  style: accent-cyan background (primary button)

Replace with:
  text: "Chat on WhatsApp"
  href: "https://wa.me/923142241393"
  style: same accent-cyan primary button style (unchanged)

The secondary CTA "See My Work" (#projects) must NOT change.
No other Hero elements change (eyebrow, H1, TypeAnimation, techPills, sub-copy, badge, social links).

---

## CHANGE 2 — Contact.tsx: Add Fiverr CTA

File: frontend/src/components/sections/Contact.tsx

Add a Fiverr CTA to the left panel (below the existing social icon row).
It should be a standalone button/link — separate from the contact form.

Content:
  label: "// Or hire me directly"
  button text: "View My Fiverr Profile"
  href: "https://www.fiverr.com/murad_hasil"
  supporting text: "Browse packages, reviews, and fixed-price options."

Style constraints:
  - Match existing card style (bg-elevated, border-subtle)
  - No new imports required — use existing anchor tag patterns
  - Do NOT change the contact form, Zod schema, or social icons

---

## CHANGE 3 — Footer.tsx: Add Fiverr Link

File: frontend/src/components/layout/Footer.tsx

Add Fiverr icon/link to the socialLinks array alongside the existing 4 links.
Existing links: GitHub, LinkedIn, WhatsApp, Email

New entry to add:
  label: "Fiverr"
  href: "https://www.fiverr.com/murad_hasil"
  Icon: use a simple external link or custom SVG inline — no new package install

Note: If no suitable icon exists in lucide-react for Fiverr, use the ExternalLink icon from lucide-react as a placeholder.

---

## CHANGE 4 — Services.tsx: Full Card Redesign

File: frontend/src/components/sections/Services.tsx

The current Service type uses { id, name, target_client, deliverables[], cta, icon }.
Replace the data structure and card template with a new format:
  { id, name, description, outcome, cta, icon }

Where:
  - description: prose string — "For businesses... / I build..." (combined into one field)
  - outcome: short outcome line — "Outcome: ..."
  - id and cta are unchanged

New service data (exact copy — do not paraphrase):

SERVICE 1:
  id: "ai-chatbot-agent"  (unchanged)
  name: "Customer Support Automation"
  description: "For businesses tired of answering the same questions every day.\n\nI build AI systems that handle customer queries across chat, email, or web — 24/7 — so your team can focus on work that actually needs a human."
  outcome: "Faster responses, lower support workload, and consistent customer experience."
  icon: Bot (unchanged)

SERVICE 2:
  id: "business-automation"  (unchanged)
  name: "Business Process Automation"
  description: "For teams spending hours on repetitive tasks like data entry, follow-ups, or reports.\n\nI map your workflow and automate it end-to-end — so the same work gets done without manual effort."
  outcome: "Save hours every week, reduce errors, and free up your team's time."
  icon: Zap (unchanged)

SERVICE 3:
  id: "rag-knowledge-base"  (unchanged)
  name: "AI Knowledge Base (answers from your data)"
  description: "For businesses where people keep asking the same questions internally or externally.\n\nI turn your documents, SOPs, and data into an AI system that gives instant answers — no searching, no delays."
  outcome: "Faster access to information and less dependency on team members."
  icon: Database (unchanged)

SERVICE 4:
  id: "fullstack-web-apps"  (unchanged)
  name: "Custom AI Tools for Your Business"
  description: "For businesses that need something built around how they actually work.\n\nI design and build custom AI systems tailored to your workflow — not generic tools that don't fit."
  outcome: "A system that works exactly the way your business operates and scales with it."
  icon: Code (unchanged)

ServiceCard component changes:
  - Remove target_client render block
  - Remove deliverables bullet list render block
  - Add description render block (prose text, text-secondary color)
  - Add outcome render block (small text, accent-green or accent-cyan color, with "Outcome:" prefix)
  - CTA button stays unchanged
  - All other card layout (icon, name, border, hover, shadow) stays unchanged

---

## CHANGE 5 — About.tsx: Stats array → text-only outcome phrases

File: frontend/src/components/sections/About.tsx

Current stats array (value+label format):
  { value: "$75K→$1K", label: "human FTE vs. this AI system" }
  { value: "20 hrs",   label: "of weekly admin work automated" }
  { value: "4",        label: "real working systems built" }
  { value: "24/7",     label: "uptime — no sick days, ever" }

Replace with text-only phrases (no value/label split):
  "Saves hours of manual work every week"
  "No extra hiring required"
  "Built on real, working systems"
  "Runs 24/7 without manual effort"

New data type: string[] (or { text: string }[] — whichever keeps the card layout simpler)

Stat card display: remove the large value number and label. Show each phrase as a single centered text line inside the same card box. Keep the same grid layout (2 cols mobile, 4 cols sm+), same border/background style.

---

## CHANGE 6 — About.tsx: Bio paragraph 3 rewrite

File: frontend/src/components/sections/About.tsx

Current paragraph 3 (the spec-driven paragraph):
  "What makes my approach different is how I plan before building. I follow a 'spec-driven' workflow where requirements, architecture, and edge cases are defined upfront. This reduces surprises, keeps systems clean, and makes them easier to scale."

Replace with (exact text — do not paraphrase):
  "What makes my approach different is how I plan before building anything. Before writing code, I break the project down step-by-step — starting with a clear understanding of the problem, then defining how the system should work, and finally turning that into a structured build plan. This includes mapping different scenarios so nothing breaks later. This approach reduces confusion, avoids rework, and ensures the system runs reliably once it's live."

Paragraphs 1, 2, and 4 must NOT change.
Bio html structure (4 <p> elements) must NOT change.

---

## CONSTRAINTS (all must hold)
- Zero new npm packages
- Zero new components
- Zero routing/slug/id changes
- Contact form Zod schema unchanged
- Service IDs unchanged: ai-chatbot-agent, business-automation, rag-knowledge-base, fullstack-web-apps
- No changes outside the 5 listed files
- TypeScript must compile with zero errors after all changes

## Response snapshot

Created branch `009-services-cta-update` and wrote a complete spec covering all 6 changes as 6 prioritized user stories with acceptance scenarios, 31 functional requirements with exact copy constraints, 7 measurable success criteria, edge cases, assumptions, and an out-of-scope section. Quality checklist created and all items pass. Spec is ready for `/sp.plan`.

## Outcome

- ✅ Impact: Spec written for all 6 copy/CTA changes across Hero, Contact, Footer, Services, and About
- 🧪 Tests: No tests applicable at spec stage
- 📁 Files: specs/009-services-cta-update/spec.md, checklists/requirements.md
- 🔁 Next prompts: /sp.plan or /sp.clarify
- 🧠 Reflection: Feature is fully prescribed — no clarifications needed. All copy exact, all constraints explicit.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): All checklist items PASS
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): null
