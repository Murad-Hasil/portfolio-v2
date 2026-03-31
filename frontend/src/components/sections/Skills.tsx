"use client";

import { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  type Variants,
  type Transition,
} from "framer-motion";

type SkillItem = {
  name: string;
  level: "advanced" | "intermediate";
};

type SkillCategory = {
  label: string;
  items: SkillItem[];
};

type SkillsData = {
  skills: Record<string, SkillCategory>;
};

const ease: Transition = { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] };

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: ease },
};

function ProficiencyDots({ level }: { level: "advanced" | "intermediate" }) {
  const count = level === "advanced" ? 3 : 2;
  return (
    <div className="flex items-center gap-1" aria-label={level}>
      {[1, 2, 3].map((n) => (
        <div
          key={n}
          className="w-1.5 h-1.5 rounded-full"
          style={{
            background: n <= count ? "var(--accent-cyan)" : "var(--border-subtle)",
          }}
        />
      ))}
    </div>
  );
}

export function Skills() {
  const [data, setData] = useState<SkillsData | null>(null);
  const [activeTab, setActiveTab] = useState<string>("");
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/skills")
      .then((r) => r.json())
      .then((d: SkillsData) => {
        if (!d.skills) return;
        setData(d);
        const firstKey = Object.keys(d.skills)[0];
        if (firstKey) setActiveTab(firstKey);
      })
      .catch(() => setError(true));
  }, []);

  const tabs = data?.skills ? Object.entries(data.skills) : [];
  const activeItems = data?.skills[activeTab]?.items ?? [];

  if (error) {
    return (
      <section id="skills" className="py-24 px-4 sm:px-6">
        <div
          className="max-w-4xl mx-auto text-center text-sm"
          style={{ color: "var(--text-muted)", fontFamily: "var(--font-jetbrains-mono)" }}
        >
          Failed to load skills. Please refresh the page.
        </div>
      </section>
    );
  }

  return (
    <section id="skills" className="py-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={ease}
          className="mb-12 text-center"
        >
          <p
            className="text-xs tracking-widest uppercase mb-3"
            style={{
              fontFamily: "var(--font-jetbrains-mono)",
              color: "var(--accent-cyan)",
            }}
          >
            {"// Skills"}
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold"
            style={{
              fontFamily: "var(--font-space-grotesk)",
              color: "var(--text-primary)",
            }}
          >
            Technical Expertise
          </h2>
        </motion.div>

        {/* Category tabs — horizontal scroll on mobile */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...ease, delay: 0.1 }}
          className="flex gap-2 mb-8 overflow-x-auto pb-2 sm:flex-wrap sm:justify-center"
          style={{ scrollbarWidth: "none" }}
        >
          {tabs.map(([key, cat]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className="flex-shrink-0 px-4 py-1.5 rounded text-sm transition-all duration-200"
              style={{
                fontFamily: "var(--font-space-grotesk)",
                color:
                  activeTab === key ? "#08080F" : "var(--text-secondary)",
                background:
                  activeTab === key ? "var(--accent-cyan)" : "transparent",
                border: `1px solid ${
                  activeTab === key
                    ? "var(--accent-cyan)"
                    : "var(--border-subtle)"
                }`,
              }}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Skills grid — 2-column on mobile + sm */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {activeItems.map((skill) => (
              <motion.div
                key={skill.name}
                variants={fadeUp}
                className="flex items-center justify-between rounded-lg px-5 py-3.5"
                style={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <span
                  className="text-sm font-medium"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    color: "var(--text-primary)",
                  }}
                >
                  {skill.name}
                </span>
                <div className="flex items-center gap-3">
                  <span
                    className="text-xs hidden sm:inline"
                    style={{
                      fontFamily: "var(--font-jetbrains-mono)",
                      color: "var(--text-muted)",
                    }}
                  >
                    {skill.level}
                  </span>
                  <ProficiencyDots level={skill.level} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ ...ease, delay: 0.3 }}
          className="flex items-center justify-center gap-6 mt-8"
        >
          {(
            [
              { label: "Advanced", count: 3 },
              { label: "Intermediate", count: 2 },
            ] as const
          ).map(({ label, count }) => (
            <div key={label} className="flex items-center gap-2">
              <div className="flex gap-1">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      background:
                        n <= count
                          ? "var(--accent-cyan)"
                          : "var(--border-subtle)",
                    }}
                  />
                ))}
              </div>
              <span
                className="text-xs"
                style={{
                  fontFamily: "var(--font-jetbrains-mono)",
                  color: "var(--text-muted)",
                }}
              >
                {label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
