import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RecapAnytime | Your TikTok Wrapped, Anytime',
  description: 'Turn your exported TikTok ZIP/JSON data into a developer-style terminal interactive recap and Receiptify-style bill.',
  keywords: ['TikTok Wrapped', 'TikTok Recap', 'Receiptify', 'TikTok Shop Recap', 'Data Privacy'],
  authors: [{ name: 'RecapAnytime Devs' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased bg-[#050505] text-[#f5f5f0] min-h-screen">
        {children}
      </body>
    </html>
  );
}
