# Tasks: Portfolio Services & CTA Update (009)

**Input**: `specs/009-services-cta-update/plan.md` + `spec.md`  
**Branch**: `009-services-cta-update`  
**Date**: 2026-04-24

No new packages. No new components. No schema changes. Five files, six logical diffs.

---

## Execution Groups

| Group | Tasks | Run when |
|-------|-------|----------|
| A | T001, T002, T003 | Immediately — all different files |
| B | T004, T005 | After Group A (T005 edits About.tsx which T003 already touched) |
| C | T006 | After Groups A + B are done |
| D | T007 | After Group C — final gate |

---

## Group A — Pure Data Swaps (run in parallel)

### T001 [P] [US1] — Hero.tsx: Swap primary CTA to WhatsApp

**File**: `frontend/src/components/sections/Hero.tsx`  
**FR**: FR-001, FR-002, FR-003, FR-004

**Step 1 — Read file, verify before-string exists**:

Locate this exact block (lines ~226–239):
```tsx
          <a
            href="https://www.fiverr.com/murad_hasil"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3 rounded-md font-semibold text-sm transition-all duration-200"
            style={{
              fontFamily: "var(--font-space-grotesk)",
              color: "#08080F",
              background: "var(--accent-cyan)",
              boxShadow: "0 0 20px rgba(0,212,255,0.25)",
            }}
          >
            Hire Me on Fiverr
          </a>
```

**Step 2 — Replace with**:
```tsx
          <a
            href="https://wa.me/923142241393"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3 rounded-md font-semibold text-sm transition-all duration-200"
            style={{
              fontFamily: "var(--font-space-grotesk)",
              color: "#08080F",
              background: "var(--accent-cyan)",
              boxShadow: "0 0 20px rgba(0,212,255,0.25)",
            }}
          >
            Chat on WhatsApp
          </a>
```

**Protected — MUST NOT change**:
- Secondary CTA `<a href="#projects">See My Work</a>` — untouched
- `socialLinks` array (already has WhatsApp entry — do not duplicate or remove)
- All other Hero elements (eyebrow, h1, TypeAnimation, techPills, value prop paragraph, scroll hint)
- `target="_blank"`, `rel="noopener noreferrer"`, all class names, all style values

**Verify**:
- [ ] `href` on primary button === `https://wa.me/923142241393`
- [ ] Button text === `Chat on WhatsApp`
- [ ] Secondary "See My Work" href === `#projects` (unchanged)
- [ ] No `fiverr.com` remaining in this file

---

### T002 [P] [US3] — Footer.tsx: Add Fiverr social link

**File**: `frontend/src/components/layout/Footer.tsx`  
**FR**: FR-011, FR-012, FR-013

**Step 1 — Read file, verify before-strings exist**:

**Edit 1** — import (line 1):
```tsx
import { Mail, MessageCircle } from "lucide-react";
```
Replace with:
```tsx
import { Mail, MessageCircle, ExternalLink } from "lucide-react";
```

**Edit 2** — `socialLinks` array tail (lines ~20–25):
```tsx
  {
    label: "Email",
    href: "mailto:mbmuradhasil@gmail.com",
    Icon: Mail,
  },
] as const;
```
Replace with:
```tsx
  {
    label: "Email",
    href: "mailto:mbmuradhasil@gmail.com",
    Icon: Mail,
  },
  {
    label: "Fiverr",
    href: "https://www.fiverr.com/murad_hasil",
    Icon: ExternalLink,
  },
] as const;
```

**Protected — MUST NOT change**:
- Existing entries: GitHub, LinkedIn, WhatsApp, Email — labels, hrefs, Icons all unchanged
- Footer JSX render block — no changes needed (map handles new entry automatically)
- Brand section, copyright text

**Verify**:
- [ ] Import line contains `ExternalLink`
- [ ] `socialLinks` has exactly 5 entries
- [ ] Fiverr entry `href` === `https://www.fiverr.com/murad_hasil`
- [ ] All 4 original entries (`GitHub`, `LinkedIn`, `WhatsApp`, `Email`) still present with original hrefs

---

### T003 [P] [US6] — About.tsx: Rewrite bio paragraph 3

**File**: `frontend/src/components/sections/About.tsx`  
**FR**: FR-024, FR-025, FR-026

**Step 1 — Read file, verify before-string exists**:

Locate this exact block (lines ~159–167):
```tsx
              <p
                className="text-base leading-relaxed mb-3"
                style={{ color: "var(--text-secondary)" }}
              >
                What makes my approach different is how I plan before building.
                I follow a &apos;spec-driven&apos; workflow where requirements,
                architecture, and edge cases are defined upfront. This reduces
                surprises, keeps systems clean, and makes them easier to scale.
              </p>
```

**Step 2 — Replace with**:
```tsx
              <p
                className="text-base leading-relaxed mb-3"
                style={{ color: "var(--text-secondary)" }}
              >
                What makes my approach different is how I plan before building
                anything. Before writing code, I break the project down
                step-by-step — starting with a clear understanding of the
                problem, then defining how the system should work, and finally
                turning that into a structured build plan. This includes mapping
                different scenarios so nothing breaks later. This approach reduces
                confusion, avoids rework, and ensures the system runs reliably
                once it&apos;s live.
              </p>
```

**Protected — MUST NOT change**:
- Paragraph 1: `"I started my journey as a full-stack developer…"`
- Paragraph 2: `"Since 2023, I've been building production-ready AI systems…"`
- Paragraph 4: `"I care about keeping things simple, reliable…"`
- `className="text-base leading-relaxed mb-3"` — unchanged on this element
- `style={{ color: "var(--text-secondary)" }}` — unchanged
- Four-`<p>` HTML structure — unchanged
- Stats array and render (that is T005's scope)

**Verify**:
- [ ] Para 3 contains `"What makes my approach different is how I plan before building anything."`
- [ ] Para 3 contains `"once it&apos;s live."` (or equivalent `once it's live.`)
- [ ] No `spec-driven` text remains anywhere in the file
- [ ] Paras 1, 2, 4 text is byte-for-byte unchanged

---

## Group B — Render + Data Changes (run in parallel after Group A)

### T004 [P] [US2] — Contact.tsx: Insert Fiverr CTA block

**File**: `frontend/src/components/sections/Contact.tsx`  
**FR**: FR-005, FR-006, FR-007, FR-008, FR-009, FR-010

**Step 1 — Read file, verify before-string exists**:

Locate this exact block (lines ~234–242 — the start of the availability note div):
```tsx
            {/* Availability note */}
            <div
              className="rounded-lg px-4 py-3 mt-2"
              style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-subtle)",
              }}
            >
```

**Step 2 — Replace with** (prepend Fiverr block immediately before it):
```tsx
            {/* Fiverr CTA */}
            <div
              className="rounded-lg px-4 py-4 mt-2"
              style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <p
                className="text-xs mb-3"
                style={{
                  fontFamily: "var(--font-jetbrains-mono)",
                  color: "var(--accent-cyan)",
                }}
              >
                {"// Or hire me directly"}
              </p>
              <a
                href="https://www.fiverr.com/murad_hasil"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center py-2.5 rounded text-sm font-semibold transition-opacity duration-200 hover:opacity-90 mb-2"
                style={{
                  background: "var(--accent-cyan)",
                  color: "#08080F",
                  fontFamily: "var(--font-space-grotesk)",
                }}
              >
                View My Fiverr Profile
              </a>
              <p
                className="text-xs text-center"
                style={{
                  fontFamily: "var(--font-space-grotesk)",
                  color: "var(--text-muted)",
                }}
              >
                Browse packages, reviews, and fixed-price options.
              </p>
            </div>

            {/* Availability note */}
            <div
              className="rounded-lg px-4 py-3 mt-2"
              style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-subtle)",
              }}
            >
```

**Protected — MUST NOT change**:
- Zod `schema` object — zero edits
- `CONTACT_LINKS` array (Email, WhatsApp, Location)
- Social icon row (GitHub + LinkedIn icons)
- Availability note div and its content
- Right panel (`lg:col-span-3`) — the form — untouched entirely
- `inputClass`, `Field` helpers
- No new imports required

**Verify**:
- [ ] Label `"// Or hire me directly"` is visible in rendered left panel
- [ ] Button text `"View My Fiverr Profile"` present
- [ ] Button `href` === `https://www.fiverr.com/murad_hasil`
- [ ] Supporting text `"Browse packages, reviews, and fixed-price options."` present
- [ ] Fiverr block renders between social icon row and availability note
- [ ] Contact form fields and submit button are completely unaffected
- [ ] No new imports in file

---

### T005 [US5] — About.tsx: Replace stats data + render block

> **Note**: Group A's T003 already edits About.tsx (bio para 3). Start T005 only after T003 is merged/applied to the working file. T005 and T004 are parallel with each other.

**File**: `frontend/src/components/sections/About.tsx`  
**FR**: FR-021, FR-022, FR-023

**Step 1 — Read file (after T003 is applied), verify before-strings exist**:

**Edit 1** — stats data (lines ~12–17):
```tsx
const stats = [
  { value: "$75K→$1K", label: "human FTE vs. this AI system" },
  { value: "20 hrs", label: "of weekly admin work automated" },
  { value: "4", label: "real working systems built" },
  { value: "24/7", label: "uptime — no sick days, ever" },
] as const;
```
Replace with:
```tsx
const stats = [
  "Saves hours of manual work every week",
  "No extra hiring required",
  "Built on real, working systems",
  "Runs 24/7 without manual effort",
];
```

**Edit 2** — stats render block (lines ~208–237, inside the `grid` motion div):
```tsx
              {stats.map(({ value, label }) => (
                <div
                  key={label}
                  className="rounded-lg p-4 text-center"
                  style={{
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border-subtle)",
                  }}
                >
                  <div
                    className="text-2xl font-bold mb-0.5"
                    style={{
                      fontFamily: "var(--font-space-grotesk)",
                      color: "var(--accent-cyan)",
                    }}
                  >
                    {value}
                  </div>
                  <div
                    className="text-xs"
                    style={{
                      fontFamily: "var(--font-jetbrains-mono)",
                      color: "var(--text-muted)",
                    }}
                  >
                    {label}
                  </div>
                </div>
              ))}
```
Replace with:
```tsx
              {stats.map((phrase) => (
                <div
                  key={phrase}
                  className="rounded-lg p-4 text-center flex items-center justify-center"
                  style={{
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border-subtle)",
                  }}
                >
                  <p
                    className="text-sm font-medium leading-snug"
                    style={{
                      fontFamily: "var(--font-space-grotesk)",
                      color: "var(--text-primary)",
                    }}
                  >
                    {phrase}
                  </p>
                </div>
              ))}
```

**Protected — MUST NOT change**:
- Grid wrapper: `className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"` — unchanged
- Card background + border style — unchanged
- Bio paragraphs (T003's output) — do not re-edit
- `socials` array — unchanged
- CTA row (Download Resume, View Projects) — unchanged
- Location + education chips — unchanged

**Verify**:
- [ ] `stats` is a `string[]` (no `{ value, label }` objects anywhere)
- [ ] 4 stat cards visible; each shows exactly one phrase
- [ ] No large numeric value (`$75K`, `20 hrs`, `4`, `24/7`) anywhere in the stat grid
- [ ] Phrases match spec verbatim (order: saves hours, no extra hiring, real systems, 24/7)
- [ ] Grid layout (2-col mobile, 4-col sm+) unchanged
- [ ] TypeScript: no `TS2339 Property 'value' does not exist` errors

---

## Group C — Full Redesign (after A + B complete)

### T006 [US4] — Services.tsx: Type + data + card render rewrite

**File**: `frontend/src/components/sections/Services.tsx`  
**FR**: FR-014, FR-015, FR-016, FR-017, FR-018, FR-019, FR-020

This task has three sequential sub-steps applied to one file.

**Step 1 — Read file, verify all three before-strings exist before editing**

---

**Sub-step 6a — Replace `Service` type** (lines ~7–14):

Before:
```tsx
type Service = {
  id: string;
  name: string;
  target_client: string;
  deliverables: string[];
  cta: string;
  icon: ReactNode;
};
```
After:
```tsx
type Service = {
  id: string;
  name: string;
  description: string;
  outcome: string;
  cta: string;
  icon: ReactNode;
};
```

---

**Sub-step 6b — Replace `services` data array** (lines ~17–68 — the entire `const services` block):

Before:
```tsx
/* ── Data sourced from context/services-manifest.json ─────────────────────── */
const services: Service[] = [
  {
    id: "ai-chatbot-agent",
    name: "AI Chatbot & Agent Development",
    target_client:
      "Businesses wanting 24/7 customer support or internal automation",
    deliverables: [
      "Production-ready AI agent or chatbot with your knowledge base",
      "RAG pipeline connected to your documents and data",
      "Deployment to your preferred platform (Vercel, Railway, or cloud)",
    ],
    cta: "#contact",
    icon: <Bot size={22} />,
  },
  {
    id: "business-automation",
    name: "Business Automation",
    target_client:
      "Small businesses spending hours on repetitive manual tasks",
    deliverables: [
      "Automated workflow replacing your most time-consuming manual process",
      "Monitoring dashboard and alerting for the automation",
      "Documentation and handover so your team can manage it",
    ],
    cta: "#contact",
    icon: <Zap size={22} />,
  },
  {
    id: "fullstack-web-apps",
    name: "Full-Stack Web Apps",
    target_client: "Startups and SMEs needing custom web applications",
    deliverables: [
      "Fully functional web app with frontend and backend",
      "PostgreSQL database with proper schema and migrations",
      "CI/CD pipeline with GitHub Actions and auto-deployment",
    ],
    cta: "#contact",
    icon: <Code size={22} />,
  },
  {
    id: "rag-knowledge-base",
    name: "AI Knowledge Base",
    target_client: "Companies wanting AI that answers from their own data",
    deliverables: [
      "Vector database populated with your company's knowledge",
      "AI query interface returning grounded, cited answers",
      "Update pipeline so new documents are indexed automatically",
    ],
    cta: "#contact",
    icon: <Database size={22} />,
  },
];
```

After:
```tsx
/* ── Data sourced from context/services-manifest.json ─────────────────────── */
const services: Service[] = [
  {
    id: "ai-chatbot-agent",
    name: "Customer Support Automation",
    description:
      "For businesses tired of answering the same questions every day.\n\nI build AI systems that handle customer queries across chat, email, or web — 24/7 — so your team can focus on work that actually needs a human.",
    outcome:
      "Faster responses, lower support workload, and consistent customer experience.",
    cta: "#contact",
    icon: <Bot size={22} />,
  },
  {
    id: "business-automation",
    name: "Business Process Automation",
    description:
      "For teams spending hours on repetitive tasks like data entry, follow-ups, or reports.\n\nI map your workflow and automate it end-to-end — so the same work gets done without manual effort.",
    outcome: "Save hours every week, reduce errors, and free up your team's time.",
    cta: "#contact",
    icon: <Zap size={22} />,
  },
  {
    id: "rag-knowledge-base",
    name: "AI Knowledge Base (answers from your data)",
    description:
      "For businesses where people keep asking the same questions internally or externally.\n\nI turn your documents, SOPs, and data into an AI system that gives instant answers — no searching, no delays.",
    outcome: "Faster access to information and less dependency on team members.",
    cta: "#contact",
    icon: <Database size={22} />,
  },
  {
    id: "fullstack-web-apps",
    name: "Custom AI Tools for Your Business",
    description:
      "For businesses that need something built around how they actually work.\n\nI design and build custom AI systems tailored to your workflow — not generic tools that don't fit.",
    outcome:
      "A system that works exactly the way your business operates and scales with it.",
    cta: "#contact",
    icon: <Code size={22} />,
  },
];
```

> Note: Service order changed — `rag-knowledge-base` moved to position 3, `fullstack-web-apps` to position 4. IDs are unchanged; render order is not contractually fixed.

---

**Sub-step 6c — Replace ServiceCard body** (target_client + deliverables blocks → description + outcome):

Before (lines ~176–203, between the Name `<h3>` and the CTA `<a>`):
```tsx
      {/* Target client */}
      <p
        className="text-xs mb-3"
        style={{
          fontFamily: "var(--font-jetbrains-mono)",
          color: "var(--accent-indigo)",
        }}
      >
        For: {service.target_client}
      </p>

      {/* Deliverables */}
      <ul className="space-y-1.5 mb-6 flex-1">
        {service.deliverables.map((d, i) => (
          <li
            key={i}
            className="flex items-start gap-2 text-xs"
            style={{ color: "var(--text-secondary)" }}
          >
            <span
              style={{ color: "var(--accent-green)", flexShrink: 0 }}
            >
              ✓
            </span>
            {d}
          </li>
        ))}
      </ul>
```

After:
```tsx
      {/* Description */}
      <div className="mb-4 flex-1 flex flex-col gap-2">
        {service.description.split("\n\n").map((chunk, i) => (
          <p
            key={i}
            className="text-sm leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            {chunk}
          </p>
        ))}
      </div>

      {/* Outcome */}
      <p
        className="text-xs mb-4"
        style={{
          fontFamily: "var(--font-space-grotesk)",
          color: "var(--accent-cyan)",
        }}
      >
        <span className="font-semibold">Outcome: </span>
        {service.outcome}
      </p>
```

**Protected — MUST NOT change**:
- Icon block (the `w-11 h-11 rounded-lg` div)
- Name `<h3>` (text content changes via data, but `className` + `style` untouched)
- CTA `<a href={service.cta}>Get Quote</a>` — href, text, classes, styles all unchanged
- `motion.div` card wrapper — `variants`, `className`, `style`, `whileHover` untouched
- Section header (`// Services`, `What I Offer`, sub-copy) — unchanged
- Cards grid wrapper — unchanged
- Service IDs: `ai-chatbot-agent`, `business-automation`, `rag-knowledge-base`, `fullstack-web-apps`

**Verify**:
- [ ] `Service` type has `description: string` and `outcome: string` — no `target_client` or `deliverables`
- [ ] All 4 service entries have `id`, `name`, `description`, `outcome`, `cta`, `icon`
- [ ] Name values match spec exactly: "Customer Support Automation", "Business Process Automation", "AI Knowledge Base (answers from your data)", "Custom AI Tools for Your Business"
- [ ] `service.target_client` no longer referenced anywhere in file
- [ ] `service.deliverables` no longer referenced anywhere in file
- [ ] `description.split("\n\n")` produces 2 paragraphs per card
- [ ] "Outcome:" prefix visible on each card
- [ ] CTA button text still `"Get Quote"`, href still `"#contact"`
- [ ] TypeScript: zero errors from type change

---

## Group D — Acceptance Gate (after Group C)

### T007 — TypeScript check + visual verification

**FR**: FR-030 (zero TS errors), SC-001 through SC-007

**Step 1 — Type check**:
```bash
cd frontend && npx tsc --noEmit
```
Expected: no output (exit code 0).  
If errors: fix the failing file before proceeding.

**Step 2 — Dev server**:
```bash
cd frontend && npm run dev
```
Open `http://localhost:3000` in browser.

**Step 3 — href spot-check** (inspect element or view source):

| Section | Element | Expected href |
|---------|---------|---------------|
| Hero | Primary CTA button | `https://wa.me/923142241393` |
| Contact | Fiverr button | `https://www.fiverr.com/murad_hasil` |
| Footer | 5th social icon | `https://www.fiverr.com/murad_hasil` |

**Step 4 — Visual check at 1440px desktop**:
- [ ] Hero: "Chat on WhatsApp" button left of "See My Work"; cyan styled
- [ ] Contact left panel: Fiverr block visible below social icons, before availability note; no layout overflow
- [ ] Footer: 5 social icons in one row, no wrapping
- [ ] Services: 4 cards; each shows name → 2 description paragraphs → "Outcome:" line → "Get Quote" button; no bullet lists; no "For:" labels
- [ ] About stats: 4 cards each showing a single phrase; no `$75K`, `20 hrs`, `4`, `24/7` visible
- [ ] About bio para 3: reads "What makes my approach different is how I plan before building anything…"

**Step 5 — Visual check at 375px mobile**:
- [ ] Hero: CTAs stack vertically, "Chat on WhatsApp" full-width
- [ ] Contact: Fiverr block full-width, text readable, no overflow
- [ ] Services: single-column cards; description text wraps cleanly
- [ ] About stats: 2×2 grid; phrase text wraps without overflow

**Step 6 — Contact form regression**:
- Fill all form fields with valid data → submit → success state renders
- No console errors in browser dev tools

**All checks pass → feature complete → ready for PR**

---

## Dependencies & Execution Order

```
Group A: T001 (Hero) ──────────┐
         T002 (Footer) ─────────┤─── all parallel
         T003 (About bio) ──────┘
                                 │
                                 ▼
Group B: T004 (Contact) ────────┐
         T005 (About stats) ────┘─── parallel; T005 depends on T003 applied first
                                 │
                                 ▼
Group C: T006 (Services) ─────────── single task, three sub-steps in order: 6a → 6b → 6c
                                 │
                                 ▼
Group D: T007 (Gate) ─────────────── final; all previous tasks must be complete
```

---

## Hard Rules (apply to every task)

1. **Read before edit** — always read the target file before writing any change
2. **Verify before-string** — confirm the exact before-string exists in the file before applying the edit; if not found, stop and report
3. **Do not touch**: routing IDs, Zod schema, service IDs, bio paras 1/2/4, Hero secondary CTA, contact form logic, social icons in Contact left panel
4. **No surrounding cleanup** — do not reformat, re-indent, or refactor lines outside the exact diff
5. **No new comments** — do not add explanatory comments beyond the ones shown in the after-strings
6. Each task is independently verifiable — run its own verify checklist before marking done
