import fs from "fs";
import path from "path";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { Services } from "@/components/sections/Services";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { ChatWidget } from "@/components/ChatWidget";
import type { Project } from "@/components/sections/Projects";
import type { SkillsData } from "@/components/sections/Skills";

function readJson<T>(filename: string): T {
  const filePath = path.resolve(process.cwd(), "context", filename);
  return JSON.parse(fs.readFileSync(filePath, "utf-8")) as T;
}

function readAvailability(): { status: string; label: string } | null {
  try {
    const filePath = path.resolve(process.cwd(), "context", "murad-profile.md");
    const content = fs.readFileSync(filePath, "utf-8");
    const match = (field: string) =>
      content.match(new RegExp(`^- ${field}:\\s*(.+)$`, "m"))?.[1]?.trim();
    const status = match("Status");
    const label = match("Label");
    if (!status || !label) return null;
    return { status, label };
  } catch {
    return null;
  }
}

export default function Home() {
  const projectsRaw = readJson<{ projects: Project[] }>("projects-manifest.json");
  const projects: Project[] = (projectsRaw.projects ?? []).sort((a, b) =>
    a.featured === b.featured ? 0 : a.featured ? -1 : 1
  );
  const skillsData = readJson<SkillsData>("skills-manifest.json");
  const availability = readAvailability();

  return (
    <>
      <Navbar />
      <main id="main-content">
        <Hero availability={availability} />
        <Projects initialProjects={projects} />
        <Skills initialData={skillsData} />
        <Services />
        <About />
        <Contact />
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
