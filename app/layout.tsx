import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Raysho — AI Knowledge Platform for F&A Professionals',
    template: '%s — Raysho',
  },
  description: "The practitioner's guide to AI in Finance and Accounting. 230 Claude-optimised prompts, 8 process towers, daily AI briefings scored for F&A relevance.",
  metadataBase: new URL('https://raysho.ai'),
  openGraph: {
    siteName: 'Raysho',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Raysho — AI & F&A Knowledge Platform' }],
  },
  twitter: { card: 'summary_large_image', images: ['/og-image.png'] },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // No class = dark mode default. 'light' class added by ThemeToggle client component.
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&family=Lora:ital@0;1&display=swap"
          rel="stylesheet"
        />
        {/* Dark mode by default — set before paint to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('raysho-theme');if(t==='light'){document.documentElement.classList.add('light');}})();`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
