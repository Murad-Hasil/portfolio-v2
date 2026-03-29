# Portfolio Frontend — Next.js 15

Murad Hasil's portfolio frontend. Built with Next.js 15 App Router, TypeScript, and Tailwind CSS.

## Features

- Hero section with animated typewriter effect
- Projects showcase with filter tabs and case study pages
- Skills section with 5 category tabs
- Services, About, Contact sections
- RAG chatbot widget powered by Groq + Qdrant
- Dark / light mode toggle
- Mobile responsive (375px+)

## Setup

```bash
npm install
```

Create `.env.local`:
```
BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Run

```bash
npm run dev      # development
npm run build    # production build
npm run start    # production server
```

## Stack

- Next.js 15 (App Router) · TypeScript · Tailwind CSS v4
- shadcn/ui · Framer Motion · React Hook Form + Zod
