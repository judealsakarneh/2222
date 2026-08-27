import type {Metadata, Viewport} from 'next';
import {Archivo, JetBrains_Mono} from 'next/font/google';
import './globals.css';
import {Header} from '@/components/site/Header';
import {Footer} from '@/components/site/Footer';
import {ActBackground} from '@/components/site/ActBackground';

/**
 * Archivo carries display and body; its width axis is what lets the big
 * headlines run expanded without a second family. JetBrains Mono carries every
 * label, timestamp and readout — the instrumentation layer that makes the site
 * read like the control room the brand is named after.
 */
const display = Archivo({
  subsets: ['latin'],
  display: 'swap',
  axes: ['wdth'],
  variable: '--font-display',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: {default: 'CTRL Room — Jordan, switched on.', template: '%s — CTRL Room'},
  description:
    "Jordan's discovery, community and commerce platform. What's happening, what's worth knowing, and the membership that gets you in.",
  openGraph: {
    title: 'CTRL Room — Jordan, switched on.',
    description:
      "Jordan's discovery, community and commerce platform.",
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#0B0B0B',
  colorScheme: 'dark',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable}`}>
      <body className="font-sans antialiased">
        {/* One fixed layer behind everything. Sections declare which act they
            belong to and this crossfades between them as you scroll, so the
            page changes temperature gradually instead of cutting. */}
        <ActBackground />
        <Header />
        <main className="relative">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
