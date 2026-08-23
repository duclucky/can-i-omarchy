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
  title: 'Can I Omarchy? — Check your stack before you switch',
  description: 'Select the apps your work depends on, find hard blockers, and build a source-backed Omarchy migration plan.',
  openGraph: {
    title: 'Can I Omarchy?',
    description: 'Check your stack before you switch.',
    type: 'website',
    url: '/',
    images: [{ url: '/og.png', width: 1733, height: 908, alt: 'Can I Omarchy? Check your stack before you switch.' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Can I Omarchy?',
    description: 'Check your stack before you switch.',
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
