---
id: "009"
title: Fix Resend Email Cloudflare 1010 User-Agent Block
stage: general
date: 2026-03-31
surface: agent
model: claude-sonnet-4-6
feature: 001-portfolio-vision
branch: main
user: brownie
command: contact form email nahi aa raha — 403 Forbidden fix karo
labels: ["bugfix","email","resend","cloudflare","user-agent","hf-spaces","contact-form"]
links:
  spec: specs/001-portfolio-vision/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - backend/app/routers/contact.py
tests:
  - HF Spaces POST /contact → 201 ✓
  - Email received at mbmuradhasil@gmail.com ✓
---

## Prompt

Contact form se email received nahi ho raha kal se — HF backend logs mein `Failed to send email: HTTP Error 403: Forbidden` aa raha hai. API key change kiya tha, NOTIFY_EMAIL aur Resend account email same hai, phir bhi 403.

## Response snapshot

**Debugging process:**

1. Resend docs fetch kiye — 3 wajah hain 403 ki: unverified domain, test API key restriction, duplicate domain
2. Local curl test kiya → `{"id":"9c3f1fcd..."}` — API key valid, email sent locally
3. Better error logging add kiya `contact.py` mein `urllib.error.HTTPError` catch karke response body log karo
4. HF logs mein aaya: `HTTP Error 403: Forbidden — error code: 1010`
5. **Root cause:** Cloudflare error 1010 = request blocked based on browser/client signature — `urllib.request` ka default User-Agent Cloudflare WAF ne ban kiya hua tha
6. **Fix:** `"User-Agent": "python-resend/1.0"` header add kiya `urllib.request.Request` mein

**Previous failures (context):**
- Gmail SMTP → HF Spaces outbound port 587 blocked (PHR 007)
- Resend with `onboarding@resend.dev` → works only for own account email (no domain needed)
- `urllib` default User-Agent → Cloudflare 1010 block on api.resend.com

## Outcome

- ✅ Impact: Contact form email notification working — Cloudflare 1010 block resolved by adding User-Agent header
- 🧪 Tests: HF POST /contact → 201; email received at mbmuradhasil@gmail.com
- 📁 Files: 1 file modified — backend/app/routers/contact.py (User-Agent header + better error logging)
- 🔁 Next prompts: Monitor for any further email delivery issues
- 🧠 Reflection: `urllib.request` sends no User-Agent by default — Cloudflare WAF blocks it. Always add `"User-Agent": "python-resend/1.0"` or similar when calling Resend from cloud platforms. `error code: 1010` is a Cloudflare block, not a Resend error — always log full response body to distinguish. HF Spaces blocks SMTP (port 587) but allows outbound HTTPS — HTTP API calls are the only option.

## Evaluation notes (flywheel)

- Failure modes observed: 403 with no body → looked like API key/domain issue; actual cause was Cloudflare WAF blocking urllib User-Agent
- Graders run and results (PASS/FAIL): email received PASS
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): Switch to official `resend` Python SDK to avoid low-level urllib issues in future
