---
id: 028
title: Portfolio 9/10 Fixes — CTA, Stats, Skills
stage: general
date: 2026-04-26
surface: agent
model: claude-sonnet-4-6
feature: none
branch: main
user: Murad Hasil
command: chat
labels: ["portfolio","cta","about","skills","conversion"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - frontend/src/components/sections/Hero.tsx
  - frontend/src/components/sections/About.tsx
  - frontend/src/components/sections/Skills.tsx
  - context/skills-manifest.json
tests:
  - n/a
---

## Prompt

Mujhe is portfolio ka rating 9/10 chahiye... Hero.tsx CTA order swap ye tek kr do... About stats → real numbers... Skills main intermediate fix kar do... n8n remove kar do skills se iski jaga clawdbot openclaw add kr do (names pending clarification)

## Response snapshot

4 changes implemented:

1. Hero.tsx — CTA order swapped: "See My Projects" (primary, cyan) → #projects; "Chat on WhatsApp" (secondary, border) → wa.me
2. About.tsx — stats replaced: vague phrases → ["4 AI systems deployed", "3 channels automated live", "45 automated tests written", "168 hrs/week autonomous runtime"]
3. Skills.tsx — ProficiencyDots: intermediate returns null (no dots shown); legend simplified to Advanced only
4. skills-manifest.json — n8n removed from automation category; new skills pending user confirmation of exact tool names ("clawdbot openclaw")
