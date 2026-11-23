"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Cherry, Gift, Radio, Rocket, Spade, Trophy, Users, Zap } from "lucide-react";
import { useState, type MouseEvent } from "react";
import { casinoGames, categories, links, sports } from "@/lib/content";
import { GameTag, Reveal, SectionTitle } from "./ui";

const catIcons = {
  slots: Cherry,
  live: Radio,
  crash: Rocket,
  shows: Gift,
  cards: Spade,
  sports: Trophy,
  turbo: Zap,
};
const catColors = ["text-pink", "text-cyan", "text-orange", "text-gold", "text-lime", "text-violet", "text-pink-soft"];

function tilt(e: MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width - 0.5;
  const y = (e.clientY - r.top) / r.height - 0.5;
  el.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-6px)`;
}
function untilt(e: MouseEvent<HTMLElement>) {
  e.currentTarget.style.transform = "";
}

export function Games() {
  const [tab, setTab] = useState<"casino" | "sports">("casino");

  return (
    <section id="games" className="relative py-20 sm:py-28" aria-labelledby="games-title">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* category chips */}
        <Reveal>
          <ul className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0">
            {categories.map((c, i) => {
              const Icon = catIcons[c.emoji];
              return (
                <li key={c.label} className="shrink-0">
                  <a
                    href={links.casino}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-xl border border-line bg-panel/70 px-4 py-3 font-display text-sm font-bold transition hover:border-pink/40 hover:bg-panel-2"
                  >
                    <Icon className={`h-4 w-4 ${catColors[i]}`} />
                    {c.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </Reveal>

        <div className="mt-16 flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <SectionTitle eyebrow="Top picks">
              <span id="games-title">Pick your game</span>
            </SectionTitle>
          </Reveal>
          <Reveal delay={0.1}>
            <div role="tablist" aria-label="Game type" className="flex rounded-full border border-line bg-panel p-1">
              {(["casino", "sports"] as const).map((t) => (
                <button
                  key={t}
                  role="tab"
                  aria-selected={tab === t}
                  onClick={() => setTab(t)}
                  className={`relative h-11 rounded-full px-6 font-display text-sm font-extrabold uppercase tracking-wide transition ${
                    tab === t ? "text-ink" : "text-muted hover:text-text"
                  }`}
                >
                  {tab === t && (
                    <motion.span
                      layoutId="tab-pill"
                      className="absolute inset-0 rounded-full bg-pink shadow-[0_8px_24px_-6px_rgba(144,247,62,.7)]"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative">{t}</span>
                </button>
              ))}
            </div>
          </Reveal>
        </div>

        <AnimatePresence mode="wait">
          {tab === "casino" ? (
            <motion.ul
              key="casino"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
            >
              {casinoGames.map((g) => (
                <li key={g.name}>
                  <a
                    href={links.casino}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseMove={tilt}
                    onMouseLeave={untilt}
                    className="group block overflow-hidden rounded-3xl border border-line bg-gradient-to-b from-panel-2 to-panel p-2 transition-[transform,border-color] duration-300 ease-out hover:border-pink/50"
                  >
                    <div className="relative aspect-[204/328] overflow-hidden rounded-2xl">
                      <Image
                        src={g.img}
                        alt={`${g.name} – ${g.provider} on Casinova`}
                        fill
                        sizes="(min-width:1024px) 200px, (min-width:640px) 30vw, 45vw"
                        className="object-cover transition duration-700 group-hover:scale-105"
                      />
                      {g.tag && (
                        <div className="absolute left-2 top-2">
                          <GameTag tag={g.tag} />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between px-2 pb-1 pt-3">
                      <div className="min-w-0">
                        <p className="truncate font-display text-sm font-extrabold uppercase">{g.name}</p>
                        <p className="text-xs text-subtle">{g.provider}</p>
                      </div>
                      <span className="flex shrink-0 items-center gap-1 rounded-full bg-lime/10 px-2 py-1 text-[11px] font-semibold text-lime">
                        <Users className="h-3 w-3" />
                        {g.players}
                      </span>
                    </div>
                  </a>
                </li>
              ))}
            </motion.ul>
          ) : (
            <motion.ul
              key="sports"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
            >
              {sports.map((s) => (
                <li key={s.name}>
                  <a
                    href={links.site("sports")}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseMove={tilt}
                    onMouseLeave={untilt}
                    className="group relative block aspect-[330/214] overflow-hidden rounded-3xl border border-line transition-[transform,border-color] duration-300 hover:border-cyan/50"
                  >
                    <Image
                      src={s.img}
                      alt={`${s.name} betting on Casinova`}
                      fill
                      sizes="(min-width:1024px) 300px, (min-width:640px) 45vw, 90vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/10 to-transparent" />
                    <div className="absolute inset-x-5 bottom-4 flex items-center justify-between">
                      <span className="font-display text-xl font-black uppercase">{s.name}</span>
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cyan text-ink">
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </div>
                  </a>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
