import { Community } from "@/components/community";
import { Faq } from "@/components/faq";
import { Footer } from "@/components/footer";
import { Games } from "@/components/games";
import { Hero } from "@/components/hero";
import { FeaturedGames } from "@/components/hero-carousel";
import { PlaySection } from "@/components/play/play-section";
import { Navbar } from "@/components/navbar";
import { TelegramBonus } from "@/components/telegram-bonus";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { faqs, links } from "@/lib/content";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://thecasinova.com/#org",
      name: "Casinova",
      url: "https://thecasinova.com",
      logo: "https://thecasinova.com/brand/casinova-logo.png",
      sameAs: [links.telegram, links.instagram, links.whatsapp],
    },
    {
      "@type": "WebSite",
      "@id": "https://thecasinova.com/#website",
      url: "https://thecasinova.com",
      name: "Casinova",
      publisher: { "@id": "https://thecasinova.com/#org" },
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <main>
        <Hero />
        <FeaturedGames />
        <Games />
        <PlaySection />
        <TelegramBonus />
        <Community />
        <Faq />
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
