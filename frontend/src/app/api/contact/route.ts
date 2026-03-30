import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000";
const TIMEOUT_MS = 35_000;

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ detail: "Invalid request body." }, { status: 400 });
  }

  // Two attempts: first handles cold-start wake-up, second is the real request
  for (let attempt = 1; attempt <= 2; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(`${BACKEND_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      clearTimeout(timer);
      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    } catch {
      clearTimeout(timer);
      if (attempt === 2) {
        return NextResponse.json(
          { detail: "Service temporarily unavailable. Please try again later." },
          { status: 503 }
        );
      }
      // Brief pause before retry on first failure
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
}
