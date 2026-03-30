import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000";

function readProjectsFromJson() {
  const jsonPath = path.resolve(
    process.cwd(),
    "context",
    "projects-manifest.json"
  );
  return JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
}

export async function GET() {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    let res: Response;
    try {
      res = await fetch(`${BACKEND_URL}/projects`, {
        next: { revalidate: 60 },
        signal: controller.signal,
      });
      clearTimeout(timer);
    } catch {
      clearTimeout(timer);
      throw new Error("Backend unavailable");
    }
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    // Backend unavailable — serve directly from context JSON
    try {
      const data = readProjectsFromJson();
      return NextResponse.json(data);
    } catch {
      return NextResponse.json(
        { error: "Failed to reach backend" },
        { status: 503 }
      );
    }
  }
}
