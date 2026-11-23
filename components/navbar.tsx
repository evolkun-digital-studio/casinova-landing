"use client";

import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { links } from "@/lib/content";
import { TelegramIcon } from "./brand-icons";

const nav = [
  { href: "#games", label: "Games" },
  { href: "#bonus", label: "Bonus" },
  { href: "#play", label: "Play free" },
  { href: "#community", label: "Community" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || open
          ? "border-b border-line bg-ink/80 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-6 px-5 sm:px-8">
        <a href="#top" aria-label="Casinova home" className="shrink-0">
          <Image
            src="/brand/casinova-logo.png"
            alt="Casinova"
            width={600}
            height={113}
            priority
            className="h-8 w-auto sm:h-9"
          />
        </a>

        <ul className="hidden items-center gap-1 rounded-full border border-line bg-white/[0.03] p-1 lg:flex">
          {nav.map((n) => (
            <li key={n.href}>
              <a
                href={n.href}
                className="rounded-full px-4 py-2 font-display text-sm font-semibold text-muted transition hover:bg-white/5 hover:text-text"
              >
                {n.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={links.telegram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Join Casinova on Telegram"
            className="hidden h-11 w-11 items-center justify-center rounded-full bg-[#229ed9] text-white shadow-[0_8px_20px_-8px_rgba(34,158,217,0.8)] transition hover:-translate-y-0.5 hover:bg-[#39b8ef] sm:flex"
          >
            <TelegramIcon className="h-5 w-5" />
          </a>
          <a
            href={links.site("nav")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center whitespace-nowrap rounded-full bg-pink px-4 font-display text-xs sm:px-5 sm:text-sm font-extrabold uppercase tracking-wide text-ink shadow-[0_8px_30px_-6px_rgba(144,247,62,0.7)] transition hover:-translate-y-0.5 hover:bg-[#a6ff5c]"
          >
            Play now
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <ul className="space-y-1 border-t border-line px-5 pb-6 pt-3 lg:hidden">
          {nav.map((n) => (
            <li key={n.href}>
              <a
                href={n.href}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-4 py-3 font-display text-lg font-bold uppercase"
              >
                {n.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
