import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://can-i-omarchy.rowers-drinker-2hrmx.chatgpt.site'),
  title: 'Can I Omarchy? — The honest compatibility check',
  description: 'Check whether your real work stack is ready for Omarchy before you touch your drive.',
  openGraph: {
    title: 'Can I Omarchy?',
    description: 'Your apps decide. Not the hype.',
    type: 'website',
    url: '/',
    images: [{ url: '/og.png', width: 1732, height: 907, alt: 'Can I Omarchy? Your apps decide. Not the hype.' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Can I Omarchy?',
    description: 'Your apps decide. Not the hype.',
    images: ['/og.png'],
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
