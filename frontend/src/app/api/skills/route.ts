import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

function readSkillsFromJson() {
  const jsonPath = path.resolve(
    process.cwd(),
    "context",
    "skills-manifest.json"
  );
  return JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
}

export async function GET() {
  try {
    const data = readSkillsFromJson();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to load skills" },
      { status: 503 }
    );
  }
}
