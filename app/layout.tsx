import type { Metadata } from 'next';
import '../styles/globals.css'; // Import global styles with color tokens and resets

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
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}