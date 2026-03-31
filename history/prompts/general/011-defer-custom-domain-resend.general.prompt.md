---
id: "011"
title: Defer Custom Domain for Resend Email
stage: general
date: 2026-03-31
surface: agent
model: claude-sonnet-4-6
feature: none
branch: main
user: Murad Hasil
command: explain resend custom domain + decision to defer
labels: ["email", "resend", "domain", "decision"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - none
tests:
  - none
---

## Prompt

Nahi mere pas koi domain nahi ha our filhaal abhi koi domain main purchase nahi kar sakta, to hum isko as it is rehne dete hai, jab tak freelancing kar ke kuch paise nahi aate, jab paise aayenge to hum invest kar payege domain wagera pe.

## Response snapshot

Acknowledged decision to defer custom domain purchase. Current email setup (onboarding@resend.dev, sending to account email only) remains in place. Explained full custom domain setup path for future reference:
1. Buy domain (~$10/year from Porkbun/Namecheap)
2. Add domain in Resend → get SPF/DKIM/DMARC DNS records
3. Add DNS records at registrar
4. Verify in Resend (5-30 min)
5. Update `"from"` in `backend/app/routers/contact.py`

## Outcome

- ✅ Impact: Decision recorded — no code changes needed
- 🧪 Tests: n/a
- 📁 Files: none modified
- 🔁 Next prompts: Revisit when domain is purchased; update contact.py "from" field
- 🧠 Reflection: Current Resend free tier sends only to account email (mbmuradhasil@gmail.com). Custom domain unlocks sending to any recipient. Defer is sensible until freelancing income available.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): n/a
- Prompt variant (if applicable): n/a
- Next experiment (smallest change to try): When domain is ready — single line change in contact.py + Resend DNS setup
