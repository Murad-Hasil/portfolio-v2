import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface Availability {
  status: string;
  label: string;
  note: string;
  hours_per_week: number;
}

interface ProfileData {
  name: string;
  title: string;
  availability: Availability;
}

function parseField(content: string, field: string): string {
  const match = content.match(new RegExp(`^- ${field}:\\s*(.+)$`, "m"));
  if (!match) throw new Error(`Field '${field}' not found in murad-profile.md`);
  return match[1].trim();
}

function readProfile(): ProfileData {
  const profilePath = path.resolve(
    process.cwd(),
    "context",
    "murad-profile.md"
  );
  const content = fs.readFileSync(profilePath, "utf-8");

  const name = parseField(content, "Name");
  const title = parseField(content, "Title");
  const status = parseField(content, "Status");
  const label = parseField(content, "Label");
  const note = parseField(content, "Note");
  const hoursRaw = parseField(content, "Hours per week");
  const hours_per_week = parseInt(hoursRaw.replace(/\D/g, ""), 10);

  return { name, title, availability: { status, label, note, hours_per_week } };
}

export const dynamic = "force-static";

export async function GET() {
  try {
    const data = readProfile();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to load profile" },
      { status: 503 }
    );
  }
}
