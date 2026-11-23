import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "@fontsource/montserrat/300.css";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/400-italic.css";
import "@fontsource/montserrat/500-italic.css";
import "@fontsource/montserrat/700.css";
import "@fontsource/montserrat/800.css";
import "@fontsource/montserrat/900.css";
import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "./globals.css";
import { SmoothScroll } from "@/components/smooth-scroll";

const LANDING = "https://thecasinova.com"; // change if the landing page lives on its own URL

export const metadata: Metadata = {
  metadataBase: new URL(LANDING),
  title: "Casinova — Live Casino & Sports Betting | Join for Bonus",
  description:
    "Play live roulette, teen patti, blackjack and bet on cricket and football at Casinova. Join our Telegram for a joining bonus and the latest updates.",
  keywords: [
    "Casinova",
    "online casino",
    "live casino",
    "live roulette",
    "teen patti online",
    "sports betting",
    "cricket betting",
    "casino joining bonus",
    "online casino UAE",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: LANDING,
    siteName: "Casinova",
    title: "Casinova — Live Casino & Sports Betting",
    description: "Live tables, sports and a joining bonus for our Telegram community.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Casinova" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Casinova — Live Casino & Sports Betting",
    description: "Live tables, sports and a joining bonus for our Telegram community.",
    images: ["/og-image.jpg"],
  },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = {
  themeColor: "#0a081c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-579TBVLC');`}
        </Script>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
