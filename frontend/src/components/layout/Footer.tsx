import { Mail, MessageCircle, ExternalLink } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons";

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
  {
    label: "Fiverr",
    href: "https://www.fiverr.com/murad_hasil",
    Icon: ExternalLink,
  },
] as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex flex-col items-center sm:items-start gap-1">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-md bg-[var(--accent-cyan)] text-[#08080F] flex items-center justify-center font-mono font-bold text-xs select-none">
                MH
              </span>
              <span
                className="font-semibold text-[var(--text-primary)] text-sm"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                Murad Hasil
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              AI Automation for Small Businesses
            </p>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-4">
            {socialLinks.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("mailto") ? undefined : "_blank"}
                rel={
                  href.startsWith("mailto") ? undefined : "noopener noreferrer"
                }
                aria-label={label}
                className="text-[var(--text-muted)] hover:text-[var(--accent-cyan)] transition-colors duration-200"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-[var(--border-subtle)] text-center">
          <p className="text-xs text-[var(--text-muted)]">
            &copy; {year} Murad Hasil. Built with the same AI stack I sell — Next.js, FastAPI, and an AI assistant that knows the full codebase.
          </p>
        </div>
      </div>
    </footer>
  );
}
