"use client";

import { motion, type Variants, type Transition } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { Mail, MessageCircle, ArrowDown } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons";

/* ── Animation helpers ──────────────────────────────────────────────────── */
const ease: Transition = { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] };

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: ease },
};

/* ── Data (static — sourced from context/murad-profile.md) ──────────────── */
const techPills = ["Next.js", "FastAPI", "OpenAI", "Kubernetes", "MCP"];

const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/Murad-Hasil",
    Icon: GithubIcon,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/muradhasil/",
    Icon: LinkedinIcon,
  },
  {
    label: "WhatsApp",
    href: "https://wa.me/923142241393",
    Icon: MessageCircle,
  },
  {
    label: "Email",
    href: "mailto:mbmuradhasil@gmail.com",
    Icon: Mail,
  },
] as const;

export function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
    >
      {/* Dot-grid background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(226,232,240,0.12) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          opacity: 0.15,
        }}
      />
      {/* Subtle cyan glow — far top-right corner */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-40 w-96 h-96 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center"
      >
        {/* Eyebrow */}
        <motion.p
          variants={fadeUp}
          className="text-xs tracking-widest uppercase mb-4"
          style={{
            fontFamily: "var(--font-jetbrains-mono)",
            color: "var(--accent-cyan)",
          }}
        >
          // AI Automation Engineer
        </motion.p>

        {/* Main headline */}
        <motion.h1
          variants={fadeUp}
          className="font-bold leading-tight mb-4"
          style={{
            fontFamily: "var(--font-space-grotesk)",
            fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
            color: "var(--text-primary)",
          }}
        >
          AI Automation Engineer
          <br />
          <span style={{ color: "var(--accent-cyan)" }}>
            &amp; Full-Stack Developer
          </span>
        </motion.h1>

        {/* TypeAnimation — rotating roles */}
        <motion.div variants={fadeUp} className="h-8 mb-6">
          <TypeAnimation
            sequence={[
              "AI Agent Developer",
              2000,
              "Full-Stack Developer",
              2000,
              "Automation Engineer",
              2000,
              "RAG System Builder",
              2000,
            ]}
            wrapper="span"
            speed={50}
            repeat={Infinity}
            className="text-lg"
            style={{
              fontFamily: "var(--font-jetbrains-mono)",
              color: "var(--text-secondary)",
            }}
          />
        </motion.div>

        {/* Value proposition */}
        <motion.p
          variants={fadeUp}
          className="text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          I build AI systems that run 24/7 — at a fraction of the cost of a
          human employee. From autonomous agents to RAG pipelines and
          production-grade web apps for international clients.
        </motion.p>

        {/* Tech pills */}
        <motion.div
          variants={fadeUp}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {techPills.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 text-xs rounded"
              style={{
                fontFamily: "var(--font-jetbrains-mono)",
                color: "var(--accent-indigo)",
                background: "rgba(99,102,241,0.1)",
                border: "1px solid rgba(99,102,241,0.3)",
              }}
            >
              [{tech}]
            </span>
          ))}
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          variants={fadeUp}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
        >
          <a
            href="https://www.upwork.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3 rounded-md font-semibold text-sm transition-all duration-200"
            style={{
              fontFamily: "var(--font-space-grotesk)",
              color: "#08080F",
              background: "var(--accent-cyan)",
              boxShadow: "0 0 20px rgba(0,212,255,0.25)",
            }}
          >
            Hire Me on Upwork
          </a>
          <a
            href="#projects"
            className="w-full sm:w-auto px-6 py-3 rounded-md font-semibold text-sm transition-all duration-200 hover:border-[var(--accent-cyan)] hover:text-[var(--accent-cyan)]"
            style={{
              fontFamily: "var(--font-space-grotesk)",
              color: "var(--text-primary)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            See My Work
          </a>
        </motion.div>

        {/* Social links */}
        <motion.div
          variants={fadeUp}
          className="flex items-center justify-center gap-5"
        >
          {socialLinks.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("mailto") ? undefined : "_blank"}
              rel={
                href.startsWith("mailto") ? undefined : "noopener noreferrer"
              }
              aria-label={label}
              className="hover:text-[var(--accent-cyan)] transition-colors duration-200"
              style={{ color: "var(--text-muted)" }}
            >
              <Icon size={20} />
            </a>
          ))}
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          variants={fadeUp}
          className="mt-16 flex justify-center"
          aria-hidden
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <ArrowDown size={18} style={{ color: "var(--text-muted)" }} />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
