import type {Metadata, Viewport} from 'next';
import {Inter, JetBrains_Mono} from 'next/font/google';
import './globals.css';

/**
 * Both faces self-hosted at build time through next/font — no render-blocking
 * CDN request, and no flash of a fallback on a phone connection.
 */
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500'],
  variable: '--font-mono',
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
  themeColor: '#0A0A0A',
  colorScheme: 'dark',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
