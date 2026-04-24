# Feature Specification: Portfolio Services & CTA Update

**Feature Branch**: `009-services-cta-update`  
**Created**: 2026-04-24  
**Status**: Draft  
**Input**: User description: "Feature 009: portfolio-services-cta-update — Six copy and CTA changes across Hero, Contact, Footer, Services, and About sections."

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Visitor Reaches Out via WhatsApp from Hero (Priority: P1)

A potential client lands on the portfolio homepage and sees the primary call-to-action button in the Hero section. They click it and are taken directly to a WhatsApp conversation with the portfolio owner, allowing them to start a conversation immediately without navigating to a third-party platform first.

**Why this priority**: WhatsApp is a lower-friction first contact for many clients compared to Fiverr onboarding. Moving the primary CTA here captures warm leads sooner.

**Independent Test**: Can be fully tested by loading the homepage and clicking the primary Hero button — it should open WhatsApp at the correct contact number.

**Acceptance Scenarios**:

1. **Given** the homepage is loaded, **When** the visitor views the Hero section, **Then** the primary CTA button reads "Chat on WhatsApp" with accent-cyan styling.
2. **Given** the "Chat on WhatsApp" button is visible, **When** the visitor clicks it, **Then** they are taken to `https://wa.me/923142241393`.
3. **Given** the Hero section is rendered, **When** inspected, **Then** the secondary "See My Work" CTA and all other Hero content (eyebrow, headline, tech pills, sub-copy, social links) remain unchanged.

---

### User Story 2 — Visitor Discovers Fiverr Profile from Contact Section (Priority: P2)

A visitor who has scrolled to the Contact section and is ready to hire sees a dedicated Fiverr option presented alongside the contact form. They can click through to the portfolio owner's Fiverr profile to browse packages, read reviews, and purchase a fixed-price offer directly — without needing to fill in the form.

**Why this priority**: Fiverr converts visitors who prefer transactional, package-based hiring over direct outreach. Adding this CTA recovers a conversion path that was removed from the Hero.

**Independent Test**: Can be fully tested by scrolling to the Contact section — the Fiverr block should be visible and link correctly without touching the form.

**Acceptance Scenarios**:

1. **Given** the Contact section is visible, **When** the visitor views the left panel, **Then** they see a block labeled "// Or hire me directly" with a "View My Fiverr Profile" button below the social icon row.
2. **Given** the Fiverr block is visible, **When** the visitor clicks "View My Fiverr Profile", **Then** they are taken to `https://www.fiverr.com/murad_hasil`.
3. **Given** the Fiverr block is visible, **When** inspected, **Then** supporting text reads "Browse packages, reviews, and fixed-price options."
4. **Given** the Contact section is rendered, **When** inspected, **Then** the contact form, Zod validation, and social icons are completely unchanged.

---

### User Story 3 — Visitor Finds Fiverr via Footer (Priority: P3)

A visitor scrolling to the footer sees a Fiverr link alongside GitHub, LinkedIn, WhatsApp, and Email. They click it to visit the owner's Fiverr profile — providing a persistent, low-friction discovery path from any page.

**Why this priority**: Footer links are evergreen discovery points. Adding Fiverr here ensures it is always reachable regardless of which section the visitor is on.

**Independent Test**: Can be fully tested by scrolling to the footer and verifying the Fiverr link exists and navigates correctly.

**Acceptance Scenarios**:

1. **Given** the footer is rendered, **When** the visitor views the social links row, **Then** a Fiverr link appears alongside the existing four links.
2. **Given** the Fiverr footer link is visible, **When** the visitor clicks it, **Then** they are taken to `https://www.fiverr.com/murad_hasil`.
3. **Given** the footer is rendered, **When** inspected, **Then** existing GitHub, LinkedIn, WhatsApp, and Email links are unchanged.

---

### User Story 4 — Visitor Understands a Service's Value from the Services Section (Priority: P2)

A visitor browsing the Services section reads each service card and immediately understands who it is for, what it does, and what outcome they can expect — without needing to decode bullet-pointed deliverables or technical jargon.

**Why this priority**: Clearer service descriptions reduce cognitive load and improve conversion from browser to inquiry. This is the core value proposition area of the portfolio.

**Independent Test**: Can be fully tested by loading the Services section and reading each card for clarity — the description and outcome line should be present on all four cards.

**Acceptance Scenarios**:

1. **Given** the Services section is loaded, **When** a visitor views any service card, **Then** they see: a service name, a prose description paragraph, an outcome line prefixed with "Outcome:", and a CTA button.
2. **Given** the Services section is loaded, **When** a visitor views the cards, **Then** no deliverable bullet lists or "target client" labels are shown.
3. **Given** the Services section is loaded, **When** verified against the spec, **Then** all four service names, descriptions, and outcome lines match the exact copy defined in this spec.
4. **Given** the Services section is rendered, **When** inspected, **Then** service IDs (`ai-chatbot-agent`, `business-automation`, `rag-knowledge-base`, `fullstack-web-apps`) and CTA buttons are unchanged.

---

### User Story 5 — Visitor Reads About Stats Without Being Confused by Metrics (Priority: P3)

A visitor reading the About section sees the four stat cards and instantly understands the value offered — framed as plain outcome phrases rather than numerical metrics that require context to interpret.

**Why this priority**: Outcome phrases communicate benefit more immediately than isolated numbers for visitors unfamiliar with the portfolio owner's background.

**Independent Test**: Can be fully tested by viewing the About section stat grid — each card should display a single outcome phrase with no value/label split.

**Acceptance Scenarios**:

1. **Given** the About section is loaded, **When** the visitor views the stats grid, **Then** four cards are visible with one plain text outcome phrase each.
2. **Given** the stat cards are visible, **When** inspected, **Then** no large numerical value or separate label text is shown.
3. **Given** the stat cards are visible, **When** verified against spec, **Then** the four phrases are exactly: "Saves hours of manual work every week", "No extra hiring required", "Built on real, working systems", "Runs 24/7 without manual effort".
4. **Given** the stat cards are rendered, **When** inspected, **Then** the 2-column mobile / 4-column desktop grid layout and card styling remain unchanged.

---

### User Story 6 — Visitor Understands the Owner's Working Approach from the Bio (Priority: P3)

A visitor reading the About bio section reads the third paragraph and understands — in plain language — how the portfolio owner approaches projects before writing any code. The explanation is concrete and jargon-free.

**Why this priority**: The approach paragraph builds trust. Replacing "spec-driven" jargon with a plain-language explanation makes it accessible to non-technical clients.

**Independent Test**: Can be fully tested by reading the third paragraph of the About bio and checking it matches the specified text exactly.

**Acceptance Scenarios**:

1. **Given** the About section is loaded, **When** the visitor reads the bio, **Then** the third paragraph reads exactly as specified in the Requirements section.
2. **Given** the About bio is rendered, **When** inspected, **Then** paragraphs 1, 2, and 4 are unchanged.
3. **Given** the About bio is rendered, **When** inspected, **Then** the four-paragraph HTML structure is preserved.

---

### Edge Cases

- What happens if a visitor clicks the WhatsApp link from a desktop browser with no WhatsApp installed? The `wa.me` URL falls back to the WhatsApp web interface — no special handling needed.
- What happens if the Fiverr profile URL changes? The URL is hardcoded in three locations (Hero → Contact → Footer); all three must be updated together.
- What happens if the Services section has a fifth service added in the future? The new data shape (`description` + `outcome`) must be populated for it; the old `target_client`/`deliverables` shape no longer applies.

---

## Requirements *(mandatory)*

### Functional Requirements

**Hero CTA**

- **FR-001**: The primary Hero CTA button MUST display the text "Chat on WhatsApp".
- **FR-002**: The primary Hero CTA button MUST link to `https://wa.me/923142241393`.
- **FR-003**: The primary Hero CTA button MUST retain its existing accent-cyan primary button style.
- **FR-004**: The secondary Hero CTA ("See My Work", `#projects`) and all other Hero content MUST remain unchanged.

**Contact — Fiverr Block**

- **FR-005**: The Contact section left panel MUST include a Fiverr block placed below the existing social icon row.
- **FR-006**: The Fiverr block MUST display the label "// Or hire me directly".
- **FR-007**: The Fiverr block MUST include a button/link with text "View My Fiverr Profile" linking to `https://www.fiverr.com/murad_hasil`.
- **FR-008**: The Fiverr block MUST display supporting text: "Browse packages, reviews, and fixed-price options."
- **FR-009**: The Fiverr block styling MUST match the existing card style (elevated background, subtle border) — no new imports required.
- **FR-010**: The contact form, Zod schema, and social icon row MUST remain completely unchanged.

**Footer — Fiverr Link**

- **FR-011**: The Footer social links array MUST include a Fiverr entry with label "Fiverr" linking to `https://www.fiverr.com/murad_hasil`.
- **FR-012**: The Fiverr Footer icon MUST use an existing icon (ExternalLink from lucide-react if no Fiverr-specific icon is available) — no new packages may be installed.
- **FR-013**: All existing Footer social links (GitHub, LinkedIn, WhatsApp, Email) MUST remain unchanged.

**Services — Card Redesign**

- **FR-014**: Each service card MUST display: name, description (prose), outcome line (prefixed "Outcome:"), and CTA button.
- **FR-015**: The `target_client` and `deliverables` fields MUST be removed from both the data structure and the card render.
- **FR-016**: The service data MUST use the shape `{ id, name, description, outcome, cta, icon }`.
- **FR-017**: Service IDs MUST remain: `ai-chatbot-agent`, `business-automation`, `rag-knowledge-base`, `fullstack-web-apps`.
- **FR-018**: The four service names MUST be exactly: "Customer Support Automation", "Business Process Automation", "AI Knowledge Base (answers from your data)", "Custom AI Tools for Your Business".
- **FR-019**: The description and outcome copy for each service MUST match the exact text specified below:

  | ID | Description | Outcome |
  |----|-------------|---------|
  | ai-chatbot-agent | "For businesses tired of answering the same questions every day. I build AI systems that handle customer queries across chat, email, or web — 24/7 — so your team can focus on work that actually needs a human." | "Faster responses, lower support workload, and consistent customer experience." |
  | business-automation | "For teams spending hours on repetitive tasks like data entry, follow-ups, or reports. I map your workflow and automate it end-to-end — so the same work gets done without manual effort." | "Save hours every week, reduce errors, and free up your team's time." |
  | rag-knowledge-base | "For businesses where people keep asking the same questions internally or externally. I turn your documents, SOPs, and data into an AI system that gives instant answers — no searching, no delays." | "Faster access to information and less dependency on team members." |
  | fullstack-web-apps | "For businesses that need something built around how they actually work. I design and build custom AI systems tailored to your workflow — not generic tools that don't fit." | "A system that works exactly the way your business operates and scales with it." |

- **FR-020**: Card layout elements (icon, name, border, hover state, shadow, CTA button) MUST remain unchanged.

**About — Stat Cards**

- **FR-021**: The four stat cards MUST display one plain text outcome phrase each, with no value/label split.
- **FR-022**: The four phrases MUST be exactly (in order): "Saves hours of manual work every week", "No extra hiring required", "Built on real, working systems", "Runs 24/7 without manual effort".
- **FR-023**: The stat card grid layout (2 columns mobile, 4 columns on sm+), border, and background styling MUST remain unchanged.

**About — Bio Paragraph 3**

- **FR-024**: The third paragraph of the About bio MUST read exactly: "What makes my approach different is how I plan before building anything. Before writing code, I break the project down step-by-step — starting with a clear understanding of the problem, then defining how the system should work, and finally turning that into a structured build plan. This includes mapping different scenarios so nothing breaks later. This approach reduces confusion, avoids rework, and ensures the system runs reliably once it's live."
- **FR-025**: Bio paragraphs 1, 2, and 4 MUST remain unchanged.
- **FR-026**: The four-paragraph bio HTML structure MUST remain unchanged.

**Global Constraints**

- **FR-027**: Zero new npm packages may be added.
- **FR-028**: Zero new components may be created.
- **FR-029**: No routing, slug, or ID changes are permitted outside the changes listed above.
- **FR-030**: TypeScript MUST compile with zero errors after all changes.
- **FR-031**: Changes are confined to these five files: `frontend/src/components/sections/Hero.tsx`, `frontend/src/components/sections/Contact.tsx`, `frontend/src/components/layout/Footer.tsx`, `frontend/src/components/sections/Services.tsx`, `frontend/src/components/sections/About.tsx`.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All six copy and CTA changes are visible on the live portfolio without any layout regression in other sections.
- **SC-002**: Every changed link navigates to the correct destination URL when clicked (WhatsApp, Fiverr × 2, Footer Fiverr).
- **SC-003**: The Services section displays four cards with prose descriptions and outcome lines; no deliverable bullets or "target client" labels appear anywhere on the page.
- **SC-004**: The About stats grid shows four plain outcome phrases; no numerical values appear in the stat cards.
- **SC-005**: The About bio third paragraph matches the specified text verbatim.
- **SC-006**: TypeScript build completes with zero type errors and zero new warnings introduced by this feature.
- **SC-007**: The contact form submits successfully end-to-end (schema and form logic unchanged, no regression).

---

## Assumptions

- WhatsApp `wa.me` links open WhatsApp Web for desktop visitors — this is acceptable behavior requiring no workaround.
- The ExternalLink icon from lucide-react is already imported in Footer.tsx; if not, it can be added from the existing lucide-react package (no new package install).
- "Accent-cyan" and "accent-green" color tokens already exist in the Tailwind config and are available for the outcome line styling.
- The description field in Services may use `\n\n` to create a visual paragraph break; rendering is handled by existing CSS white-space or `<br />` insertion as needed.
- Feature 008 (portfolio-copy-conversion) is fully merged before this branch is created from main.

---

## Out of Scope

- Changes to any file other than the five listed.
- Changes to the contact form logic, Zod schema, or API routes.
- New npm packages, components, or routing.
- Changes to any other portfolio section (Projects, Skills, Navbar).
- Analytics tracking or event logging for the new CTA links.
