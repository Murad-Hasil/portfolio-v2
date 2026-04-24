"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Mail, MessageSquare, MapPin, Send, CheckCircle, AlertCircle } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons";

// ── Zod schema ─────────────────────────────────────────────────────────────────

const schema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Max 100 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(1, "Subject is required").max(200, "Max 200 characters"),
  service: z.enum(["AI Chatbot", "Automation", "Web App", "RAG System", "Other"] as const, {
    error: "Please select a service",
  }),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

type FormData = z.infer<typeof schema>;

// ── Contact info ───────────────────────────────────────────────────────────────

const CONTACT_LINKS = [
  {
    icon: Mail,
    label: "Email",
    value: "mbmuradhasil@gmail.com",
    href: "mailto:mbmuradhasil@gmail.com",
  },
  {
    icon: MessageSquare,
    label: "WhatsApp",
    value: "+92 314 2241393",
    href: "https://wa.me/923142241393",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Karachi, Pakistan",
    href: null,
  },
];

const ease = { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] } as const;

// ── Component ──────────────────────────────────────────────────────────────────

export function Contact() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "ratelimit">(
    "idle"
  );
  const [reference, setReference] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (res.status === 429) {
        setStatus("ratelimit");
        return;
      }
      if (!res.ok) {
        setErrorMsg(json?.detail ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setReference(json.reference ?? "");
      setStatus("success");
      reset();
    } catch {
      setErrorMsg("Unable to send message. Please try again later.");
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="py-24 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={ease}
          className="mb-14 text-center"
        >
          <p
            className="text-xs tracking-widest uppercase mb-3"
            style={{
              fontFamily: "var(--font-jetbrains-mono)",
              color: "var(--accent-cyan)",
            }}
          >
            {"// Contact"}
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold"
            style={{
              fontFamily: "var(--font-space-grotesk)",
              color: "var(--text-primary)",
            }}
          >
            Let&apos;s Automate Your Workflow
          </h2>
          <p
            className="mt-3 text-base max-w-xl mx-auto"
            style={{
              fontFamily: "var(--font-space-grotesk)",
              color: "var(--text-secondary)",
            }}
          >
            Tell me what your team does repeatedly — I&apos;ll tell you if it can be automated, and I&apos;ll be honest if it can&apos;t.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* ── Left: contact info ─────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={ease}
            className="lg:col-span-2 flex flex-col gap-6"
          >
            <div className="flex flex-col gap-4">
              {CONTACT_LINKS.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-start gap-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}
                  >
                    <Icon size={16} style={{ color: "var(--accent-cyan)" }} />
                  </div>
                  <div>
                    <p
                      className="text-xs mb-0.5"
                      style={{
                        fontFamily: "var(--font-jetbrains-mono)",
                        color: "var(--text-muted)",
                      }}
                    >
                      {label}
                    </p>
                    {href ? (
                      <a
                        href={href}
                        target={href.startsWith("http") ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className="text-sm transition-colors hover:underline"
                        style={{
                          fontFamily: "var(--font-space-grotesk)",
                          color: "var(--text-primary)",
                        }}
                      >
                        {value}
                      </a>
                    ) : (
                      <p
                        className="text-sm"
                        style={{
                          fontFamily: "var(--font-space-grotesk)",
                          color: "var(--text-primary)",
                        }}
                      >
                        {value}
                      </p>
                    )}
                    {label === "WhatsApp" && (
                      <p
                        className="text-xs mt-1"
                        style={{
                          fontFamily: "var(--font-space-grotesk)",
                          color: "var(--text-muted)",
                        }}
                      >
                        Fastest way to reach me — most clients hear back within a few hours.
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Social links */}
            <div className="flex gap-3 mt-2">
              {[
                { href: "https://github.com/Murad-Hasil", label: "GitHub", Icon: GithubIcon },
                { href: "https://www.linkedin.com/in/muradhasil/", label: "LinkedIn", Icon: LinkedinIcon },
              ].map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200"
                  style={{
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border-subtle)",
                    color: "var(--text-secondary)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--accent-cyan)";
                    (e.currentTarget as HTMLAnchorElement).style.color = "var(--accent-cyan)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--border-subtle)";
                    (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-secondary)";
                  }}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>

            {/* Fiverr CTA */}
            <div
              className="rounded-lg px-4 py-4 mt-2"
              style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <p
                className="text-xs mb-3"
                style={{
                  fontFamily: "var(--font-jetbrains-mono)",
                  color: "var(--accent-cyan)",
                }}
              >
                {"// Or hire me directly"}
              </p>
              <a
                href="https://www.fiverr.com/murad_hasil"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center py-2.5 rounded text-sm font-semibold transition-opacity duration-200 hover:opacity-90 mb-2"
                style={{
                  background: "var(--accent-cyan)",
                  color: "#08080F",
                  fontFamily: "var(--font-space-grotesk)",
                }}
              >
                View My Fiverr Profile
              </a>
              <p
                className="text-xs text-center"
                style={{
                  fontFamily: "var(--font-space-grotesk)",
                  color: "var(--text-muted)",
                }}
              >
                Browse packages, reviews, and fixed-price options.
              </p>
            </div>

            {/* Availability note */}
            <div
              className="rounded-lg px-4 py-3 mt-2"
              style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <p
                className="text-xs"
                style={{
                  fontFamily: "var(--font-jetbrains-mono)",
                  color: "var(--accent-cyan)",
                }}
              >
                {"// Available for freelance"}
              </p>
              <p
                className="text-sm mt-1"
                style={{
                  fontFamily: "var(--font-space-grotesk)",
                  color: "var(--text-secondary)",
                }}
              >
                Open to new projects. WhatsApp replies in a few hours — form replies within 24.
              </p>
            </div>
          </motion.div>

          {/* ── Right: form ────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={ease}
            className="lg:col-span-3"
          >
            {/* Success state */}
            {status === "success" && (
              <div
                className="rounded-xl p-8 flex flex-col items-center text-center gap-3"
                style={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <CheckCircle size={40} style={{ color: "var(--accent-cyan)" }} />
                <h3
                  className="text-xl font-bold"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    color: "var(--text-primary)",
                  }}
                >
                  Message Sent!
                </h3>
                <p
                  className="text-sm"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    color: "var(--text-secondary)",
                  }}
                >
                  Thank you! Murad will respond within 24-48 hours.
                </p>
                {reference && (
                  <div
                    className="px-4 py-2 rounded-lg mt-1"
                    style={{ background: "var(--bg-primary)", border: "1px solid var(--border-subtle)" }}
                  >
                    <p
                      className="text-xs"
                      style={{
                        fontFamily: "var(--font-jetbrains-mono)",
                        color: "var(--text-muted)",
                      }}
                    >
                      Reference
                    </p>
                    <p
                      className="text-sm font-bold mt-0.5"
                      style={{
                        fontFamily: "var(--font-jetbrains-mono)",
                        color: "var(--accent-cyan)",
                      }}
                    >
                      {reference}
                    </p>
                  </div>
                )}
                <button
                  suppressHydrationWarning
                  onClick={() => setStatus("idle")}
                  className="text-sm mt-2 underline"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    color: "var(--text-muted)",
                  }}
                >
                  Send another message
                </button>
              </div>
            )}

            {/* Rate limit state */}
            {status === "ratelimit" && (
              <div
                className="rounded-xl p-8 flex flex-col items-center text-center gap-3"
                style={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <AlertCircle size={40} style={{ color: "#F59E0B" }} />
                <h3
                  className="text-xl font-bold"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    color: "var(--text-primary)",
                  }}
                >
                  Too Many Requests
                </h3>
                <p
                  className="text-sm"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    color: "var(--text-secondary)",
                  }}
                >
                  You&apos;ve reached the 3-submission limit per hour. Please try again later or
                  email directly at{" "}
                  <a
                    href="mailto:mbmuradhasil@gmail.com"
                    className="underline"
                    style={{ color: "var(--accent-cyan)" }}
                  >
                    mbmuradhasil@gmail.com
                  </a>
                </p>
              </div>
            )}

            {/* Form */}
            {(status === "idle" || status === "loading" || status === "error") && (
              <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="flex flex-col gap-4"
              >
                {/* Error banner */}
                {status === "error" && (
                  <div
                    className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm"
                    style={{
                      background: "rgba(239,68,68,0.1)",
                      border: "1px solid rgba(239,68,68,0.3)",
                      fontFamily: "var(--font-space-grotesk)",
                      color: "#EF4444",
                    }}
                  >
                    <AlertCircle size={16} className="flex-shrink-0" />
                    {errorMsg}
                  </div>
                )}

                {/* Name + Email row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Name" error={errors.name?.message} id="contact-name">
                    <input
                      suppressHydrationWarning
                      id="contact-name"
                      aria-required="true"
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "contact-name-error" : undefined}
                      {...register("name")}
                      placeholder="John Smith"
                      className={inputClass(!!errors.name)}
                    />
                  </Field>
                  <Field label="Email" error={errors.email?.message} id="contact-email">
                    <input
                      suppressHydrationWarning
                      id="contact-email"
                      type="email"
                      aria-required="true"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "contact-email-error" : undefined}
                      {...register("email")}
                      placeholder="john@company.com"
                      className={inputClass(!!errors.email)}
                    />
                  </Field>
                </div>

                {/* Subject */}
                <Field label="Subject" error={errors.subject?.message} id="contact-subject">
                  <input
                    suppressHydrationWarning
                    id="contact-subject"
                    aria-required="true"
                    aria-invalid={!!errors.subject}
                    aria-describedby={errors.subject ? "contact-subject-error" : undefined}
                    {...register("subject")}
                    placeholder="AI chatbot for customer support"
                    className={inputClass(!!errors.subject)}
                  />
                </Field>

                {/* Service */}
                <Field label="Service" error={errors.service?.message} id="contact-service">
                  <select
                    suppressHydrationWarning
                    id="contact-service"
                    aria-required="true"
                    aria-invalid={!!errors.service}
                    aria-describedby={errors.service ? "contact-service-error" : undefined}
                    {...register("service")}
                    className={inputClass(!!errors.service)}
                  >
                    <option value="">Select a service…</option>
                    <option value="AI Chatbot">AI Chatbot</option>
                    <option value="Automation">Automation</option>
                    <option value="Web App">Web App</option>
                    <option value="RAG System">RAG System</option>
                    <option value="Other">Other</option>
                  </select>
                </Field>

                {/* Message */}
                <Field label="Message" error={errors.message?.message} id="contact-message">
                  <textarea
                    suppressHydrationWarning
                    id="contact-message"
                    aria-required="true"
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? "contact-message-error" : undefined}
                    {...register("message")}
                    rows={5}
                    placeholder="Tell me about your project…"
                    className={inputClass(!!errors.message)}
                    style={{ resize: "vertical" }}
                  />
                </Field>

                <button
                  suppressHydrationWarning
                  type="submit"
                  disabled={status === "loading"}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-lg text-sm font-semibold transition-all duration-200 mt-1"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    background: status === "loading" ? "var(--bg-elevated)" : "var(--accent-cyan)",
                    color: status === "loading" ? "var(--text-muted)" : "#08080F",
                    border: "1px solid var(--border-subtle)",
                    cursor: status === "loading" ? "not-allowed" : "pointer",
                  }}
                >
                  {status === "loading" ? (
                    <>
                      <span
                        className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
                        style={{ borderColor: "var(--text-muted)", borderTopColor: "transparent" }}
                      />
                      Sending…
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function inputClass(hasError: boolean) {
  return [
    "w-full px-4 py-2.5 rounded-lg text-sm outline-none transition-all duration-150",
    "bg-[var(--bg-elevated)] text-[var(--text-primary)]",
    hasError
      ? "border border-red-500"
      : "border border-[var(--border-subtle)] focus:border-[var(--accent-cyan)]",
  ].join(" ");
}

function Field({
  label,
  error,
  id,
  children,
}: {
  label: string;
  error?: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-xs font-medium"
        style={{
          fontFamily: "var(--font-space-grotesk)",
          color: "var(--text-secondary)",
        }}
      >
        {label}
      </label>
      {children}
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-xs"
          style={{
            fontFamily: "var(--font-space-grotesk)",
            color: "#EF4444",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
