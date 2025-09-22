import type { Metadata } from 'next';
import { Michroma } from 'next/font/google';

import '../styles/globals.css'; // Import global styles with color tokens and resets
import Header from '@/components/Header'; // Import the client-side Header

const michroma = Michroma({
  subsets: ['latin'],
  variable: '--font-michroma',
  weight: ['400'], // Regular weight, but bold via CSS for effective/simple
});

// Metadata for SEO
export const metadata: Metadata = {
  title: 'Spacey Landing Page',
  description: 'An interactive journey through the universe with 3D visuals.',
  openGraph: {
    title: 'Spacey Landing Page',
    description: 'Explore cosmic wonders in this immersive web experience.',
    images: '/og-image.png', // Placeholder for OG image; add actual file in /public if needed
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
        {/* Viewport for responsive design */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Favicon placeholder */}
        <link rel="icon" href="/abyss-logo.png" />
        <link rel="apple-touch-icon" href="/abyss-logo.png" sizes="180x180" />
      </head>
      <body className={`${michroma.variable} antialiased`}>
        <div className="aura-layer">
          <div className="aura light-blue"></div>
          <div className="aura dark-blue"></div>
          <div className="aura deep-purple"></div>
          <div className="aura pink"></div>
        </div>
        <Header /> {/* Use the client-side Header component */}
        {children}
      </body>
    </html>
  );
}