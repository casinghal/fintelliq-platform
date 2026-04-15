// Server Component — no 'use client' directive
// This ensures Google sees the full HTML on first crawl
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FintelliQ — AI & F&A Knowledge Platform for Finance Professionals',
  description: 'Consulting-grade AI prompts, real-world case studies, tool comparisons and weekly fresh content for F&A professionals, consultants and BPO operators. Free access. No signup required.',
  openGraph: {
    title: 'FintelliQ — AI & F&A Knowledge Platform',
    description: 'The practitioner\'s guide to AI in Finance & Accounting. 230+ consulting prompts across 10 industries, Big Four case studies, and weekly fresh content.',
    type: 'website',
    url: 'https://fintelliQ.com',
  },
  alternates: {
    canonical: 'https://fintelliQ.com',
  },
};

const C = {
  bg: '#07080c', surface: '#0f1117', card: '#14161f',
  border: 'rgba(255,255,255,0.07)', accent: '#f0b429',
  acdim: 'rgba(240,180,41,0.09)', acbor: 'rgba(240,180,41,0.28)',
  text: '#eef0f4', t2: '#8891a4', t3: '#3d4455',
  green: '#10b981', blue: '#4a9eff', purple: '#a78bfa', orange: '#e07b4a',
};

const FEATURES = [
  { icon: '🤖', title: 'AI Tools Hub', desc: 'Claude, ChatGPT, Copilot, Grok, Gemini — F&A-specific use cases and copy-paste prompt frameworks for each.' },
  { icon: '🏗️', title: 'Process Tower Library', desc: 'AP, AR, R2R, Tax, Audit, FP&A and more — 10 structured AI prompt templates per function.' },
  { icon: '⚡', title: 'Prompt Library', desc: '230+ structured prompt frameworks designed as professional starting points, spanning 8 process towers and 10 industries. All outputs require practitioner review before use.' },
  { icon: '📊', title: 'Real-World Case Studies', desc: 'Published results from Deloitte, EY, PwC and KPMG — with source disclosures. FintelliQ is not affiliated with any of these firms.' },
  { icon: '🔄', title: 'Auto-Refreshing Content', desc: 'Our AI engine scans 20+ publications and YouTube daily. Fresh content every week — old content rotates out.' },
  { icon: '🔍', title: 'Live Discovery Feed', desc: 'AI-curated articles, videos and reports on AI in F&A — scored for relevance and published weekly.' },
];

const STATS = [
  { v: '230+', l: 'AI prompt frameworks' },
  { v: '10', l: 'Industries covered' },
  { v: '8', l: 'Process towers' },
  { v: 'Weekly', l: 'Content refresh' },
];

export default function LandingPage() {
  return (
    <div style={{ background: C.bg, minHeight: '100vh', fontFamily: "'DM Sans', sans-serif", color: C.text }}>

      {/* ── NAV ── */}
      <nav style={{ borderBottom: `1px solid ${C.border}`, padding: '0 24px', background: C.surface, position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 58 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 26 26" fill="none"><path d="M7 13h12M13 7l6 6-6 6" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.02em' }}>FintelliQ</span>
          </div>
          <Link href="/platform" style={{ padding: '9px 20px', borderRadius: 8, background: C.accent, color: '#000', fontSize: 13, fontWeight: 700, display: 'inline-flex', alignItems: 'center' }}>
            Enter Platform →
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 24px 60px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.accent, background: C.acdim, border: `1px solid ${C.acbor}`, borderRadius: 20, padding: '5px 14px', marginBottom: 24 }}>
          Free access during launch · No signup required
        </div>
        <h1 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 'clamp(32px, 6vw, 58px)', fontWeight: 400, lineHeight: 1.12, marginBottom: 22, color: C.text }}>
          The AI knowledge platform<br />built for F&amp;A professionals
        </h1>
        <p style={{ fontSize: 'clamp(15px, 2vw, 18px)', color: C.t2, lineHeight: 1.75, maxWidth: 600, margin: '0 auto 36px' }}>
          Structured AI prompt frameworks, real-world case studies, tool comparisons and weekly fresh content — built for F&amp;A professionals who want to apply AI in their work. All outputs require professional review before use in any client or regulated context.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/platform" style={{ padding: '14px 32px', borderRadius: 10, background: C.accent, color: '#000', fontSize: 15, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            Enter Platform — Free →
          </Link>
          <a href="#features" style={{ padding: '14px 28px', borderRadius: 10, border: `1px solid ${C.border}`, color: C.t2, fontSize: 15, fontWeight: 500, display: 'inline-flex', alignItems: 'center' }}>
            What's inside
          </a>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, background: C.surface }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 24px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {STATS.map(s => (
            <div key={s.l} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 28, color: C.accent, marginBottom: 4 }}>{s.v}</div>
              <div style={{ fontSize: 12, color: C.t3 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FRESHNESS BANNER ── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px 0' }}>
        <div style={{ background: `linear-gradient(135deg, ${C.acdim} 0%, rgba(16,185,129,0.07) 100%)`, border: `1px solid ${C.acbor}`, borderRadius: 14, padding: '20px 26px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <div style={{ fontSize: 28, flexShrink: 0 }}>🔄</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.accent, marginBottom: 6 }}>This platform refreshes every week</div>
            <div style={{ fontSize: 13, color: C.t2, lineHeight: 1.75 }}>
              FintelliQ's AI engine continuously scans 20+ industry publications and YouTube channels, scores every item for F&amp;A relevance, and surfaces the freshest content weekly. Old content rotates out as newer, more current material comes in. <strong style={{ color: C.text }}>If you find something useful — save that link offline.</strong> It may be replaced by even fresher content on your next visit.
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 24px' }}>
        <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 32, fontWeight: 400, textAlign: 'center', marginBottom: 8 }}>
          Everything you need in one place
        </h2>
        <p style={{ fontSize: 14, color: C.t2, textAlign: 'center', marginBottom: 40 }}>
          Practitioner-built. Independently curated. Not affiliated with any AI vendor or consulting firm.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 14 }}>
          {FEATURES.map(f => (
            <div key={f.title} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '20px 22px' }}>
              <div style={{ fontSize: 24, marginBottom: 10 }}>{f.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 6 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: C.t2, lineHeight: 1.65 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHO IS IT FOR ── */}
      <section style={{ background: C.surface, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 24px' }}>
          <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 32, fontWeight: 400, textAlign: 'center', marginBottom: 40 }}>
            Built for F&amp;A practitioners
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
            {['Controllers & CFOs', 'AP & AR Managers', 'Internal Auditors', 'FP&A Analysts', 'Tax Professionals', 'BPO & GDS Operators', 'Big Four & Mid-tier Staff', 'F&A Consultants'].map(role => (
              <div key={role} style={{ padding: '12px 16px', background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13, color: C.t2, textAlign: 'center' }}>
                ✓ {role}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ maxWidth: 700, margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 36, fontWeight: 400, marginBottom: 16, lineHeight: 1.2 }}>
          Ready to work smarter with AI?
        </h2>
        <p style={{ fontSize: 15, color: C.t2, lineHeight: 1.7, marginBottom: 32 }}>
          Free access during launch. No signup. No paywall. Open the platform and start using it today.
        </p>
        <Link href="/platform" style={{ padding: '16px 40px', borderRadius: 10, background: C.accent, color: '#000', fontSize: 16, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          Enter FintelliQ →
        </Link>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: `1px solid ${C.border}`, padding: '24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 16, flexWrap: 'wrap' }}>
            <Link href="/terms" style={{ fontSize: 12, color: C.t3, textDecoration: 'none' }}>Terms of Service</Link>
            <Link href="/privacy" style={{ fontSize: 12, color: C.t3, textDecoration: 'none' }}>Privacy Policy</Link>
            <Link href="/platform" style={{ fontSize: 12, color: C.t3, textDecoration: 'none' }}>Platform</Link>
            <a href="mailto:contact.us@avantage-partners.com" style={{ fontSize: 12, color: C.t3, textDecoration: 'none' }}>Contact</a>
          </div>
          <div style={{ fontSize: 11, color: C.t3, lineHeight: 1.8, textAlign: 'center' }}>
            FintelliQ is an independent educational platform. Not affiliated with, endorsed by, or sponsored by Deloitte, EY, PwC, KPMG, McKinsey, Anthropic, OpenAI, Microsoft, Google, or xAI. All trademarks and brand names belong to their respective owners. Content is for educational purposes only — not professional financial, accounting, tax, or legal advice. All AI-generated outputs require review by a qualified professional before use.
          </div>
        </div>
      </footer>
    </div>
  );
}
