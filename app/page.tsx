// Server Component — dark-first, glass + liquid + neubrutalism
import Link from 'next/link';
import type { Metadata } from 'next';
import { ThemeToggle } from '@/components/ThemeToggle';

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

// ── inline CSS vars ──────────────────────────────────────────
const T = {
  accent:    'var(--accent)',
  acDim:     'var(--accent-dim)',
  acBorder:  'var(--accent-border)',
  acGlow:    'var(--accent-glow)',
  gold:      'var(--gold)',
  goldDim:   'var(--gold-dim)',
  goldBdr:   'var(--gold-border)',
  text1:     'var(--text-1)',
  text2:     'var(--text-2)',
  text3:     'var(--text-3)',
  textAI:    'var(--text-ai)',
  bg:        'var(--bg-base)',
  raised:    'var(--bg-raised)',
  elevated:  'var(--bg-elevated)',
  glassBg:   'var(--glass-bg)',
  glassBdr:  'var(--glass-border)',
  glassBdrHi:'var(--glass-border-hi)',
  brutal:    'var(--brutal-border)',
  display:   'var(--font-display)',
  body:      'var(--font-body)',
  mono:      'var(--font-mono)',
  serif:     'var(--font-serif)',
};

const SAMPLE_PROMPT = `BANK RECONCILIATION VARIANCE ANALYSIS

You are a senior finance professional conducting month-end
bank reconciliation review. Analyse the following data:

1. VARIANCE IDENTIFICATION
   — Unreconciled items above materiality threshold
   — Classify: timing / error / missing entry / unknown

2. RISK ASSESSMENT
   — Flag items outstanding > 30 days
   — Patterns suggesting systematic error

3. CORRECTIVE ACTIONS
   — Journal entry recommendations with account codes
   — Items requiring controller sign-off

Paste your reconciliation data below:`;

const PILLARS = [
  { n:'01', label:'AI Tools Hub',       desc:'Claude, ChatGPT, Copilot, Grok — F&A-specific use cases for each tool.', style:'glass' },
  { n:'02', label:'Process Towers',     desc:'80 prompts across AP, AR, R2R, Tax, Audit, FP&A, Payroll, Treasury.', wide:true, style:'hybrid', stat:'8 towers · 10 prompts each' },
  { n:'03', label:'Industry Prompts',   desc:'150 deep-analysis frameworks across 10 sectors. Avg 17,000 chars each — the most specific F&A prompt library available.', wide:true, style:'brutal', stat:'150 prompts · 10 industries' },
  { n:'04', label:'Case Studies',       desc:'Published Big Four results — cited, sourced, no affiliation claimed.', style:'glass' },
  { n:'05', label:'Live Discovery',     desc:"Today's F&A AI briefings — scored by Claude for relevance.", style:'hybrid', live:true },
  { n:'06', label:'Automation Lab',     desc:'Automation ideas across F&A towers. More launching weekly.', style:'glass' },
];

const WHO = ['CPAs and Accounting Firms','CFOs and Controllers','FP&A Analysts','AP and AR Managers','Hotel Finance Teams','Internal Auditors','Tax Professionals','BPO and GDS Operators'];

const STATS = [
  { v:'230', l:'Claude-optimised prompts' },
  { v:'8',   l:'Process towers' },
  { v:'10',  l:'Industries covered' },
  { v:'Daily', l:'AI content briefings' },
];

const PROOF = [
  { stat:'98%',   body:'of accounting firms now use AI in some form', src:'Karbon 2026 — 600 firms across 6 continents' },
  { stat:'35%',   body:'average reduction in close cycle time with structured AI workflows', src:'Deloitte CFO Survey 2026' },
  { stat:'82%',   body:'of CPA firms use ChatGPT — most get inconsistent results without structured prompts', src:"Future Firm 2025" },
];

export default function LandingPage() {
  return (
    <div style={{ background: T.bg, minHeight:'100vh', fontFamily: T.body, color: T.text1 }}>

      {/* ── NAV — Liquid Glass ─────────────────────────────── */}
      <nav className="raysho-nav">
        <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 24px', display:'flex', alignItems:'center', justifyContent:'space-between', height:60, gap:16 }}>

          {/* Logo */}
          <div style={{ display:'flex', alignItems:'center', gap:9, flexShrink:0 }}>
            <div style={{ width:30, height:30, borderRadius:6, background:T.accent, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 0 12px ${T.acGlow}` }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-inv)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
            </div>
            <span style={{ fontFamily:T.display, fontSize:15, fontWeight:800, letterSpacing:'-0.03em', color:T.text1 }}>Raysho</span>
          </div>

          {/* Nav links */}
          <div style={{ display:'flex', alignItems:'center', gap:28, flex:1, justifyContent:'center' }}>
            {[['#pillars','Platform'],['#sample','See a prompt'],['#who',"Who it's for"]].map(([href,lbl]) => (
              <a key={href} href={href} style={{ fontFamily:T.mono, fontSize:11, fontWeight:500, letterSpacing:'0.06em', textTransform:'uppercase', color:T.text3, transition:'color 130ms' }}>
                {lbl}
              </a>
            ))}
          </div>

          {/* Right side */}
          <div style={{ display:'flex', alignItems:'center', gap:10, flexShrink:0 }}>
            <ThemeToggle />
            <Link href="/platform" className="btn-primary" style={{ fontSize:13, padding:'8px 18px' }}>
              Open Platform →
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────── */}
      <section style={{ position:'relative', overflow:'hidden' }}>
        <div className="hero-aurora" aria-hidden="true" />
        <div className="hero-content" style={{ maxWidth:1280, margin:'0 auto', padding:'96px 24px 80px', textAlign:'center' }}>

          {/* Eyebrow — mono brutal label */}
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, fontFamily:T.mono, fontSize:10, fontWeight:500, letterSpacing:'0.12em', textTransform:'uppercase', color:T.textAI, background:T.acDim, border:`1px solid ${T.acBorder}`, borderRadius:3, padding:'4px 14px', marginBottom:32 }}>
            <span className="live-dot" />
            The F&A Professional's Guide to AI
          </div>

          {/* Headline */}
          <h1 style={{ fontFamily:T.display, fontSize:'clamp(34px,6vw,62px)', fontWeight:800, lineHeight:1.05, letterSpacing:'-0.03em', color:T.text1, marginBottom:24, maxWidth:860, margin:'0 auto 24px' }}>
            Stop guessing with AI.<br/>
            <span style={{ color:T.accent }}>Start using it like a professional.</span>
          </h1>

          {/* Sub */}
          <p style={{ fontFamily:T.body, fontSize:'clamp(15px,2vw,18px)', color:T.text2, lineHeight:1.75, maxWidth:560, margin:'0 auto 44px' }}>
            230 Claude-optimised prompt frameworks, 8 process towers, and daily AI briefings
            scored for F&A relevance. Built by practitioners, for practitioners.
          </p>

          {/* CTAs */}
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap', marginBottom:64 }}>
            <Link href="/platform" className="btn-primary" style={{ fontSize:15, padding:'12px 28px' }}>
              Start with your function →
            </Link>
            <a href="#sample" className="btn-ghost" style={{ fontSize:15, padding:'12px 28px' }}>
              See what Claude-optimised means
            </a>
          </div>

          {/* Stats — glass cards */}
          <div style={{ display:'flex', justifyContent:'center', gap:10, flexWrap:'wrap', maxWidth:720, margin:'0 auto' }}>
            {STATS.map(s => (
              <div key={s.l} className="glass-card" style={{ padding:'16px 28px', textAlign:'center', minWidth:140 }}>
                <div style={{ fontFamily:T.display, fontSize:28, fontWeight:800, letterSpacing:'-0.03em', color:T.accent, lineHeight:1 }}>{s.v}</div>
                <div style={{ fontFamily:T.mono, fontSize:10, letterSpacing:'0.08em', textTransform:'uppercase', color:T.text3, marginTop:6 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION RULE ───────────────────────────────────── */}
      <hr className="section-rule" />

      {/* ── SIX PILLARS BENTO ──────────────────────────────── */}
      <section id="pillars" style={{ maxWidth:1280, margin:'0 auto', padding:'72px 24px' }}>

        {/* Label */}
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:32 }}>
          <span className="section-label accent">Platform</span>
          <div style={{ flex:1, height:1, background:T.glassBdrHi }} />
        </div>
        <h2 style={{ fontFamily:T.display, fontSize:'clamp(24px,3vw,36px)', fontWeight:800, letterSpacing:'-0.025em', color:T.text1, marginBottom:40, maxWidth:600 }}>
          Six pillars. One daily-use platform.
        </h2>

        {/* Bento grid */}
        <div className="bento-grid">
          {PILLARS.map(p => (
            <Link
              key={p.n}
              href="/platform"
              className={`bento-cell ${p.style === 'glass' ? 'glass-card' : p.style === 'brutal' ? 'brutal-card' : 'hybrid-card'}`}
              style={{ gridColumn: p.wide ? 'span 2' : 'span 1', padding: p.wide ? '28px 28px' : '22px 22px' }}
            >
              {/* Number label */}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <span style={{ fontFamily:T.mono, fontSize:10, fontWeight:600, letterSpacing:'0.10em', color:T.accent }}>{p.n}</span>
                {p.live && (
                  <span style={{ display:'flex', alignItems:'center', gap:6, fontFamily:T.mono, fontSize:10, letterSpacing:'0.08em', textTransform:'uppercase', color:T.textAI }}>
                    <span className="live-dot" style={{ width:5, height:5 }} />
                    Live
                  </span>
                )}
              </div>

              {/* Title */}
              <div>
                <div style={{ fontFamily:T.display, fontSize:15, fontWeight:700, color:T.text1, marginBottom:6, letterSpacing:'-0.01em' }}>{p.label}</div>
                <div style={{ fontFamily:T.body, fontSize:13, color:T.text2, lineHeight:1.65 }}>{p.desc}</div>
              </div>

              {/* Stat */}
              {p.stat && (
                <div style={{ fontFamily:T.mono, fontSize:10, fontWeight:500, letterSpacing:'0.06em', color:T.textAI, textTransform:'uppercase' }}>
                  {p.stat}
                </div>
              )}
            </Link>
          ))}
        </div>
      </section>

      <hr className="section-rule" />

      {/* ── SAMPLE PROMPT — Brutal editorial ───────────────── */}
      <section id="sample" style={{ maxWidth:1280, margin:'0 auto', padding:'72px 24px' }}>

        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:32 }}>
          <span className="section-label accent">What Claude-optimised means</span>
          <div style={{ flex:1, height:1, background:T.glassBdrHi }} />
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:40, alignItems:'start' }}>

          {/* Left — editorial text */}
          <div>
            <h2 style={{ fontFamily:T.display, fontSize:'clamp(22px,2.8vw,32px)', fontWeight:800, letterSpacing:'-0.025em', color:T.text1, marginBottom:16, lineHeight:1.2 }}>
              Not a generic prompt.<br/>A structured professional framework.
            </h2>
            <p style={{ fontFamily:T.body, fontSize:15, color:T.text2, lineHeight:1.8, marginBottom:24 }}>
              Generic AI prompts return generic output. Every Raysho prompt is engineered
              specifically for its task — with numbered steps, required data constructs,
              and role-framing that tells Claude it's working with a senior finance professional.
            </p>
            <p style={{ fontFamily:T.serif, fontStyle:'italic', fontSize:14, color:T.text3, lineHeight:1.8, borderLeft:`2px solid ${T.acBorder}`, paddingLeft:16, marginBottom:28 }}>
              "The difference between a prompt that works and one that doesn't
              is usually the difference between a practitioner writing it
              and a generalist guessing."
            </p>

            {/* Badge row */}
            <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:28 }}>
              <span className="badge-free">Free</span>
              <span className="badge-claude">Claude-optimised</span>
              <span className="badge-new">AP Tower</span>
            </div>

            <Link href="/platform" className="btn-primary">
              Explore all 230 prompts →
            </Link>
          </div>

          {/* Right — prompt block */}
          <div className="prompt-block" style={{ fontSize:12, lineHeight:1.85 }}>
            <div className="copy-btn">Copy for Claude</div>
            {SAMPLE_PROMPT}
          </div>
        </div>

        <p style={{ fontFamily:T.mono, fontSize:10, letterSpacing:'0.06em', color:T.text3, marginTop:16, textTransform:'uppercase' }}>
          ⚠ Outputs require review by a qualified professional before use in any client or regulated context
        </p>
      </section>

      <hr className="section-rule" />

      {/* ── PROOF — editorial layout ────────────────────────── */}
      <section style={{ background:T.raised, borderTop:`1px solid ${T.glassBdr}`, borderBottom:`1px solid ${T.glassBdr}` }}>
        <div style={{ maxWidth:1280, margin:'0 auto', padding:'72px 24px' }}>

          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:32 }}>
            <span className="section-label">What the profession has found</span>
            <div style={{ flex:1, height:1, background:T.glassBdrHi }} />
          </div>

          <h2 style={{ fontFamily:T.display, fontSize:'clamp(22px,2.8vw,32px)', fontWeight:800, letterSpacing:'-0.025em', color:T.text1, marginBottom:40, maxWidth:640 }}>
            Finance functions that adopted structured AI workflows are operating differently.
          </h2>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(260px,1fr))', gap:12 }}>
            {PROOF.map(p => (
              <div key={p.stat} className="hybrid-card" style={{ padding:'24px' }}>
                <div style={{ fontFamily:T.display, fontSize:42, fontWeight:800, color:T.accent, letterSpacing:'-0.04em', lineHeight:1, marginBottom:10 }}>{p.stat}</div>
                <div style={{ fontFamily:T.body, fontSize:14, color:T.text1, lineHeight:1.65, marginBottom:10 }}>{p.body}</div>
                <div style={{ fontFamily:T.mono, fontSize:10, color:T.text3, letterSpacing:'0.06em', textTransform:'uppercase' }}>Source: {p.src}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO IT'S FOR ────────────────────────────────────── */}
      <section id="who" style={{ maxWidth:1280, margin:'0 auto', padding:'72px 24px' }}>

        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:32 }}>
          <span className="section-label">Built for F&A practitioners</span>
          <div style={{ flex:1, height:1, background:T.glassBdrHi }} />
        </div>

        <h2 style={{ fontFamily:T.display, fontSize:'clamp(22px,2.8vw,32px)', fontWeight:800, letterSpacing:'-0.025em', color:T.text1, marginBottom:32 }}>
          If Finance and Accounting is your work,<br/>this is your platform.
        </h2>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(190px,1fr))', gap:8 }}>
          {WHO.map(role => (
            <div key={role} className="glass-card" style={{ padding:'12px 16px', display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:5, height:5, borderRadius:'50%', background:T.accent, flexShrink:0 }} />
              <span style={{ fontFamily:T.body, fontSize:13, color:T.text2 }}>{role}</span>
            </div>
          ))}
        </div>
      </section>

      <hr className="section-rule" />

      {/* ── FINAL CTA — Liquid Glass ────────────────────────── */}
      <section style={{ padding:'96px 24px', textAlign:'center' }}>
        <div style={{ maxWidth:640, margin:'0 auto' }}>

          <div style={{ display:'inline-flex', alignItems:'center', gap:8, fontFamily:T.mono, fontSize:10, fontWeight:500, letterSpacing:'0.12em', textTransform:'uppercase', color:T.textAI, background:T.acDim, border:`1px solid ${T.acBorder}`, borderRadius:3, padding:'4px 14px', marginBottom:28 }}>
            Free access · No signup · No paywall
          </div>

          <h2 style={{ fontFamily:T.display, fontSize:'clamp(28px,4vw,42px)', fontWeight:800, letterSpacing:'-0.03em', lineHeight:1.1, color:T.text1, marginBottom:16 }}>
            Finance professionals who use AI properly
            are operating at a different level.
          </h2>
          <p style={{ fontFamily:T.body, fontSize:16, color:T.text2, lineHeight:1.75, marginBottom:36 }}>
            Raysho is where that starts. Open the platform now —
            no account, no paywall, no friction.
          </p>

          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            <Link href="/platform" className="btn-primary" style={{ fontSize:16, padding:'14px 36px' }}>
              Open Raysho — It's Free →
            </Link>
            <a href="#pillars" className="btn-ghost" style={{ fontSize:15, padding:'14px 24px' }}>
              Explore the platform ↓
            </a>
          </div>

          <p style={{ fontFamily:T.mono, fontSize:10, color:T.text3, marginTop:20, letterSpacing:'0.06em', textTransform:'uppercase' }}>
            Free during launch · Content refreshes daily · No signup required
          </p>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────── */}
      <footer style={{ borderTop:`1px solid ${T.glassBdr}`, background:T.raised, padding:'32px 24px' }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16, marginBottom:20 }}>
            <span style={{ fontFamily:T.display, fontSize:14, fontWeight:700, color:T.text2, letterSpacing:'-0.02em' }}>Raysho</span>
            <div style={{ display:'flex', gap:20, flexWrap:'wrap' }}>
              {[['Terms of Service','/terms'],['Privacy Policy','/privacy'],['Platform','/platform'],['contact.us@avantage-partners.com','mailto:contact.us@avantage-partners.com']].map(([l,h]) => (
                <a key={l} href={h} style={{ fontFamily:T.mono, fontSize:10, letterSpacing:'0.06em', textTransform:'uppercase', color:T.text3, transition:'color 130ms' }}>
                  {l.includes('@') ? 'Contact' : l}
                </a>
              ))}
            </div>
          </div>
          <p style={{ fontFamily:T.body, fontSize:11, color:T.text3, lineHeight:1.8, maxWidth:800 }}>
            Raysho is an independent educational platform. Not affiliated with, endorsed by, or sponsored by Deloitte, EY, PwC, KPMG, McKinsey, Anthropic, OpenAI, Microsoft, Google, or xAI. All trademarks belong to their respective owners. Content is for educational purposes only — not professional financial, accounting, tax, or legal advice. All AI-generated outputs require review by a qualified professional before use.
          </p>
        </div>
      </footer>

    </div>
  );
}
