---
id: "0001"
title: Dynamic OG Image Spec
stage: spec
date: 2026-04-02
surface: agent
model: claude-sonnet-4-6
feature: 004-og-image
branch: main
user: brownie
command: /sp.specify
labels: ["spec","og-image","seo","opengraph","linkedin","004-og-image"]
links:
  spec: specs/004-og-image/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/004-og-image/spec.md
tests:
  - none
---

## Prompt

/sp.specify 004-og-image

Two problems:
1. Homepage OG image is fully hardcoded — adding a skill to skills-manifest.json does NOT update the OG card.
2. Each project case study page has NO OG image — sharing /projects/crm-digital-fte on LinkedIn shows a blank card.

Define the spec for:
- Homepage OG: dynamic skills from skills-manifest.json (all advanced-level, max 6)
- Per-project OG: unique 1200×630 PNG per slug from projects-manifest.json (title, category badge, first 4 tech tags, first metric)
- All design tokens from constitution Principle III (no new colours)
- outputFileTracingRoot must bundle context/ files in Vercel serverless function
- No hardcoded strings in any opengraph-image.tsx

## Response snapshot

Spec created at `specs/004-og-image/spec.md`.

**Problem documented**: hardcoded homepage OG, zero per-project OG images.

**2 user stories**: US-1 (LinkedIn portfolio share looks professional), US-2 (per-project share shows project context).

**7 acceptance criteria**: dynamic skills in homepage OG, unique per-project OG per slug, project data from manifest (no hardcoding), design tokens only, zero build errors, outputFileTracingRoot set.

**Design spec documented**:
- Shared tokens: #08080F bg, #00D4FF cyan, #6366F1 indigo, #10B981 green, 3px gradient top bar
- Homepage layout: eyebrow, name, skills row, tag pills (6 max), bottom bar with email + URL
- Per-project layout: category badge, title, description, 4 tech tags, first metric with → prefix
- Category → colour: AI Agents/AI Automation=indigo, Full-Stack+AI/Full-Stack=cyan

**Files**: next.config.ts (outputFileTracingRoot), opengraph-image.tsx (update), projects/[slug]/opengraph-image.tsx (new).

## Outcome

- ✅ Impact: Spec fully defined — every social share will show professional, data-driven preview cards
- 🧪 Tests: none (specification document)
- 📁 Files: specs/004-og-image/spec.md
- 🔁 Next prompts: /sp.plan 004-og-image
- 🧠 Reflection: Per-project OG is the higher-impact change (blank → rich card). Homepage OG was already rendering but needed dynamic data. Both changes are low-risk (build-time image generation, no runtime API calls).

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): requirements checklist PASS
- Prompt variant (if applicable): null
- Next experiment: /sp.plan to document runtime choice (nodejs vs edge)
