'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';

/* ─────────────────────────────────────────────────────────────
   TYPEWRITER COMPONENT
───────────────────────────────────────────────────────────── */
function Typewriter({ phrases, speed = 55, pause = 2200 }: {
  phrases: string[];
  speed?: number;
  pause?: number;
}) {
  const [display, setDisplay] = useState('');
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[phraseIdx];
    const delay = deleting ? speed / 2 : speed;

    const timer = setTimeout(() => {
      if (!deleting) {
        if (charIdx < current.length) {
          setDisplay(current.slice(0, charIdx + 1));
          setCharIdx(c => c + 1);
        } else {
          setTimeout(() => setDeleting(true), pause);
        }
      } else {
        if (charIdx > 0) {
          setDisplay(current.slice(0, charIdx - 1));
          setCharIdx(c => c - 1);
        } else {
          setDeleting(false);
          setPhraseIdx(i => (i + 1) % phrases.length);
        }
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [charIdx, deleting, phraseIdx, phrases, speed, pause]);

  return (
    <span style={{ color: 'var(--accent)', display: 'inline' }}>
      {display}
      <span style={{
        display: 'inline-block', width: 3, height: '0.85em',
        background: 'var(--accent)', marginLeft: 3, verticalAlign: 'middle',
        animation: 'blink-cursor 550ms ease infinite',
      }} />
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────
   PILLAR CARD ANIMATIONS (Supabase-style SVG animations)
───────────────────────────────────────────────────────────── */

function AIToolsAnimation() {
  return (
    <svg width="100%" height="100" viewBox="0 0 280 100" fill="none">
      {/* Central hub */}
      <circle cx="140" cy="50" r="18" fill="rgba(79,255,176,0.12)" stroke="rgba(79,255,176,0.5)" strokeWidth="1.5"/>
      <text x="140" y="55" textAnchor="middle" fontSize="10" fill="var(--accent)" fontFamily="var(--font-mono)">AI</text>
      {/* Satellite nodes */}
      {[
        { cx: 50, cy: 25, label: 'Claude', color: '#4FFFB0' },
        { cx: 230, cy: 25, label: 'GPT', color: '#60A5FA' },
        { cx: 40, cy: 75, label: 'Copilot', color: '#A78BFA' },
        { cx: 240, cy: 75, label: 'Gemini', color: '#FB923C' },
        { cx: 140, cy: 10, label: 'Grok', color: '#F87171' },
      ].map((n, i) => (
        <g key={n.label}>
          <line x1="140" y1="50" x2={n.cx} y2={n.cy} stroke={n.color} strokeWidth="1" strokeOpacity="0.3"
            strokeDasharray="4 4">
            <animate attributeName="stroke-dashoffset" from="0" to="-16" dur={`${1.2 + i * 0.3}s`} repeatCount="indefinite"/>
          </line>
          <circle cx={n.cx} cy={n.cy} r="10" fill={`${n.color}18`} stroke={n.color} strokeWidth="1">
            <animate attributeName="r" values="10;12;10" dur={`${2 + i * 0.4}s`} repeatCount="indefinite"/>
          </circle>
          <text x={n.cx} y={n.cy + 4} textAnchor="middle" fontSize="7" fill={n.color} fontFamily="var(--font-mono)">{n.label}</text>
        </g>
      ))}
    </svg>
  );
}

function ProcessTowersAnimation() {
  const steps = ['Receive','Validate','Process','Review','Post','Close'];
  return (
    <svg width="100%" height="100" viewBox="0 0 280 100" fill="none">
      {steps.map((s, i) => (
        <g key={s}>
          <rect x={20 + i * 43} y={30} width={35} height={22} rx="3"
            fill="rgba(79,255,176,0.08)" stroke="rgba(79,255,176,0.35)" strokeWidth="1">
            <animate attributeName="fill-opacity" values="0.08;0.22;0.08" dur={`${1.5 + i * 0.25}s`} repeatCount="indefinite"/>
          </rect>
          <text x={37 + i * 43} y={45} textAnchor="middle" fontSize="7.5" fill="var(--accent)" fontFamily="var(--font-mono)">{s}</text>
          {i < 5 && (
            <line x1={55 + i * 43} y1={41} x2={63 + i * 43} y2={41} stroke="rgba(79,255,176,0.4)" strokeWidth="1.5">
              <animate attributeName="stroke-opacity" values="0.4;1;0.4" dur={`${1.2 + i * 0.2}s`} repeatCount="indefinite"/>
            </line>
          )}
        </g>
      ))}
      {/* Active indicator */}
      <circle r="3" fill="var(--accent)" opacity="0.9">
        <animateMotion dur="4s" repeatCount="indefinite"
          path="M 37 41 L 80 41 L 123 41 L 166 41 L 209 41 L 252 41"/>
      </circle>
    </svg>
  );
}

function IndustryPromptsAnimation() {
  const lines = [
    { y: 20, w: 200, label: 'VARIANCE ANALYSIS FRAMEWORK' },
    { y: 36, w: 160, label: 'Input transaction data below:' },
    { y: 52, w: 220, label: '1. Identify unreconciled items > threshold' },
    { y: 68, w: 180, label: '2. Classify: timing / error / unknown' },
    { y: 84, w: 140, label: '3. Generate corrective actions' },
  ];
  return (
    <svg width="100%" height="100" viewBox="0 0 280 100" fill="none">
      <rect x="10" y="8" width="260" height="84" rx="4"
        fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.10)" strokeWidth="1"/>
      {/* Left accent */}
      <rect x="10" y="8" width="3" height="84" rx="2" fill="var(--accent)" opacity="0.7"/>
      {lines.map((l, i) => (
        <text key={l.y} x="22" y={l.y} fontSize={i === 0 ? 8 : 7.5}
          fontWeight={i === 0 ? "bold" : "normal"} fontFamily="var(--font-mono)"
          fill={i === 0 ? 'var(--accent)' : 'rgba(255,255,255,0.6)'}>
          <animate attributeName="opacity" values="0;1" dur={`${0.4 * (i + 1)}s`} fill="freeze" begin={`${i * 0.3}s`}/>
          {l.label}
        </text>
      ))}
    </svg>
  );
}

function CaseStudiesAnimation() {
  const bars = [
    { label: 'EY', val: 78, color: '#4FFFB0' },
    { label: 'PWC', val: 62, color: '#60A5FA' },
    { label: 'KPMG', val: 71, color: '#A78BFA' },
    { label: 'Deloitte', val: 85, color: '#FFB547' },
  ];
  return (
    <svg width="100%" height="100" viewBox="0 0 280 100" fill="none">
      {bars.map((b, i) => (
        <g key={b.label}>
          <rect x={20 + i * 62} y={90 - b.val * 0.7} width={42} height={b.val * 0.7} rx="3"
            fill={`${b.color}28`} stroke={b.color} strokeWidth="1">
            <animate attributeName="height" from="0" to={`${b.val * 0.7}`} dur={`${0.6 + i * 0.15}s`} fill="freeze"
              calcMode="spline" keySplines="0.4 0 0.2 1"/>
            <animate attributeName="y" from="90" to={`${90 - b.val * 0.7}`} dur={`${0.6 + i * 0.15}s`} fill="freeze"
              calcMode="spline" keySplines="0.4 0 0.2 1"/>
          </rect>
          <text x={41 + i * 62} y="96" textAnchor="middle" fontSize="7" fill={b.color} fontFamily="var(--font-mono)">{b.label}</text>
          <text x={41 + i * 62} y={84 - b.val * 0.7} textAnchor="middle" fontSize="8" fill={b.color} fontFamily="var(--font-mono)" fontWeight="bold">
            {b.val}%
          </text>
        </g>
      ))}
      <text x="140" y="12" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.4)" fontFamily="var(--font-mono)">
        AI ADOPTION IMPROVEMENT
      </text>
    </svg>
  );
}

function LiveDiscoveryAnimation() {
  const items = [
    { score: 9.2, title: 'EY releases AI audit framework', age: '2h ago' },
    { score: 8.7, title: 'Claude API: new F&A capabilities', age: '4h ago' },
    { score: 8.1, title: 'AICPA AI guidance for CPAs', age: '6h ago' },
  ];
  return (
    <svg width="100%" height="100" viewBox="0 0 280 100" fill="none">
      {items.map((item, i) => (
        <g key={i}>
          <rect x="10" y={8 + i * 30} width="260" height="24" rx="3"
            fill="rgba(79,255,176,0.06)" stroke="rgba(79,255,176,0.15)" strokeWidth="1">
            <animate attributeName="fill-opacity" values="0.06;0.14;0.06" dur={`${2.5 + i * 0.5}s`} repeatCount="indefinite"/>
          </rect>
          {/* Score badge */}
          <rect x="14" y={12 + i * 30} width="28" height="16" rx="2" fill="rgba(79,255,176,0.18)"/>
          <text x="28" y={23 + i * 30} textAnchor="middle" fontSize="8" fill="var(--accent)" fontFamily="var(--font-mono)" fontWeight="bold">
            {item.score}
          </text>
          <text x="50" y={23 + i * 30} fontSize="7.5" fill="rgba(255,255,255,0.7)" fontFamily="var(--font-body)">{item.title}</text>
          <text x="258" y={23 + i * 30} textAnchor="end" fontSize="7" fill="rgba(255,255,255,0.3)" fontFamily="var(--font-mono)">{item.age}</text>
        </g>
      ))}
      {/* Pulse dot */}
      <circle cx="16" cy="8" r="4" fill="var(--accent)">
        <animate attributeName="r" values="4;7;4" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite"/>
      </circle>
    </svg>
  );
}

function AutomationLabAnimation() {
  return (
    <svg width="100%" height="100" viewBox="0 0 280 100" fill="none">
      {/* Central gear */}
      <g transform="translate(140,50)">
        <circle r="16" fill="rgba(255,181,71,0.10)" stroke="rgba(255,181,71,0.4)" strokeWidth="1.5">
          <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="12s" repeatCount="indefinite"/>
        </circle>
        <text textAnchor="middle" y="4" fontSize="14" fill="#FFB547">⚙</text>
      </g>
      {/* Satellite items */}
      {[
        { x: 55, y: 25, label: 'AP Auto', dur: '8s' },
        { x: 225, y: 25, label: 'AR Match', dur: '10s' },
        { x: 45, y: 75, label: 'Close AI', dur: '9s' },
        { x: 235, y: 75, label: 'Tax Bot', dur: '11s' },
      ].map(n => (
        <g key={n.label}>
          <line x1="140" y1="50" x2={n.x} y2={n.y} stroke="rgba(255,181,71,0.25)" strokeWidth="1" strokeDasharray="3 3">
            <animate attributeName="stroke-opacity" values="0.25;0.6;0.25" dur={n.dur} repeatCount="indefinite"/>
          </line>
          <rect x={n.x - 22} y={n.y - 11} width="44" height="22" rx="3"
            fill="rgba(255,181,71,0.08)" stroke="rgba(255,181,71,0.35)" strokeWidth="1">
            <animate attributeName="fill-opacity" values="0.08;0.20;0.08" dur={n.dur} repeatCount="indefinite"/>
          </rect>
          <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize="7.5" fill="#FFB547" fontFamily="var(--font-mono)">{n.label}</text>
        </g>
      ))}
      {/* Orbiting particle */}
      <circle r="3" fill="#FFB547" opacity="0.7">
        <animateMotion dur="5s" repeatCount="indefinite"
          path="M 140 50 m -60 0 a 60 40 0 1 1 120 0 a 60 40 0 1 1 -120 0"/>
      </circle>
    </svg>
  );
}

const PILLAR_ANIMATIONS = [
  AIToolsAnimation, ProcessTowersAnimation, IndustryPromptsAnimation,
  CaseStudiesAnimation, LiveDiscoveryAnimation, AutomationLabAnimation,
];

const PILLARS = [
  { n: '01', title: 'AI Tools Hub',      desc: 'Claude, ChatGPT, Copilot, Grok, Gemini — F&A-specific use cases and frameworks for every tool.', stat: '5 tools covered', live: false },
  { n: '02', title: 'Process Towers',    desc: '80 Claude-optimised prompts across AP, AR, R2R, Tax, Audit, FP&A, Payroll, and Treasury.', stat: '8 towers · 10 prompts each', live: false },
  { n: '03', title: 'Industry Prompts',  desc: '150 deep-analysis frameworks across 10 sectors. Each averages 17,000 characters of structured framework.', stat: '150 prompts · 10 industries', live: false },
  { n: '04', title: 'Case Studies',      desc: 'Published Big Four results on AI adoption — cited, sourced, no affiliation claimed.', stat: '10 sourced case studies', live: false },
  { n: '05', title: 'Live Discovery',    desc: "Today's F&A AI developments — curated and scored by Claude for relevance every single day.", stat: 'Updated daily', live: true },
  { n: '06', title: 'Automation Lab',    desc: 'Practical automation ideas across F&A towers. Ready to implement. More launching weekly.', stat: 'Growing weekly', live: false },
];

const SAMPLE_PROMPT = `BANK RECONCILIATION VARIANCE ANALYSIS

You are a senior finance professional conducting month-end bank
reconciliation review. Analyse the reconciliation data below and produce:

1. VARIANCE IDENTIFICATION
   — All unreconciled items above materiality threshold
   — Classify each: timing difference / error / missing entry / unknown

2. RISK ASSESSMENT
   — Items outstanding > 30 days flagged
   — Patterns suggesting systematic error identified

3. CORRECTIVE ACTIONS
   — Journal entry recommendations with account codes
   — Escalation items requiring controller sign-off

Paste your reconciliation data here:`;

const HOW_STEPS = [
  { n: '01', title: 'Find your prompt', body: 'Search by function, tower, or industry. Every prompt is tagged for role, complexity, and AI tool.' },
  { n: '02', title: 'Paste into Claude', body: 'Copy for Claude with one click. The framework does the engineering — you bring the data.' },
  { n: '03', title: 'Get professional output', body: 'Review, refine, and use. Come back tomorrow for new briefings from Live Discovery.' },
];

const PROOF = [
  { stat: '98%', body: 'of accounting firms now use AI in some form', src: 'Karbon 2026 Survey' },
  { stat: '35%', body: 'average reduction in close cycle time with structured AI workflows', src: 'Deloitte CFO Survey 2026' },
  { stat: '82%', body: 'of CPA firms use ChatGPT but most get inconsistent output without structured prompts', src: 'Future Firm 2025' },
];

const WHO = ['CPAs and Accounting Firms','CFOs and Controllers','FP&A Analysts','AP / AR Managers','Hotel Finance Teams','Internal Auditors','Tax Professionals','BPO and GDS Operators'];

const TYPEWRITER_PHRASES = [
  'bank reconciliation',
  'variance analysis',
  'FP&A reporting',
  'AP automation',
  'month-end close',
  'audit preparation',
  'tax compliance',
  'cash flow forecasting',
];

/* ─────────────────────────────────────────────────────────────
   MAIN LANDING PAGE
───────────────────────────────────────────────────────────── */
export function LandingPage() {
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const promptRef = useRef<HTMLDivElement>(null);

  function copyPrompt() {
    navigator.clipboard?.writeText(SAMPLE_PROMPT).then(() => {
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    });
  }

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh', fontFamily: 'var(--font-body)', color: 'var(--text-1)', overflowX: 'hidden' }}>

      {/* ── NAV ─────────────────────────────────────────────── */}
      <nav className="raysho-nav" style={{ padding: '0 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>

          {/* ── LOGO ── */}
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
            {/* Icon mark */}
            <div style={{
              width: 36, height: 36, borderRadius: 8, background: 'var(--accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 16px var(--accent-glow), 0 0 32px rgba(79,255,176,0.08)',
              flexShrink: 0,
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-inv)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
            </div>
            {/* Wordmark */}
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: '-0.04em',
              color: 'var(--text-1)',
              lineHeight: 1,
            }}>
              Ray<span style={{ color: 'var(--accent)' }}>sho</span>
            </span>
          </a>

          {/* ── NAV LINKS ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {[['#how','How it works'],['#pillars','Platform'],['#sample','See a prompt'],['#who',"Who it's for"]].map(([href, lbl]) => (
              <a key={href} href={href} className="nav-link" style={{
                fontSize: 13, fontWeight: 500, padding: '6px 12px',
                borderRadius: 6, fontFamily: 'var(--font-body)',
                letterSpacing: 0, textTransform: 'none',
              }}>
                {lbl}
              </a>
            ))}
          </div>

          {/* ── RIGHT ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ThemeToggle />
            <Link href="/platform" className="btn-primary btn-3d" style={{ fontSize: 14, padding: '10px 22px' }}>
              Open Platform →
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────── */}
      <section style={{ position: 'relative', overflow: 'hidden', minHeight: '88vh', display: 'flex', alignItems: 'center' }}>
        <div className="hero-aurora" aria-hidden="true" />

        <div className="hero-content" style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px', width: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 480px', gap: 64, alignItems: 'center' }}>

            {/* LEFT — copy */}
            <div>
              {/* Eyebrow */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500,
                letterSpacing: '0.10em', textTransform: 'uppercase',
                color: 'var(--accent)', background: 'var(--accent-dim)',
                border: '1px solid var(--accent-border)', borderRadius: 4,
                padding: '5px 14px', marginBottom: 28,
              }}>
                <span className="live-dot" />
                The F&A Professional's Guide to AI
              </div>

              {/* Headline */}
              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(38px, 5vw, 60px)',
                fontWeight: 800, lineHeight: 1.05,
                letterSpacing: '-0.03em',
                color: 'var(--text-1)',
                marginBottom: 12,
              }}>
                Stop guessing with AI.
              </h1>
              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(38px, 5vw, 60px)',
                fontWeight: 800, lineHeight: 1.05,
                letterSpacing: '-0.03em',
                marginBottom: 28,
              }}>
                Get a prompt for{' '}
                <Typewriter phrases={TYPEWRITER_PHRASES} />
              </h1>

              <p style={{
                fontFamily: 'var(--font-body)', fontSize: 18,
                color: 'var(--text-2)', lineHeight: 1.75, maxWidth: 500, marginBottom: 40,
              }}>
                230 Claude-optimised frameworks, 8 process towers, and daily AI briefings
                scored for F&A relevance. Built by practitioners.
              </p>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link href="/platform" className="btn-primary btn-3d" style={{ fontSize: 16, padding: '14px 32px' }}>
                  Start with your function →
                </Link>
                <a href="#sample" className="btn-ghost btn-3d" style={{ fontSize: 15, padding: '14px 24px' }}>
                  See Claude-optimised prompts
                </a>
              </div>

              {/* Stats row */}
              <div style={{ display: 'flex', gap: 32, marginTop: 48, flexWrap: 'wrap' }}>
                {[['230', 'Prompts'],['8', 'Towers'],['10', 'Industries'],['Daily','Updates']].map(([v, l]) => (
                  <div key={l}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--accent)', lineHeight: 1 }}>{v}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-3)', marginTop: 4 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — AI visualization panel */}
            <div className="glass-card" style={{
              padding: '28px', borderRadius: 16, position: 'relative',
              background: 'rgba(255,255,255,0.04)',
              boxShadow: '0 0 40px rgba(79,255,176,0.06), inset 0 1px 0 rgba(255,255,255,0.12)',
            }}>
              {/* Panel header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)' }}>
                  <style>{`@keyframes panel-pulse { 0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(0.8)} }`}</style>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--text-ai)' }}>
                  Live F&A AI Feed
                </span>
              </div>

              {/* Simulated live prompt output */}
              {[
                { role: 'PRACTITIONER', color: 'var(--accent)', text: 'Analyse this AP aging report for payment risk...' },
                { role: 'CLAUDE', color: 'var(--blue)', text: 'Identified 3 high-risk vendors (>90 days), $142K exposure. Recommended: immediate escalation for Vendor #7...' },
                { role: 'PRACTITIONER', color: 'var(--accent)', text: 'Generate journal entry recommendations' },
                { role: 'CLAUDE', color: 'var(--blue)', text: 'DR Accounts Payable 142,350 | CR Cash / Bank 142,350 — Review by Controller required per policy...' },
              ].map((msg, i) => (
                <div key={i} style={{ marginBottom: 12, padding: '10px 12px', borderRadius: 6, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, fontWeight: 600, letterSpacing: '0.10em', color: msg.color, marginBottom: 5 }}>{msg.role}</div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-2)', lineHeight: 1.6 }}>{msg.text}</div>
                </div>
              ))}

              {/* Typing indicator */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 12px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--blue)', letterSpacing: '0.08em' }}>CLAUDE</span>
                <div style={{ display: 'flex', gap: 3 }}>
                  {[0,1,2].map(d => (
                    <div key={d} style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--blue)', opacity: 0.7,
                      animation: `typing-dot 1.2s ${d * 0.2}s ease-in-out infinite` }} />
                  ))}
                </div>
                <style>{`@keyframes typing-dot{0%,80%,100%{transform:scale(0.7);opacity:0.4}40%{transform:scale(1);opacity:1}}`}</style>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────── */}
      <section id="how" style={{ borderTop: '1px solid var(--brutal-border)', borderBottom: '1px solid var(--glass-border)', background: 'var(--bg-raised)', padding: '72px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-3)' }}>How it works</span>
            <div style={{ flex: 1, height: 1, background: 'var(--brutal-border)' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            {HOW_STEPS.map((s, i) => (
              <div key={s.n} className="hybrid-card hover-lift" style={{ padding: '28px', position: 'relative', overflow: 'hidden' }}>
                {/* Large number watermark */}
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 80, fontWeight: 800, position: 'absolute', right: 16, top: -8, color: 'rgba(79,255,176,0.05)', letterSpacing: '-0.05em', lineHeight: 1, pointerEvents: 'none' }}>{s.n}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent)', letterSpacing: '0.10em', marginBottom: 14 }}>{s.n}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.02em', marginBottom: 10 }}>{s.title}</h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-2)', lineHeight: 1.7 }}>{s.body}</p>
                {i < 2 && (
                  <div style={{ position: 'absolute', right: -16, top: '50%', fontSize: 20, color: 'var(--accent)', opacity: 0.4, transform: 'translateY(-50%)' }}>→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SIX PILLARS — Equal-size animated glassmorphic cards ── */}
      <section id="pillars" style={{ padding: '72px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-3)' }}>The Platform</span>
            <div style={{ flex: 1, height: 1, background: 'var(--brutal-border)' }} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px,3vw,38px)', fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--text-1)', marginBottom: 40, lineHeight: 1.15 }}>
            Six pillars. One daily-use platform.
          </h2>

          {/* 3×2 symmetric grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
            {PILLARS.map((p, i) => {
              const Anim = PILLAR_ANIMATIONS[i];
              return (
                <Link
                  key={p.n}
                  href="/platform"
                  className="glass-card hover-lift"
                  style={{
                    display: 'flex', flexDirection: 'column', gap: 0,
                    textDecoration: 'none', color: 'inherit',
                    padding: '24px 24px 20px',
                    background: 'rgba(255,255,255,0.04)',
                    borderRadius: 12, overflow: 'hidden',
                    minHeight: 260,
                  }}
                >
                  {/* Animated illustration area */}
                  <div style={{ flex: 1, marginBottom: 16, borderRadius: 8, overflow: 'hidden', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <Anim />
                  </div>

                  {/* Card metadata */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.10em', color: 'var(--accent)', fontWeight: 600 }}>{p.n}</span>
                    {p.live && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-ai)' }}>
                        <span className="live-dot" style={{ width: 5, height: 5 }} />Live
                      </span>
                    )}
                  </div>
                  <h3 className="hover-grow" style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.01em', marginBottom: 6, display: 'inline-block' }}>{p.title}</h3>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, marginBottom: 10 }}>{p.desc}</p>
                  {p.stat && (
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-3)' }}>{p.stat}</div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SAMPLE PROMPT ───────────────────────────────────── */}
      <section id="sample" style={{ borderTop: '1px solid var(--brutal-border)', borderBottom: '1px solid var(--glass-border)', background: 'var(--bg-raised)', padding: '72px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-3)' }}>What Claude-optimised means</span>
            <div style={{ flex: 1, height: 1, background: 'var(--brutal-border)' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 48, alignItems: 'start' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px,2.8vw,32px)', fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--text-1)', marginBottom: 16, lineHeight: 1.2 }}>
                Not a generic prompt.<br/>A structured framework engineered for F&A.
              </h2>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--text-2)', lineHeight: 1.8, marginBottom: 20 }}>
                Generic prompts return generic output. Every Raysho prompt is role-framed, structured, and tested — so Claude knows it's working with a senior finance professional.
              </p>
              <blockquote style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 14, color: 'var(--text-2)', lineHeight: 1.8, borderLeft: '2px solid var(--accent-border)', paddingLeft: 16, marginBottom: 24 }}>
                "The difference between a prompt that works and one that doesn't is usually the difference between a practitioner writing it and a generalist guessing."
              </blockquote>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
                <span className="badge-free">Free</span>
                <span className="badge-claude">Claude-optimised</span>
                <span className="badge-new">AP Tower</span>
              </div>
              <Link href="/platform" className="btn-primary btn-3d">
                Explore all 230 prompts →
              </Link>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.06em', color: 'var(--text-3)', marginTop: 16, textTransform: 'uppercase' }}>
                ⚠ All outputs require professional review before use
              </p>
            </div>

            {/* Prompt block */}
            <div ref={promptRef} className="prompt-block" style={{ position: 'relative', fontSize: 12.5 }}>
              <button
                className={`copy-btn${copiedPrompt ? ' copied' : ''}`}
                onClick={copyPrompt}
              >
                {copiedPrompt ? '✓ Copied for Claude' : 'Copy for Claude'}
              </button>
              {SAMPLE_PROMPT}
            </div>
          </div>
        </div>
      </section>

      {/* ── PROOF ───────────────────────────────────────────── */}
      <section style={{ padding: '72px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-3)' }}>What the profession has found</span>
            <div style={{ flex: 1, height: 1, background: 'var(--brutal-border)' }} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px,2.8vw,32px)', fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--text-1)', marginBottom: 40, maxWidth: 600 }}>
            Finance functions using structured AI are operating differently.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
            {PROOF.map(p => (
              <div key={p.stat} className="hybrid-card hover-lift" style={{ padding: '28px' }}>
                <div className="hover-grow" style={{ fontFamily: 'var(--font-display)', fontSize: 52, fontWeight: 800, color: 'var(--accent)', letterSpacing: '-0.04em', lineHeight: 1, marginBottom: 12, display: 'inline-block' }}>{p.stat}</div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-1)', lineHeight: 1.65, marginBottom: 12 }}>{p.body}</p>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text-3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Source: {p.src}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO ─────────────────────────────────────────────── */}
      <section id="who" style={{ borderTop: '1px solid var(--glass-border)', background: 'var(--bg-raised)', padding: '72px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-3)' }}>Built for F&A practitioners</span>
            <div style={{ flex: 1, height: 1, background: 'var(--brutal-border)' }} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px,2.8vw,32px)', fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--text-1)', marginBottom: 32 }}>
            If Finance and Accounting is your work,<br/>this is your platform.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 8 }}>
            {WHO.map(role => (
              <div key={role} className="glass-card hover-lift" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
                <span className="hover-grow" style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-1)', display: 'inline-block' }}>{role}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ───────────────────────────────────────── */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '96px 24px', textAlign: 'center' }}>
        <div className="hero-aurora" style={{ opacity: 0.6 }} aria-hidden="true" />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 680, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', background: 'var(--accent-dim)', border: '1px solid var(--accent-border)', borderRadius: 4, padding: '5px 14px', marginBottom: 28 }}>
            Free access · No signup · No paywall
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(30px,4vw,46px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, color: 'var(--text-1)', marginBottom: 16 }}>
            The profession is moving.<br/>
            <span style={{ color: 'var(--accent)' }}>Be on the right side of it.</span>
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: 'var(--text-2)', lineHeight: 1.75, marginBottom: 40 }}>
            Finance professionals who adopted structured AI workflows early are closing faster, reporting better, and advising smarter. Raysho is where that starts.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/platform" className="btn-primary btn-3d" style={{ fontSize: 16, padding: '16px 40px' }}>
              Open Raysho — It's Free →
            </Link>
            <a href="#pillars" className="btn-ghost btn-3d" style={{ fontSize: 15, padding: '16px 28px' }}>
              Explore the platform
            </a>
          </div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-3)', marginTop: 20, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Free during launch · Daily refresh · No account required
          </p>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid var(--glass-border)', background: 'var(--bg-raised)', padding: '32px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 800, letterSpacing: '-0.03em' }}>
              Ray<span style={{ color: 'var(--accent)' }}>sho</span>
            </span>
            <div style={{ display: 'flex', gap: 24 }}>
              {[['Terms','/terms'],['Privacy','/privacy'],['Platform','/platform'],['Contact','mailto:contact.us@avantage-partners.com']].map(([l,h]) => (
                <a key={l} href={h} className="footer-link">{l}</a>
              ))}
            </div>
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--text-3)', lineHeight: 1.8, maxWidth: 800 }}>
            Raysho is an independent educational platform. Not affiliated with, endorsed by, or sponsored by Deloitte, EY, PwC, KPMG, McKinsey, Anthropic, OpenAI, Microsoft, Google, or xAI. All trademarks belong to their respective owners. Content is for educational purposes only — not professional financial, accounting, tax, or legal advice. All AI-generated outputs require review by a qualified professional before use.
          </p>
        </div>
      </footer>

    </div>
  );
}
