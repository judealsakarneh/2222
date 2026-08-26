import type {Metadata, Viewport} from 'next';
import {Inter} from 'next/font/google';
import './globals.css';

/**
 * Inter, loaded through next/font so it is self-hosted at build time — no
 * render-blocking request to a font CDN, and no flash of a fallback face on a
 * phone connection. `display: swap` plus an explicit adjustFontFallback keeps
 * the pre-swap layout close enough that nothing jumps.
 */
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'ctrl ROOM — Your place. Your rewards.',
  description:
    'A contactless loyalty card for the rooms you already call yours. Tap to earn points, tap to redeem rewards. No app, no punch card.',
  openGraph: {
    title: 'ctrl ROOM — Your place. Your rewards.',
    description:
      'A contactless loyalty card for the rooms you already call yours.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  // Matches the page floor, so the iOS status bar and the address bar blend
  // into the design instead of framing it in white.
  themeColor: '#0A0A0A',
  colorScheme: 'dark',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
