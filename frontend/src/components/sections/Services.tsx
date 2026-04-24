"use client";

import { motion, type Variants, type Transition } from "framer-motion";
import { Bot, Zap, Code, Database } from "lucide-react";
import type { ReactNode } from "react";

type Service = {
  id: string;
  name: string;
  description: string;
  outcome: string;
  cta: string;
  icon: ReactNode;
};

/* ── Data sourced from context/services-manifest.json ─────────────────────── */
const services: Service[] = [
  {
    id: "ai-chatbot-agent",
    name: "Customer Support Automation",
    description:
      "For businesses tired of answering the same questions every day.\n\nI build AI systems that handle customer queries across chat, email, or web — 24/7 — so your team can focus on work that actually needs a human.",
    outcome:
      "Faster responses, lower support workload, and consistent customer experience.",
    cta: "#contact",
    icon: <Bot size={22} />,
  },
  {
    id: "business-automation",
    name: "Business Process Automation",
    description:
      "For teams spending hours on repetitive tasks like data entry, follow-ups, or reports.\n\nI map your workflow and automate it end-to-end — so the same work gets done without manual effort.",
    outcome: "Save hours every week, reduce errors, and free up your team's time.",
    cta: "#contact",
    icon: <Zap size={22} />,
  },
  {
    id: "rag-knowledge-base",
    name: "AI Knowledge Base (answers from your data)",
    description:
      "For businesses where people keep asking the same questions internally or externally.\n\nI turn your documents, SOPs, and data into an AI system that gives instant answers — no searching, no delays.",
    outcome: "Faster access to information and less dependency on team members.",
    cta: "#contact",
    icon: <Database size={22} />,
  },
  {
    id: "fullstack-web-apps",
    name: "Custom AI Tools for Your Business",
    description:
      "For businesses that need something built around how they actually work.\n\nI design and build custom AI systems tailored to your workflow — not generic tools that don't fit.",
    outcome:
      "A system that works exactly the way your business operates and scales with it.",
    cta: "#contact",
    icon: <Code size={22} />,
  },
];

const ease: Transition = { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] };

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: ease },
};

export function Services() {
  return (
    <section id="services" className="py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
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
            {"// Services"}
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold"
            style={{
              fontFamily: "var(--font-space-grotesk)",
              color: "var(--text-primary)",
            }}
          >
            What I Offer
          </h2>
          <p
            className="text-base mt-3 max-w-xl mx-auto"
            style={{ color: "var(--text-secondary)" }}
          >
            Built for businesses that want to automate without the technical headache.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {services.map((svc) => (
            <ServiceCard key={svc.id} service={svc} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function ServiceCard({ service }: { service: Service }) {
  return (
    <motion.div
      variants={fadeUp}
      className="rounded-lg p-6 flex flex-col"
      style={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--border-subtle)",
      }}
      whileHover={{
        y: -4,
        borderColor: "var(--accent-cyan)",
        boxShadow:
          "0 4px 32px rgba(0,212,255,0.1), 0 0 0 1px rgba(0,212,255,0.12)",
      }}
    >
      {/* Icon */}
      <div
        className="w-11 h-11 rounded-lg flex items-center justify-center mb-4"
        style={{
          background: "rgba(0,212,255,0.08)",
          border: "1px solid rgba(0,212,255,0.15)",
          color: "var(--accent-cyan)",
        }}
      >
        {service.icon}
      </div>

      {/* Name */}
      <h3
        className="font-semibold text-base mb-1"
        style={{
          fontFamily: "var(--font-space-grotesk)",
          color: "var(--text-primary)",
        }}
      >
        {service.name}
      </h3>

      {/* Description */}
      <div className="mb-4 flex-1 flex flex-col gap-2">
        {service.description.split("\n\n").map((chunk, i) => (
          <p
            key={i}
            className="text-sm leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            {chunk}
          </p>
        ))}
      </div>

      {/* Outcome */}
      <p
        className="text-xs mb-4"
        style={{
          fontFamily: "var(--font-space-grotesk)",
          color: "var(--accent-cyan)",
        }}
      >
        <span className="font-semibold">Outcome: </span>
        {service.outcome}
      </p>

      {/* CTA */}
      <a
        href={service.cta}
        className="block w-full text-center py-2.5 rounded text-sm font-semibold transition-opacity duration-200 hover:opacity-90"
        style={{
          background: "var(--accent-cyan)",
          color: "#08080F",
          fontFamily: "var(--font-space-grotesk)",
        }}
      >
        Get Quote
      </a>
    </motion.div>
  );
}
