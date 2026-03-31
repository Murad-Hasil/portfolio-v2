"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
      style={{ background: "var(--bg-primary)" }}
    >
      <p
        className="text-xs tracking-widest uppercase mb-4"
        style={{
          fontFamily: "var(--font-jetbrains-mono)",
          color: "var(--accent-cyan)",
        }}
      >
        {"// Error"}
      </p>
      <h1
        className="text-3xl sm:text-4xl font-bold mb-3"
        style={{
          fontFamily: "var(--font-space-grotesk)",
          color: "var(--text-primary)",
        }}
      >
        Something went wrong
      </h1>
      <p
        className="text-sm mb-8 max-w-md"
        style={{ color: "var(--text-secondary)" }}
      >
        An unexpected error occurred. You can try again or return to the homepage.
      </p>
      <div className="flex gap-3 flex-wrap justify-center">
        <button
          onClick={reset}
          className="px-5 py-2 rounded-md text-sm font-medium transition-opacity hover:opacity-80"
          style={{
            fontFamily: "var(--font-space-grotesk)",
            background: "var(--accent-cyan)",
            color: "#08080F",
          }}
        >
          Try Again
        </button>
        <a
          href="/"
          className="px-5 py-2 rounded-md text-sm font-medium transition-opacity hover:opacity-80"
          style={{
            fontFamily: "var(--font-space-grotesk)",
            color: "var(--text-secondary)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          Return Home
        </a>
      </div>
    </main>
  );
}
