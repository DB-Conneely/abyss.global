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
  title: "Abyss Global", // UPDATED: New tab title
  description: "An interactive journey through the universe with 3D visuals.",
  openGraph: {
    title: "Abyss Global", // UPDATED: Match for social shares
    description: "Explore cosmic wonders in this immersive web experience.",
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
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
