"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { links } from "@/lib/content";
import { TelegramIcon } from "./brand-icons";
import { HeroVisual } from "./hero-visual";

const EASE = [0.22, 1, 0.36, 1] as const;
const NAV_H = "72px";

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: EASE },
});

export function Hero() {
  return (
    <section
      id="top"
      className="grain relative isolate overflow-hidden"
      style={{ paddingTop: NAV_H }}
      aria-labelledby="hero-title"
    >
      {/* background: faint dotted grid that fades towards the edges */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-[0.05] [background-image:radial-gradient(circle,#fff_1px,transparent_1.5px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,#000_30%,transparent_75%)]"
      />

      <div
        className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-16 pt-8 sm:px-8 lg:grid-cols-[45fr_55fr] lg:gap-6 lg:pb-10 lg:pt-0"
        style={{ minHeight: `calc(100svh - ${NAV_H})` }}
      >
        {/* text */}
        <div className="order-2 text-center lg:order-1 lg:text-left">
          <motion.p
            {...rise(0)}
            className="inline-flex items-center gap-2.5 font-display text-[11px] font-medium uppercase tracking-[0.3em] text-muted"
          >
            Live casino &amp; sports
          </motion.p>

          <motion.h1
            id="hero-title"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
            className="mt-6 font-sans text-[clamp(40px,5.2vw,76px)] leading-[1.02] tracking-[-0.03em]"
          >
            <span className="block font-light text-white">The table</span>{" "}
            <span className="relative inline-block font-light text-lime">
              is live.
              <motion.span
                aria-hidden
                className="absolute -bottom-1 left-0 h-[2px] w-full origin-left bg-lime"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.9, delay: 0.6, ease: EASE }}
              />
            </span>
            <span className="sr-only"> — Casinova online casino and sports betting</span>
          </motion.h1>

          <motion.p {...rise(0.25)} className="mt-6 text-base font-normal text-muted">
            Roulette, teen patti, blackjack &amp; sports — one tap away.
          </motion.p>

          <motion.div {...rise(0.35)} className="mt-9 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <a
              href={links.site("hero")}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex h-[52px] items-center gap-2 rounded-full bg-pink px-7 font-display text-[15px] font-semibold text-ink shadow-[0_14px_40px_-12px_rgba(144,247,62,0.7)] transition hover:-translate-y-0.5 hover:bg-[#a6ff5c]"
            >
              Visit live site
              <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            <a
              href="#bonus"
              className="inline-flex h-[52px] items-center gap-2 rounded-full border border-lime/40 px-6 font-display text-[15px] font-semibold text-lime transition hover:-translate-y-0.5 hover:border-lime/70 hover:bg-lime/5"
            >
              <TelegramIcon className="h-4 w-4" />
              Join Telegram for more bonus
            </a>
          </motion.div>

        </div>

        {/* visual */}
        <div className="order-1 lg:order-2">
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}
