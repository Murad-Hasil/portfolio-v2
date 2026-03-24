"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Send, X } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

// ── Suggested questions ────────────────────────────────────────────────────────

const SUGGESTED = [
  "What AI projects have you built?",
  "What services do you offer?",
  "What is your tech stack?",
  "How can I hire you?",
];

// ── Typing indicator ───────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-3">
      {/* Bot avatar */}
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
        style={{
          background: "var(--accent-cyan)",
          color: "#08080F",
          fontFamily: "var(--font-space-grotesk)",
        }}
      >
        M
      </div>
      <div
        className="flex items-center gap-1 px-4 py-3 rounded-2xl rounded-bl-sm"
        style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "var(--text-muted)" }}
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </div>
  );
}

// ── Message bubble ─────────────────────────────────────────────────────────────

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex items-end gap-2 mb-3 ${isUser ? "flex-row-reverse" : ""}`}
    >
      {!isUser && (
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
          style={{
            background: "var(--accent-cyan)",
            color: "#08080F",
            fontFamily: "var(--font-space-grotesk)",
          }}
        >
          M
        </div>
      )}
      <div
        className="max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed"
        style={
          isUser
            ? {
                background: "var(--accent-indigo)",
                color: "#fff",
                borderRadius: "16px 16px 4px 16px",
                fontFamily: "var(--font-space-grotesk)",
              }
            : {
                background: "var(--bg-elevated)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "16px 16px 16px 4px",
                fontFamily: "var(--font-space-grotesk)",
              }
        }
      >
        {msg.content}
      </div>
    </motion.div>
  );
}

// ── Main widget ────────────────────────────────────────────────────────────────

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Generate / reuse sessionStorage UUID
  useEffect(() => {
    const stored = sessionStorage.getItem("chat_session_id");
    if (stored) {
      setSessionId(stored);
    } else {
      const id = crypto.randomUUID();
      sessionStorage.setItem("chat_session_id", id);
      setSessionId(id);
    }
  }, []);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Focus input when panel opens
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  async function sendMessage(text: string) {
    if (!text.trim() || loading || !sessionId) return;
    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, message: userMsg.content }),
      });
      const data = await res.json();
      const botText: string =
        res.ok && data.message
          ? data.message
          : "Sorry, I'm having trouble responding right now. Please reach Murad at mbmuradhasil@gmail.com";
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", content: botText },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "Sorry, I'm having trouble responding right now. Please reach Murad at mbmuradhasil@gmail.com",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <>
      {/* ── Panel ────────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed z-50 flex flex-col"
            style={{
              bottom: "calc(4rem + 1.5rem)",
              right: "1.5rem",
              width: "min(400px, calc(100vw - 2rem))",
              height: "min(520px, calc(100vh - 7rem))",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "16px",
              boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 flex-shrink-0"
              style={{
                borderBottom: "1px solid var(--border-subtle)",
                background: "var(--bg-elevated)",
                borderRadius: "16px 16px 0 0",
              }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{
                    background: "var(--accent-cyan)",
                    color: "#08080F",
                    fontFamily: "var(--font-space-grotesk)",
                  }}
                >
                  M
                </div>
                <div>
                  <p
                    className="text-sm font-semibold leading-none"
                    style={{
                      fontFamily: "var(--font-space-grotesk)",
                      color: "var(--text-primary)",
                    }}
                  >
                    Ask about Murad
                  </p>
                  <p
                    className="text-xs mt-0.5"
                    style={{
                      fontFamily: "var(--font-jetbrains-mono)",
                      color: "var(--accent-cyan)",
                    }}
                  >
                    AI assistant · online
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="p-1.5 rounded-lg transition-colors"
                style={{ color: "var(--text-muted)" }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Message list */}
            <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2" style={{ scrollbarWidth: "thin" }}>
              {messages.length === 0 && !loading && (
                <div>
                  <p
                    className="text-sm mb-4 text-center"
                    style={{
                      fontFamily: "var(--font-space-grotesk)",
                      color: "var(--text-muted)",
                    }}
                  >
                    Ask me anything about Murad&apos;s work and experience.
                  </p>
                  <div className="flex flex-col gap-2">
                    {SUGGESTED.map((q) => (
                      <button
                        key={q}
                        onClick={() => sendMessage(q)}
                        className="text-left text-sm px-3 py-2 rounded-lg transition-all duration-150"
                        style={{
                          fontFamily: "var(--font-space-grotesk)",
                          color: "var(--text-secondary)",
                          background: "var(--bg-elevated)",
                          border: "1px solid var(--border-subtle)",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.borderColor =
                            "var(--accent-cyan)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.borderColor =
                            "var(--border-subtle)";
                        }}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((msg) => (
                <MessageBubble key={msg.id} msg={msg} />
              ))}
              {loading && <TypingIndicator />}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div
              className="flex items-center gap-2 px-3 py-3 flex-shrink-0"
              style={{ borderTop: "1px solid var(--border-subtle)" }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message…"
                maxLength={500}
                disabled={loading}
                className="flex-1 bg-transparent text-sm outline-none"
                style={{
                  fontFamily: "var(--font-space-grotesk)",
                  color: "var(--text-primary)",
                }}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                aria-label="Send message"
                className="p-2 rounded-lg transition-all duration-150 flex-shrink-0"
                style={{
                  background: input.trim() && !loading ? "var(--accent-cyan)" : "var(--bg-elevated)",
                  color: input.trim() && !loading ? "#08080F" : "var(--text-muted)",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <Send size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FAB ──────────────────────────────────────────────────────────────── */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Open chat"}
        title="Ask me anything"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="fixed z-50 flex items-center gap-2 px-4 py-3 rounded-full shadow-lg"
        style={{
          bottom: "1.5rem",
          right: "1.5rem",
          background: open ? "var(--bg-elevated)" : "var(--accent-cyan)",
          color: open ? "var(--text-primary)" : "#08080F",
          border: "1px solid var(--border-subtle)",
          fontFamily: "var(--font-space-grotesk)",
          fontWeight: 600,
          fontSize: "0.875rem",
        }}
      >
        {open ? <X size={18} /> : <MessageCircle size={18} />}
        {!open && <span>Ask me anything</span>}
      </motion.button>
    </>
  );
}
