# Tasks: Portfolio Copy Conversion

**Input**: Design documents from `specs/008-portfolio-copy-conversion/`
**Branch**: `008-portfolio-copy-conversion`
**Date**: 2026-04-24
**Spec**: 35 FRs across 11 files | **Plan**: 5 execution groups, 14 steps

**Total tasks**: 14
**Parallel opportunities**: Group A (T001–T004) fully parallelisable
**No setup or foundational phase needed** — all files pre-exist, no new dependencies

---

## Hard Rules (apply to every task)

1. Read the file before editing
2. Verify the exact before-value is present before writing
3. Do NOT change: routing ids/slugs, bio paragraphs, Zod schema, CTA buttons, service deliverables, project tech stacks
4. Do NOT add comments or refactor surrounding code
5. Each task is independently verifiable — check only its declared FRs

---

## Phase 1: Group A — Standalone Components (fully parallelisable)

**Purpose**: Low-risk, single-node text replacements with no interdependencies.
**Independent test**: Each file compiles and renders the new text node without touching any other element.

- [x] T001 [P] [US8] Update Skills.tsx section heading — FR-025
  - File: `frontend/src/components/sections/Skills.tsx`
  - Find: `Technical Expertise` (inside the `<h2>` element, line ~92)
  - Replace with: `What I Build With`
  - Must NOT change: skill data, tab logic, proficiency dots, any className or style

- [x] T002 [P] [US8] Update Footer.tsx tagline and copyright text — FR-021, FR-022
  - File: `frontend/src/components/layout/Footer.tsx`
  - Change 1 (FR-021): Find: `AI Automation Engineer &amp; Full-Stack Developer` → Replace with: `AI Automation for Small Businesses`
  - Change 2 (FR-022): Find: `Built with Next.js, FastAPI &amp; a RAG chatbot that actually knows the code.` → Replace with: `Built with the same AI stack I sell — Next.js, FastAPI, and an AI assistant that knows the full codebase.`
  - Must NOT change: social links, brand name, copyright year logic, layout

- [x] T003 [P] [US6] Update ChatWidget.tsx suggested questions — FR-023
  - File: `frontend/src/components/ChatWidget.tsx`
  - Find the `SUGGESTED` const array (line ~17):
    ```
    "What AI projects have you built?",
    "What services do you offer?",
    "What is your tech stack?",
    "How can I hire you?",
    ```
  - Replace with:
    ```
    "What can you automate for my business?",
    "What services do you offer?",
    "How much does a project cost?",
    "How do we get started?",
    ```
  - Must NOT change: chat logic, streaming, session, FAB, header text, input, message bubbles

- [x] T004 [P] [US2] Update About.tsx stats array — FR-007
  - File: `frontend/src/components/sections/About.tsx`
  - Find the `stats` const array (lines ~12–17):
    ```typescript
    const stats = [
      { value: "2+", label: "Years Experience" },
      { value: "5+", label: "Hackathons" },
      { value: "20+", label: "Technologies" },
      { value: "100%", label: "Self-Taught" },
    ] as const;
    ```
  - Replace with:
    ```typescript
    const stats = [
      { value: "$75K→$1K", label: "human FTE vs. this AI system" },
      { value: "20 hrs",   label: "of weekly admin work automated" },
      { value: "4",        label: "real working systems built" },
      { value: "24/7",     label: "uptime — no sick days, ever" },
    ] as const;
    ```
  - Must NOT change: bio paragraphs (4 `<p>` elements), social links, download resume button, view projects button, any className or style

---

## Phase 2: Group B — Hero Section

**Purpose**: Three related changes in one file — H1, TypeAnimation sequence, techPills array.
**Independent test**: Load homepage. H1 reads "Automate the Work That's Slowing Your Business Down". Pills show outcome labels. TypeAnimation cycles client phrases. Run `tsc --noEmit` after.

- [x] T005 [US1] Update Hero.tsx — H1, TypeAnimation sequence, techPills — FR-001, FR-004, FR-005
  - File: `frontend/src/components/sections/Hero.tsx`

  **Change 1 — H1 (FR-001)**:
  Find (inside `<motion.h1>`, lines ~137–142):
  ```
  AI Automation Engineer
  <br />
  <span style={{ color: "var(--accent-cyan)" }}>
    &amp; Full-Stack Developer
  </span>
  ```
  Replace with:
  ```
  Automate the Work That&apos;s
  <br />
  <span style={{ color: "var(--accent-cyan)" }}>
    Slowing Your Business Down
  </span>
  ```

  **Change 2 — TypeAnimation sequence (FR-004)**:
  Find (inside `<TypeAnimation sequence={[` block, lines ~168–177):
  ```
  "AI Agent Developer",
  2000,
  "Full-Stack Developer",
  2000,
  "Automation Engineer",
  2000,
  "RAG System Builder",
  2000,
  ```
  Replace with:
  ```
  "handling support for you",
  2000,
  "cutting your busywork",
  2000,
  "freeing up your team's time",
  2000,
  "turning your process into a system",
  2000,
  ```

  **Change 3 — techPills array (FR-005)**:
  Find (line ~51):
  ```typescript
  const techPills = ["Next.js", "FastAPI", "OpenAI", "Kubernetes", "MCP"];
  ```
  Replace with:
  ```typescript
  const techPills = ["automates 20+ hrs/week", "runs while you sleep", "no extra headcount", "always on"];
  ```

  **After all 3 changes**: Run `cd frontend && npx tsc --noEmit` — must pass with zero errors.
  Must NOT change: eyebrow `// AI Automation Engineer`, sub-copy paragraph, availability badge, CTA buttons, social links, animation variants, styling

---

## Phase 3: Group C — Services and Contact

**Purpose**: Service rename + contact copy rewrite including conditional WhatsApp note.
**Independent test**: Services section shows "AI Knowledge Base" (not "RAG"). Contact H2 reads "Let's Automate Your Workflow". WhatsApp entry shows supporting line. Availability note shows split timing.

- [x] T006 [US3] Update Services.tsx — RAG service name, section sub-heading — FR-009, FR-010
  - File: `frontend/src/components/sections/Services.tsx`

  **Change 1 — RAG service name (FR-009)**:
  Find (inside `services` array, the 4th service object):
  ```
  name: "RAG / Knowledge Base Systems",
  ```
  Replace with:
  ```
  name: "AI Knowledge Base",
  ```
  CRITICAL: The `id: "rag-knowledge-base"` field on the same object must NOT change.

  **Change 2 — Section sub-heading (FR-010)**:
  Find (in the heading `<p>` below `<h2>What I Offer</h2>`):
  ```
  End-to-end AI and web development services for international
            clients.
  ```
  Replace with:
  ```
  Built for businesses that want to automate without the
            technical headache.
  ```
  Must NOT change: service ids, deliverables, target_client fields, icons, card layout, CTA buttons

- [x] T007 [US5] Update Contact.tsx — H2, sub-copy, WhatsApp note, availability note — FR-012, FR-013, FR-014, FR-015
  - File: `frontend/src/components/sections/Contact.tsx`

  **Change 1 — H2 (FR-012)**:
  Find:
  ```
  Let&apos;s Work Together
  ```
  Replace with:
  ```
  Let&apos;s Automate Your Workflow
  ```

  **Change 2 — Sub-copy (FR-013)**:
  Find:
  ```
  Have a project in mind? Reach out directly or use the form below.
  ```
  Replace with:
  ```
  Tell me what your team does repeatedly — I&apos;ll tell you if it can be automated, and I&apos;ll be honest if it can&apos;t.
  ```

  **Change 3 — WhatsApp supporting line (FR-014)**:
  The `CONTACT_LINKS` array is mapped in JSX. Inside the `.map()` render block, after the WhatsApp `<a>` link renders, add a conditional `<p>` that only shows for the WhatsApp entry.
  Find the render block inside the map (around line ~162–176 where href links render). After the closing of the conditional `{href ? (...) : (...)}` block but still inside the WhatsApp entry's `<div>`, add:
  ```tsx
  {label === "WhatsApp" && (
    <p
      className="text-xs mt-0.5"
      style={{
        fontFamily: "var(--font-jetbrains-mono)",
        color: "var(--text-muted)",
      }}
    >
      Fastest way to reach me — most clients hear back within a few hours.
    </p>
  )}
  ```

  **Change 4 — Availability note (FR-015)**:
  Find (inside the availability note `<p>`):
  ```
  Open to new projects. Typically responds within 24 hours.
  ```
  Replace with:
  ```
  Open to new projects. WhatsApp replies in a few hours — form replies within 24.
  ```
  Must NOT change: form fields, Zod schema, social links, contact link hrefs, rate limit logic, success/error states

---

## Phase 4: Group D — Data and Context Files

**Purpose**: Update JSON manifest problem fields and murad-profile.md for RAG consistency.
**Independent test**: JSON is valid (`python3 -m json.tool context/projects-manifest.json`). Both changed problem fields contain new text. murad-profile.md Title and Stats section show new values. Availability block unchanged.

- [x] T008 [US4] Update projects-manifest.json — Todo App and Physical AI Textbook problem fields — FR-017, FR-018
  - File: `context/projects-manifest.json`

  **Change 1 — Todo App problem (FR-017)**:
  Find the object with `"id": "todo-cloud-ai"` and update its `"problem"` field:
  ```
  "problem": "Demonstrate a complete, documented software evolution — from a console CLI to a production cloud-native AI agent — using Spec-Driven Development as the only discipline at every phase.",
  ```
  Replace with:
  ```
  "problem": "Teams lose hours tracking tasks across disconnected tools. This production system takes plain-English input, creates and assigns tasks automatically, sends reminders, and runs on Kubernetes — built as a real-world tool and documented end-to-end.",
  ```

  **Change 2 — Physical AI Textbook problem (FR-018)**:
  Find the object with `"id": "physical-ai-textbook"` and update its `"problem"` field (the long multi-sentence paragraph starting with "Physical AI — AI systems...").
  Replace with:
  ```
  "problem": "Online robotics courses assume identical hardware for every learner and offer no help when students get stuck mid-lesson. This platform adapts content to each student's hardware setup and answers questions in real time — deployed on live cloud infrastructure.",
  ```
  After editing: run `python3 -m json.tool context/projects-manifest.json > /dev/null` to verify valid JSON.
  Must NOT change: any `id`, `slug`, `title`, `description`, `tech`, `github_url`, `live_url`, `image`, `metrics`, `highlights` fields, or any other project's data

- [x] T009 [US7] Update context/murad-profile.md — Title, Professional Summary, Stats — FR-027, FR-028, FR-029
  - File: `context/murad-profile.md`

  **Change 1 — Title (FR-027)**:
  Find:
  ```
  - Title: AI Automation Engineer & Full-Stack Developer
  ```
  Replace with:
  ```
  - Title: AI Automation Engineer
  ```

  **Change 2 — Professional Summary (FR-028)**:
  Find:
  ```
  AI Automation Engineer and Full-Stack Developer specializing in building autonomous
  AI systems, intelligent chatbots, and scalable web applications. 2+ years building
  with modern AI technologies including OpenAI Agents SDK, MCP (Model Context Protocol),
  RAG systems, and cloud-native architectures.
  ```
  Replace with:
  ```
  AI Automation Engineer specializing in building autonomous AI systems that replace
  repetitive business work. 2+ years building production-grade systems — from 24/7
  customer support agents to cloud-native automation — using OpenAI Agents SDK, MCP,
  RAG pipelines, and Kubernetes.
  ```

  **Change 3 — Stats section (FR-029)**:
  Find:
  ```
  ## Stats (Accurate)
  - Experience: 2+ Years
  - Projects Completed: 5+
  - Technologies Used: 20+
  - Hackathons Completed: 5+
  ```
  Replace with:
  ```
  ## Stats (Accurate)
  - AI System Cost vs Human FTE: $75K→$1K per year
  - Weekly Admin Work Automated: 20 hrs
  - Production Systems Built: 4
  - Uptime: 24/7 — no sick days
  ```
  CRITICAL: Must NOT change the `## Availability` block — Status, Label, Note, Hours per week must remain exactly as they are.

---

## Phase 5: Group E — RAG Knowledge Base Sync (run LAST)

**Purpose**: Sync chatbot knowledge with updated portfolio copy. Constitution mandates this group runs after all other edits and that Qdrant is re-seeded after.
**Independent test**: After seed-rag.py completes, open chat widget and ask "What is Murad's title?" — response must NOT contain "Full-Stack Developer" as primary identity. Ask "What services do you offer?" — "AI Knowledge Base" (not "RAG / Knowledge Base Systems").

- [x] T010 [US7] Update rag-knowledge-base/about.md — remove Full-Stack Developer, update Career Stats — FR-031
  - File: `context/rag-knowledge-base/about.md`

  **Change 1 — Opening line**:
  Find:
  ```
  Murad Hasil is an AI Automation Engineer and Full-Stack Developer based in Karachi, Pakistan. He specialises in building autonomous AI systems, intelligent chatbots, and scalable full-stack web applications for businesses worldwide.
  ```
  Replace with:
  ```
  Murad Hasil is an AI Automation Engineer based in Karachi, Pakistan. He specialises in building autonomous AI systems that replace repetitive business work — from 24/7 customer support agents to full workflow automation — for businesses worldwide.
  ```

  **Change 2 — Career Stats section**:
  Find:
  ```
  ## Career Stats

  - **2+ years** of experience with AI and full-stack development
  - **5+ hackathons** completed (including 4 major Panaversity hackathons)
  - **20+ technologies** used in production
  - **4 featured portfolio projects** — production-deployed with live infrastructure and documented specs
  ```
  Replace with:
  ```
  ## Career Stats

  - **$75K→$1K** — annual cost of one AI system vs. a human FTE (from CRM Digital FTE project)
  - **20 hrs** — weekly admin work automated per system (from Personal AI Employee project)
  - **4 production systems** — deployed with live infrastructure and documented specs
  - **24/7 uptime** — no sick days, no downtime in production deployments
  ```

- [x] T011 [US3] [US7] Update rag-knowledge-base/services.md — rename RAG service — FR-032
  - File: `context/rag-knowledge-base/services.md`

  Find:
  ```
  ## Service 4: RAG / Knowledge Base Systems
  ```
  Replace with:
  ```
  ## Service 4: AI Knowledge Base
  ```
  Must NOT change: service descriptions, deliverables, example work sections

- [x] T012 [US3] [US7] Update rag-knowledge-base/contact.md — update service type name — FR-033
  - File: `context/rag-knowledge-base/contact.md`

  Find (in the Contact Form section):
  ```
  - Service type (AI Chatbot & Agent Development, Business Automation, Full-Stack Web Apps, RAG / Knowledge Base Systems)
  ```
  Replace with:
  ```
  - Service type (AI Chatbot & Agent Development, Business Automation, Full-Stack Web Apps, AI Knowledge Base)
  ```
  Also find (in Project Types section):
  ```
  - RAG knowledge base systems (AI search over your company documents)
  ```
  Replace with:
  ```
  - AI Knowledge Base systems (AI search over your company documents)
  ```

- [x] T013 [US7] Update rag-knowledge-base/faq.md — remove Full-Stack Developer, rename RAG service — FR-034
  - File: `context/rag-knowledge-base/faq.md`

  **Change 1 — Opening "What does Murad do?" answer**:
  Find:
  ```
  Murad Hasil is an AI Automation Engineer and Full-Stack Developer based in Karachi, Pakistan. He builds autonomous AI agents, RAG chatbots, business automation systems, and full-stack web applications. His specialisation is taking a business problem that currently requires human time and building an AI system that handles it automatically — cheaper, faster, and 24/7.
  ```
  Replace with:
  ```
  Murad Hasil is an AI Automation Engineer based in Karachi, Pakistan. He builds autonomous AI agents, RAG chatbots, and business automation systems. His specialisation is taking a business problem that currently requires human time and building an AI system that handles it automatically — cheaper, faster, and 24/7.
  ```

  **Change 2 — "What services does Murad offer?" answer**:
  Find:
  ```
  4. **RAG / Knowledge Base Systems** — vector search systems for company knowledge bases, document Q&A
  ```
  Replace with:
  ```
  4. **AI Knowledge Base** — vector search systems for company knowledge bases, document Q&A
  ```

  **Change 3 — "What makes Murad different?" answer**:
  Find:
  ```
  4. **RAG / Knowledge Base Systems** — vector search systems for company knowledge bases, document Q&A
  ```
  Note: only one occurrence of this exact string exists in the file — the one in services list. Verify before replacing.
  Must NOT change: project descriptions, hackathon facts, tech stack answers, hiring/pricing answers, any URLs

- [x] T014 [US7] Re-seed Qdrant — FR-035 (MANDATORY — constitution mandate)
  - Action: Run `python3 scripts/seed-rag.py` from repo root
  - This refreshes Qdrant vectors with the updated RAG knowledge base files (T010–T013)
  - Wait for script to complete and confirm no errors
  - If script fails: surface error to user before proceeding — do NOT skip this step
  - Constitution states: "After editing any file in context/rag-knowledge-base/, ALWAYS re-run scripts/seed-rag.py to refresh Qdrant vectors"

---

## Dependencies

```
T001 ──────────────────────────────────────────┐
T002 ──────────────────────────────────────────┤
T003 ──────────────────────────────────────────┤─→ T005 → T006 → T007 → T008 → T009 → T010 → T011 → T012 → T013 → T014
T004 ──────────────────────────────────────────┘
```

- T001–T004 are fully parallel (different files)
- T005 can start after T001–T004 (or independently — different file)
- T006 and T007 can run in parallel (different files)
- T008 and T009 can run in parallel (different files)
- T010–T013 can run in parallel (different KB files)
- T014 MUST run after T010–T013 (requires all KB edits to be complete)

---

## Acceptance Verification (run after T014 completes)

1. **TypeScript**: `cd frontend && npx tsc --noEmit` — zero errors
2. **JSON validity**: `python3 -m json.tool context/projects-manifest.json > /dev/null` — no errors
3. **Routing**: Navigate to `#services`, `#about`, `#contact`, `/projects/crm-digital-fte` — all load
4. **Visual spot-check** (Playwright): Homepage at 1440px — H1, pills, stats, footer show new copy
5. **RAG chatbot**: Ask "What is Murad's title?" → no "Full-Stack Developer" primary identity; ask "What services?" → shows "AI Knowledge Base"
6. **Bio preservation**: About section bio paragraphs word-for-word identical to pre-implementation
7. **Service id check**: Services section contact link for RAG service still routes to `#contact` correctly
