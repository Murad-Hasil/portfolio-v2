---
id: 010
title: Navbar Footer Hero Components T023 T025
stage: green
date: 2026-03-23
surface: agent
model: claude-sonnet-4-6
feature: 001-portfolio-vision
branch: 001-portfolio-vision
user: brownie
command: /sp.implement T023 T024 T025
labels: ["frontend","navbar","footer","hero","framer-motion","type-animation","design-system","shadcn"]
links:
  spec: specs/001-portfolio-vision/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - frontend/src/components/layout/Navbar.tsx
  - frontend/src/components/layout/Footer.tsx
  - frontend/src/components/sections/Hero.tsx
  - frontend/src/components/icons.tsx (new — inline SVGs for Github/LinkedIn)
  - frontend/src/app/page.tsx (updated — wires Navbar + Hero + Footer, TODO stubs for remaining sections)
tests:
  - npx tsc --noEmit → 0 errors
---

## Prompt

T023 T024 T025

## Response snapshot

Implemented Navbar, Footer, and Hero components with design system compliance:

- **T023 Navbar**: Sticky header with scroll-triggered backdrop blur, "MH" monogram logo, desktop nav links, GitHub icon, dark/light theme toggle (next-themes), Resume download button, mobile Sheet hamburger (Base UI Dialog via shadcn). Fixed: lucide-react v1.0.1 doesn't export Github/Linkedin — created src/components/icons.tsx with inline SVGs. Fixed: SheetTrigger in Base UI doesn't support asChild prop.

- **T024 Footer**: Name + tagline, social links row (GitHub, LinkedIn, WhatsApp, Email), copyright line with brand voice copy. Server component (no "use client").

- **T025 Hero**: Full-screen section with dot-grid radial-gradient background (opacity 0.15), cyan corner glow, Framer Motion stagger container/fadeUp animations using cubic-bezier (not string ease — strict type), TypeAnimation rotating 4 roles in JetBrains Mono, tech stack pills in [bracket] format, "Hire Me on Upwork" + "See My Work" CTAs, social icon row, animated ArrowDown scroll hint. Fixed: Framer Motion Variants type requires `ease` as tuple not string.

- **page.tsx**: Updated to assemble Navbar + Hero + Footer with TODO comment stubs for remaining US1 sections.

- **icons.tsx**: Inline SVG components GithubIcon and LinkedinIcon since lucide-react v1.0.1 does not include them.

## Outcome

- ✅ Impact: Navbar + Hero + Footer render; homepage is functional; TypeScript clean (0 errors)
- 🧪 Tests: tsc --noEmit PASS
- 📁 Files: 5 files created/updated
- 🔁 Next prompts: /sp.implement T026 T027 T028 T029 T030 (Projects backend + frontend + case study page)
- 🧠 Reflection: lucide-react v1.0.1 (installed by this Next.js version) is significantly older than expected — missing Github, Linkedin, and other icons added in later versions. Created icons.tsx as the solution. Base UI Sheet doesn't support asChild — pass className directly to SheetTrigger instead.

## Evaluation notes (flywheel)

- Failure modes observed: lucide-react v1.0.1 missing Github/Linkedin; Framer Motion ease type requires tuple; SheetTrigger asChild not supported in Base UI
- Graders run and results (PASS/FAIL): tsc --noEmit PASS (0 errors after fixes)
- Prompt variant (if applicable): none
- Next experiment (smallest change to try): upgrade lucide-react to latest version for full icon set
