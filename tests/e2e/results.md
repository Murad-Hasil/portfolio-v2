# E2E Test Results — Portfolio

**Date**: 2026-03-24
**Environment**: localhost:3000 (Next.js production build) + localhost:8000 (FastAPI)
**Tool**: Playwright MCP

## Results Summary

| # | Test | Status | Notes |
|---|------|--------|-------|
| 1 | Homepage loads, hero visible | ✅ PASS | Title, H1, CTA all visible |
| 2 | Nav links scroll correctly | ✅ PASS | All 5 nav links navigate to correct sections |
| 3 | Projects filter tabs | ✅ PASS | 4 filter tabs work, cards update correctly |
| 4 | Skills — all 5 tabs | ✅ PASS | AI & Agents, Frontend, Backend, DevOps & Cloud, Automation |
| 5 | Contact valid submit → reference number | ✅ PASS | Reference: 20260324-0006 |
| 6 | Contact invalid email → error | ✅ PASS | "Please enter a valid email address" shown |
| 7 | Chat open + message response | ✅ PASS | RAG chatbot responded with 4 AI projects |
| 8 | Mobile 375px — all sections | ✅ PASS | Hamburger menu, responsive layout, all sections present |
| 9 | Dark mode toggle | ✅ PASS | Switches between dark/light theme correctly |
| 10 | Resume download | ⚠️ PARTIAL | Link /resume.pdf returns 404 — PDF missing from frontend/public/ |

**Pass: 9/10** | **Partial: 1/10** (content gap, not code bug)

## Lighthouse Audit (Desktop)

| Category | Score | Target |
|----------|-------|--------|
| Performance | **96** | ≥ 90 ✅ |
| Accessibility | **88** | — |
| Best Practices | **100** | — |
| SEO | **100** | — |

## Screenshots

All screenshots saved in tests/e2e/screenshots/:
- 01-homepage-hero.png
- 02-nav-projects.png
- 03-projects-filter.png
- 04-skills-tabs.png
- 05-contact-success.png
- 06-contact-invalid.png
- 07-chat-response.png
- 08-mobile-375px.png
- 09-dark-mode-toggle.png

## Action Required

- [ ] Add frontend/public/resume.pdf — Murad's actual CV/resume file
