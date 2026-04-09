---
id: 021
title: Todo Case Study Accuracy Fixes
stage: general
date: 2026-04-09
surface: agent
model: claude-sonnet-4-6
feature: none
branch: main
user: Murad Hasil
command: fix todo case study inaccurate claims across portfolio files
labels: ["content-fix","case-study","todo-cloud-ai","accuracy"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - context/projects-manifest.json
  - context/rag-knowledge-base/projects.md
  - context/rag-knowledge-base/faq.md
  - backend/context/projects-manifest.json
  - frontend/context/projects-manifest.json
  - Portfolio-Spec.md
tests:
  - grep verify: no "Full CI/CD with GitHub Actions" in todo project files
  - grep verify: no "DigitalOcean DOKS / Azure AKS / GKE" in project files
  - grep verify: no "1,000 base points + 600 bonus points" in project files
---

## Prompt

Mujhe "Todo App → Cloud-Native AI Agent" project ki case study update karni hai.
Portfolio-Spec.md padho pehle poora context samjhne ke liye. Phir neeche likhe
kaam karo:

## Background (kya galat hai)

Is project ki case study mein kuch claims inaccurate hain jo fix karni hain:

1. **CI/CD claim GALAT hai** — GitHub Actions configure nahi ki gayi. Fix: "Vercel auto-deploy on push to main; backend deployed via HF Space"
2. **Phase V Cloud K8s claim MISLEADING hai** — Actual cloud K8s deploy nahi hua. Fix: "Local Kubernetes on Minikube with Helm; production backend on Hugging Face Spaces"
3. **Browser Notifications feature MISSING hai** — Complete aur deployed hai lekin mention nahi. Add: "Real-time browser notifications — in-app toast + OS push on reminder tasks, powered by DB polling"
4. **Score/Points claim REMOVE karo** — "1,000 base points + 600 bonus points (Panaversity Hackathon II)" — verify nahi hota, remove karo.

## Response snapshot

Fixed 6 files with the following changes to todo-cloud-ai project data:

1. **CI/CD fix** — Replaced "Full CI/CD with GitHub Actions" with "Vercel auto-deploy on push to main; backend deployed via HF Space" in all metrics arrays. Removed "GitHub Actions" from tech arrays.

2. **Cloud K8s fix** — Replaced "Cloud-native Kubernetes deployment" / "Cloud Kubernetes with Kafka and Dapr" with "Local Kubernetes on Minikube; production backend on Hugging Face Spaces" in solution and metrics fields. Fixed Phase V description in frontend/context and rag-knowledge-base/projects.md to remove "DigitalOcean DOKS / Azure AKS / GKE" claim.

3. **Browser notifications added** — Added "Real-time browser notifications — in-app toast + OS push on reminder tasks, powered by DB polling" to highlights arrays in all 4 manifest files and to Key Highlights in rag-knowledge-base/projects.md. Also added to faq.md Hackathon II description.

4. **Points/score removed** — Removed "1,000 base + 600 bonus points" from: rag-knowledge-base/projects.md Hackathon Context + Measurable Outcomes, faq.md (3 occurrences: hackathons Q, strongest project Q, AI projects Q, tell me about todo Q), frontend/context/projects-manifest.json context + metrics.

**PHRs untouched** — Only 1 PHR found with these claims: `history/prompts/general/016-update-rag-chatbot-projects-knowledge.general.prompt.md` (reported, not modified).

## Outcome

- ✅ Impact: All inaccurate claims removed from 6 files; browser notifications added; points score removed
- 🧪 Tests: grep confirms no remaining "Full CI/CD with GitHub Actions", "DOKS/AKS/GKE", "1,000 base points", or "600 bonus" in non-PHR files
- 📁 Files: 6 files modified (context/projects-manifest.json, backend/context/projects-manifest.json, frontend/context/projects-manifest.json, context/rag-knowledge-base/projects.md, context/rag-knowledge-base/faq.md, Portfolio-Spec.md)
- 🔁 Next prompts: Update chatbot RAG embeddings to reflect corrected project data
- 🧠 Reflection: Found more files than initially scoped (faq.md, backend + frontend manifests) — thorough grep search caught them all

## Evaluation notes (flywheel)

- Failure modes observed: Initial scope missed backend/, frontend/, and faq.md copies of the same data
- Graders run and results (PASS/FAIL): grep verify — PASS (only PHR file remains with old claims)
- Prompt variant (if applicable): null
- Next experiment: null
