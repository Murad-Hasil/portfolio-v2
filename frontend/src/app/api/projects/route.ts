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
    const res = await fetch(`${BACKEND_URL}/projects`, {
      next: { revalidate: 60 },
    });
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
