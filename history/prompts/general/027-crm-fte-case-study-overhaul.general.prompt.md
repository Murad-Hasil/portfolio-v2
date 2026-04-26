---
id: 027
title: CRM-FTE Case Study Overhaul with New Screenshots
stage: general
date: 2026-04-26
surface: agent
model: claude-sonnet-4-6
feature: crm-digital-fte
branch: main
user: Murad Hasil
command: chat
labels: ["case-study","screenshots","crm-fte","content-update","portfolio"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - context/projects-manifest.json
  - backend/context/projects-manifest.json
  - context/rag-knowledge-base/projects.md
  - frontend/public/projects/crm-fte-webform-v2.png
  - frontend/public/projects/crm-fte-ticket-v2.png
  - frontend/public/projects/crm-fte-email-sent.png
  - frontend/public/projects/crm-fte-email-received.png
  - frontend/public/projects/crm-fte-whatsapp.png
tests:
  - node JSON.parse validation on projects-manifest.json
---

## Prompt

whatsap ka screenshot bhi maine root pe rakh dia ha wo dekh lo, aur case study main jo 2 web ui ke 1 terminal ka ticket wala screenshot ha wo delete kr k ye new add kar do and case study ko agar mazeed strong banana ha to portfolio folder ke bahir CRM-Digital-FTE folder ha usme pehle pdf analysis kro uske bad project ka readme.md check kr lo us ke hesab se case study bana lo.

## Response snapshot

Analyzed all sources: WhatsApp screenshot (Twilio sandbox conversation), PDF (Hackathon 5 brief — Agent Maturity Model, 48-72 hrs, 2-phase build), and README.md (45 tests, Challenges & Fixes table, channel flow details).

**Changes made:**

1. Copied 5 new screenshots to frontend/public/projects/:
   - crm-fte-webform-v2.png (Sarah Mitchell 401 Unauthorized scenario)
   - crm-fte-ticket-v2.png (UUID ticket confirmed)
   - crm-fte-email-sent.png (Gmail sent — AI reply)
   - crm-fte-email-received.png (Mailinator — customer receives AI reply)
   - crm-fte-whatsapp.png (Twilio WhatsApp sandbox conversation)

2. Updated projects-manifest.json CRM-FTE entry:
   - Gallery: 5 → 7 screenshots; removed terminal crm-fte-api-response.png; added email flow + WhatsApp; story-driven captions
   - Problem: expanded to mention benefits/training overhead and "lost customer" impact
   - Solution: now explains 2-phase Agent Maturity Model build (Incubation → Specialization)
   - Metrics: 4 → 5; added 98% cost reduction number, 45-test count, Kafka <200ms webhook decoupling
   - Tech: added MCP Server, updated to Neon PostgreSQL, Next.js 15
   - Highlights: replaced generic descriptions with real engineering war stories from README Challenges & Fixes (Groq tool_use_failed fix, Groq 429 parsing, duplicate email prevention, asyncio.Queue fallback, cross-channel identity)
