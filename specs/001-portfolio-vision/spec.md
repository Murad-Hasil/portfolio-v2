# Feature Specification: Portfolio Vision

**Feature Branch**: `001-portfolio-vision`
**Created**: 2026-03-23
**Status**: Draft
**Input**: User description: "Portfolio Vision — Murad Hasil full-stack AI portfolio for international freelancing"

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Client Evaluates Developer at a Glance (Priority: P1)

An international business owner (Upwork / Fiverr prospect) lands on the portfolio
homepage. Within 30 seconds they must clearly understand what Murad builds, what
technologies he uses, and what measurable results he has delivered — without
scrolling past the hero section.

**Why this priority**: First impression is the only impression for cold international
leads. If a prospect cannot qualify Murad within 30 seconds they will navigate away.
This is the portfolio's highest-value moment.

**Independent Test**: Can be fully tested by visiting the homepage with no prior
knowledge of Murad and recording whether the evaluator can answer three questions
without scrolling: (1) What does Murad do? (2) What tech does he use? (3) What has
he built?

**Acceptance Scenarios**:

1. **Given** a first-time visitor lands on the homepage, **When** they view the hero
   section, **Then** they see Murad's title, primary tech stack, a value proposition
   focused on business outcomes, and two clear calls-to-action.
2. **Given** a visitor wants proof of work, **When** they scroll to the Projects
   section, **Then** they see featured projects with titles, categories, tech used,
   and measurable outcomes.
3. **Given** a visitor arrives via mobile device, **When** the page loads, **Then**
   all hero information is accessible without horizontal scroll and all interactive
   elements are tappable.

---

### User Story 2 — Client Gets Questions Answered by AI Chatbot (Priority: P2)

A prospect wants to know if Murad can solve their specific problem. Instead of
digging through the page, they use the floating AI chatbot widget to ask directly
and get an accurate, professional response grounded in Murad's actual portfolio.

**Why this priority**: The chatbot is the portfolio's key differentiator. It
demonstrates AI capability while simultaneously serving as a sales tool. A
well-functioning chatbot converts skeptical visitors into enquiries.

**Independent Test**: Can be fully tested by opening the chat widget, asking a
question about Murad's services or projects, and verifying the response is accurate
and sourced from real portfolio content.

**Acceptance Scenarios**:

1. **Given** a visitor clicks the chatbot widget, **When** they ask "What AI projects
   have you built?", **Then** the chatbot responds with accurate details about Murad's
   real projects.
2. **Given** a visitor asks something outside the knowledge base, **When** the chatbot
   processes the question, **Then** it responds directing the visitor to contact Murad
   directly via email.
3. **Given** a visitor is on mobile, **When** they open the chat widget, **Then** the
   widget opens in a usable full-screen or near-full-screen panel.

---

### User Story 3 — Client Contacts Murad to Start a Project (Priority: P3)

A prospect has decided they want to hire Murad. They fill in the contact form, submit
it, and receive a confirmation with a reference number so they know their enquiry was
received and logged.

**Why this priority**: Lead capture is the ultimate conversion goal of the portfolio.
Without a working contact mechanism, no business objective is met.

**Independent Test**: Can be fully tested by submitting the contact form with valid
data (verifying reference number returned) and with invalid data (verifying inline
validation errors appear).

**Acceptance Scenarios**:

1. **Given** a visitor fills in all required contact form fields correctly, **When**
   they submit, **Then** they see a success message containing a unique reference
   number in YYYYMMDD-XXXX format.
2. **Given** a visitor submits with an invalid email, **When** the form is validated,
   **Then** an inline error appears on the email field before submission is sent.
3. **Given** the same origin submits more than 3 enquiries in one hour, **When** the
   4th submission is attempted, **Then** the form shows a rate-limit message and no
   data is stored.

---

### User Story 4 — Murad Adds a New Project Without Touching Code (Priority: P4)

After completing a new client project, Murad updates the portfolio and refreshes the
chatbot knowledge entirely through CLI commands — no code changes, no redeployment
required.

**Why this priority**: Portfolio maintenance must be sustainable. If updates require
code changes, the portfolio will become stale. This story is the long-term viability
guarantee.

**Independent Test**: Can be fully tested by running the add_project and rebuild_rag
MCP tools via Claude Code CLI, then verifying the project appears and the chatbot
answers accurately about it.

**Acceptance Scenarios**:

1. **Given** Murad runs the add_project MCP tool with new project data, **When** the
   tool completes, **Then** the project appears in the Projects section without any
   code change.
2. **Given** the project has been added, **When** Murad runs rebuild_rag, **Then** the
   chatbot correctly answers questions about the new project.
3. **Given** Murad provides incomplete project data, **When** the tool validates
   input, **Then** it returns a clear error listing the missing required fields.

---

### Edge Cases

- What happens when the backend API is unreachable? Projects and Skills sections must
  show a graceful fallback state — not a blank page or unhandled error.
- What happens if the vector database is temporarily unavailable? The chatbot endpoint
  must return a user-friendly message, not a server error.
- What happens when a visitor submits the contact form with a script injection attempt?
  Input must be sanitised before storage.
- What happens when switching embedding providers with different vector dimensions?
  The rebuild_rag tool must detect the mismatch and recreate the collection cleanly.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The portfolio MUST present Murad's professional identity, tech
  specialisation, and proof-of-work to international freelancing prospects.
- **FR-002**: Visitors MUST be able to browse all projects with category filtering and
  navigate to individual case study pages per project.
- **FR-003**: Visitors MUST be able to browse all skills grouped by category: AI and
  Agents, Frontend, Backend, DevOps and Cloud, Automation.
- **FR-004**: Visitors MUST be able to view all four services Murad offers with
  descriptions, target client type, and a call-to-action to the contact form.
- **FR-005**: Visitors MUST be able to submit an enquiry via a structured contact
  form; submissions MUST be stored persistently and a reference number MUST be
  returned.
- **FR-006**: The portfolio MUST include a floating AI chatbot widget that answers
  visitor questions using only Murad's published portfolio knowledge base.
- **FR-007**: The chatbot MUST respond with a direct-contact fallback message when a
  question cannot be answered from the knowledge base.
- **FR-008**: All portfolio content (projects, skills, services, profile stats) MUST
  be sourced from structured data files — not hardcoded in UI components.
- **FR-009**: The portfolio MUST support dark mode and light mode with a
  user-togglable control persisted across visits.
- **FR-010**: Murad MUST be able to add new projects and refresh chatbot knowledge
  via CLI tools without modifying application code.
- **FR-011**: The contact form MUST enforce rate limiting (max 3 submissions per
  origin per hour) to prevent abuse.
- **FR-012**: The portfolio MUST be deployed to production with automated CI/CD so
  that changes merged to the main branch deploy automatically.
- **FR-013**: All pages MUST include proper SEO metadata (title, description, OG
  tags, structured data) to support discoverability.

### Key Entities

- **Project**: A completed work item with title, category, description, problem
  statement, solution summary, tech list, metrics, live URL (optional), GitHub URL
  (optional), and a featured flag.
- **Skill**: A technology or competency with name and proficiency level
  (advanced or intermediate), grouped under a named category.
- **Service**: A freelance offering with name, target client type, key deliverables,
  and a link to the contact form.
- **ContactSubmission**: A prospect enquiry with name, email, subject, service
  interest, message, timestamp, and a generated reference number.
- **ChatSession**: A visitor conversation identified by a session ID, storing all
  exchanged messages and token usage.
- **KnowledgeChunk**: A text fragment from the RAG knowledge base stored as a vector
  embedding with source file and chunk index metadata.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A first-time visitor can identify Murad's role, primary skills, and at
  least two completed projects within 30 seconds of page load, without scrolling past
  the hero section.
- **SC-002**: The portfolio reaches an interactive state in under 3 seconds on a
  standard broadband connection.
- **SC-003**: The chatbot correctly answers at least 4 of these 5 standard test
  questions: "What AI projects have you built?", "Can you build a customer support
  chatbot?", "What is your Kubernetes experience?", "How do I hire you?",
  "What services do you offer?"
- **SC-004**: The contact form accepts valid submissions, rejects invalid ones with
  inline messages, and enforces the rate limit — all verifiable without code
  inspection.
- **SC-005**: All portfolio sections render correctly and are fully usable at 375px,
  768px, and 1440px screen widths with no horizontal scroll.
- **SC-006**: Adding a new project via MCP tools and rebuilding the RAG index results
  in the project appearing on the portfolio and the chatbot answering accurately about
  it — without any code change.
- **SC-007**: The portfolio achieves a Lighthouse performance score of 90 or above on
  desktop.

## Assumptions

- Murad's profile information is accurately captured in context/murad-profile.md
  before any content is rendered.
- The LinkedIn URL and availability hours placeholders will be filled before
  production deployment.
- No testimonials section is included — Murad does not yet have client testimonials.
- The portfolio targets English only; no localisation is required in this version.
- Groq (Llama 3.3 70B) is the default chatbot LLM due to its free tier; switching to
  OpenAI GPT-4o-mini requires only an environment variable change, not code work.
