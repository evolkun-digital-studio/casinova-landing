"use client";

import Image from "next/image";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from "motion/react";
import type { CSSProperties, PointerEvent } from "react";
import { Coin } from "./brand-icons";
import { GameTag } from "./ui";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ---------------------------------------------------------------- wheel */

// European single-zero wheel order, clockwise from 0
const ORDER = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
const C = 220; // centre of the 440 viewBox
const R_RIM = 218;
const R_TRACK = 200; // ball track outer edge
const R_POCKET_OUT = 184;
const R_POCKET_IN = 140;
const R_NUM = 168;
export const BALL_R = 192; // ball orbit radius in viewBox units

// Keep SVG attributes byte-for-byte identical between the server and client.
// React can otherwise serialize the same floating-point value with different
// final digits during hydration.
const svgNumber = (value: number) => value.toFixed(6).replace(/\.?0+$/, "");

const polar = (r: number, deg: number) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [C + r * Math.cos(a), C + r * Math.sin(a)] as const;
};

function pocketPath(i: number) {
  const step = 360 / ORDER.length;
  const a0 = i * step - step / 2;
  const a1 = a0 + step;
  const [x0, y0] = polar(R_POCKET_OUT, a0);
  const [x1, y1] = polar(R_POCKET_OUT, a1);
  const [x2, y2] = polar(R_POCKET_IN, a1);
  const [x3, y3] = polar(R_POCKET_IN, a0);
  return `M${svgNumber(x0)} ${svgNumber(y0)} A${R_POCKET_OUT} ${R_POCKET_OUT} 0 0 1 ${svgNumber(x1)} ${svgNumber(y1)} L${svgNumber(x2)} ${svgNumber(y2)} A${R_POCKET_IN} ${R_POCKET_IN} 0 0 0 ${svgNumber(x3)} ${svgNumber(y3)}Z`;
}

function RouletteWheel() {
  const step = 360 / ORDER.length;
  return (
    <svg viewBox="0 0 440 440" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="rim-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff1b8" />
          <stop offset=".3" stopColor="#e8b93a" />
          <stop offset=".55" stopColor="#8a5a08" />
          <stop offset=".8" stopColor="#f2cf6a" />
          <stop offset="1" stopColor="#a8700f" />
        </linearGradient>
        <radialGradient id="bowl" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#1a221a" />
          <stop offset="1" stopColor="#050705" />
        </radialGradient>
        <radialGradient id="turret" cx=".4" cy=".35" r=".7">
          <stop offset="0" stopColor="#fff3b0" />
          <stop offset=".45" stopColor="#e8b93a" />
          <stop offset="1" stopColor="#6b4506" />
        </radialGradient>
      </defs>

      {/* gold rim + ball track */}
      <circle cx={C} cy={C} r={R_RIM} fill="url(#rim-gold)" />
      <circle cx={C} cy={C} r={R_TRACK} fill="#0b0f0b" />
      <circle cx={C} cy={C} r={R_TRACK - 2} fill="none" stroke="#ffffff" strokeOpacity=".06" strokeWidth="1" />

      {/* pockets */}
      {ORDER.map((n, i) => (
        <path
          key={n}
          d={pocketPath(i)}
          fill={n === 0 ? "#27b52a" : i % 2 ? "#8b1a1a" : "#0b0f0b"}
          stroke="#e8b93a"
          strokeOpacity=".85"
          strokeWidth="1"
        />
      ))}
      {ORDER.map((n, i) => {
        const [x, y] = polar(R_NUM, i * step);
        return (
          <text
            key={`t${n}`}
            x={svgNumber(x)}
            y={svgNumber(y)}
            fill="#fff"
            fontSize="10"
            fontWeight="600"
            fontFamily="Montserrat, sans-serif"
            textAnchor="middle"
            dominantBaseline="central"
            transform={`rotate(${svgNumber(i * step)} ${svgNumber(x)} ${svgNumber(y)})`}
          >
            {n}
          </text>
        );
      })}

      {/* inner bowl */}
      <circle cx={C} cy={C} r={R_POCKET_IN} fill="url(#bowl)" stroke="#e8b93a" strokeOpacity=".6" strokeWidth="1.5" />
      <circle cx={C} cy={C} r={R_POCKET_IN - 26} fill="none" stroke="#e8b93a" strokeOpacity=".15" />

      {/* turret: 4 spokes + cone */}
      {[0, 90, 180, 270].map((a) => {
        const [x, y] = polar(84, a);
        return (
          <g key={a}>
            <line x1={C} y1={C} x2={x} y2={y} stroke="url(#rim-gold)" strokeWidth="5" strokeLinecap="round" />
            <circle cx={x} cy={y} r="7" fill="url(#turret)" />
          </g>
        );
      })}
      <circle cx={C} cy={C} r="34" fill="url(#turret)" />
      <circle cx={C} cy={C} r="18" fill="url(#rim-gold)" stroke="#6b4506" strokeOpacity=".5" />
      <circle cx={C - 5} cy={C - 6} r="5" fill="#fff8d6" opacity=".7" />
    </svg>
  );
}

/* ---------------------------------------------------------------- chips */

function Chip({ base, edge, className, style }: { base: string; edge: string; className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 64 64" className={className} style={style} aria-hidden>
      <circle cx="32" cy="32" r="30" fill={base} />
      <circle cx="32" cy="32" r="27" fill="none" stroke={edge} strokeWidth="6" strokeDasharray="10.6 10.6" />
      <circle cx="32" cy="32" r="19" fill="none" stroke={edge} strokeOpacity=".7" strokeWidth="1.5" strokeDasharray="3 3" />
      <circle cx="32" cy="32" r="14" fill={base} stroke={edge} strokeOpacity=".9" strokeWidth="1.5" />
    </svg>
  );
}

/* ---------------------------------------------------------------- cards */

const cards = [
  { name: "Roulette", img: "/games/roulette.jpg", tag: "LIVE", players: 37, r: "-8deg", delay: 0, pos: "left-0 top-[2%] sm:left-[2%]", depth: 1 },
  { name: "Teen Patti", img: "/games/teen-patti.jpg", tag: "HOT", players: 24, r: "6deg", delay: 1.4, pos: "right-0 top-[34%] sm:right-[1%]", depth: 0.7 },
  { name: "Blackjack", img: "/games/blackjack.jpg", tag: "EXCLUSIVE", players: 12, r: "-4deg", delay: 0.7, pos: "bottom-[3%] left-[4%] sm:left-[8%]", depth: 0.85 },
] as const;

function GameCard({ card, index, px, py }: { card: (typeof cards)[number]; index: number; px: MotionValue<number>; py: MotionValue<number> }) {
  const x = useTransform(px, (v) => v * 12 * card.depth);
  const y = useTransform(py, (v) => v * 12 * card.depth);
  const fromX = card.pos.includes("right") ? 60 : -60;
  return (
    <motion.div
      className={`absolute z-20 ${card.pos}`}
      style={{ x, y }}
    >
      <motion.div
        initial={{ opacity: 0, x: fromX, scale: 0.9 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.35 + index * 0.12, ease: EASE }}
      >
        <div
          className="animate-float origin-center scale-[0.66] sm:scale-100"
          style={{ "--r": card.r, animationDelay: `${card.delay}s` } as CSSProperties}
        >
          <div className="relative h-[170px] w-[120px] overflow-hidden rounded-[20px] border border-white/10 bg-panel shadow-[0_30px_50px_-20px_rgba(0,0,0,0.9)]">
            <Image src={card.img} alt="" fill sizes="120px" className="object-cover" />
            <div className="absolute left-2 top-2 scale-90 origin-top-left">
              <GameTag tag={card.tag} />
            </div>
            <div className="absolute inset-x-0 bottom-0 border-t border-white/10 bg-ink/90 px-2.5 py-2 backdrop-blur-sm">
              <p className="truncate font-display text-[12px] font-semibold leading-tight text-text">{card.name}</p>
              <p className="mt-0.5 flex items-center gap-1 text-[10px] text-muted">
                <span className="h-1 w-1 rounded-full bg-lime" />
                {card.players} playing
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ---------------------------------------------------------------- visual */

export function HeroVisual() {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 80, damping: 20 });
  const py = useSpring(my, { stiffness: 80, damping: 20 });
  const wheelX = useTransform(px, (v) => v * 6);
  const wheelY = useTransform(py, (v) => v * 6);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 2);
    my.set(((e.clientY - r.top) / r.height - 0.5) * 2);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: EASE }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="relative mx-auto h-[380px] w-full max-w-[640px] lg:h-[600px]"
      aria-hidden
    >
      {/* big soft glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[90%] w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#27b52a] opacity-40 blur-[120px]" />

      {/* wheel */}
      <motion.div
        className="absolute left-1/2 top-1/2 z-10 -ml-[150px] -mt-[150px] h-[300px] w-[300px] lg:-ml-[220px] lg:-mt-[220px] lg:h-[440px] lg:w-[440px]"
        style={{ x: wheelX, y: wheelY }}
      >
        <motion.div
          className="absolute -inset-6 rounded-full shadow-[0_0_80px_10px_rgba(144,247,62,0.35)] ring-1 ring-lime/30"
          animate={reduce ? undefined : { scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 rounded-full shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9)]" />
        <motion.div
          className="absolute inset-0 will-change-transform"
          animate={reduce ? undefined : { rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        >
          <RouletteWheel />
        </motion.div>
        {/* ball orbits the other way on the outer track */}
        <motion.div
          className="absolute inset-0"
          animate={reduce ? undefined : { rotate: -360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        >
          <span
            className="absolute left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_2px_6px_rgba(0,0,0,0.6),inset_-1px_-1px_2px_rgba(0,0,0,0.25)]"
            style={{ top: `${((220 - BALL_R) / 440) * 100}%` }}
          />
        </motion.div>

      </motion.div>

      {/* cards */}
      {cards.map((c, i) => (
        <GameCard key={c.name} card={c} index={i} px={reduce ? mx : px} py={reduce ? my : py} />
      ))}

      {/* chips */}
      <Chip base="#13951c" edge="#ffffff" className="animate-float absolute right-[14%] top-[6%] z-20 h-12 w-12 drop-shadow-[0_10px_14px_rgba(0,0,0,0.6)]" style={{ "--r": "18deg", animationDelay: "0.4s" } as CSSProperties} />
      <Chip base="#0b0f0b" edge="#e8b93a" className="animate-float absolute bottom-[12%] right-[10%] z-20 h-14 w-14 drop-shadow-[0_10px_14px_rgba(0,0,0,0.6)]" style={{ "--r": "-12deg", animationDelay: "1.8s" } as CSSProperties} />
      <Chip base="#8b1a1a" edge="#ffffff" className="animate-float absolute left-[30%] top-[-2%] z-0 h-10 w-10 opacity-70 blur-[2px]" style={{ "--r": "30deg", animationDelay: "1.1s" } as CSSProperties} />

      {/* coins around the visual */}
      <div className="animate-float absolute bottom-[26%] left-[-2%] z-0 hidden h-12 w-12 sm:block" style={{ "--r": "-18deg", animationDelay: "2.2s" } as CSSProperties}>
        <Coin className="h-full w-full" />
      </div>
      <div className="animate-float absolute right-[2%] top-[14%] z-0 hidden h-10 w-10 opacity-80 blur-[1.5px] sm:block" style={{ "--r": "22deg", animationDelay: "0.9s" } as CSSProperties}>
        <Coin className="h-full w-full" />
      </div>
    </motion.div>
  );
}
