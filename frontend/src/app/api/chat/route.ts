import { NextRequest } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const upstream = await fetch(`${BACKEND_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(55000),
    });

    if (!upstream.ok || !upstream.body) {
      const err = await upstream.text().catch(() => "Chat service error");
      return new Response(err, { status: upstream.status });
    }

    return new Response(upstream.body, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  } catch {
    return new Response(
      JSON.stringify({ detail: "Chat service temporarily unavailable." }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }
}
