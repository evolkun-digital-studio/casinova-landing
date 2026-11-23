"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Play, Users } from "lucide-react";
import { motion, useReducedMotion, type PanInfo } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { casinoGames, links, sports } from "@/lib/content";
import { GameTag } from "./ui";

type Slide = {
  name: string;
  sub: string;
  img: string;
  href: string;
  players?: number;
  tag?: string;
  wide?: boolean;
};

const slides: Slide[] = [
  ...casinoGames.map((g) => ({
    name: g.name,
    sub: g.provider,
    img: g.img,
    href: links.casino,
    players: g.players,
    tag: g.tag,
  })),
  ...sports.slice(0, 2).map((s) => ({
    name: s.name,
    sub: "Sports betting",
    img: s.img,
    href: links.site("hero-sports"),
    tag: "LIVE",
    wide: true,
  })),
];

const N = slides.length;

/** shortest signed distance from the active slide, so the ring loops */
function offsetOf(i: number, active: number) {
  let d = i - active;
  if (d > N / 2) d -= N;
  if (d < -N / 2) d += N;
  return d;
}

export function HeroCarousel() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [step, setStep] = useState(210); // px between cards; smaller on phones

  useEffect(() => {
    const fit = () => setStep(window.innerWidth < 640 ? 118 : window.innerWidth < 1024 ? 170 : 210);
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  const go = useCallback((dir: number) => setActive((a) => (a + dir + N) % N), []);

  useEffect(() => {
    if (paused || reduce) return;
    const t = setInterval(() => go(1), 3200);
    return () => clearInterval(t);
  }, [paused, reduce, go]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -50) go(1);
    else if (info.offset.x > 50) go(-1);
  };

  const current = slides[active];

  return (
    <div
      className="relative z-10 mx-auto mt-8 max-w-7xl select-none px-5 sm:mt-10"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured games"
    >
      {/* glow under the active card */}
      <div aria-hidden className="absolute left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(144,247,62,0.35),transparent_65%)] blur-2xl" />

      <motion.div
        className="relative h-[330px] cursor-grab touch-pan-y [perspective:1400px] active:cursor-grabbing sm:h-[420px]"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.15}
        onDragEnd={onDragEnd}
      >
        {slides.map((s, i) => {
          const o = offsetOf(i, active);
          const abs = Math.abs(o);
          const hidden = abs > 3;
          const isActive = o === 0;
          return (
            <motion.div
              key={s.name}
              className="absolute left-1/2 top-1/2 [transform-style:preserve-3d]"
              initial={false}
              animate={{
                x: `calc(-50% + ${o * step}px)`,
                y: "-50%",
                rotateY: reduce ? 0 : o * -22,
                scale: isActive ? 1 : 1 - abs * 0.11,
                opacity: hidden ? 0 : 1,
                filter: isActive ? "brightness(1)" : `brightness(${1 - abs * 0.2})`,
              }}
              transition={{ type: "spring", stiffness: 160, damping: 24, mass: 0.9 }}
              style={{ zIndex: 20 - abs, pointerEvents: hidden ? "none" : "auto" }}
              aria-hidden={!isActive}
            >
              <button
                type="button"
                tabIndex={isActive ? -1 : 0}
                onClick={() => !isActive && setActive(i)}
                className="block"
                aria-label={isActive ? undefined : `Show ${s.name}`}
              >
                <div
                  className={`relative h-[260px] w-[170px] overflow-hidden rounded-[26px] border bg-panel sm:h-[340px] sm:w-[220px] ${
                    isActive
                      ? "border-pink/60 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9),0_0_0_6px_rgba(144,247,62,0.12)]"
                      : "border-white/10 shadow-[0_30px_60px_-25px_rgba(0,0,0,0.9)]"
                  }`}
                >
                  <div className="relative h-[calc(100%-56px)]">
                    <Image
                      src={s.img}
                      alt={`${s.name} on Casinova`}
                      fill
                      sizes="(min-width:640px) 220px, 170px"
                      className={s.wide ? "object-cover object-[50%_20%]" : "object-cover object-top"}
                      priority={abs <= 1}
                      draggable={false}
                    />
                    {s.tag && (
                      <div className="absolute left-3 top-3">
                        <GameTag tag={s.tag} />
                      </div>
                    )}
                  </div>
                  <div className="flex h-14 items-center justify-between gap-2 border-t border-white/10 bg-gradient-to-b from-panel-2 to-panel px-3 text-left">
                    <div className="min-w-0">
                      <p className="truncate font-display text-[13px] font-black uppercase leading-tight">{s.name}</p>
                      <p className="truncate text-[11px] text-subtle">{s.sub}</p>
                    </div>
                    {s.players !== undefined && (
                      <span className="flex shrink-0 items-center gap-1 rounded-full bg-lime/10 px-2 py-1 text-[11px] font-semibold text-lime">
                        <Users className="h-3 w-3" />
                        {s.players}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            </motion.div>
          );
        })}
      </motion.div>

      {/* controls */}
      <div className="relative z-30 mt-4 flex items-center justify-center gap-4 sm:mt-2">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous game"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] transition hover:border-pink/50 hover:text-pink"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <a
          href={current.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 min-w-[200px] items-center justify-center gap-2 rounded-full border border-pink/40 bg-pink/10 px-5 font-display text-xs font-extrabold uppercase tracking-wide text-pink-soft transition hover:bg-pink/20"
          aria-live="polite"
        >
          <Play className="h-3.5 w-3.5 fill-current" />
          Play {current.name}
        </a>

        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next game"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] transition hover:border-pink/50 hover:text-pink"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-4 flex justify-center gap-1.5" aria-hidden>
        {slides.map((s, i) => (
          <span
            key={s.name}
            className={`h-1.5 rounded-full transition-all duration-500 ${i === active ? "w-6 bg-pink" : "w-1.5 bg-white/20"}`}
          />
        ))}
      </div>
    </div>
  );
}

/** Short section directly under the hero that hosts the carousel. */
export function FeaturedGames() {
  return (
    <section aria-labelledby="featured-title" className="relative overflow-x-clip pb-16 pt-4 sm:pb-20">
      <p
        id="featured-title"
        className="text-center font-display text-[11px] font-medium uppercase tracking-[0.3em] text-muted"
      >
        Featured games
      </p>
      <HeroCarousel />
    </section>
  );
}
