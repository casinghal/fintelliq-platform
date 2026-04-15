// Server wrapper — metadata here, interactive client in _landing.tsx
import type { Metadata } from 'next';
import { LandingPage } from './_landing';

export const metadata: Metadata = {
  title: 'Raysho — AI Knowledge Platform for F&A Professionals',
  description: 'Stop guessing with AI. 230 Claude-optimised prompt frameworks, 8 process towers, and daily AI briefings built for Finance and Accounting professionals.',
  openGraph: {
    title: 'Raysho — AI & F&A Knowledge Platform',
    description: 'Claude-optimised prompts for CPAs, CFOs, controllers and F&A teams. Daily AI briefings scored for relevance.',
    type: 'website',
    url: 'https://raysho.ai',
  },
  alternates: { canonical: 'https://raysho.ai' },
};

export default function Page() {
  return <LandingPage />;
}
