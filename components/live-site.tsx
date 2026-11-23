"use client";

import Image from "next/image";
import { ArrowUpRight, Globe2 } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { links } from "@/lib/content";
import { Reveal } from "./ui";

export function LiveSite() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotX = useTransform(scrollYProgress, [0, 0.5], [reduce ? 0 : 28, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [reduce ? 1 : 0.9, 1]);

  return (
    <section ref={ref} id="live" className="relative overflow-hidden py-20 sm:py-28">
      <div aria-hidden className="absolute left-1/2 top-1/3 -z-10 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(19,149,28,0.3),transparent_62%)]" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="relative [perspective:1600px]">
          <motion.div
            style={{ rotateX: rotX, scale }}
            className="relative mx-auto max-w-5xl [transform-origin:50%_100%]"
          >
            {/* browser frame */}
            <div className="overflow-hidden rounded-2xl border border-white/12 bg-[#030904] shadow-[0_60px_120px_-30px_rgba(0,0,0,0.9),0_0_0_1px_rgba(144,247,62,0.12)]">
              <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                  <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                  <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                </div>
                <div className="mx-auto flex max-w-xs flex-1 items-center justify-center gap-2 rounded-lg bg-white/[0.06] px-3 py-1.5 text-xs text-muted">
                  <Globe2 className="h-3.5 w-3.5" />
                  thecasinova.com
                </div>
              </div>
              <div className="relative aspect-[1920/866]">
                <Image
                  src="/brand/live-site.jpg"
                  alt="The live Casinova website lobby with top casino and sports games"
                  fill
                  sizes="(min-width:1024px) 1024px, 100vw"
                  className="object-cover object-top"
                />
              </div>
            </div>

            {/* CTA pinned on the mockup */}
            <div className="absolute inset-x-0 -bottom-8 flex justify-center">
              <a
                href={links.site("live-site")}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex h-16 items-center gap-3 rounded-full bg-pink px-9 font-display text-base font-extrabold uppercase tracking-wide text-ink shadow-[0_18px_50px_-8px_rgba(144,247,62,0.8)] ring-8 ring-ink transition hover:-translate-y-0.5 hover:bg-[#a6ff5c]"
              >
                Open the live site
                <ArrowUpRight className="h-5 w-5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}
