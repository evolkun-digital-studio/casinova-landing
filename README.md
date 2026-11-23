# Casinova — Landing page

Next.js 16 (App Router) + Tailwind CSS 4 + Motion + Lenis smooth scroll.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start   # production
```

## Before going live

1. Open `lib/content.ts` and replace the placeholder links:
   - `telegram` → your Telegram channel
   - `instagram` → your Instagram profile
   - `whatsapp` → `https://wa.me/<number>`
2. If the landing page will live on its own URL (for example `join.thecasinova.com`), change `LANDING` in `app/layout.tsx` and the URLs in `app/sitemap.ts`, `app/robots.ts` and the JSON-LD in `app/page.tsx`.
3. Swap the game/sport images in `public/games` and `public/sports` for full-size originals (same file names) — the current ones were cut from a screen recording, so they are low resolution.
4. `public/brand/live-site.jpg` is the screenshot shown in the "Step inside the lobby" section — replace it with a fresh, sharp screenshot of thecasinova.com.

## Where things are

- `app/layout.tsx` — fonts, SEO metadata, Open Graph, GTM (GTM-579TBVLC), smooth scroll
- `app/page.tsx` — section order + JSON-LD (Organization, WebSite, FAQPage)
- `app/sitemap.ts`, `app/robots.ts`
- `app/globals.css` — colour palette and the chrome headline style
- `components/` — one file per section: `hero`, `games`, `telegram-bonus`, `live-site`, `mini-game`, `community`, `faq`, `footer`, `navbar`, `whatsapp-fab`
