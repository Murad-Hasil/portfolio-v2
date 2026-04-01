# Tasks — Feature 004: Dynamic OG Image

| Field | Value |
|---|---|
| **Status** | In Progress |
| **Date** | 2026-04-02 |

---

## Tasks

- [x] **Task 1** — Update `frontend/next.config.ts`
  - Add `import path from "path"` at top
  - Add `outputFileTracingRoot: path.join(__dirname, "../")` to config
  - Test: `next build` still compiles cleanly

- [x] **Task 2** — Update `frontend/src/app/opengraph-image.tsx`
  - Change `runtime` from `"edge"` to `"nodejs"`
  - Add `fs` + `path` imports
  - Add `getTopSkills()` — reads `skills-manifest.json`, returns all `advanced` skills, max 6
  - Replace hardcoded tag array with dynamic `topSkills`
  - Tags alternate indigo (odd index) / cyan (even index)
  - Keep agent network SVG, gradient bar, grid overlay, bottom bar
  - Test: screenshot of `/opengraph-image` shows real skills

- [x] **Task 3** — Create `frontend/src/app/projects/[slug]/opengraph-image.tsx`
  - `runtime = "nodejs"`, `size = { width: 1200, height: 630 }`, `contentType = "image/png"`
  - `getProjects()` reads `projects-manifest.json` via `fs`
  - `generateImageMetadata({ params })` returns alt text per slug
  - Layout: top gradient bar, category badge, title, description (truncated),
    first 4 tech tags, first metric with ✦ prefix, bottom email + URL bar
  - Category → indigo (AI Agents/AI Automation) or cyan (Full-Stack)
  - Fallback: if slug not found, show generic "Project — Murad Hasil" image
  - Test: screenshot of `/projects/crm-digital-fte/opengraph-image`

- [x] **Task 4** — `next build` clean
  - Zero TypeScript errors
  - Zero ESLint errors
  - All 4 project slugs listed in build output under `/projects/[slug]`

- [x] **Task 5** — Verification via Playwright MCP ✅ 2026-04-02
  - `/opengraph-image` — skills reading from `skills-manifest.json` (OpenAI Agents SDK, OpenAI API, Gemini API, MCP, RAG Systems, Autonomous AI Agents)
  - `/projects/crm-digital-fte/opengraph-image` — [AI Agents] badge, title, 4 tech tags, → metric
  - `/projects/todo-cloud-ai/opengraph-image` — [Full-Stack + AI] badge (cyan), title, 4 tech tags, → metric
  - Bug fixed: Next.js 15+ `params` is a Promise — added `async/await`
  - Bug fixed: `✦` unicode not supported by OG renderer — replaced with `→`
