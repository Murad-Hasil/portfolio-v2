---
id: "025"
title: Feature 009 — All 4 SDD Prompts (specify → plan → tasks → implement)
stage: general
date: 2026-04-24
surface: agent
model: claude-sonnet-4-6
feature: 009-portfolio-services-cta-update
branch: 009-portfolio-services-cta-update
user: Murad Hasil
command: (reference document — paste prompts individually into Claude)
labels: ["009", "services", "cta", "about", "hero", "contact", "footer", "prompts"]
links:
  spec: specs/009-portfolio-services-cta-update/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - history/prompts/general/025-009-feature-all-prompts.general.prompt.md
tests:
  - n/a
---

# Feature 009 — Portfolio Services + CTA Update
## All 4 SDD Prompts (ready to paste)

**Context:** Feature 008 completed baseline copy conversion. This feature covers 6 new changes:
1. Hero: WhatsApp CTA (primary) replacing Fiverr
2. Contact: Fiverr CTA added
3. Footer: Fiverr icon added
4. Services: full redesign (4 new names + new description format)
5. About stats: replaced with 4 text-only outcome phrases
6. About bio para 3: rewritten to client-friendly SDD explanation

---

## PROMPT 1 — `/sp.specify`

Paste this entire block after typing `/sp.specify`:

```
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
```

---

## PROMPT 2 — `/sp.plan`

Paste this entire block after typing `/sp.plan`:

```
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
```

---

## PROMPT 3 — `/sp.tasks`

Paste this entire block after typing `/sp.tasks`:

```
Feature: 009-portfolio-services-cta-update
Read plan at: specs/009-portfolio-services-cta-update/plan.md
Read spec at:  specs/009-portfolio-services-cta-update/spec.md

Generate tasks.md. Each task must include:
  - Exact file path
  - Exact before-string to find (copy from current file)
  - Exact after-string to replace with
  - What must NOT change (protected elements)

Group tasks for maximum parallelism. Suggested groups:
  Group A (parallel): T001 Hero CTA, T002 Footer Fiverr, T003 About bio para 3
  Group B (parallel): T004 Contact Fiverr CTA, T005 About stats
  Group C (after A+B): T006 Services.tsx full rewrite (type + data + render — largest task)
  Group D: Final — tsc verify, visual check

Hard rules for every task:
  1. Read file before editing
  2. Verify before-string exists before writing
  3. Do NOT change: routing ids, Zod schema, service IDs, bio paras 1/2/4, CTA button hrefs other than Hero primary
  4. Do NOT add comments or refactor surrounding code
  5. Each task independently verifiable
```

---

## PROMPT 4 — `/sp.implement`

Paste this entire block after typing `/sp.implement`:

```
Feature: 009-portfolio-services-cta-update
Read tasks at:  specs/009-portfolio-services-cta-update/tasks.md
Read spec at:   specs/009-portfolio-services-cta-update/spec.md

Execute all tasks from tasks.md. Process parallel groups together. After all tasks:

ACCEPTANCE VERIFICATION (mandatory before reporting complete):
1. Run: cd frontend && npx tsc --noEmit — must show ZERO errors
2. Verify Hero primary CTA href is "https://wa.me/923142241393" (not Fiverr)
3. Verify Contact.tsx left panel has a Fiverr link with href "https://www.fiverr.com/murad_hasil"
4. Verify Footer.tsx socialLinks array includes a Fiverr entry
5. Verify Services.tsx: all 4 service names match new names, no "deliverables" or "target_client" fields remain
6. Verify About.tsx stats: no value+label format remains, 4 text-only phrases present
7. Verify About.tsx bio para 3: new client-friendly text present, paras 1/2/4 unchanged

If any task fails verification: fix before moving to the next group. Report each fix inline.

PROTECTED — must not change under any circumstances:
  - About bio paragraphs 1, 2, and 4
  - Contact form fields and Zod schema
  - Service IDs: ai-chatbot-agent, business-automation, rag-knowledge-base, fullstack-web-apps
  - Hero secondary CTA "See My Work" (#projects)
  - All routing hrefs except Hero primary CTA
  - TypeAnimation sequence, techPills, eyebrow, H1 (all unchanged from 008)
```

---

## Usage Order

Run these prompts in sequence — each step depends on the previous:

```
Step 1:  /sp.specify   → paste PROMPT 1
Step 2:  /sp.plan      → paste PROMPT 2  (after spec is confirmed)
Step 3:  /sp.tasks     → paste PROMPT 3  (after plan is confirmed)
Step 4:  /sp.implement → paste PROMPT 4  (after tasks are confirmed)
```

PHR (Prompt History Record) will be auto-created after each step.
