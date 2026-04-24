# Feature Specification: Portfolio Copy Conversion

**Feature Branch**: `008-portfolio-copy-conversion`
**Created**: 2026-04-23
**Updated**: 2026-04-24
**Status**: Ready for Planning
**Input**: Full portfolio conversion audit (score 5.5/10) + multi-session decision workflow. Goal: 8–9/10 without testimonials.

## Context & Background

A copy-only update across 9 files — 18 text nodes changed, zero UI/structural changes. Every section currently speaks developer language. Every section after this update must speak client language.

**Target audience**: Small business owners and founders (non-technical) on Fiverr/Upwork.

**Source of truth for all copy decisions**:
- Conversion audit (2026-04-23) — score 5.5/10
- Brand voice guide: `context/brand-voice.md`
- Actual project data: `context/projects-manifest.json`
- RAG knowledge source: `context/murad-profile.md`

**Critical constraint**: All 9 files get text-only edits. No routing IDs, slugs, hrefs, component structures, form schemas, or styling values change.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — SMB Owner Lands on Hero (Priority: P1)

A small business owner (non-technical) lands on the homepage. Within 3 seconds they must understand: what problem is solved, who it's for, and what to do next.

**Why this priority**: Hero is the first and only conversion point. All other sections are reached only if the hero holds attention.

**Independent Test**: Load homepage. Read only H1 + TypeAnimation + sub-copy. Answer: "What does this person do and for whom?" — must not require technical knowledge.

**Acceptance Scenarios**:
1. **Given** a visitor reads the H1, **When** they finish it, **Then** they see an outcome statement — not a job title
2. **Given** a visitor sees the tech pills, **When** they read them, **Then** each pill describes a result, not a technology name
3. **Given** a visitor watches the TypeAnimation, **When** it cycles through phrases, **Then** each phrase describes a client benefit, not a developer role
4. **Given** a visitor reads the sub-copy, **When** they finish it, **Then** the value prop ("save time and cut costs by replacing repetitive work...") is preserved unchanged

---

### User Story 2 — Visitor Reads About Stats (Priority: P2)

A potential client reads the About section to assess credibility. The 4 stat boxes must communicate system-verified outcomes, not developer résumé metrics.

**Why this priority**: Stats are the first scannable element after the bio. Weak stats reduce trust before the bio is even read.

**Independent Test**: Read only the 4 stat boxes. Each one must make a client more likely to hire — not raise doubt.

**Acceptance Scenarios**:
1. **Given** a visitor scans the About stats, **When** they read all 4, **Then** none show "Self-Taught", "Hackathons", or "Technologies"
2. **Given** a visitor reads the stats, **When** they assess credibility, **Then** all 4 reference system-verified outcomes (cost, uptime, automation scale, production count)
3. **Given** a visitor reads the About section, **When** they read the bio paragraphs, **Then** bio text is unchanged — only stat box values and labels differ

---

### User Story 3 — Visitor Reads Services (Priority: P2)

A non-technical business owner reads the services section. Every service title and the section sub-heading must be understandable without technical knowledge.

**Why this priority**: Service titles are the first thing scanned. Jargon titles ("RAG") cause immediate drop-off from non-technical visitors.

**Independent Test**: Show services section to a non-technical person. Ask: "Do you understand what each service is?" All 4 must pass without explanation.

**Acceptance Scenarios**:
1. **Given** a visitor reads the service titles, **When** they encounter the RAG service, **Then** the title reads "AI Knowledge Base" — not "RAG / Knowledge Base Systems"
2. **Given** a visitor reads the section sub-heading, **When** they finish it, **Then** it speaks to their problem — not to "international clients"
3. **Given** the service rename is applied, **When** internal routing is used, **Then** the `id` field "rag-knowledge-base" is unchanged and all links work correctly

---

### User Story 4 — Visitor Reads All 4 Projects (Priority: P3)

A potential client scans all 4 project cards. Each must feel like a business solution — not a learning exercise or academic submission.

**Why this priority**: Projects are the proof layer. Two currently read as internal work.

**Independent Test**: Read only the `problem` field for each project. Each must describe a business problem a non-technical client would recognise.

**Acceptance Scenarios**:
1. **Given** a visitor reads the Todo App project, **When** they read the problem, **Then** it describes a real productivity problem — not "demonstrate spec-driven evolution"
2. **Given** a visitor reads the Physical AI Textbook project, **When** they read the problem, **Then** it frames the value as an education technology platform — not a hackathon submission
3. **Given** all 4 projects are read, **When** a visitor scans the grid, **Then** all 4 projects are present — none removed
4. **Given** the CRM Digital FTE project is read, **When** the visitor reads the problem, **Then** the cost framing ($75,000/year human FTE vs. under $1,000/year) is preserved unchanged

---

### User Story 5 — Visitor Reaches Contact Section (Priority: P3)

A visitor who has scrolled through the portfolio reaches the contact section. The heading and sub-copy must be problem-driven and push toward action. WhatsApp must be clearly identified as the fastest response path.

**Why this priority**: The CTA is the conversion endpoint. Generic copy loses visitors who were almost ready to contact.

**Independent Test**: Read only the contact section heading, sub-copy, and availability note. Does it name a client problem, give honest guidance, and set clear response expectations?

**Acceptance Scenarios**:
1. **Given** a visitor reads the contact H2, **When** they finish it, **Then** it references automation — not a generic collaboration phrase
2. **Given** a visitor reads the sub-copy, **When** they finish it, **Then** it names a specific action and includes an honesty signal ("I'll be honest if it can't")
3. **Given** a visitor sees the WhatsApp contact entry, **When** they read the supporting line, **Then** they understand WhatsApp is the fastest response path
4. **Given** a visitor reads the availability note, **When** they finish it, **Then** they know WhatsApp replies in a few hours and form replies within 24

---

### User Story 6 — Visitor Uses the Chat Widget (Priority: P3)

A visitor opens the AI chat widget. The suggested questions shown on first open must reflect client concerns — not developer curiosity.

**Why this priority**: Suggested questions are the first thing seen when the widget opens. Developer questions ("What is your tech stack?") signal the portfolio is built for peers, not clients.

**Independent Test**: Open the chat widget. Read the 4 suggested questions. Each must be a question a non-technical business owner would genuinely ask.

**Acceptance Scenarios**:
1. **Given** a visitor opens the chat widget, **When** they see the suggested questions, **Then** none ask about tech stack or project history in developer terms
2. **Given** a visitor reads the suggested questions, **When** they consider clicking one, **Then** at least one directly addresses "what can you automate for me"
3. **Given** a visitor reads the suggested questions, **When** they consider clicking one, **Then** at least one addresses cost or getting started

---

### User Story 7 — RAG Chatbot Gives Consistent Answers (Priority: P2)

When a visitor asks the AI chatbot about Murad's stats, positioning, or title, the answers must be consistent with what the portfolio displays visually.

**Why this priority**: If the chat says "Self-Taught" or "AI Automation Engineer & Full-Stack Developer" but the portfolio shows outcome metrics and client-focused positioning, the inconsistency destroys trust.

**Independent Test**: Ask the chatbot: "What is Murad's title?", "What results have your systems achieved?", "What makes you different from other developers?" — answers must align with updated portfolio copy.

**Acceptance Scenarios**:
1. **Given** a visitor asks the chatbot about Murad's title, **When** the chatbot responds, **Then** it does not say "Full-Stack Developer" as a primary identity
2. **Given** a visitor asks about stats or results, **When** the chatbot responds, **Then** it references system-capability metrics (AI system cost vs FTE, hours automated, production count) — not hackathon count
3. **Given** the murad-profile.md Availability block exists, **When** it is updated, **Then** the Status, Label, and Hours fields are preserved unchanged

---

### User Story 8 — Footer Consistency (Priority: P3)

A visitor scrolls to the bottom of the page. The footer tagline must match the updated positioning — not contradict the hero.

**Why this priority**: The footer is the last thing a visitor sees. A contradictory tagline ("AI Automation Engineer & Full-Stack Developer") after a hero that says "Automate the Work That's Slowing Your Business Down" signals inconsistency.

**Independent Test**: Read the footer tagline. Does it match the portfolio's positioning or contradict it?

**Acceptance Scenarios**:
1. **Given** a visitor reads the footer tagline, **When** they finish it, **Then** it aligns with client-focused positioning — not a developer job title
2. **Given** a visitor reads the footer copyright text, **When** they encounter "RAG chatbot", **Then** the term is replaced with plain English

---

## Requirements *(mandatory)*

### Functional Requirements

#### Hero.tsx
- **FR-001**: H1 MUST change from "AI Automation Engineer & Full-Stack Developer" to "Automate the Work That's Slowing Your Business Down"
- **FR-002**: Hero sub-copy paragraph MUST remain unchanged
- **FR-003**: Hero eyebrow (`// AI Automation Engineer`) MUST remain unchanged
- **FR-004**: TypeAnimation sequence MUST change from developer roles to: `["handling support for you", "cutting your busywork", "freeing up your team's time", "turning your process into a system"]`
- **FR-005**: techPills array MUST change from tech stack names to: `["automates 20+ hrs/week", "runs while you sleep", "no extra headcount", "always on"]`
- **FR-006**: Hero availability badge, CTA buttons, social links MUST remain unchanged

#### About.tsx
- **FR-007**: About stats array MUST replace all 4 value+label pairs:
  - `{ value: "$75K→$1K", label: "human FTE vs. this AI system" }`
  - `{ value: "20 hrs",   label: "of weekly admin work automated" }`
  - `{ value: "4",        label: "real working systems built" }`
  - `{ value: "24/7",     label: "uptime — no sick days, ever" }`
- **FR-008**: About bio paragraphs MUST remain unchanged

#### Services.tsx
- **FR-009**: RAG service `name` field MUST change to "AI Knowledge Base" — `id` field "rag-knowledge-base" MUST NOT change
- **FR-010**: Services section sub-heading paragraph MUST change to "Built for businesses that want to automate without the technical headache."
- **FR-011**: All service `deliverables`, `target_client`, and other service `name` fields MUST remain unchanged

#### Contact.tsx
- **FR-012**: Contact H2 MUST change from "Let's Work Together" to "Let's Automate Your Workflow"
- **FR-013**: Contact sub-copy MUST change from "Have a project in mind? Reach out directly or use the form below." to "Tell me what your team does repeatedly — I'll tell you if it can be automated, and I'll be honest if it can't."
- **FR-014**: A supporting line MUST be added below the WhatsApp contact entry: "Fastest way to reach me — most clients hear back within a few hours."
- **FR-015**: Availability note MUST change from "Open to new projects. Typically responds within 24 hours." to "Open to new projects. WhatsApp replies in a few hours — form replies within 24."
- **FR-016**: Contact form fields, Zod schema, social icons, contact links MUST remain unchanged

#### context/projects-manifest.json
- **FR-017**: Todo App (`todo-cloud-ai`) `problem` field MUST change to: "Teams lose hours tracking tasks across disconnected tools. This production system takes plain-English input, creates and assigns tasks automatically, sends reminders, and runs on Kubernetes — built as a real-world tool and documented end-to-end."
- **FR-018**: Physical AI Textbook (`physical-ai-textbook`) `problem` field MUST change to: "Online robotics courses assume identical hardware for every learner and offer no help when students get stuck mid-lesson. This platform adapts content to each student's hardware setup and answers questions in real time — deployed on live cloud infrastructure."
- **FR-019**: All `id`, `slug`, `title`, `description`, `tech`, `github_url`, `live_url`, `image`, `metrics`, `highlights` fields MUST remain unchanged
- **FR-020**: All 4 projects MUST remain in the featured grid

#### Footer.tsx
- **FR-021**: Footer tagline MUST change from "AI Automation Engineer & Full-Stack Developer" to "AI Automation for Small Businesses"
- **FR-022**: Footer copyright text MUST change from "Built with Next.js, FastAPI & a RAG chatbot that actually knows the code." to "Built with the same AI stack I sell — Next.js, FastAPI, and an AI assistant that knows the full codebase."

#### ChatWidget.tsx
- **FR-023**: SUGGESTED questions array MUST change to:
  - `"What can you automate for my business?"`
  - `"What services do you offer?"`
  - `"How much does a project cost?"`
  - `"How do we get started?"`
- **FR-024**: All chat functionality — streaming, session logic, FAB button, header text, input — MUST remain unchanged

#### Skills.tsx
- **FR-025**: Skills section H2 heading MUST change from "Technical Expertise" to "What I Build With"
- **FR-026**: All skills data (sourced from `skills-manifest.json`) MUST remain unchanged

#### context/murad-profile.md (RAG Consistency)
- **FR-027**: Title field MUST change from "AI Automation Engineer & Full-Stack Developer" to "AI Automation Engineer"
- **FR-028**: Professional Summary MUST be updated to remove "Full-Stack Developer" as a secondary identity and align with client-facing positioning
- **FR-029**: Stats section MUST be updated to replace hackathon/technology counts with system-capability metrics consistent with the new About.tsx stats:
  - AI System Cost: "$75K→$1K vs. human FTE"
  - Weekly Admin Work Automated: "20 hrs"
  - Production Systems Built: "4"
  - Uptime: "24/7 — no sick days"
- **FR-030**: Availability block (Status, Label, Hours per week) MUST remain unchanged

#### context/rag-knowledge-base/ (RAG Chatbot Knowledge Sync — Constitution Mandate)
- **FR-031**: `about.md` — "Who Is Murad Hasil?" opening line MUST remove "Full-Stack Developer" secondary identity. Career Stats section MUST replace "5+ hackathons" and "20+ technologies" with system-capability metrics matching About.tsx
- **FR-032**: `services.md` — "Service 4: RAG / Knowledge Base Systems" heading MUST change to "Service 4: AI Knowledge Base"
- **FR-033**: `contact.md` — service type reference "RAG / Knowledge Base Systems" MUST change to "AI Knowledge Base"
- **FR-034**: `faq.md` — opening description MUST remove "Full-Stack Developer" secondary identity. Service reference "RAG / Knowledge Base Systems" MUST change to "AI Knowledge Base"
- **FR-035**: After ALL RAG KB file edits are complete, `scripts/seed-rag.py` MUST be run to refresh Qdrant vectors (constitution mandate — non-negotiable)

### Key Entities

| Entity | File | Fields Changing | Fields Protected |
|--------|------|----------------|-----------------|
| Hero H1 | `Hero.tsx` | text node | eyebrow, sub-copy, badge, buttons |
| TypeAnimation | `Hero.tsx` | sequence array | wrapper, speed, className |
| Tech pills | `Hero.tsx` | array values | styling, rendering |
| About stats | `About.tsx` | value + label (×4) | bio paragraphs |
| RAG service | `Services.tsx` | name field | id, deliverables, target_client |
| Services sub-heading | `Services.tsx` | paragraph text | all else |
| Contact H2 | `Contact.tsx` | h2 text | form, links, schema |
| Contact sub-copy | `Contact.tsx` | paragraph text | all else |
| WhatsApp note | `Contact.tsx` | new supporting line | WhatsApp href |
| Availability note | `Contact.tsx` | paragraph text | all else |
| Todo problem | `projects-manifest.json` | problem field | id, slug, title, all other fields |
| Textbook problem | `projects-manifest.json` | problem field | id, slug, title, all other fields |
| Footer tagline | `Footer.tsx` | paragraph text | all else |
| Footer copyright | `Footer.tsx` | text content | all else |
| Chat suggestions | `ChatWidget.tsx` | SUGGESTED array | all logic |
| Skills heading | `Skills.tsx` | h2 text | skills data, tabs |
| Profile title | `murad-profile.md` | Title field | Availability block |
| Profile summary | `murad-profile.md` | Professional Summary | Availability block |
| Profile stats | `murad-profile.md` | Stats section | Availability block |

---

## Success Criteria *(mandatory)*

- **SC-001**: A non-technical reader identifies the portfolio's core value proposition within 3 seconds of landing on the hero
- **SC-002**: All 4 service names and the section sub-heading are understandable to a non-technical business owner without explanation
- **SC-003**: All 4 project problem statements describe a recognisable business problem — not a developer exercise or academic submission
- **SC-004**: All 4 stat boxes communicate system-verified outcomes — none reference hackathons, self-taught status, or technology counts
- **SC-005**: The contact section heading names automation — not a generic collaboration phrase
- **SC-006**: The contact section clearly identifies WhatsApp as the fastest response path with explicit timing
- **SC-007**: The chat widget's 4 suggested questions are all questions a non-technical business owner would genuinely ask
- **SC-008**: The AI chatbot (RAG) gives answers consistent with the updated portfolio copy — no "Self-Taught" or "Full-Stack Developer" primary identity in responses
- **SC-009**: The footer tagline matches the updated positioning — no job-title language
- **SC-010**: Zero routing breakage — all internal links, slugs, service IDs, and project slugs function identically after all changes
- **SC-011**: Zero unintended changes — About bio paragraphs, service deliverables, project technical details, form schema all unchanged

---

## Assumptions

- All stat values ($75K→$1K, 20 hrs, 4, 24/7) are system-capability claims from actual project designs — not verified real-client results. Labels are written to reflect this.
- The `todo-cloud-ai` project was assigned by a teacher as a practice exercise but is a real-world production tool — problem statement reframe reflects this.
- `murad-profile.md` is the primary source for the RAG chatbot's knowledge about Murad. Updating it ensures chatbot answers stay consistent with portfolio copy.
- The Fiverr CTA button stays as primary hero CTA — this is an intentional business decision, not in scope for this feature.
- WhatsApp prominence is achieved through copy alone (no new UI elements) in this sprint.

---

## Out of Scope

- Adding testimonials section
- Adding pricing section to the portfolio
- Adding "early client / discounted work" section
- Removing any project from the featured grid
- Changing CTA button text or href values
- Changing navbar links or order
- Adding WhatsApp to navbar (separate feature sprint)
- Changing project filter labels in Projects.tsx
- Any UI/layout/styling changes
- Adding new sections or components
- Changing the contact form fields or Zod validation schema
- Changing service deliverables or target_client labels
- Changing any project's tech stack, metrics, highlights, or gallery images
