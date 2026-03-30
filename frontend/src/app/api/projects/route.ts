import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

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
    const data = readProjectsFromJson();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to load projects" },
      { status: 503 }
    );
  }
}
