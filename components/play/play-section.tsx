"use client";

import { AnimatePresence, motion } from "motion/react";
import { Coins } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { links } from "@/lib/content";
import { TelegramIcon } from "../brand-icons";
import { Reveal } from "../ui";
import { HigherLower } from "./higher-lower";
import { RocketCrash } from "./rocket-crash";

const WALLET_KEY = "cnv-points";
const START_POINTS = 1000;

const games = [
  { id: "higher-lower", label: "Higher or Lower" },
  { id: "rocket-crash", label: "Rocket Crash" },
] as const;
type GameId = (typeof games)[number]["id"];

export function PlaySection() {
  const [game, setGame] = useState<GameId>("higher-lower");
  const [wallet, setWallet] = useState(START_POINTS);
  const [loaded, setLoaded] = useState(false);
  const [hlTop, setHlTop] = useState(0);

  // read storage on the client only, so server and client HTML match
  useEffect(() => {
    try {
      const raw = localStorage.getItem(WALLET_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only read keeps SSR and client HTML identical
      if (raw !== null && Number.isFinite(Number(raw))) setWallet(Number(raw));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(WALLET_KEY, String(wallet));
    } catch {}
  }, [wallet, loaded]);

  const updateWallet = useCallback((fn: (w: number) => number) => setWallet((w) => Math.max(0, fn(w))), []);
  const addPoints = useCallback((n: number) => setWallet((w) => w + n), []);
  const trackScore = useCallback((s: number) => setHlTop((t) => Math.max(t, s)), []);

  const nudge = wallet > 2000 || hlTop >= 200;

  return (
    <section id="play" className="relative scroll-mt-20 py-20 sm:py-28 lg:py-16" aria-labelledby="play-title">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-[32px] border border-[#a69b8b]/30 bg-gradient-to-b from-[#32302d] to-[#1c1b1a] p-7 sm:p-12 lg:px-12 lg:py-8">
            <div aria-hidden className="absolute -left-32 -top-32 -z-10 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(197,138,50,0.16),transparent_65%)]" />

            <div className="mb-10 flex flex-wrap lg:mb-6 items-center justify-between gap-4">
              <h2 id="play-title" className="sr-only">
                Play free
              </h2>
              <div role="tablist" aria-label="Free games" className="flex rounded-full border border-[#c58a32]/30 bg-[#171310] p-1">
                {games.map((g) => (
                  <button
                    key={g.id}
                    role="tab"
                    id={`tab-${g.id}`}
                    aria-selected={game === g.id}
                    aria-controls="play-panel"
                    onClick={() => setGame(g.id)}
                    className={`relative h-11 rounded-full px-5 font-display text-sm font-extrabold uppercase tracking-wide transition sm:px-6 ${
                      game === g.id ? "text-ink" : "text-muted hover:text-text"
                    }`}
                  >
                    {game === g.id && (
                      <motion.span
                        layoutId="play-tab-pill"
                        className="absolute inset-0 rounded-full bg-[#d5a34a] shadow-[0_8px_24px_-6px_rgba(197,138,50,.45)]"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className="relative">{g.label}</span>
                  </button>
                ))}
              </div>
              <p className="flex items-center gap-2 rounded-full border border-[#c58a32]/25 bg-white/[0.05] px-4 py-2 font-display text-sm font-bold">
                <Coins className="h-4 w-4 text-gold" />
                <span className="text-[#cdbda6]">Total points</span>
                <span className="tabular-nums text-white">{wallet}</span>
              </p>
            </div>

            <div id="play-panel" role="tabpanel" aria-labelledby={`tab-${game}`}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={game}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                >
                  {game === "higher-lower" ? (
                    <HigherLower onGain={addPoints} onScore={trackScore} />
                  ) : (
                    <RocketCrash wallet={wallet} onWallet={updateWallet} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {nudge && (
              <a
                href={links.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#f1c66b] hover:underline"
              >
                <TelegramIcon className="h-4 w-4" />
                Nice run! Claim your real joining bonus on Telegram →
              </a>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
