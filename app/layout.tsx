// app/layout.tsx (Updated - Change title to 'Abyss Global')
import type { Metadata } from "next";
import { Michroma, Montserrat } from "next/font/google";
import "../styles/globals.css";
import Header from "@/components/Header";
const michroma = Michroma({
  subsets: ["latin"],
  variable: "--font-michroma",
  weight: ["400"],
});
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});
// Metadata for SEO
export const metadata: Metadata = {
  title: "Abyss Global: My Evolving Dev Portfolio", 
  description: "Dive into my solo dev projects, from AI transcription tools to Telegram trading bots. Follow my journey in Software Development and Engineering.",
  keywords: "dev portfolio, AI development, Solana bot, note-taking app, web3, full-stack SaaS, Software Development, Software Engineering",
  openGraph: {
    title: "Abyss Global: My Evolving Dev Portfolio", 
    description: "Dive into my solo dev projects, from AI transcription tools to Telegram trading bots. Follow my journey in Software Development and Engineering.",
    images: "/og-image.png",
    type: "website", 
    url: "https://abyss.global", 
  },
  twitter: { 
    card: "summary_large_image",
    title: "Abyss Global: My Evolving Dev Portfolio",
    description: "Explore my AI-driven dev projects and blog.",
    images: "/og-image.png",
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" /> 
        <link rel="icon" href="/abyss-logo.png" />
        <link rel="apple-touch-icon" href="/abyss-logo.png" sizes="180x180" />
      </head>
      <body
        className={`${michroma.variable} ${montserrat.variable} antialiased`}
      >
        <div className="aura-layer">
          <div className="aura light-blue"></div>
          <div className="aura dark-blue"></div>
          <div className="aura deep-purple"></div>
          <div className="aura pink"></div>
        </div>
        <Header />
        {children}
      </body>
    </html>
  );
}