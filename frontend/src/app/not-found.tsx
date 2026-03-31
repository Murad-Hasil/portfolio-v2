import Link from "next/link";

export default function NotFound() {
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
        {"// 404"}
      </p>
      <h1
        className="text-3xl sm:text-4xl font-bold mb-3"
        style={{
          fontFamily: "var(--font-space-grotesk)",
          color: "var(--text-primary)",
        }}
      >
        Page Not Found
      </h1>
      <p
        className="text-sm mb-8 max-w-md"
        style={{ color: "var(--text-secondary)" }}
      >
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-5 py-2 rounded-md text-sm font-medium transition-opacity hover:opacity-80"
        style={{
          fontFamily: "var(--font-space-grotesk)",
          background: "var(--accent-cyan)",
          color: "#08080F",
        }}
      >
        Return Home
      </Link>
    </main>
  );
}
