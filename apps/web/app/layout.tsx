import type { Metadata } from 'next';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import './globals.css';

export const metadata: Metadata = {
  title: 'RecapAnytime | Your TikTok Wrapped, Anytime',
  description: 'Turn your exported TikTok ZIP/JSON data into a bold Spotify Wrapped-style interactive recap and Receiptify-style bill.',
  keywords: ['TikTok Wrapped', 'TikTok Recap', 'Receiptify', 'TikTok Shop Recap', 'Data Privacy'],
  authors: [{ name: 'RecapAnytime Devs' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-background text-foreground min-h-screen font-sans">
        {children}
      </body>
    </html>
  );
}
