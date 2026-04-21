# Quickstart: 007-content-copy-update

**Estimated implementation time**: ~10 minutes  
**Branch**: `007-content-copy-update`

## What this changes

Three string literal edits across two files. No new files, no installs, no migrations.

## Files to edit

| File | Location | Change |
|------|----------|--------|
| `frontend/src/components/sections/Hero.tsx` | Lines 195–198 | Replace hero subtext |
| `frontend/src/components/sections/About.tsx` | Line 16 | Update 4th stat value + label |
| `frontend/src/components/sections/About.tsx` | Lines 143–167 | Replace 3 paragraphs → 4 paragraphs |

## Implementation steps

1. Edit `Hero.tsx` lines 195–198 — replace the inner text of the `<motion.p>` with the new subtext.
2. Edit `About.tsx` line 16 — change `{ value: "4", label: "Projects" }` → `{ value: "100%", label: "Self-Taught" }`.
3. Edit `About.tsx` lines 143–167 — replace the 3 `<p>` elements with 4 new `<p>` elements. Use `&apos;` for apostrophes. First 3 paragraphs use `mb-3`; 4th (last) has no `mb-3`.
4. Run `npm run build` in `/frontend` to confirm no type errors.
5. Screenshot at 1440px and 375px with Playwright MCP to verify visual correctness.

## Verification checklist

- [ ] Hero subtext shows new copy; old "fraction of the cost" text is gone
- [ ] About bio shows exactly 4 paragraphs
- [ ] 4th stat card shows `100%` / `Self-Taught`
- [ ] No layout shifts or style changes visible in screenshots
- [ ] `npm run build` exits 0
