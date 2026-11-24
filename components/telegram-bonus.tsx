import { Bell, Gift, Zap } from "lucide-react";
import { links } from "@/lib/content";
import { Coin, TelegramIcon } from "./brand-icons";
import { Reveal } from "./ui";

const perks = [
  { icon: Gift, label: "Joining bonus", color: "text-[#8fddff]" },
  { icon: Zap, label: "Latest updates first", color: "text-[#5bc7f2]" },
  { icon: Bell, label: "Exclusive offers", color: "text-white" },
];

const posts = [
  { title: "Your joining bonus is waiting", meta: "Pinned", accent: "bg-pink" },
  { title: "New live table added: Dragon Tiger", meta: "Today", accent: "bg-lime" },
  { title: "Today's offers are live on the site", meta: "Today", accent: "bg-cyan" },
];

export function TelegramBonus() {
  return (
    <section id="bonus" className="relative py-12 sm:py-20" aria-labelledby="bonus-title">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="grain relative isolate overflow-hidden rounded-[32px] border border-[#229ed9]/30 bg-white p-7 text-[#102b3d] shadow-[0_35px_100px_-35px_rgba(34,158,217,0.55)] sm:p-12 lg:p-16">
            <div aria-hidden className="absolute -right-24 -top-24 -z-10 h-[460px] w-[460px] rounded-full bg-[radial-gradient(circle,rgba(91,199,242,0.5),transparent_65%)]" />
            <div aria-hidden className="absolute -bottom-40 left-1/3 -z-10 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(0,136,204,0.3),transparent_65%)]" />

            <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_1fr]">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-[#229ed9]/20 bg-[#229ed9]/10 px-4 py-2 font-display text-[11px] font-bold uppercase tracking-[0.2em] text-[#0879b5]">
                  <TelegramIcon className="h-3.5 w-3.5" />
                  Official Telegram channel
                </p>
                <h2
                  id="bonus-title"
                  className="mt-6 font-display text-[clamp(40px,6.5vw,60px)] font-black uppercase leading-[0.9] tracking-[-0.02em]"
                >
                  <span className="text-[#102b3d]">Join Telegram.</span>
                  <br />
                  <span className="text-[#8fddff]">Get more bonus.</span>
                </h2>
                <ul className="mt-8 flex flex-wrap gap-2">
                  {perks.map(({ icon: Icon, label, color }) => (
                    <li
                      key={label}
                      className="flex items-center gap-2 rounded-xl border border-[#229ed9]/15 bg-[#229ed9]/[0.06] px-4 py-3 text-sm font-semibold text-[#24485d]"
                    >
                      <Icon className={`h-4 w-4 ${color}`} />
                      {label}
                    </li>
                  ))}
                </ul>
                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <a
                    href={links.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-14 items-center gap-3 rounded-full bg-[#229ed9] px-8 font-display text-sm font-extrabold uppercase tracking-wide text-white shadow-[0_14px_40px_-8px_rgba(34,158,217,0.8)] transition hover:-translate-y-0.5 hover:bg-[#39b8ef]"
                  >
                    <TelegramIcon className="h-5 w-5" />
                    Join now
                  </a>
                  <span className="text-xs text-[#5f7582]">Bonus terms apply · 18+ only</span>
                </div>
              </div>

              {/* phone with channel preview */}
              <div className="relative mx-auto w-full max-w-[340px]">
                <div aria-hidden className="animate-float absolute -left-10 top-6 h-16 w-16" style={{ ["--r" as string]: "-20deg" }}>
                  <Coin className="h-full w-full" />
                </div>
                <div aria-hidden className="animate-float absolute -right-8 bottom-16 h-20 w-20" style={{ ["--r" as string]: "16deg", animationDelay: "1.4s" }}>
                  <Coin className="h-full w-full" />
                </div>
                <div className="rotate-[4deg] rounded-[40px] border border-white/15 bg-[#080b08] p-3 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]">
                  <div className="overflow-hidden rounded-[30px] bg-gradient-to-b from-[#174d6e] to-[#071824] text-white">
                    <div className="flex items-center gap-3 border-b border-white/10 px-4 py-4">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink ring-1 ring-gold/40">
                        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-gold" aria-hidden="true">
                          <path d="M12 2C9 6 4 9 4 13a4 4 0 0 0 6.5 3.1L9 21h6l-1.5-4.9A4 4 0 0 0 20 13c0-4-5-7-8-11z" />
                        </svg>
                      </span>
                      <div>
                        <p className="font-display text-sm font-extrabold text-white">Casinova Official</p>
                        <p className="text-[11px] text-[#8fddff]">channel</p>
                      </div>
                    </div>
                    <ul className="space-y-3 p-4">
                      {posts.map((p) => (
                        <li key={p.title} className="rounded-2xl border border-white/10 bg-white/[0.09] p-3">
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-[#5bc7f2]" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#b8e8ff]">{p.meta}</span>
                          </div>
                          <p className="mt-1.5 text-sm font-semibold leading-snug text-white">{p.title}</p>
                        </li>
                      ))}
                    </ul>
                    <div className="m-4 mt-1 rounded-2xl bg-[#229ed9] py-3 text-center font-display text-sm font-extrabold uppercase text-white">
                      Join channel
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
