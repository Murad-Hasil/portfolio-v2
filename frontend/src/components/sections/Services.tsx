"use client";

import { motion, type Variants, type Transition } from "framer-motion";
import { Bot, Zap, Code, Database } from "lucide-react";
import type { ReactNode } from "react";

type Service = {
  id: string;
  name: string;
  target_client: string;
  deliverables: string[];
  cta: string;
  icon: ReactNode;
};

/* ── Data sourced from context/services-manifest.json ─────────────────────── */
const services: Service[] = [
  {
    id: "ai-chatbot-agent",
    name: "AI Chatbot & Agent Development",
    target_client:
      "Businesses wanting 24/7 customer support or internal automation",
    deliverables: [
      "Production-ready AI agent or chatbot with your knowledge base",
      "RAG pipeline connected to your documents and data",
      "Deployment to your preferred platform (Vercel, Railway, or cloud)",
    ],
    cta: "#contact",
    icon: <Bot size={22} />,
  },
  {
    id: "business-automation",
    name: "Business Automation",
    target_client:
      "Small businesses spending hours on repetitive manual tasks",
    deliverables: [
      "Automated workflow replacing your most time-consuming manual process",
      "Monitoring dashboard and alerting for the automation",
      "Documentation and handover so your team can manage it",
    ],
    cta: "#contact",
    icon: <Zap size={22} />,
  },
  {
    id: "fullstack-web-apps",
    name: "Full-Stack Web Apps",
    target_client: "Startups and SMEs needing custom web applications",
    deliverables: [
      "Fully functional web app with frontend and backend",
      "PostgreSQL database with proper schema and migrations",
      "CI/CD pipeline with GitHub Actions and auto-deployment",
    ],
    cta: "#contact",
    icon: <Code size={22} />,
  },
  {
    id: "rag-knowledge-base",
    name: "RAG / Knowledge Base Systems",
    target_client: "Companies wanting AI that answers from their own data",
    deliverables: [
      "Vector database populated with your company's knowledge",
      "AI query interface returning grounded, cited answers",
      "Update pipeline so new documents are indexed automatically",
    ],
    cta: "#contact",
    icon: <Database size={22} />,
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
            // Services
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
            End-to-end AI and web development services for international
            clients.
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

      {/* Target client */}
      <p
        className="text-xs mb-3"
        style={{
          fontFamily: "var(--font-jetbrains-mono)",
          color: "var(--accent-indigo)",
        }}
      >
        For: {service.target_client}
      </p>

      {/* Deliverables */}
      <ul className="space-y-1.5 mb-6 flex-1">
        {service.deliverables.map((d, i) => (
          <li
            key={i}
            className="flex items-start gap-2 text-xs"
            style={{ color: "var(--text-secondary)" }}
          >
            <span
              style={{ color: "var(--accent-green)", flexShrink: 0 }}
            >
              ✓
            </span>
            {d}
          </li>
        ))}
      </ul>

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
