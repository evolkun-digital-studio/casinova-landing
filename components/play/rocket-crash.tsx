"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Rocket } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { SectionTitle } from "../ui";

const STAKES = [10, 25, 50, 100] as const;
const GROWTH = 0.00006; // multiplier = e^(GROWTH * ms)  →  ≈2x at 11.5s
const MAX_CRASH = 50;
const BEST_KEY = "cnv-crash-best";

type Phase = "ready" | "flying" | "cashed" | "crashed";
type Past = { id: number; x: number };

const multAt = (ms: number) => Math.exp(GROWTH * ms);
const msAt = (m: number) => Math.log(m) / GROWTH;
const fmt = (m: number) => `${m.toFixed(2)}x`;

/** crash = max(1, 0.97 / (1 - U)), capped at 50x — about 3% of rounds bust at 1.00x */
function rollCrash() {
  const c = 0.97 / (1 - Math.random());
  return Math.min(MAX_CRASH, Math.max(1, Math.floor(c * 100) / 100));
}

// Flight screen geometry: viewBox matches the 16/10 panel so angles aren't distorted.
const VW = 160;
const VH = 100;
const PAD = 8;

function curve(elapsed: number, mult: number) {
  const tMax = Math.max(8000, elapsed * 1.15);
  const mMax = Math.max(2, 1 + (mult - 1) * 1.25);
  const toXY = (t: number) => {
    const m = multAt(t);
    return [PAD + (t / tMax) * (VW - PAD * 2), VH - PAD - ((m - 1) / (mMax - 1)) * (VH - PAD * 2)] as const;
  };
  const steps = 48;
  const pts: (readonly [number, number])[] = [];
  for (let i = 0; i <= steps; i++) pts.push(toXY((elapsed * i) / steps));
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(2)} ${y.toFixed(2)}`).join(" ");
  const [x, y] = pts[pts.length - 1];
  const [px, py] = toXY(Math.max(0, elapsed - 120));
  const angle = elapsed > 0 ? (Math.atan2(py - y, x - px) * 180) / Math.PI : 0; // degrees above horizontal
  return { d, x, y, angle };
}

export function RocketCrash({
  wallet,
  onWallet,
}: {
  wallet: number;
  /** apply a change to the shared points wallet */
  onWallet: (fn: (w: number) => number) => void;
}) {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("ready");
  const [stake, setStake] = useState<number>(25);
  const [auto, setAuto] = useState("");
  const [mult, setMult] = useState(1);
  const [elapsed, setElapsed] = useState(0);
  const [last, setLast] = useState<number | null>(null);
  const [best, setBest] = useState(0);
  const [past, setPast] = useState<Past[]>([]);
  const [msg, setMsg] = useState<{ text: string; tone: "idle" | "win" | "lose" }>({
    text: "Pick a stake and launch.",
    tone: "idle",
  });

  const raf = useRef(0);
  const tickRef = useRef<() => void>(() => {});
  const phaseRef = useRef<Phase>("ready");
  const round = useRef({ start: 0, crash: 1, stake: 0, auto: 0, id: 0 });

  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only read keeps SSR and client HTML identical
      setBest(Number(localStorage.getItem(BEST_KEY) || 0));
    } catch {}
    return () => cancelAnimationFrame(raf.current);
  }, []);

  const finish = useCallback(
    (outcome: "cashed" | "crashed", at: number) => {
      if (phaseRef.current !== "flying") return; // guards double cash-out / crash
      phaseRef.current = outcome;
      cancelAnimationFrame(raf.current);
      const r = round.current;
      setMult(at);
      setElapsed(msAt(at));
      setPhase(outcome);
      setLast(r.crash);
      setPast((p) => [{ id: r.id, x: r.crash }, ...p].slice(0, 8));
      if (outcome === "cashed") {
        const win = Math.floor(r.stake * at);
        onWallet((w) => w + win);
        setBest((b) => {
          if (win <= b) return b;
          try {
            localStorage.setItem(BEST_KEY, String(win));
          } catch {}
          return win;
        });
        setMsg({ text: `Cashed out at ${fmt(at)} — +${win} pts`, tone: "win" });
      } else {
        setMsg({ text: `Crashed at ${fmt(at)}`, tone: "lose" });
      }
    },
    [onWallet],
  );

  const tick = useCallback(() => {
    const r = round.current;
    const t = performance.now() - r.start;
    const m = multAt(t);
    if (r.auto && r.auto <= r.crash && m >= r.auto) return finish("cashed", r.auto);
    if (m >= r.crash) return finish("crashed", r.crash);
    setMult(m);
    setElapsed(t);
    raf.current = requestAnimationFrame(() => tickRef.current());
  }, [finish]);

  useEffect(() => {
    tickRef.current = tick;
  }, [tick]);

  const autoValue = (() => {
    const v = Number(auto);
    return auto.trim() && Number.isFinite(v) && v >= 1.01 && v <= MAX_CRASH ? v : 0;
  })();

  const launch = () => {
    if (phaseRef.current === "flying" || wallet < stake) return;
    phaseRef.current = "flying";
    onWallet((w) => w - stake);
    round.current = {
      start: performance.now(),
      crash: rollCrash(),
      stake,
      auto: autoValue,
      id: round.current.id + 1,
    };
    setPhase("flying");
    setMult(1);
    setElapsed(0);
    setMsg({ text: "Flying… cash out before it crashes!", tone: "idle" });
    if (round.current.crash <= 1) {
      finish("crashed", 1);
      return;
    }
    raf.current = requestAnimationFrame(tick);
  };

  const cashOut = () => {
    if (phaseRef.current !== "flying") return;
    const m = Math.floor(multAt(performance.now() - round.current.start) * 100) / 100;
    if (m >= round.current.crash) finish("crashed", round.current.crash);
    else finish("cashed", Math.max(1, m));
  };

  const flying = phase === "flying";
  const broke = !flying && wallet < STAKES[0];
  const main = () => (flying ? cashOut() : launch());

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== " ") return;
    const tag = (e.target as HTMLElement).tagName;
    if (tag === "INPUT" || tag === "BUTTON") return; // let native controls handle space
    e.preventDefault();
    if (!broke) main();
  };

  const { d, x, y, angle } = curve(elapsed, mult);
  const crashed = phase === "crashed";

  const stats = [
    { label: "Wallet", value: wallet, color: "text-white" },
    { label: "Last", value: last === null ? "—" : fmt(last), color: "text-white" },
    { label: "Best", value: best, color: "text-gold" },
  ];

  const status = {
    ready: { text: "Ready", cls: "text-muted border-line" },
    flying: { text: "Flying", cls: "text-[#5bc7f2] border-[#229ed9]/60" },
    cashed: { text: "Cashed out", cls: "text-[#f1c66b] border-[#c58a32]/60" },
    crashed: { text: "Crashed", cls: "text-[#ff7a9a] border-[#ff7a9a]/40" },
  }[phase];

  return (
    <div className="grid items-center gap-12 lg:grid-cols-2">
      <div>
        <SectionTitle eyebrow="Quick play · just for fun" eyebrowClassName="!text-[#5bc7f2]">Rocket crash</SectionTitle>
        <p className="mt-5 max-w-sm text-muted">Cash out before the rocket crashes.</p>
        <dl className="mt-8 grid max-w-md grid-cols-3 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-line bg-white/[0.03] px-4 py-3">
              <dt className="text-xs text-subtle">{s.label}</dt>
              <dd className={`mt-1 truncate font-display text-3xl font-black tabular-nums ${s.color}`}>
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

      {/* game panel — focusable so Space works only while it has focus */}
      <div
        tabIndex={0}
        onKeyDown={onKey}
        aria-label="Rocket Crash game. Press Space to launch or cash out."
        className="order-first flex min-w-0 flex-col gap-4 rounded-3xl lg:order-none"
      >
        <div className={`relative aspect-[16/10] overflow-hidden rounded-[24px] border lg:aspect-auto lg:h-[clamp(180px,28vh,290px)] ${crashed ? "border-[#b42318]/60 bg-[#240e0e]" : "border-[#229ed9]/45 bg-[#09283d]"}`}>
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.06] [background-image:repeating-linear-gradient(0deg,#fff_0_1px,transparent_1px_40px),repeating-linear-gradient(90deg,#fff_0_1px,transparent_1px_40px)]"
          />
          <svg viewBox={`0 0 ${VW} ${VH}`} className="absolute inset-0 h-full w-full" preserveAspectRatio="none" aria-hidden>
            <defs>
              <linearGradient id="crash-stroke" x1="0" x2="1" y1="1" y2="0">
                <stop offset="0" stopColor={crashed ? "#8f1d15" : "#1261a0"} />
                <stop offset="1" stopColor={crashed ? "#f06a5f" : "#5bc7f2"} />
              </linearGradient>
              <filter id="crash-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" />
              </filter>
            </defs>
            {elapsed > 0 && (
              <>
                <path d={d} fill="none" stroke={crashed ? "#d13a2d" : "#229ed9"} strokeOpacity={0.55} strokeWidth={2.5} filter="url(#crash-glow)" />
                <path d={d} fill="none" stroke="url(#crash-stroke)" strokeWidth={3} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              </>
            )}
          </svg>

          {/* rocket rides the tip; lucide Rocket points up-right (45°) by default */}
          {!crashed && (
            <div
              aria-hidden
              className="absolute -translate-x-1/2 -translate-y-1/2 text-[#5bc7f2] drop-shadow-[0_0_8px_rgba(34,158,217,0.7)]"
              style={{ left: `${(x / VW) * 100}%`, top: `${(y / VH) * 100}%`, transform: `translate(-50%,-50%) rotate(${45 - angle}deg)` }}
            >
              <Rocket className="h-7 w-7" />
            </div>
          )}

          <span
            className={`absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border bg-black/35 px-3 py-1 font-display text-[11px] font-bold uppercase tracking-wider ${status.cls}`}
          >
            {flying && <span className={`h-1.5 w-1.5 rounded-full bg-[#5bc7f2] ${reduce ? "" : "animate-pulse"}`} />}
            {status.text}
          </span>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.p
              animate={crashed && !reduce ? { x: [0, -10, 10, -6, 6, 0] } : { x: 0 }}
              transition={{ duration: 0.4 }}
              className={`font-display text-[clamp(44px,7vh,64px)] font-black leading-none tabular-nums ${
                phase === "cashed" ? "text-lime" : crashed ? "text-[#ff7a9a]" : "text-white"
              }`}
            >
              {fmt(mult)}
            </motion.p>
            {crashed && <p className="mt-2 font-display text-sm font-black tracking-[0.3em] text-[#ff7a9a]">CRASHED</p>}
          </div>

          <AnimatePresence>
            {crashed && !reduce && (
              <motion.div
                key={`flash-${past[0]?.id ?? 0}`}
                aria-hidden
                initial={{ opacity: 0.2 }}
                animate={{ opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="pointer-events-none absolute inset-0 bg-[#ff3b5c]"
              />
            )}
          </AnimatePresence>
        </div>

        <ul className="flex min-h-7 flex-wrap items-center gap-1.5" aria-label="Last crash points">
          <AnimatePresence initial={false}>
            {past.map((p) => (
              <motion.li
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                className={`rounded-full px-2.5 py-1 font-display text-[11px] font-black tabular-nums ${
                  p.x >= 2 ? "bg-lime/15 text-lime" : p.x >= 1.2 ? "bg-cyan/15 text-cyan" : "bg-[#ff7a9a]/15 text-[#ff7a9a]"
                }`}
              >
                {fmt(p.x)}
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Stake">
          {STAKES.map((s) => (
            <button
              key={s}
              onClick={() => setStake(s)}
              disabled={flying}
              aria-label={`Stake ${s} points`}
              aria-pressed={stake === s}
                className={`h-11 min-w-11 rounded-full px-4 font-display text-sm font-extrabold tabular-nums transition disabled:cursor-not-allowed disabled:opacity-60 ${
                stake === s ? "bg-[#1261a0] text-white" : "border border-[#229ed9]/35 bg-[#0f3c59] text-[#c9edff] hover:bg-[#145273]"
              }`}
            >
              {s}
            </button>
          ))}
          <label className="ml-auto flex h-11 items-center gap-2 text-sm text-muted">
            Auto cash-out at
            <input
              type="number"
              inputMode="decimal"
              min={1.01}
              max={MAX_CRASH}
              step={0.01}
              placeholder="2.00"
              value={auto}
              onChange={(e) => setAuto(e.target.value)}
              disabled={flying}
              className="h-11 w-20 rounded-xl border border-line bg-ink-2 px-2 text-center font-display font-bold tabular-nums text-text disabled:opacity-60"
            />
            x
          </label>
        </div>

        <p
          role="status"
          aria-live="polite"
          className={`min-h-6 font-display font-bold ${
                msg.tone === "win" ? "text-[#5bc7f2]" : msg.tone === "lose" ? "text-[#ff7a9a]" : "text-muted"
          }`}
        >
          {broke ? "Out of points — refill" : msg.text}
        </p>

        {broke ? (
          <button
            onClick={() => onWallet(() => 1000)}
            className="inline-flex h-14 w-full items-center justify-center rounded-full bg-gold px-8 font-display text-sm font-extrabold uppercase tracking-wide text-ink transition hover:-translate-y-0.5 sm:w-auto"
          >
            Refill to 1000 points
          </button>
        ) : (
          <button
            onClick={main}
            disabled={!flying && wallet < stake}
            className={`inline-flex h-14 w-full items-center justify-center gap-2 rounded-full px-8 font-display text-sm font-extrabold uppercase tracking-wide text-ink transition hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto ${
              crashed ? "bg-[#b42318] text-white shadow-[0_12px_34px_-8px_rgba(180,35,24,0.65)]" : flying ? "bg-[#229ed9] text-white shadow-[0_12px_34px_-8px_rgba(34,158,217,0.65)]" : "bg-[#1261a0] text-white shadow-[0_12px_34px_-8px_rgba(18,97,160,0.65)]"
            }`}
          >
            {flying ? `Cash out (+${Math.floor(stake * mult)} pts)` : "Launch"}
          </button>
        )}
        <p className="text-xs text-subtle">Free to play · points only, no real money</p>
      </div>
    </div>
  );
}
