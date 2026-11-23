"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionTitle({
  eyebrow,
  children,
  className = "",
  eyebrowClassName = "",
}: {
  eyebrow?: string;
  children: ReactNode;
  className?: string;
  eyebrowClassName?: string;
}) {
  return (
    <div className={className}>
      {eyebrow && (
        <p className={`font-display text-xs font-bold uppercase tracking-[0.22em] text-pink-soft ${eyebrowClassName}`}>
          {eyebrow}
        </p>
      )}
      <h2 className="text-chrome mt-3 font-display text-4xl font-black uppercase leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl">
        {children}
      </h2>
    </div>
  );
}

const tagStyles: Record<string, string> = {
  NEW: "bg-lime text-[#08210a]",
  HOT: "bg-orange text-[#2a0c00]",
  EXCLUSIVE: "bg-cyan text-[#03252a]",
  LIVE: "bg-pink text-ink",
};

export function GameTag({ tag }: { tag: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-display text-[10px] font-extrabold tracking-wider ${tagStyles[tag]}`}
    >
      {tag === "LIVE" && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />}
      {tag}
    </span>
  );
}
