import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

const baseUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL || 'portfolieo.vercel.app'}`
  : 'http://localhost:3000';

const siteName = "Portfolioeo";
const siteDescription = "Stwórz swoje portfolio online w minutę! Portfolio programisty, developer portfolio, portfolio IT - wszystko automatycznie. Darmowe portfolio online bez kodu. Wklej linki do projektów i gotowe!";
const keywords = [
  "portfolio online",
  "portfolio programisty",
  "portfolio developer",
  "portfolio web",
  "portfolio programistyczne",
  "portfolio IT",
  "portfolio projektów",
  "tworzenie portfolio",
  "portfolio online za darmo",
  "portfolio bez kodu",
  "portfolio szybko",
  "portfolio w minutę",
  "portfolio linki",
  "portfolio automatyczne",
  "portfolio dla programistów",
  "portfolio dla developerów",
  "portfolio github",
  "portfolio online darmowe",
  "portfolio programisty online",
  "portfolio developer online",
  "portfolio frontend",
  "portfolio backend",
  "portfolio fullstack",
  "portfolio aplikacji",
  "portfolio projektów IT",
  "darmowe portfolio",
  "szybkie portfolio",
  "automatyczne portfolio"
].join(", ");

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Portfolioeo - Portfolio Online w Minutę | Portfolio Programisty i Developer",
    template: "%s | Portfolioeo"
  },
  description: siteDescription,
  keywords: keywords,
  authors: [{ name: "Portfolioeo" }],
  creator: "Portfolioeo",
  publisher: "Portfolioeo",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/logo-portfolioeo.png", sizes: "32x32", type: "image/png" },
      { url: "/logo-portfolioeo.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/logo-portfolioeo.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/logo-portfolioeo.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: baseUrl,
    siteName: siteName,
    title: "Portfolioeo - Portfolio Online w Minutę | Portfolio Programisty i Developer",
    description: siteDescription,
    images: [
      {
        url: "/logo-portfolioeo.png",
        width: 1200,
        height: 630,
        alt: "Portfolioeo - Portfolio Online",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolioeo - Portfolio Online w Minutę | Portfolio Programisty",
    description: siteDescription,
    images: ["/logo-portfolioeo.png"],
    creator: "@portfolieo",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: baseUrl,
  },
  category: "technology",
  classification: "Portfolio Builder, Developer Tools, Web Application",
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Portfolioeo",
    "mobile-web-app-capable": "yes",
    "theme-color": "#2563eb",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

