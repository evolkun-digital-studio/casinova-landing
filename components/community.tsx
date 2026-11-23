import { ArrowUpRight } from "lucide-react";
import { links } from "@/lib/content";
import { InstagramIcon, TelegramIcon, WhatsAppIcon } from "./brand-icons";
import { Reveal, SectionTitle } from "./ui";

const socials = [
  {
    name: "Telegram",
    caption: "Join more, more bonus",
    href: links.telegram,
    Icon: TelegramIcon,
    tone: "from-[#1b6fd1] to-[#33d6e8]",
    ring: "hover:border-cyan/50",
  },
  {
    name: "Instagram",
    caption: "Wins, reels & drops",
    href: links.instagram,
    Icon: InstagramIcon,
    tone: "from-[#feda75] via-[#d62976] to-[#4f5bd5]",
    ring: "hover:border-pink/50",
  },
  {
    name: "WhatsApp",
    caption: "24/7 support chat",
    href: links.whatsapp,
    Icon: WhatsAppIcon,
    tone: "from-[#1f9e5a] to-[#5ada2e]",
    ring: "hover:border-lime/50",
  },
];

export function Community() {
  return (
    <section id="community" className="relative py-20 sm:py-28" aria-labelledby="community-title">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <SectionTitle eyebrow="Community">
            <span id="community-title">Stay close</span>
          </SectionTitle>
        </Reveal>
        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {socials.map(({ name, caption, href, Icon, tone, ring }, i) => (
            <li key={name}>
              <Reveal delay={i * 0.08}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group relative flex items-center gap-5 overflow-hidden rounded-3xl border border-line bg-panel/70 p-5 transition hover:-translate-y-1 hover:bg-panel-2 ${ring}`}
                >
                  <span className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${tone} text-white shadow-lg`}>
                    <Icon className="h-8 w-8" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-xl font-black uppercase">{name}</span>
                    <span className="block text-sm text-muted">{caption}</span>
                  </span>
                  <ArrowUpRight className="h-5 w-5 text-subtle transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-text" />
                </a>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
