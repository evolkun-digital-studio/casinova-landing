import Image from "next/image";
import { links } from "@/lib/content";
import { InstagramIcon, TelegramIcon, WhatsAppIcon } from "./brand-icons";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-5 py-14 sm:px-8 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-md">
          <Image src="/brand/casinova-logo.png" alt="Casinova" width={600} height={113} className="h-8 w-auto" />
          <p className="mt-5 text-sm leading-relaxed text-subtle">
            Casinova is an online casino and sportsbook with live roulette, teen patti, blackjack, andar bahar, crash
            games and betting on cricket, football, tennis and horse racing.
          </p>
        </div>
        <div className="flex flex-col gap-5 lg:items-end">
          <div className="flex gap-2">
            {[
              { href: links.telegram, Icon: TelegramIcon, label: "Telegram" },
              { href: links.instagram, Icon: (p: { className?: string }) => <InstagramIcon {...p} gradient />, label: "Instagram" },
              { href: links.whatsapp, Icon: WhatsAppIcon, label: "WhatsApp" },
            ].map(({ href, Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Casinova on ${label}`}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-muted transition hover:border-pink/50 hover:text-text"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
          <a href={links.responsibleGaming} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-muted hover:text-text">
            <span className="rounded-full border-2 border-gold px-2 py-0.5 font-display text-xs font-black text-gold">18+</span>
            Play responsibly
          </a>
          <p className="text-xs text-subtle">© 2026 Casinova. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
