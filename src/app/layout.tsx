import type { Metadata } from 'next';
import {
  Abril_Fatface,
  Archivo,
  Noto_Sans_Kannada,
  Philosopher,
  Space_Mono,
} from 'next/font/google';
import './globals.css';
import './v2.css';
import './region.css';
import './v3.css';
import './v4.css';
import './v5.css';
import './v6.css';
import './v7.css';
import './v8.css';
import './v9.css';
import './v10.css';
import './v11.css';
import './v12.css';
import './v13.css';
import './v14.css';
import './v20.css';
import { StoreProvider } from '@/components/Store';
import { Header, Footer } from '@/components/Site';
import { BackTrack } from '@/components/BackTrack';

// Philosopher carries every paragraph and most headings; Archivo keeps
// shopping copy crisp; Abril Fatface is reserved for short, warm display
// moments — hero emphasis words, product names, place names — an "Archivo +
// Abril" pairing, in place of the earlier, louder Notable accent.
const display = Philosopher({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--serif',
});
const sans = Archivo({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--sans',
});
const accent = Abril_Fatface({
  subsets: ['latin'],
  weight: '400',
  variable: '--accent',
});
const mono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--mono',
});
const kannada = Noto_Sans_Kannada({
  subsets: ['kannada'],
  weight: ['400', '600'],
  variable: '--kannada',
});

export const metadata: Metadata = {
  title: "The Thindi Angadi | Karnataka's Own Snacking",
  description:
    'Discover regional snacks from across Karnataka, their places and stories, brought together for Bengaluru by The Thindi Angadi.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={[
        display.variable,
        sans.variable,
        accent.variable,
        mono.variable,
        kannada.variable,
      ].join(' ')}
    >
      <body>
        <StoreProvider>
          <Header />
          <BackTrack />
          <main>{children}</main>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
