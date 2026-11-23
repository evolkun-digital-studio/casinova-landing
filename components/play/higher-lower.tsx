"use client";

import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, ChevronUp, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { SectionTitle } from "../ui";

const RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const SUITS = ["♠", "♥", "♦", "♣"];
type Card = { r: number; s: number; id: number };

let uid = 0;
const draw = (): Card => ({ r: 1 + Math.floor(Math.random() * 13), s: Math.floor(Math.random() * 4), id: ++uid });

function PlayingCard({ card }: { card: Card }) {
  const red = card.s === 1 || card.s === 2;
  return (
    <motion.div
      key={card.id}
      initial={{ rotateY: 90, opacity: 0 }}
      animate={{ rotateY: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={`relative flex h-[200px] w-[140px] items-center justify-center rounded-2xl bg-[#fffdf8] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] ring-1 ring-[#d9cdbd] ${
        red ? "text-[#b42318]" : "text-[#171411]"
      }`}
      aria-label={`${RANKS[card.r - 1]} of ${["spades", "hearts", "diamonds", "clubs"][card.s]}`}
      role="img"
    >
      <span className="absolute left-3 top-2.5 text-center font-display text-2xl font-black leading-none">
        {RANKS[card.r - 1]}
        <span className="block text-lg">{SUITS[card.s]}</span>
      </span>
      <span className="text-7xl leading-none">{SUITS[card.s]}</span>
      <span className="absolute bottom-2.5 right-3 rotate-180 text-center font-display text-2xl font-black leading-none">
        {RANKS[card.r - 1]}
        <span className="block text-lg">{SUITS[card.s]}</span>
      </span>
    </motion.div>
  );
}

export function HigherLower({
  onGain,
  onScore,
}: {
  /** points won this guess, added to the shared wallet */
  onGain?: (points: number) => void;
  /** current run score, used for the Telegram nudge */
  onScore?: (score: number) => void;
}) {
  const [card, setCard] = useState<Card | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(1);
  const [best, setBest] = useState(0);
  const [busy, setBusy] = useState(false);
  const [history, setHistory] = useState<Card[]>([]);
  const [flash, setFlash] = useState<"none" | "win" | "lose">("none");
  const [msg, setMsg] = useState<{ text: string; tone: "idle" | "win" | "lose" }>({
    text: "Will the next card be higher or lower?",
    tone: "idle",
  });

  // draw on the client only, to keep server and client HTML identical
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only init keeps SSR and client HTML identical
    setCard(draw());
    try {
      setBest(Number(localStorage.getItem("cnv-best") || 0));
    } catch {}
  }, []);

  const settle = (tone: "win" | "lose" | "none") => {
    setFlash(tone);
    setBusy(true);
    window.setTimeout(() => {
      setBusy(false);
      setFlash("none");
    }, 550);
  };

  const guess = (dir: "hi" | "lo") => {
    if (!card || busy) return;
    setHistory((h) => [card, ...h].slice(0, 6));
    let next = draw();
    while (next.r === card.r && next.s === card.s) next = draw();
    if (next.r === card.r) {
      setCard(next);
      setMsg({ text: `Same rank — push, streak kept.`, tone: "idle" });
      settle("none");
      return;
    }
    const right = dir === "hi" ? next.r > card.r : next.r < card.r;
    setCard(next);
    if (right) {
      const gain = 10 * streak;
      const total = score + gain;
      setScore(total);
      onGain?.(gain);
      onScore?.(total);
      setStreak((s) => Math.min(s + 1, 10));
      if (total > best) {
        setBest(total);
        try {
          localStorage.setItem("cnv-best", String(total));
        } catch {}
      }
      setMsg({ text: `+${gain} points — keep going!`, tone: "win" });
      settle("win");
    } else {
      setScore(0);
      setStreak(1);
      setMsg({ text: `It was ${RANKS[next.r - 1]}. Streak lost — try again.`, tone: "lose" });
      settle("lose");
    }
  };

  const reset = () => {
    setScore(0);
    setStreak(1);
    setCard(draw());
    setHistory([]);
    setMsg({ text: "Fresh deck. Higher or lower?", tone: "idle" });
  };

  const stats = [
    { label: "Points", value: score, color: "text-lime" },
    { label: "Streak", value: `x${streak}`, color: "text-cyan" },
    { label: "Best", value: best, color: "text-gold" },
  ];

  return (
    <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <SectionTitle eyebrow="Quick play · just for fun" eyebrowClassName="!text-[#5bc7f2]">
                  <span>
                    Higher <span className="text-pink-grad">or lower?</span>
                  </span>
                </SectionTitle>
                <p className="mt-5 max-w-sm text-muted">Guess the next card. Build a streak to multiply your points.</p>
                <dl className="mt-8 grid max-w-md grid-cols-3 gap-3">
                  {stats.map((s) => (
                    <div key={s.label} className="rounded-2xl border border-line bg-white/[0.03] px-4 py-3">
                      <dt className="text-xs text-subtle">{s.label}</dt>
                      <dd className={`mt-1 font-display text-3xl font-black tabular-nums ${s.color}`}>
                        <motion.span
                          key={String(s.value)}
                          initial={{ scale: 1.35, opacity: 0.4 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 420, damping: 18 }}
                          className="inline-block"
                        >
                          {s.value}
                        </motion.span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="flex flex-col items-center gap-6">
                <motion.div
                  animate={
                    flash === "lose"
                      ? { x: [0, -10, 10, -6, 6, 0] }
                      : flash === "win"
                        ? { scale: [1, 1.04, 1] }
                        : { x: 0, scale: 1 }
                  }
                  transition={{ duration: 0.45 }}
                  className={`flex items-center gap-6 rounded-3xl p-3 transition-shadow duration-300 [perspective:900px] ${
                    flash === "win"
                      ? "shadow-[0_0_0_2px_rgba(90,218,46,0.7),0_0_60px_rgba(90,218,46,0.35)]"
                      : flash === "lose"
                        ? "shadow-[0_0_0_2px_rgba(255,122,154,0.7),0_0_60px_rgba(255,46,100,0.3)]"
                        : ""
                  }`}
                >
                  <AnimatePresence mode="popLayout">
                    {card ? <PlayingCard key={card.id} card={card} /> : <div className="h-[200px] w-[140px] rounded-2xl bg-white/5" />}
                  </AnimatePresence>
                  <div
                    aria-hidden
                    className="flex h-[200px] w-[140px] items-center justify-center rounded-2xl border border-[#b42318]/60 bg-[repeating-linear-gradient(45deg,#b42318_0_10px,#8f1d15_10px_20px)] shadow-[inset_0_0_0_8px_#fffdf8,inset_0_0_0_9px_#b42318]"
                  >
                    <svg viewBox="0 0 24 24" className="h-12 w-12 fill-gold">
                      <path d="M12 2C9 6 4 9 4 13a4 4 0 0 0 6.5 3.1L9 21h6l-1.5-4.9A4 4 0 0 0 20 13c0-4-5-7-8-11z" />
                    </svg>
                  </div>
                </motion.div>

                <ul className="flex h-9 items-center gap-1.5" aria-label="Previous cards">
                  {history.map((h) => (
                    <motion.li
                      key={h.id}
                      layout
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`flex h-9 w-7 items-center justify-center rounded-md bg-[#fffdf8] font-display text-[11px] font-black leading-none ring-1 ring-[#d9cdbd] ${
                        h.s === 1 || h.s === 2 ? "text-[#b42318]" : "text-[#171411]"
                      }`}
                    >
                      {RANKS[h.r - 1]}
                      {SUITS[h.s]}
                    </motion.li>
                  ))}
                </ul>

                <p
                  role="status"
                  aria-live="polite"
                  className={`min-h-6 text-center font-display font-bold ${
                    msg.tone === "win" ? "text-lime" : msg.tone === "lose" ? "text-[#ff7a9a]" : "text-muted"
                  }`}
                >
                  {msg.text}
                </p>

                <div className="flex w-full max-w-[296px] flex-wrap justify-center gap-3">
                  <button
                    onClick={() => guess("hi")}
                    disabled={busy || !card}
                    className="inline-flex h-11 items-center gap-2 rounded-full bg-[#b42318] px-6 font-display text-xs font-extrabold uppercase tracking-wide text-white shadow-[0_10px_24px_-8px_rgba(180,35,24,0.55)] transition hover:-translate-y-0.5 hover:bg-[#d13a2d] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <ChevronUp className="h-5 w-5" />
                    Higher
                  </button>
                  <button
                    onClick={() => guess("lo")}
                    disabled={busy || !card}
                    className="inline-flex h-11 items-center gap-2 rounded-full border border-[#d9cdbd] bg-[#f6efe3] px-6 font-display text-xs font-extrabold uppercase tracking-wide text-[#302820] transition hover:-translate-y-0.5 hover:bg-[#fffaf2] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <ChevronDown className="h-5 w-5" />
                    Lower
                  </button>
                  <button
                    onClick={reset}
                    aria-label="Restart game"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-[#8e7e6e] text-[#d9cdbd] transition hover:border-[#f1c66b] hover:text-[#f1c66b]"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-xs text-subtle">Free to play · points only, no real money</p>
              </div>
    </div>
  );
}
