import type { Metadata } from 'next';
import { Playfair_Display, DM_Sans, Noto_Serif_SC } from 'next/font/google';
import '../styles/globals.css';
import { generateLocalBusinessSchema, generateOrganizationSchema, generateWebSiteSchema } from '@/lib/schema';

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-heading',
  preload: true,
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  display: 'swap',
  variable: '--font-body',
  preload: true,
});

const notoSerifSC = Noto_Serif_SC({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-chinese',
  preload: false,
});

export const metadata: Metadata = {
  title: 'Julia Studio — 25 Years of Timeless Interior Design',
  description: 'Julia Studio creates timeless interior spaces for homes, offices, and exhibitions. 25 years of design excellence, 1,000+ projects completed.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://studio-julia.com'),
  icons: {
    icon: [
      { url: '/favicon.svg?v=2', type: 'image/svg+xml' },
      { url: '/icon?v=2', type: 'image/png', sizes: '32x32' },
    ],
    shortcut: '/favicon.svg?v=2',
    apple: [{ url: '/icon?v=2', type: 'image/png', sizes: '180x180' }],
  },
  alternates: { canonical: './' },
  openGraph: { type: 'website', siteName: 'Julia Studio' },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${playfairDisplay.variable} ${dmSans.variable} ${notoSerifSC.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generateLocalBusinessSchema()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generateOrganizationSchema()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generateWebSiteSchema()) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
