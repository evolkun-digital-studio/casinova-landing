// Every link, label and list lives here so the page can be edited in one place.

export const SITE_URL = "https://thecasinova.com";

const utm = (campaign: string) =>
  `?utm_source=landing&utm_medium=cta&utm_campaign=${campaign}`;

export const links = {
  site: (campaign = "landing") => `${SITE_URL}/${utm(campaign)}`,
  casino: `${SITE_URL}/casino-home${utm("games")}`,
  // TODO: replace with the real handles
  telegram: "https://t.me/YOUR_TELEGRAM_CHANNEL",
  instagram: "https://www.instagram.com/YOUR_INSTAGRAM",
  whatsapp: "https://wa.me/971XXXXXXXXX",
  responsibleGaming: `${SITE_URL}/responsible-gaming`,
};

const CDN = "https://csnva-images-329712896.s3.eu-north-1.amazonaws.com/casino";

export type Tag = "NEW" | "HOT" | "EXCLUSIVE" | "LIVE";

export const casinoGames: {
  name: string;
  provider: string;
  img: string;
  players: number;
  tag?: Tag;
}[] = [
  { name: "Stock Market", provider: "Evolution", img: `${CDN}/Evolution/Stock+Market.webp`, players: 37, tag: "LIVE" },
  { name: "Hot 4 Cash", provider: "Nolimit City", img: `${CDN}/Nolimit+City/Hot+4+Cash.webp`, players: 11, tag: "HOT" },
  { name: "Bounty Hunters", provider: "Nolimit City", img: `${CDN}/Nolimit+City/Bounty+Hunters.webp`, players: 4, tag: "EXCLUSIVE" },
  { name: "Thor Hammer Time", provider: "Nolimit City", img: `${CDN}/Nolimit+City/Thor+Hammer+Time.webp`, players: 7 },
  { name: "Benji Killed In Vegas", provider: "Nolimit City", img: `${CDN}/Nolimit+City/Benji+Killed+In+Vegas.webp`, players: 24, tag: "NEW" },
  { name: "Roulette", provider: "Evolution", img: `${CDN}/Evolution/Roulette.webp`, players: 9 },
];

export const sports: { name: string; img: string }[] = [
  { name: "Cricket", img: "/sports/cricket.jpg" },
  { name: "Football", img: "/sports/football.jpg" },
  { name: "Tennis", img: "/sports/tennis.jpg" },
  { name: "Horse Race", img: "/sports/horse-race.jpg" },
];

export const categories = [
  { label: "Slots", emoji: "slots" },
  { label: "Live Casino", emoji: "live" },
  { label: "Crash Games", emoji: "crash" },
  { label: "Game Shows", emoji: "shows" },
  { label: "Card Games", emoji: "cards" },
  { label: "Sports", emoji: "sports" },
  { label: "Turbo Games", emoji: "turbo" },
] as const;

export const faqs = [
  {
    q: "How do I get the joining bonus?",
    a: "Join the Casinova Telegram channel, sign up on thecasinova.com and follow the steps posted in the channel. Bonus terms apply.",
  },
  {
    q: "What games can I play on Casinova?",
    a: "Live roulette, teen patti, blackjack, andar bahar, dragon tiger, crash games, slots and sports betting on cricket, football, tennis and horse racing.",
  },
  {
    q: "Is Casinova secure?",
    a: "Casinova uses secure, encrypted payments and protects your account data. Support is available around the clock on WhatsApp.",
  },
  {
    q: "Are the free games real money?",
    a: "No. Higher or Lower and Rocket Crash use free points only, just for fun.",
  },
  {
    q: "How can I contact support?",
    a: "Chat with the team on WhatsApp any time, or message us on Telegram.",
  },
];
