# Implementation Plan: About Bio & Skills Update

**Branch**: `005-about-bio-skills-update` | **Date**: 2026-04-16 | **Spec**: specs/005-about-bio-skills-update/spec.md

## Summary

Update three hardcoded values in `About.tsx` (bio text, badge label, stats label) and sync both copies of `skills-manifest.json` to remove LangChain and add Prompt Engineering + Context Engineering.

## Technical Context

**Language/Version**: TypeScript / Next.js 15 App Router
**Primary Dependencies**: React, Framer Motion (existing, no new deps)
**Storage**: Static JSON manifests read at build time
**Testing**: Manual Playwright verification on live Vercel deployment
**Target Platform**: Vercel (SSG + ISR)
**Performance Goals**: No change — static content edits only
**Constraints**: JSX apostrophes must use `&apos;`; both manifest copies must stay in sync
**Scale/Scope**: 3 files, ~20 lines changed total

## Constitution Check

- Smallest viable diff ✓ — only touching what spec requires
- No new dependencies ✓
- No unrelated refactoring ✓

## Project Structure

### Files Touched

```text
frontend/src/components/sections/About.tsx       ← bio, badge, stats
context/skills-manifest.json                     ← root copy (RAG + reference)
frontend/context/skills-manifest.json            ← build copy (what Vercel reads)
```

### No new files created — pure edits to existing files.

## Approved Bio Copy

**Paragraph 1:**
> I started my AI engineering journey in 2023 through GIAIC, with a focus on building practical, real-world systems. I&apos;ve worked on autonomous agents, RAG pipelines with live data, and full-stack applications containerized with Docker and deployed on Kubernetes.

**Paragraph 2:**
> My workflow is spec-driven — I define clear requirements and system architecture before writing code. This ensures everything I build is reliable, scalable, and maintainable from day one.

**Paragraph 3:**
> I care about the problem as much as the solution. Whether it&apos;s reducing operational costs through automation or building AI that answers from your company&apos;s own data, the goal is always the same: a system that works in production, not just in a demo.

## Skills Changes

| Action | Skill | Level |
|--------|-------|-------|
| REMOVE | LangChain | intermediate |
| ADD | Prompt Engineering | advanced |
| ADD | Context Engineering | intermediate |
