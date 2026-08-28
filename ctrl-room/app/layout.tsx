import type {Metadata, Viewport} from 'next';
import {Archivo} from 'next/font/google';
import {GeistSans} from 'geist/font/sans';
import {GeistMono} from 'geist/font/mono';
import '@fontsource-variable/manrope';
import './globals.css';
import {Header} from '@/components/site/Header';
import {Footer} from '@/components/site/Footer';
import {ActBackground} from '@/components/site/ActBackground';

/**
 * Three roles, and each one earns its place.
 *
 * GEIST SANS carries every heading, label and line of body copy. It is the
 * neutral, tightly-drawn UI voice.
 *
 * GEIST MONO appears only where a figure is being measured: the Amman clock,
 * the stat readouts, the member number. Never as a label. Monospace worn as a
 * costume for "technical" is a craft-floor violation; monospace on data is what
 * it is for.
 *
 * ARCHIVO is loaded for exactly one job: the display headlines, where its
 * variable WIDTH axis animates on scroll. Geist has no `wdth` axis and
 * structurally cannot do it. That is the whole argument for carrying a second
 * family, and it is why Archivo appears nowhere below display scale.
 */
const display = Archivo({
  subsets: ['latin'],
  display: 'swap',
  axes: ['wdth'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: {default: 'CTRL Room · Jordan, switched on.', template: '%s · CTRL Room'},
  description:
    "Jordan's discovery, community and commerce platform. What's happening, what's worth knowing, and the membership that gets you in.",
  openGraph: {
    title: 'CTRL Room · Jordan, switched on.',
    description: "Jordan's discovery, community and commerce platform.",
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#121212',
  colorScheme: 'dark',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} ${display.variable}`}
    >
      <body className="font-sans antialiased">
        <ActBackground />
        <Header />
        <main className="relative">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
