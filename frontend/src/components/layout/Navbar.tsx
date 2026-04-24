"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Menu, Moon, Sun, Download } from "lucide-react";
import { GithubIcon } from "@/components/icons";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navLinks = [
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () =>
    setTheme(resolvedTheme === "dark" ? "light" : "dark");

  return (
    <header
      className={[
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-[var(--border-subtle)] bg-[var(--bg-primary)]/90 backdrop-blur-md"
          : "bg-transparent",
      ].join(" ")}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 group"
          aria-label="Murad Hasil — Home"
        >
          <span className="w-8 h-8 rounded-md bg-[var(--accent-cyan)] text-[#08080F] flex items-center justify-center font-mono font-bold text-sm select-none">
            MH
          </span>
          <span
            className="font-semibold text-[var(--text-primary)] text-sm hidden sm:block group-hover:text-[var(--accent-cyan)] transition-colors"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Murad Hasil
          </span>
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-6">
          {navLinks.map(({ label, href }) => (
            <li key={label}>
              <a
                href={href}
                className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors duration-200"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop right actions */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="https://github.com/Murad-Hasil"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <GithubIcon size={18} />
          </a>

          <button
            suppressHydrationWarning
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            {mounted && resolvedTheme === "dark" ? (
              <Sun size={18} />
            ) : (
              <Moon size={18} />
            )}
          </button>

          <a
            href="/resume.pdf"
            download
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--accent-cyan)] hover:text-[var(--accent-cyan)] transition-all duration-200"
          >
            <Download size={14} />
            Resume
          </a>
        </div>

        {/* Mobile: theme toggle + hamburger */}
        <div className="flex md:hidden items-center gap-3">
          <button
            suppressHydrationWarning
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            {mounted && resolvedTheme === "dark" ? (
              <Sun size={18} />
            ) : (
              <Moon size={18} />
            )}
          </button>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              aria-label="Open menu"
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer bg-transparent border-0 p-0"
            >
              <Menu size={20} />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-72 bg-[var(--bg-elevated)] border-[var(--border-subtle)]"
            >
              <SheetHeader className="mb-6">
                <SheetTitle
                  className="flex items-center gap-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  <span className="w-7 h-7 rounded-md bg-[var(--accent-cyan)] text-[#08080F] flex items-center justify-center font-mono font-bold text-xs">
                    MH
                  </span>
                  Murad Hasil
                </SheetTitle>
              </SheetHeader>

              <nav className="flex flex-col gap-1">
                {navLinks.map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className="px-3 py-3 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] rounded-md transition-colors"
                  >
                    {label}
                  </a>
                ))}
              </nav>

              <div className="mt-6 pt-6 border-t border-[var(--border-subtle)] flex flex-col gap-3">
                <a
                  href="https://github.com/Murad-Hasil"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-md transition-colors"
                >
                  <GithubIcon size={16} />
                  GitHub
                </a>
                <a
                  href="/resume.pdf"
                  download
                  className="flex items-center gap-2 px-3 py-2.5 text-sm border border-[var(--border-subtle)] rounded-md text-[var(--text-primary)] hover:border-[var(--accent-cyan)] hover:text-[var(--accent-cyan)] transition-all"
                >
                  <Download size={16} />
                  Download Resume
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
