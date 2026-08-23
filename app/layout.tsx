import type { Metadata } from 'next';
import { IBM_Plex_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const bodyFont = IBM_Plex_Sans({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const displayFont = JetBrains_Mono({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const productionOrigin =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://can-i-omarchy.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(productionOrigin),
  title: 'Can I Omarchy? — Get your stack roasted',
  description: 'Find the app holding your operating system hostage. Get a named Stack Roast, downloadable card, and challenge link.',
  openGraph: {
    title: 'Can I Omarchy?',
    description: 'Your apps are holding you hostage. Get your stack roasted.',
    type: 'website',
    url: '/',
    images: [{ url: '/og.png', width: 1734, height: 907, alt: 'Can I Omarchy? Your apps are holding you hostage. Get your stack roasted.' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Can I Omarchy?',
    description: 'Your apps are holding you hostage. Get your stack roasted.',
    images: ['/og.png'],
  },
  icons: {
    icon: '/brand-logo.png',
    apple: '/brand-logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${bodyFont.variable} ${displayFont.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
