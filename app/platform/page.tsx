'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { C, F, TM, LEGAL, SUMMARIES, TOOLS, TOOLS_RESOURCES, TOWERS, CASES, LAB_IDEAS, DEMO_FEED, INDUSTRY_PROMPTS } from './data';

// ─── RESPONSIVE HOOK ──────────────────────────────────────────────────────────
function useWindowWidth() {
  const [w, setW] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return w;
}

// ─── NEXT-SECTION FLOW ────────────────────────────────────────────────────────
const FLOW: Record<string, { id: string; label: string; desc: string }> = {
  home:     { id: 'tools',    label: 'Begin with AI Tools Hub',       desc: 'Compare all 5 AI tools with F&A-specific prompts for each' },
  tools:    { id: 'towers',   label: 'Explore Process Towers',        desc: 'AP, AR, R2R, Tax, Audit — 10 consulting-grade prompts each' },
  towers:   { id: 'cases',    label: 'See Real-World Results',        desc: 'Measured outcomes from Deloitte, EY, PwC and KPMG' },
  cases:    { id: 'prompts',  label: 'Open the Prompt Library',       desc: '80 ready-to-use prompts — search, filter and copy in one click' },
  prompts:  { id: 'industry', label: 'Industry Master Prompts',       desc: 'Deep-analysis prompts built for your specific sector' },
  industry: { id: 'feed',     label: 'Try Live Discovery',            desc: 'AI-powered search for the latest F&A content published this week' },
  feed:     { id: 'lab',      label: 'Explore the Automation Lab',    desc: '100 automation ideas across 10 F&A towers' },
  lab:      { id: 'home',     label: 'Back to Overview',              desc: 'You have explored the full Raysho platform' },
};

const NAV = [
  { id: 'home',     label: 'Overview',          icon: '◈' },
  { id: 'tools',    label: 'AI Tools Hub',      icon: '⬡' },
  { id: 'towers',   label: 'Process Towers',    icon: '⊕' },
  { id: 'cases',    label: 'Case Studies',      icon: '◉' },
  { id: 'prompts',  label: 'Prompt Library',    icon: '◆' },
  { id: 'industry', label: 'Industry Prompts',  icon: '◐' },
  { id: 'feed',     label: 'Live Discovery',    icon: '◎' },
  { id: 'lab',      label: 'Automation Lab',    icon: '⚙' },
];

// ─── SMALL COMPONENTS ─────────────────────────────────────────────────────────
function Tag({ type }: { type: string }) {
  const s = (TM as Record<string, { bg: string; fg: string; bd: string }>)[type] || TM.READ;
  return (
    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', padding: '3px 8px', borderRadius: 3, background: s.bg, color: s.fg, border: `1px solid ${s.bd}`, flexShrink: 0, whiteSpace: 'nowrap' }}>
      {type}
    </span>
  );
}

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }).catch(fallback);
    } else { fallback(); }
  };
  const fallback = () => {
    const ta = document.createElement('textarea'); ta.value = text;
    document.body.appendChild(ta); ta.select(); document.execCommand('copy');
    document.body.removeChild(ta); setCopied(true); setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} style={{ fontSize: 12, padding: '7px 14px', borderRadius: 7, border: `1px solid ${copied ? C.acbor : C.border}`, background: copied ? C.acdim : 'transparent', color: copied ? C.accent : C.t2, cursor: 'pointer', fontFamily: F.sans, transition: 'all 0.2s', flexShrink: 0, minHeight: 36 }}>
      {copied ? '✓ Ready for Claude' : 'Copy for Claude'}
    </button>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '14px 8px', background: C.card2, borderRadius: 10, border: `1px solid ${C.border}` }}>
      <div style={{ fontFamily: F.serif, fontSize: 22, color: color || C.accent, fontWeight: 400, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 11, color: C.t2, marginTop: 6, lineHeight: 1.4 }}>{label}</div>
    </div>
  );
}

function NextSection({ currentId, onNavigate }: { currentId: string; onNavigate: (id: string) => void }) {
  const next = FLOW[currentId];
  if (!next) return null;
  return (
    <div onClick={() => onNavigate(next.id)}
      style={{ marginTop: 40, padding: '18px 22px', background: `linear-gradient(135deg,${C.card} 0%,${C.card2} 100%)`, border: `1px solid ${C.acbor}`, borderRadius: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, transition: 'all 0.2s' }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = C.accent; (e.currentTarget as HTMLDivElement).style.background = C.acdim; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = C.acbor; (e.currentTarget as HTMLDivElement).style.background = `linear-gradient(135deg,${C.card} 0%,${C.card2} 100%)`; }}>
      <div>
        <div style={{ fontSize: 11, color: C.t3, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 4 }}>Up next</div>
        <div style={{ fontSize: 15, fontWeight: 600, color: C.accent }}>{next.label}</div>
        <div style={{ fontSize: 12, color: C.t2, marginTop: 3 }}>{next.desc}</div>
      </div>
      <div style={{ fontSize: 24, color: C.accent, flexShrink: 0 }}>→</div>
    </div>
  );
}

function DisclaimerBanner() {
  return (
    <div style={{ background: C.surface, borderTop: `1px solid ${C.border}`, padding: '10px 20px', fontSize: 10, color: C.t3, lineHeight: 1.7, flexShrink: 0 }}>
      <strong style={{ color: C.t2 }}>Legal notice:</strong> Raysho is an independent educational platform. Not affiliated with or endorsed by Deloitte, EY, PwC, KPMG, McKinsey, Anthropic, OpenAI, Microsoft, Google, or xAI. All trademarks belong to their respective owners. Content is for educational purposes only — not professional advice. No specific learning outcome is guaranteed.
    </div>
  );
}

function LegalModal({ onAccept }: { onAccept: () => void }) {
  const [checked, setChecked] = useState(false);
  const items = [
    { icon: '📚', title: 'Educational content only', body: 'Everything on this platform is for learning purposes. It is not professional financial, accounting, tax, or legal advice.' },
    { icon: '🔗', title: 'Independent platform', body: 'Raysho is not affiliated with, endorsed by, or sponsored by Deloitte, EY, PwC, KPMG, McKinsey, Anthropic, OpenAI, Microsoft, Google, or xAI.' },
    { icon: '📊', title: 'Third-party data', body: 'Case study figures are drawn from public sources and company press releases. Raysho has not independently verified them.' },
    { icon: '⚙️', title: 'Review AI outputs', body: 'Prompts are frameworks, not finished deliverables. All AI-generated outputs must be reviewed by a qualified professional before use.' },
    { icon: '💳', title: 'Non-refundable subscription', body: 'Digital content access commences on payment. Subscription fees are non-refundable once access has been granted.' },
  ];
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, overflowY: 'auto' }}>
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: '28px 24px', maxWidth: 480, width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: 20 }}>⚡</div>
          <div style={{ fontFamily: F.serif, fontSize: 22, color: C.text, marginBottom: 6 }}>Before you dive in</div>
          <div style={{ fontSize: 13, color: C.t2 }}>30 seconds — then you're in.</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {items.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 14px', background: C.card, borderRadius: 10, border: `1px solid ${C.border}`, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{item.icon}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 3 }}>{item.title}</div>
                <div style={{ fontSize: 12, color: C.t2, lineHeight: 1.6 }}>{item.body}</div>
              </div>
            </div>
          ))}
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', background: C.acdim, border: `1px solid ${C.acbor}`, borderRadius: 10, cursor: 'pointer', marginBottom: 16 }}>
          <input type="checkbox" checked={checked} onChange={e => setChecked(e.target.checked)} style={{ width: 18, height: 18, cursor: 'pointer', accentColor: C.accent }} />
          <span style={{ fontSize: 13, color: C.t2, lineHeight: 1.5 }}>I understand this is educational content and have read the above.</span>
        </label>
        <button onClick={() => checked && onAccept()} disabled={!checked}
          style={{ width: '100%', padding: '14px', borderRadius: 10, border: 'none', background: checked ? C.accent : '#2a2e3a', color: checked ? '#000' : C.t3, fontSize: 14, fontWeight: 700, cursor: checked ? 'pointer' : 'not-allowed', fontFamily: F.sans, transition: 'all 0.2s' }}>
          {checked ? 'Enter Raysho →' : 'Check the box above to continue'}
        </button>
      </div>
    </div>
  );
}

function SectionBrief({ sectionId, sectionName, resources }: { sectionId: string; sectionName: string; resources: Array<{ title: string; src?: string }> }) {
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState((SUMMARIES as Record<string, string>)[sectionId] || '');
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  const regenerate = async () => {
    setLoading(true); setError(null);
    const resourceList = resources?.length ? resources.map(r => `${r.title} (${r.src})`).join(', ') : 'current resources in this section';
    try {
      const res = await fetch('/api/regenerate-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionName, resourceList }),
      });
      const data = await res.json();
      if (data.text) setText(data.text);
      else setError('Regeneration unavailable — showing pre-written brief.');
    } catch { setError('Live regeneration unavailable — showing pre-written brief.'); }
    finally { setLoading(false); }
  };

  const PREVIEW_LEN = 680;
  const preview = text.length > PREVIEW_LEN ? text.slice(0, PREVIEW_LEN) + '…' : text;

  return (
    <div style={{ background: C.acdim, border: `1px solid ${C.acbor}`, borderRadius: 12, padding: '18px 20px', marginBottom: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: C.accent, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 3 }}>Section Brief</div>
          <div style={{ fontSize: 12, color: C.t3 }}>What's happening in this area of F&A AI — and why it matters to you</div>
        </div>
        <button onClick={regenerate} disabled={loading} style={{ fontSize: 11, padding: '6px 13px', borderRadius: 7, border: `1px solid ${C.acbor}`, background: 'transparent', color: loading ? C.t3 : C.accent, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: F.sans, flexShrink: 0, minHeight: 32 }}>
          {loading ? 'Updating…' : '↺ Refresh with AI'}
        </button>
      </div>
      {error && <div style={{ fontSize: 11, color: '#f87171', marginBottom: 10, padding: '6px 10px', background: 'rgba(239,68,68,0.08)', borderRadius: 6, border: '1px solid rgba(239,68,68,0.2)' }}>{error}</div>}
      <div style={{ fontSize: 13, color: C.t2, lineHeight: 1.85, whiteSpace: 'pre-wrap' }}>{expanded ? text : preview}</div>
      {text.length > PREVIEW_LEN && (
        <button onClick={() => setExpanded(e => !e)} style={{ marginTop: 10, fontSize: 12, color: C.accent, background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: F.sans, padding: 0 }}>
          {expanded ? 'Show less ↑' : 'Read full brief ↓'}
        </button>
      )}
    </div>
  );
}

// ─── SECTION COMPONENTS ───────────────────────────────────────────────────────

function ToolsHub({ onNavigate }: { onNavigate: (id: string) => void }) {
  const w = useWindowWidth(); const isMobile = w < 768;
  const [active, setActive] = useState('claude');
  const [resTab, setResTab] = useState<string>('ALL');
  const [expandedCase, setExpandedCase] = useState<number | null>(null);
  const [briefExpanded, setBriefExpanded] = useState(false);
  const tool = TOOLS.find((t: { id: string }) => t.id === active)!;

  const [liveItems, setLiveItems] = useState<null | Array<{ type: string; title: string; url: string; source: string; approved_at: string; summary: string; why_it_matters: string; is_new: boolean }>>(null);

  useEffect(() => {
    fetch('/api/content/feed?tower=AI+Tools&limit=8')
      .then(r => r.json())
      .then(d => { if (d.items?.length) setLiveItems(d.items); })
      .catch(() => {});
  }, []);

  const RES_TYPES = ['ALL','VIDEO','ARTICLE','PODCAST'];
  const TYPE_ICONS: Record<string,string> = { VIDEO:'▶', ARTICLE:'📄', PODCAST:'🎙' };
  const TYPE_COLORS: Record<string,string> = { VIDEO:'#f87171', ARTICLE:'#60a5fa', PODCAST:'#a78bfa' };

  const filteredResources = resTab === 'ALL'
    ? TOOLS_RESOURCES
    : TOOLS_RESOURCES.filter((r: { type: string }) => r.type === resTab);

  const briefText = (SUMMARIES as Record<string,string>)['tools'] || '';
  const BRIEF_PREVIEW = 520;

  return (
    <div>
      {/* ── Header ── */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: F.serif, fontSize: isMobile ? 22 : 26, fontWeight: 400, color: C.text, marginBottom: 6 }}>AI Tools Hub</h2>
        <p style={{ fontSize: 13, color: C.t2, lineHeight: 1.7 }}>F&A-specific use cases for every major AI tool. Raysho is not affiliated with any of these products.</p>
      </div>

      {/* ── Rich Section Brief ── */}
      <div style={{ background: C.acdim, border: `1px solid ${C.acbor}`, borderRadius: 12, padding: '20px 22px', marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.accent, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 3 }}>Section Brief</div>
            <div style={{ fontSize: 12, color: C.t3 }}>The state of AI tools in F&A — what each tool does, who is using it, and why tool selection matters</div>
          </div>
        </div>
        <div style={{ fontSize: 13, color: C.t2, lineHeight: 1.9, whiteSpace: 'pre-wrap' }}>
          {briefExpanded ? briefText : (briefText.length > BRIEF_PREVIEW ? briefText.slice(0, BRIEF_PREVIEW) + '…' : briefText)}
        </div>
        {briefText.length > BRIEF_PREVIEW && (
          <button onClick={() => setBriefExpanded(e => !e)} style={{ marginTop: 10, fontSize: 12, color: C.accent, background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: F.sans, padding: 0 }}>
            {briefExpanded ? 'Show less ↑' : 'Read full brief ↓'}
          </button>
        )}
      </div>

      {/* ── Unified Resource Library ── */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: isMobile ? 16 : 20, marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 2 }}>Resource Library</div>
            <div style={{ fontSize: 12, color: C.t3 }}>{TOOLS_RESOURCES.length} curated resources — videos, articles, podcasts, and LinkedIn — newest first</div>
          </div>
          {/* Type filter tabs */}
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {RES_TYPES.map(type => (
              <button key={type} onClick={() => setResTab(type)}
                style={{ padding: '5px 11px', borderRadius: 20, border: `1px solid ${resTab === type ? C.accent + '88' : C.border}`, background: resTab === type ? C.accent + '18' : 'transparent', color: resTab === type ? C.accent : C.t3, fontSize: 11, fontWeight: resTab === type ? 600 : 400, cursor: 'pointer', fontFamily: F.sans, whiteSpace: 'nowrap', minHeight: 30 }}>
                {type === 'ALL' ? 'All' : `${TYPE_ICONS[type]} ${type.charAt(0) + type.slice(1).toLowerCase()}`}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filteredResources.map((r: { type: string; title: string; url: string; src: string; date: string; summary: string; keyQuestions: string[] }, i: number) => (
            <div key={i} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: '14px 16px' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 8 }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', padding: '3px 8px', borderRadius: 4, background: TYPE_COLORS[r.type] + '22', color: TYPE_COLORS[r.type], flexShrink: 0, marginTop: 1 }}>{r.type}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, fontWeight: 600, color: C.text, textDecoration: 'none', lineHeight: 1.5, display: 'block' }}>{r.title} ↗</a>
                  <div style={{ fontSize: 11, color: C.t3, marginTop: 2 }}>{r.src}</div>
                </div>
              </div>
              <p style={{ fontSize: 12, color: C.t2, lineHeight: 1.7, margin: '0 0 10px' }}>{r.summary}</p>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: C.t3, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Key questions to explore</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {r.keyQuestions.map((q: string, qi: number) => (
                    <div key={qi} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                      <span style={{ color: C.accent, fontSize: 11, flexShrink: 0, marginTop: 1 }}>→</span>
                      <span style={{ fontSize: 12, color: C.t2, lineHeight: 1.6 }}>{q}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Disclaimer */}
        <div style={{ marginTop: 12, fontSize: 11, color: C.t3, padding: '8px 12px', background: '#0a0b0e', borderRadius: 7, border: `1px solid ${C.border}`, lineHeight: 1.6 }}>{LEGAL.contentWarning}</div>
      </div>

      {/* ── Weekly Live Feed ── */}
      {liveItems && liveItems.length > 0 && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: isMobile ? 16 : 20, marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 2 }}>This Week in AI Tools</div>
              <div style={{ fontSize: 12, color: C.t3 }}>Latest articles and videos from the platform's live content feed — updated daily</div>
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, color: C.green, background: C.green + '18', border: `1px solid ${C.green}44`, padding: '3px 9px', borderRadius: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Live</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {liveItems.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '11px 13px', background: C.surface, borderRadius: 8, border: `1px solid ${item.is_new ? C.acbor : C.border}` }}>
                <Tag type={item.type} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, fontWeight: 500, color: C.text, textDecoration: 'none', lineHeight: 1.5, display: 'block' }}>
                    {item.is_new && <span style={{ fontSize: 9, fontWeight: 700, color: C.accent, background: C.acdim, border: `1px solid ${C.acbor}`, padding: '1px 6px', borderRadius: 3, marginRight: 6, letterSpacing: '0.06em', textTransform: 'uppercase', verticalAlign: 'middle' }}>New</span>}
                    {item.title} ↗
                  </a>
                  <div style={{ fontSize: 11, color: C.t3, marginTop: 2 }}>{item.source}</div>
                  {item.why_it_matters && <div style={{ fontSize: 12, color: C.t2, marginTop: 5, lineHeight: 1.6 }}>{item.why_it_matters}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Tool Selector ── */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: C.t2, marginBottom: 10 }}>Explore use cases by tool</div>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
          {TOOLS.map((t: { id: string; name: string; color: string }) => (
            <button key={t.id} onClick={() => { setActive(t.id); setExpandedCase(null); }}
              style={{ padding: '10px 16px', borderRadius: 20, border: `1px solid ${active === t.id ? t.color + '88' : C.border}`, background: active === t.id ? t.color + '18' : 'transparent', color: active === t.id ? t.color : C.t2, fontSize: 13, fontWeight: active === t.id ? 600 : 400, cursor: 'pointer', fontFamily: F.sans, whiteSpace: 'nowrap', flexShrink: 0, minHeight: 42 }}>
              {t.name}
            </button>
          ))}
        </div>
      </div>

      {/* ── Active Tool Card ── */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderLeft: `3px solid ${tool.color}`, borderRadius: 12, overflow: 'hidden' }}>
        {/* Tool header */}
        <div style={{ padding: '16px 18px', borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 3 }}>{tool.name} <span style={{ fontSize: 12, color: C.t3, fontWeight: 400 }}>by {tool.by}</span></div>
              <div style={{ fontSize: 12, color: C.t2, lineHeight: 1.6 }}>{tool.tagline}</div>
            </div>
            <a href={(tool as { url: string }).url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: tool.color, textDecoration: 'none', padding: '7px 13px', borderRadius: 7, border: `1px solid ${tool.color}44`, background: tool.color + '0d', flexShrink: 0, minHeight: 36, display: 'flex', alignItems: 'center' }}>{(tool as { price: string }).price} ↗</a>
          </div>
          {/* Strengths */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {(tool as { strengths: string[] }).strengths.map((s: string, i: number) => (
              <span key={i} style={{ fontSize: 11, color: C.t2, background: C.surface, border: `1px solid ${C.border}`, padding: '3px 9px', borderRadius: 4, lineHeight: 1.5 }}>✓ {s}</span>
            ))}
          </div>
        </div>

        {/* Use cases */}
        <div style={{ padding: isMobile ? 14 : '16px 20px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.t3, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>F&A Use Cases — {(tool as { usecases: unknown[] }).usecases.length} workflows</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(tool as { usecases: { title: string; workflow: string; description: string; automationAreas: string[]; keyQuestions: string[] }[] }).usecases.map((c, i) => {
              const open = expandedCase === i;
              return (
                <div key={c.title} style={{ background: C.surface, border: `1px solid ${open ? tool.color + '55' : C.border}`, borderRadius: 9, overflow: 'hidden' }}>
                  <div onClick={() => setExpandedCase(open ? null : i)} style={{ padding: '13px 16px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, minHeight: 54 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: C.text, lineHeight: 1.4 }}>{c.title}</div>
                      <div style={{ fontSize: 11, color: C.t3, marginTop: 2 }}>{c.workflow}</div>
                    </div>
                    <span style={{ fontSize: 14, color: tool.color, flexShrink: 0, display: 'inline-block', transform: `rotate(${open ? 180 : 0}deg)`, transition: 'transform 0.2s' }}>▾</span>
                  </div>
                  {open && (
                    <div style={{ padding: '0 16px 18px', borderTop: `1px solid ${C.border}` }}>
                      {/* Description */}
                      <p style={{ fontSize: 13, color: C.t2, lineHeight: 1.8, margin: '14px 0 14px' }}>{c.description}</p>
                      {/* Automation areas */}
                      <div style={{ marginBottom: 14 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: C.t3, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 7 }}>Automates these tasks</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          {c.automationAreas.map((a: string, ai: number) => (
                            <span key={ai} style={{ fontSize: 11, color: tool.color, background: tool.color + '12', border: `1px solid ${tool.color}33`, padding: '3px 10px', borderRadius: 4, lineHeight: 1.5 }}>{a}</span>
                          ))}
                        </div>
                      </div>
                      {/* Key questions */}
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: C.t3, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Key questions to ask {tool.name}</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {c.keyQuestions.map((q: string, qi: number) => (
                            <div key={qi} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '9px 12px', background: C.card, borderRadius: 7, border: `1px solid ${C.border}` }}>
                              <span style={{ color: tool.color, fontSize: 12, flexShrink: 0, marginTop: 1 }}>→</span>
                              <span style={{ fontSize: 12, color: C.t2, lineHeight: 1.65 }}>{q}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div style={{ marginTop: 12, fontSize: 11, color: C.t2, background: '#0a0b0e', border: `1px solid ${C.border}`, borderRadius: 6, padding: '8px 12px', lineHeight: 1.6 }}><strong style={{ color: C.t3 }}>Note:</strong> {LEGAL.promptDisclaimer}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <NextSection currentId="tools" onNavigate={onNavigate} />
    </div>
  );
}



function AutomationLab({ onNavigate }: { onNavigate: (id: string) => void }) {
  const w = useWindowWidth(); const isMobile = w < 768;
  const [activeTower, setActiveTower] = useState('AP');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterMaturity, setFilterMaturity] = useState('All');
  const [filterEffort, setFilterEffort] = useState('All');

  const TOWERS_LAB: Array<{ id: string; label: string; color: string; count: number; soon?: boolean }> = [
    { id: 'AP', label: 'Accounts Payable', color: '#f0b429', count: 10 },
    { id: 'AR', label: 'Accounts Receivable', color: '#10b981', count: 10 },
    { id: 'R2R', label: 'Record to Report', color: '#4a9eff', count: 10 },
    { id: 'TREAS', label: 'Treasury and Cash', color: '#e07b4a', count: 10 },
    { id: 'FPA', label: 'FP&A', color: '#a78bfa', count: 10 },
    { id: 'PAY', label: 'Payroll Processing', color: '#60a5fa', count: 10 },
    { id: 'TAX', label: 'Tax & Compliance', color: '#f0b429', count: 10 },
    { id: 'FA', label: 'Fixed Assets', color: '#ef4444', count: 10 },
    { id: 'AUD', label: 'Audit & Assurance', color: '#a78bfa', count: 10 },
    { id: 'REP', label: 'Financial Reporting', color: '#60a5fa', count: 10 },
  ];

  const MATURITY_COLORS: Record<string, string> = {
    'Mid-market': '#10b981', 'Enterprise': '#4a9eff', 'Both': '#a78bfa'
  };
  const EFFORT_COLORS: Record<string, string> = {
    'Quick win': '#10b981', 'Medium-term': '#f0b429', 'Transformation': '#ef4444'
  };
  const STEP_COLORS: Record<string, string> = {
    grey: C.t3, amber: '#f0b429', green: '#10b981', red: '#ef4444'
  };
  const AUTO_TYPE_COLORS: Record<string, string> = {
    EXTRACT: '#4a9eff', MATCH: '#10b981', ROUTE: '#f0b429',
    PREDICT: '#a78bfa', GENERATE: '#e07b4a', VALIDATE: '#ef4444',
    CONTROL: '#10b981', CLASSIFY: '#60a5fa'
  };
  const BLOCK_HEADING_COLORS = ['#f0b429','#10b981','#4a9eff','#a78bfa','#e07b4a','#ef4444'];

  const towerIdeas = (LAB_IDEAS as typeof LAB_IDEAS).filter((idea: typeof LAB_IDEAS[0]) => idea.tower === activeTower);
  const filteredIdeas = towerIdeas.filter((idea: typeof LAB_IDEAS[0]) => {
    const matchM = filterMaturity === 'All' || idea.maturity === filterMaturity || idea.maturity === 'Both';
    const matchE = filterEffort === 'All' || idea.effort === filterEffort;
    return matchM && matchE;
  });

  const activeTowerData = TOWERS_LAB.find(t => t.id === activeTower)!;

  // Render summary content blocks
  const renderSummary = (summary: typeof LAB_IDEAS[0]['summary'], towerColor: string) => {
    let headingIdx = 0;
    return summary.map((block, bi) => {
      if (block.t === 'h') {
        const color = BLOCK_HEADING_COLORS[headingIdx % BLOCK_HEADING_COLORS.length];
        headingIdx++;
        return (
          <div key={bi} style={{ marginTop: bi === 0 ? 0 : 24, marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <div style={{ width: 3, height: 18, background: color, borderRadius: 2, flexShrink: 0 }} />
              <div style={{ fontSize: 14, fontWeight: 700, color: color, letterSpacing: '0.01em' }}>{block.v as string}</div>
            </div>
            <div style={{ height: 1, background: `${color}22`, marginBottom: 2 }} />
          </div>
        );
      }
      if (block.t === 'p') {
        return <p key={bi} style={{ fontSize: 13, color: C.t2, lineHeight: 1.85, margin: '0 0 12px', textAlign: 'justify' }}>{block.v as string}</p>;
      }
      if (block.t === 'b') {
        return (
          <ul key={bi} style={{ margin: '0 0 16px', paddingLeft: 0, listStyle: 'none' }}>
            {(block.v as string[]).map((item, ii) => (
              <li key={ii} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 8 }}>
                <span style={{ color: towerColor, fontSize: 12, flexShrink: 0, marginTop: 2, fontWeight: 700 }}>→</span>
                <span style={{ fontSize: 13, color: C.t2, lineHeight: 1.75 }}>{item}</span>
              </li>
            ))}
          </ul>
        );
      }
      if (block.t === 'c') {
        return (
          <div key={bi} style={{ margin: '0 0 16px', padding: '12px 16px', background: `${towerColor}0d`, border: `1px solid ${towerColor}33`, borderLeft: `3px solid ${towerColor}`, borderRadius: 8 }}>
            <p style={{ fontSize: 13, color: C.t2, lineHeight: 1.8, margin: 0, fontStyle: 'italic' }}>{block.v as string}</p>
          </div>
        );
      }
      return null;
    });
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: '#a78bfa', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Automation Intelligence Lab</div>
        <h2 style={{ fontFamily: F.serif, fontSize: isMobile ? 22 : 26, fontWeight: 400, color: C.text, marginBottom: 8 }}>F&A Process Automation Ideas by Tower</h2>
        <p style={{ fontSize: 13, color: C.t2, lineHeight: 1.7 }}>Step-level process maps and detailed implementation guides for practical AI and workflow automation across every F&A function.</p>
      </div>

      {/* Section Brief */}
      <SectionBrief sectionId="lab" sectionName="F&A Process Automation Intelligence Lab" resources={[]} />

      {/* Tower selector */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: C.t3, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>Select Process Tower</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {TOWERS_LAB.map(t => (
            <button key={t.id} onClick={() => { if (!t.soon) { setActiveTower(t.id); setExpandedId(null); } }}
              style={{ padding: '9px 15px', borderRadius: 20, border: `1px solid ${activeTower === t.id ? t.color + '88' : C.border}`, background: activeTower === t.id ? t.color + '18' : 'transparent', color: t.soon ? C.t3 : (activeTower === t.id ? t.color : C.t2), fontSize: 12, fontWeight: activeTower === t.id ? 600 : 400, cursor: t.soon ? 'default' : 'pointer', fontFamily: F.sans, display: 'flex', alignItems: 'center', gap: 6, minHeight: 36 }}>
              {t.label}
              {t.count > 0 && <span style={{ fontSize: 10, background: activeTower === t.id ? t.color + '33' : C.surface, color: activeTower === t.id ? t.color : C.t3, padding: '1px 6px', borderRadius: 10, fontWeight: 700 }}>{t.count}</span>}
              {t.soon && <span style={{ fontSize: 9, color: C.t3, background: C.surface, padding: '1px 5px', borderRadius: 8, letterSpacing: '0.05em' }}>SOON</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Filter bar */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, color: C.t3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Maturity:</span>
          {['All','Mid-market','Enterprise','Both'].map(m => (
            <button key={m} onClick={() => setFilterMaturity(m)} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 12, border: `1px solid ${filterMaturity === m ? C.accent + '66' : C.border}`, background: filterMaturity === m ? C.acdim : 'transparent', color: filterMaturity === m ? C.accent : C.t3, cursor: 'pointer', fontFamily: F.sans, minHeight: 26 }}>{m}</button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, color: C.t3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Effort:</span>
          {['All','Quick win','Medium-term','Transformation'].map(e => (
            <button key={e} onClick={() => setFilterEffort(e)} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 12, border: `1px solid ${filterEffort === e ? C.accent + '66' : C.border}`, background: filterEffort === e ? C.acdim : 'transparent', color: filterEffort === e ? C.accent : C.t3, cursor: 'pointer', fontFamily: F.sans, minHeight: 26 }}>{e}</button>
          ))}
        </div>
        <div style={{ fontSize: 11, color: C.t3, marginLeft: 'auto' }}>{filteredIdeas.length} of {towerIdeas.length} ideas</div>
      </div>

      {/* Idea cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filteredIdeas.map((idea: typeof LAB_IDEAS[0]) => {
          const isOpen = expandedId === idea.id;
          const tColor = activeTowerData.color;
          return (
            <div key={idea.id} style={{ background: C.card, border: `1px solid ${isOpen ? tColor + '55' : C.border}`, borderRadius: 12, overflow: 'hidden' }}>
              {/* Card header — always visible */}
              <div onClick={() => setExpandedId(isOpen ? null : idea.id)}
                style={{ padding: '16px 18px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 6 }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color: isOpen ? tColor : C.text, lineHeight: 1.3 }}>{idea.title}</span>
                  </div>
                  <div style={{ fontSize: 12, color: C.t2, lineHeight: 1.6, maxWidth: 580 }}>{idea.oneliner}</div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 10, background: `${MATURITY_COLORS[idea.maturity]}18`, color: MATURITY_COLORS[idea.maturity], border: `1px solid ${MATURITY_COLORS[idea.maturity]}33` }}>{idea.maturity}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 10, background: `${EFFORT_COLORS[idea.effort]}18`, color: EFFORT_COLORS[idea.effort], border: `1px solid ${EFFORT_COLORS[idea.effort]}33` }}>{idea.effort}</span>
                    {idea.areas.map((a: string) => (
                      <span key={a} style={{ fontSize: 10, padding: '3px 8px', borderRadius: 10, background: C.surface, color: C.t3, border: `1px solid ${C.border}` }}>{a}</span>
                    ))}
                  </div>
                </div>
                <span style={{ fontSize: 16, color: tColor, flexShrink: 0, marginTop: 2, display: 'inline-block', transform: `rotate(${isOpen ? 180 : 0}deg)`, transition: 'transform 0.2s' }}>▾</span>
              </div>

              {/* Expanded content */}
              {isOpen && (
                <div style={{ borderTop: `1px solid ${C.border}` }}>

                  {/* ── PROCESS MAP ── */}
                  <div style={{ padding: '20px 18px 16px', background: C.surface, borderBottom: `1px solid ${C.border}` }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.t3, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>Process Map — {idea.steps.length} Steps</div>
                    {/* Step map — horizontal scroll on mobile */}
                    <div style={{ overflowX: 'auto', paddingBottom: 8 }}>
                      <div style={{ display: 'flex', gap: 0, alignItems: 'stretch', minWidth: isMobile ? 900 : 'auto' }}>
                        {idea.steps.map((step: typeof idea.steps[0], si: number) => {
                          const stepBg = step.col === 'red' ? 'rgba(239,68,68,0.08)' : step.col === 'green' ? 'rgba(16,185,129,0.08)' : step.col === 'amber' ? 'rgba(240,180,41,0.08)' : C.card;
                          const stepBorder = step.col === 'red' ? 'rgba(239,68,68,0.35)' : step.col === 'green' ? 'rgba(16,185,129,0.35)' : step.col === 'amber' ? 'rgba(240,180,41,0.35)' : C.border;
                          const stepColor = STEP_COLORS[step.col];
                          return (
                            <div key={si} style={{ display: 'flex', alignItems: 'center', flexShrink: 0, flex: 1 }}>
                              <div style={{ flex: 1, background: stepBg, border: `1px solid ${stepBorder}`, borderRadius: 8, padding: '10px 10px 8px', minWidth: 88, maxWidth: 120, position: 'relative' }}>
                                {/* Step number */}
                                <div style={{ fontSize: 9, fontWeight: 700, color: stepColor, letterSpacing: '0.06em', marginBottom: 4 }}>STEP {step.n}</div>
                                {/* Step name */}
                                <div style={{ fontSize: 11, fontWeight: 500, color: step.col === 'grey' ? C.t3 : C.text, lineHeight: 1.35, marginBottom: 6 }}>{step.name}</div>
                                {/* Badges */}
                                <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                                  <span style={{ fontSize: 8, fontWeight: 700, padding: '2px 5px', borderRadius: 4, background: `${stepColor}22`, color: stepColor, letterSpacing: '0.04em' }}>{step.current}</span>
                                  {step.auto && step.atype && (
                                    <span style={{ fontSize: 8, fontWeight: 700, padding: '2px 5px', borderRadius: 4, background: `${AUTO_TYPE_COLORS[step.atype] || tColor}22`, color: AUTO_TYPE_COLORS[step.atype] || tColor, letterSpacing: '0.04em' }}>{step.atype}</span>
                                  )}
                                </div>
                                {/* Automation indicator dot */}
                                {step.auto && (
                                  <div style={{ position: 'absolute', top: 6, right: 6, width: 6, height: 6, borderRadius: '50%', background: tColor }} title="Automation opportunity" />
                                )}
                              </div>
                              {si < idea.steps.length - 1 && (
                                <div style={{ fontSize: 14, color: C.t3, flexShrink: 0, margin: '0 3px' }}>›</div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    {/* Legend */}
                    <div style={{ display: 'flex', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
                      {[['red','Bottleneck / High manual effort'],['amber','Partially automated / opportunity'],['green','Auto-capable'],['grey','Remains manual (by design)']].map(([col, label]) => (
                        <div key={col} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <div style={{ width: 8, height: 8, borderRadius: 2, background: STEP_COLORS[col as string] }} />
                          <span style={{ fontSize: 10, color: C.t3 }}>{label}</span>
                        </div>
                      ))}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: tColor }} />
                        <span style={{ fontSize: 10, color: C.t3 }}>Automation opportunity</span>
                      </div>
                    </div>
                    {/* Step tooltip detail on hover — show all tips in a scrollable list instead */}
                    <div style={{ marginTop: 14, borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: C.t3, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Step-by-step automation breakdown</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                        {idea.steps.map((step: typeof idea.steps[0]) => (
                          <div key={step.n} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '7px 10px', background: step.auto ? `${tColor}08` : C.card, borderRadius: 6, border: `1px solid ${step.auto ? tColor + '22' : C.border}` }}>
                            <span style={{ fontSize: 10, fontWeight: 700, color: STEP_COLORS[step.col], flexShrink: 0, width: 50, paddingTop: 1 }}>Step {step.n}</span>
                            <span style={{ fontSize: 11, fontWeight: 500, color: C.text, flexShrink: 0, width: 120, paddingTop: 1 }}>{step.name}</span>
                            <span style={{ fontSize: 11, color: C.t2, lineHeight: 1.6, flex: 1 }}>{step.tip}</span>
                            {step.auto && <span style={{ fontSize: 9, fontWeight: 700, color: tColor, flexShrink: 0, padding: '2px 6px', background: `${tColor}18`, borderRadius: 6, letterSpacing: '0.05em' }}>AUTO</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* ── DETAILED SUMMARY ── */}
                  <div style={{ padding: '24px 20px 20px' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.t3, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 18 }}>Detailed Implementation Guide</div>
                    {renderSummary(idea.summary, tColor)}
                  </div>

                  {/* ── TOOLS ── */}
                  <div style={{ padding: '0 20px 20px' }}>
                    <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 18, marginBottom: 14 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: C.t3, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Tool Categories & Representative Platforms</div>
                      <div style={{ fontSize: 10, color: C.t3, marginBottom: 12, fontStyle: 'italic' }}>The tool landscape evolves rapidly. Validate current capability before procurement decisions.</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {idea.tools.map((tool: typeof idea.tools[0], ti: number) => (
                          <div key={ti} style={{ padding: '12px 14px', background: C.surface, borderRadius: 8, border: `1px solid ${C.border}` }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: tColor, marginBottom: 4 }}>{tool.cat}</div>
                            <div style={{ fontSize: 12, color: C.t2, lineHeight: 1.6, marginBottom: 8 }}>{tool.what}</div>
                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                              {tool.ex.map((ex: string) => (
                                <span key={ex} style={{ fontSize: 11, padding: '3px 9px', borderRadius: 12, background: `${tColor}0d`, color: tColor, border: `1px solid ${tColor}33` }}>{ex}</span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* ── DEPENDENCIES ── */}
                    <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16, marginBottom: 16 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: C.t3, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>Prerequisites — What You Need Before You Start</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {idea.deps.map((dep: string, di: number) => (
                          <div key={di} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: '8px 12px', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 7 }}>
                            <span style={{ fontSize: 11, color: '#ef4444', flexShrink: 0, marginTop: 1, fontWeight: 700 }}>✓</span>
                            <span style={{ fontSize: 12, color: C.t2, lineHeight: 1.6 }}>{dep}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* ── KPIs ── */}
                    <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: C.t3, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>KPIs to Track After Implementation</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {idea.kpis.map((kpi: typeof idea.kpis[0], ki: number) => (
                          <div key={ki} style={{ padding: '12px 14px', background: C.surface, borderRadius: 8, border: `1px solid ${C.border}` }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 6 }}>{kpi.metric}</div>
                            <div style={{ display: 'flex', gap: isMobile ? 8 : 20, flexDirection: isMobile ? 'column' : 'row', flexWrap: 'wrap' }}>
                              <div style={{ flex: 1, minWidth: 140 }}>
                                <div style={{ fontSize: 9, fontWeight: 700, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>Before</div>
                                <div style={{ fontSize: 12, color: C.t2 }}>{kpi.before}</div>
                              </div>
                              <div style={{ flexShrink: 0, fontSize: 16, color: C.t3, alignSelf: 'center', display: isMobile ? 'none' : 'block' }}>→</div>
                              <div style={{ flex: 1, minWidth: 140 }}>
                                <div style={{ fontSize: 9, fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>After</div>
                                <div style={{ fontSize: 12, color: '#10b981', fontWeight: 500 }}>{kpi.after}</div>
                              </div>
                              <div style={{ flex: 2, minWidth: 200 }}>
                                <div style={{ fontSize: 9, fontWeight: 700, color: C.t3, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>Source basis</div>
                                <div style={{ fontSize: 11, color: C.t3, lineHeight: 1.5 }}>{kpi.basis}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredIdeas.length === 0 && (
        <div style={{ padding: '32px 20px', textAlign: 'center', color: C.t3, fontSize: 13 }}>
          No ideas match the selected filters. Try broadening your filter selection.
        </div>
      )}

      <NextSection currentId="lab" onNavigate={onNavigate} />
    </div>
  );
}


function CaseStudies({ onNavigate }: { onNavigate: (id: string) => void }) {
  const w = useWindowWidth(); const isMobile = w < 768;
  const [active, setActive] = useState(0);
  const cs = CASES[active];
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontFamily: F.serif, fontSize: isMobile ? 22 : 26, fontWeight: 400, color: C.text, marginBottom: 6 }}>Real-World Case Studies</h2>
        <p style={{ fontSize: 13, color: C.t2, lineHeight: 1.7 }}>Real operational results from named companies — AR, AP, FP&A, tax, audit, and accounting practices. Sources cited. Raysho has not independently verified any figures.</p>
      </div>
      <SectionBrief sectionId="cases" sectionName="AI in F&A Case Studies" resources={CASES.map((c: { firm: string; cat: string; src: string }) => ({ title: c.firm + ' — ' + c.cat, src: c.src }))} />
      <div style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '12px 16px', marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#f87171', marginBottom: 4 }}>Before you read these figures</div>
        <div style={{ fontSize: 12, color: C.t2, lineHeight: 1.75 }}>{LEGAL.caseStudyNote}</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
        {CASES.map((c: { firm: string; cat: string; color: string }, i: number) => (
          <div key={i} onClick={() => setActive(i)} style={{ padding: '12px 14px', background: C.card, border: `1px solid ${active === i ? c.color + '66' : C.border}`, borderRadius: 9, cursor: 'pointer', minHeight: 60 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: active === i ? c.color : C.text, lineHeight: 1.3 }}>{c.firm}</div>
            <div style={{ fontSize: 11, color: C.t3, marginTop: 3, lineHeight: 1.4 }}>{c.cat}</div>
          </div>
        ))}
      </div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderLeft: `3px solid ${cs.color}`, borderRadius: 12, padding: isMobile ? '16px' : '22px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: cs.color, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>{cs.firm} · {cs.cat}</div>
        <div style={{ fontFamily: F.serif, fontSize: isMobile ? 17 : 20, color: C.text, fontWeight: 400, marginBottom: 14, lineHeight: 1.35 }}>{cs.headline}</div>
        <div style={{ fontSize: 13, color: C.t2, lineHeight: 1.75, marginBottom: 20 }}>{cs.detail}</div>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(cs.metrics.length, isMobile ? 2 : 4)},1fr)`, gap: 10, marginBottom: 16 }}>
          {cs.metrics.map((m: { l: string; v: string; c: string }, i: number) => <Stat key={i} label={m.l} value={m.v} color={m.c} />)}
        </div>
        <div style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.18)', borderRadius: 8, padding: '10px 14px', marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#f87171', marginBottom: 3 }}>Source disclosure</div>
          <div style={{ fontSize: 12, color: C.t3, lineHeight: 1.7 }}>{cs.note}</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: C.surface, borderRadius: 8, border: `1px solid ${C.border}`, flexWrap: 'wrap', gap: 8 }}>
          <div><div style={{ fontSize: 11, color: C.t3 }}>Investment data</div><div style={{ fontSize: 12, color: C.t2, marginTop: 1 }}>{cs.invest}</div></div>
          <a href={cs.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: cs.color, textDecoration: 'none', padding: '7px 13px', borderRadius: 7, border: `1px solid ${cs.color}44`, background: cs.color + '0d', flexShrink: 0, minHeight: 36, display: 'flex', alignItems: 'center' }}>Read source ↗ ({cs.src})</a>
        </div>
      </div>
      <NextSection currentId="cases" onNavigate={onNavigate} />
    </div>
  );
}


function ProcessTowers({ onNavigate }: { onNavigate: (id: string) => void }) {
  const w = useWindowWidth(); const isMobile = w < 768;
  const towers = TOWERS as Array<{ id: string; name: string; short: string; color: string; summary: string; stats: string[]; prompts: Array<{ title: string; prompt: string }> }>;
  const [activeTower, setActiveTower] = useState(towers[0]?.id ?? 'ap');
  const [expandedTitle, setExpandedTitle] = useState<string | null>(null);
  const tower = towers.find(t => t.id === activeTower) ?? towers[0];

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontFamily: F.serif, fontSize: isMobile ? 22 : 26, fontWeight: 400, color: C.text, marginBottom: 6 }}>Process Towers</h2>
        <p style={{ fontSize: 13, color: C.t2, lineHeight: 1.7 }}>AI use cases and Claude-optimised prompts for every core F&A function. Select a tower to explore prompts and implementation guidance.</p>
      </div>
      <SectionBrief sectionId="towers" sectionName="F&A Process Towers" resources={[]} />
      {/* Tower selector */}
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4, marginBottom: 16, flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
        {towers.map(t => (
          <button key={t.id} onClick={() => { setActiveTower(t.id); setExpandedTitle(null); }}
            style={{ fontSize: 11, padding: '7px 14px', borderRadius: 20, border: `1px solid ${activeTower === t.id ? t.color + '88' : C.border}`, background: activeTower === t.id ? t.color + '18' : 'transparent', color: activeTower === t.id ? t.color : C.t2, cursor: 'pointer', fontFamily: F.sans, fontWeight: activeTower === t.id ? 600 : 400, whiteSpace: 'nowrap', flexShrink: 0, minHeight: 34 }}>
            {t.short}
          </button>
        ))}
      </div>
      {/* Active tower header */}
      {tower && (
        <div>
          <div style={{ background: C.card, border: `1px solid ${tower.color}33`, borderRadius: 10, padding: '16px 18px', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: tower.color, flexShrink: 0 }} />
              <div style={{ fontSize: isMobile ? 16 : 18, fontWeight: 600, color: C.text }}>{tower.name}</div>
            </div>
            <p style={{ fontSize: 13, color: C.t2, lineHeight: 1.7, margin: '0 0 10px' }}>{tower.summary}</p>
            {tower.stats?.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {tower.stats.slice(0, 3).map((s: string, i: number) => (
                  <div key={i} style={{ fontSize: 11, color: C.t3, padding: '4px 0', borderTop: `1px solid ${C.border}` }}>— {s}</div>
                ))}
              </div>
            )}
          </div>
          {/* Prompts */}
          <div style={{ fontSize: 11, color: C.t3, marginBottom: 10 }}>{tower.prompts?.length ?? 0} prompts for this tower</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {(tower.prompts ?? []).map((p: { title: string; prompt: string }) => {
              const isOpen = expandedTitle === p.title;
              return (
                <div key={p.title} style={{ background: C.card, border: `1px solid ${isOpen ? tower.color + '55' : C.border}`, borderRadius: 9, overflow: 'hidden' }}>
                  <div onClick={() => setExpandedTitle(isOpen ? null : p.title)} style={{ padding: '13px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, minHeight: 52 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: C.text, lineHeight: 1.4 }}>{p.title}</div>
                    </div>
                    <div style={{ fontSize: 11, color: C.t3, flexShrink: 0 }}>{isOpen ? '▲' : '▼'}</div>
                  </div>
                  {isOpen && (
                    <div style={{ padding: '0 16px 16px', borderTop: `1px solid ${C.border}` }}>
                      <div style={{ background: C.bg, borderRadius: 8, padding: '12px 14px', marginTop: 12, position: 'relative' }}>
                        <pre style={{ fontSize: 12, color: C.t2, lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: F.sans }}>{p.prompt}</pre>
                        <CopyBtn text={p.prompt} />
                      </div>
                      <div style={{ marginTop: 10, padding: '8px 12px', background: 'rgba(240,180,41,0.07)', border: '1px solid rgba(240,180,41,0.18)', borderRadius: 7 }}>
                        <div style={{ fontSize: 11, color: C.accent, fontWeight: 600, marginBottom: 3 }}>Claude-optimised prompt</div>
                        <div style={{ fontSize: 11, color: C.t3, lineHeight: 1.6 }}>Designed for Claude by Anthropic. For best results, upload your data file alongside this prompt. Review all AI outputs before professional use.</div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      <NextSection currentId="towers" onNavigate={onNavigate} />
    </div>
  );
}

function PromptLibrary({ onNavigate }: { onNavigate: (id: string) => void }) {
  const w = useWindowWidth(); const isMobile = w < 768;
  const allPrompts = TOWERS.flatMap((tower: { short: string; color: string; prompts: Array<{ title: string; prompt: string }> }) =>
    tower.prompts.map(p => ({ ...p, cat: tower.short, towerColor: tower.color }))
  );
  const cats = [...new Set(allPrompts.map((p: { cat: string }) => p.cat))];
  const [cat, setCat] = useState('All');
  const [search, setSearch] = useState('');
  const [expandedTitle, setExpandedTitle] = useState<string | null>(null);
  const filtered = allPrompts.filter((p: { cat: string; title: string }) =>
    (cat === 'All' || p.cat === cat) && (search === '' || p.title.toLowerCase().includes(search.toLowerCase()))
  );
  const handleCat = (c: string) => { setCat(c); setExpandedTitle(null); };
  const handleSearch = (v: string) => { setSearch(v); setExpandedTitle(null); };
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontFamily: F.serif, fontSize: isMobile ? 22 : 26, fontWeight: 400, color: C.text, marginBottom: 6 }}>Prompt Library</h2>
        <p style={{ fontSize: 13, color: C.t2, lineHeight: 1.7 }}>{allPrompts.length} consulting-grade prompts across {cats.length} F&A categories. All outputs require professional review before use.</p>
      </div>
      <SectionBrief sectionId="prompts" sectionName="F&A Prompt Library" resources={[]} />
      <div style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.18)', borderRadius: 9, padding: '10px 14px', marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: '#f87171', fontWeight: 600, marginBottom: 4 }}>Professional responsibility reminder</div>
        <div style={{ fontSize: 12, color: C.t2, lineHeight: 1.7 }}>{LEGAL.promptDisclaimer}</div>
      </div>
      <input value={search} onChange={e => handleSearch(e.target.value)} placeholder="Search all prompts…" style={{ width: '100%', padding: '11px 14px', background: C.card, border: `1px solid ${C.border}`, borderRadius: 9, color: C.text, fontSize: 13, fontFamily: F.sans, marginBottom: 10 }} />
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4, marginBottom: 12 }}>
        {(['All', ...cats] as string[]).map(c => (
          <button key={c} onClick={() => handleCat(c)} style={{ fontSize: 11, padding: '6px 13px', borderRadius: 20, border: `1px solid ${cat === c ? C.accent : C.border}`, background: cat === c ? C.acdim : 'transparent', color: cat === c ? C.accent : C.t2, cursor: 'pointer', fontFamily: F.sans, fontWeight: cat === c ? 600 : 400, whiteSpace: 'nowrap', flexShrink: 0, minHeight: 34 }}>
            {c}
          </button>
        ))}
      </div>
      <div style={{ fontSize: 11, color: C.t3, marginBottom: 12 }}>{filtered.length} of {allPrompts.length} prompts</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {filtered.map((p: { title: string; prompt: string; cat: string; towerColor: string }) => {
          const isOpen = expandedTitle === p.title;
          return (
            <div key={p.title} style={{ background: C.card, border: `1px solid ${isOpen ? C.acbor : C.border}`, borderRadius: 9, overflow: 'hidden' }}>
              <div onClick={() => setExpandedTitle(isOpen ? null : p.title)} style={{ padding: '13px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, minHeight: 52 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: C.text, lineHeight: 1.4 }}>{p.title}</span>
                    <span style={{ fontSize: 10, color: p.towerColor, background: p.towerColor + '15', padding: '2px 8px', borderRadius: 3, border: `1px solid ${p.towerColor}33`, flexShrink: 0, whiteSpace: 'nowrap' }}>{p.cat}</span>
                  </div>
                </div>
                <span style={{ fontSize: 14, color: isOpen ? C.accent : C.t3, flexShrink: 0, display: 'inline-block', transform: `rotate(${isOpen ? 180 : 0}deg)`, transition: 'transform 0.2s' }}>▾</span>
              </div>
              {isOpen && (
                <div style={{ padding: '0 16px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}><CopyBtn text={p.prompt} /></div>
                  <pre style={{ margin: 0, padding: '14px', background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: isMobile ? 11 : 12, color: C.t2, lineHeight: 1.75, whiteSpace: 'pre-wrap', fontFamily: "'JetBrains Mono',monospace", overflowX: 'auto' }}>{p.prompt}</pre>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <NextSection currentId="prompts" onNavigate={onNavigate} />
    </div>
  );
}

// ─── Industry Prompts Section ────────────────────────────────────────────────

// All 10 industries are now live
const INDUSTRY_SOON: Array<{ id: string; label: string; icon: string; color: string }> = [];

function IndustryPrompts({ onNavigate }: { onNavigate: (id: string) => void }) {
  const w = useWindowWidth(); const isMobile = w < 768;
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState(false);

  const liveIndustries = Object.entries(INDUSTRY_PROMPTS);
  const currentData = selectedIndustry ? INDUSTRY_PROMPTS[selectedIndustry] : null;

  const filteredPrompts = currentData
    ? currentData.prompts.filter(p =>
        search === '' ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
      )
    : [];

  const openPrompt = currentData?.prompts.find(p => p.id === selectedPrompt);

  const copyPrompt = (text: string) => {
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  // ── Industry Grid (home view) ──
  if (!selectedIndustry) {
    return (
      <div>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontFamily: F.serif, fontSize: isMobile ? 22 : 26, fontWeight: 400, color: C.text, marginBottom: 6 }}>Industry Master Prompts</h2>
          <p style={{ fontSize: 13, color: C.t2, lineHeight: 1.7, maxWidth: 560 }}>War-room-grade analysis prompts built for your sector. Each prompt handles data upload, performs deep structured analysis with external benchmarks, and surfaces the hard questions your data is really asking.</p>
        </div>

        {/* What makes these different */}
        <div style={{ background: 'linear-gradient(135deg,rgba(240,180,41,0.08) 0%,rgba(74,158,255,0.05) 100%)', border: `1px solid ${C.border}`, borderRadius: 12, padding: isMobile ? '16px' : '20px 24px', marginBottom: 28 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: isMobile ? 12 : 20 }}>
            {[
              ['📊','Deep structured analysis','Not a summary — a full diagnostic with ranked tables, trend analysis, and decomposed drivers'],
              ['🌐','External benchmark calibration','Every prompt pulls sector benchmarks and frames your data against how the industry actually performs'],
              ['❓','Hard questions built in','Each prompt ends with the 4 questions your data is demanding that most organisations avoid asking'],
            ].map(([icon, title, desc]) => (
              <div key={title as string} style={{ flex: '1 1 200px', minWidth: 160 }}>
                <div style={{ fontSize: isMobile ? 18 : 20, marginBottom: 6 }}>{icon}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 4 }}>{title as string}</div>
                <div style={{ fontSize: 12, color: C.t2, lineHeight: 1.6 }}>{desc as string}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Live industries */}
        <div style={{ fontSize: 11, fontWeight: 600, color: C.t3, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 12 }}>
          Available now — {liveIndustries.length} {liveIndustries.length === 1 ? 'industry' : 'industries'} · {liveIndustries.reduce((a,[,v]) => a + v.prompts.length, 0)} prompts
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
          {liveIndustries.map(([key, data]) => (
            <button key={key} onClick={() => { setSelectedIndustry(key); setSearch(''); setSelectedPrompt(null); }}
              style={{ background: C.card, border: `1px solid ${data.meta.color}30`, borderRadius: 12, padding: isMobile ? '14px 12px' : '18px 16px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = data.meta.color + '60'; (e.currentTarget as HTMLButtonElement).style.background = data.meta.color + '10'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = data.meta.color + '30'; (e.currentTarget as HTMLButtonElement).style.background = C.card; }}>
              <div style={{ fontSize: isMobile ? 22 : 26, marginBottom: 8 }}>{data.meta.icon}</div>
              <div style={{ fontSize: isMobile ? 12 : 13, fontWeight: 700, color: C.text, marginBottom: 4, lineHeight: 1.3 }}>{data.meta.label}</div>
              <div style={{ fontSize: 11, color: C.t2, lineHeight: 1.5, marginBottom: 10 }}>{data.meta.desc}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11, color: data.meta.color, fontWeight: 600 }}>{data.prompts.length} prompts</span>
                <span style={{ fontSize: 11, background: data.meta.color + '20', color: data.meta.color, border: `1px solid ${data.meta.color}40`, borderRadius: 4, padding: '2px 8px', fontWeight: 600 }}>Open →</span>
              </div>
            </button>
          ))}
        </div>

        {/* Coming soon */}
        <div style={{ fontSize: 11, fontWeight: 600, color: C.t3, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 12 }}>
          Building next — {INDUSTRY_SOON.length} industries
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3, 1fr)', gap: 8 }}>
          {INDUSTRY_SOON.map(ind => (
            <div key={ind.id} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '12px 14px', opacity: 0.55 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 16 }}>{ind.icon}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: C.t2 }}>{ind.label}</span>
              </div>
              <span style={{ fontSize: 10, color: C.t3, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 3, padding: '2px 7px' }}>Coming soon</span>
            </div>
          ))}
        </div>

        <NextSection currentId="industry" onNavigate={onNavigate} />
      </div>
    );
  }

  // ── Prompt List (industry selected, no prompt open) ──
  if (!selectedPrompt) {
    return (
      <div>
        {/* Back + header */}
        <button onClick={() => { setSelectedIndustry(null); setSearch(''); }}
          style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: C.t2, background: 'none', border: 'none', cursor: 'pointer', marginBottom: 18, padding: 0, fontFamily: F.sans }}>
          ← Back to industries
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <span style={{ fontSize: 28 }}>{currentData!.meta.icon}</span>
          <div>
            <h2 style={{ fontFamily: F.serif, fontSize: isMobile ? 20 : 24, fontWeight: 400, color: C.text, marginBottom: 2 }}>{currentData!.meta.label}</h2>
            <p style={{ fontSize: 12, color: C.t2 }}>{currentData!.prompts.length} master prompts · each built for data upload and deep structured analysis</p>
          </div>
        </div>

        {/* Legal reminder */}
        <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.16)', borderRadius: 8, padding: '9px 13px', marginBottom: 16 }}>
          <span style={{ fontSize: 11, color: '#f87171' }}>AI-generated analysis — outputs require professional review and independent verification before use in decisions.</span>
        </div>

        {/* Search */}
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search prompts in this industry…"
          style={{ width: '100%', padding: '10px 14px', background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: 13, fontFamily: F.sans, marginBottom: 14 }} />

        {/* Prompt cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filteredPrompts.map((p, i) => (
            <button key={p.id} onClick={() => setSelectedPrompt(p.id)}
              style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '14px 16px', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 14, transition: 'border-color 0.15s' }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.borderColor = currentData!.meta.color + '50'}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.borderColor = C.border}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: currentData!.meta.color + '18', border: `1px solid ${currentData!.meta.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: currentData!.meta.color }}>{String(i + 1).padStart(2, '0')}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 4, lineHeight: 1.4 }}>{p.title}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {p.tags.map(tag => (
                    <span key={tag} style={{ fontSize: 10, color: C.t3, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 3, padding: '2px 6px' }}>{tag}</span>
                  ))}
                </div>
              </div>
              <span style={{ fontSize: 18, color: C.t3, flexShrink: 0 }}>›</span>
            </button>
          ))}
        </div>

        {filteredPrompts.length === 0 && search && (
          <div style={{ textAlign: 'center', padding: '30px 0', color: C.t3, fontSize: 13 }}>No prompts match "{search}"</div>
        )}
      </div>
    );
  }

  // ── Full Prompt View ──
  return (
    <div>
      <button onClick={() => setSelectedPrompt(null)}
        style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: C.t2, background: 'none', border: 'none', cursor: 'pointer', marginBottom: 18, padding: 0, fontFamily: F.sans }}>
        ← Back to {currentData!.meta.label} prompts
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 20 }}>{currentData!.meta.icon}</span>
        <span style={{ fontSize: 11, color: currentData!.meta.color, background: currentData!.meta.color + '18', border: `1px solid ${currentData!.meta.color}35`, borderRadius: 4, padding: '3px 9px', fontWeight: 600 }}>{currentData!.meta.label}</span>
      </div>
      <h2 style={{ fontFamily: F.serif, fontSize: isMobile ? 18 : 22, fontWeight: 400, color: C.text, marginBottom: 6, lineHeight: 1.3 }}>{openPrompt!.title}</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 16 }}>
        {openPrompt!.tags.map(tag => (
          <span key={tag} style={{ fontSize: 11, color: C.t3, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 3, padding: '2px 8px' }}>{tag}</span>
        ))}
      </div>

      {/* Legal */}
      <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.16)', borderRadius: 8, padding: '9px 13px', marginBottom: 14 }}>
        <span style={{ fontSize: 11, color: '#f87171' }}>AI-generated analysis — outputs require professional review and independent verification before use in business decisions.</span>
      </div>

      {/* How to use */}
      <div style={{ background: C.acdim, border: `1px solid ${C.acbor}`, borderRadius: 10, padding: '13px 16px', marginBottom: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.accent, marginBottom: 6 }}>How to use this prompt</div>
        <div style={{ fontSize: 12, color: C.t2, lineHeight: 1.7 }}>1. Copy the prompt below · 2. Open Claude (or ChatGPT / Copilot) · 3. Paste the prompt · 4. Upload or paste your dataset · 5. Review all outputs before acting on them</div>
      </div>

      {/* Copy button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
        <button onClick={() => copyPrompt(openPrompt!.prompt)}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', borderRadius: 7, border: `1px solid ${copied ? C.acbor : C.border}`, background: copied ? C.acdim : C.surface, color: copied ? C.accent : C.t2, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: F.sans, transition: 'all 0.15s' }}>
          {copied ? '✓ Ready for Claude' : 'Copy for Claude'}
        </button>
      </div>

      {/* Prompt text */}
      <pre style={{ margin: 0, padding: isMobile ? '14px' : '18px 20px', background: C.card2, border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.acbor}`, borderRadius: 10, fontSize: isMobile ? 11 : 12, color: C.text, lineHeight: 1.8, whiteSpace: 'pre-wrap', fontFamily: "'JetBrains Mono',monospace", overflowX: 'auto' }}>
        {openPrompt!.prompt}
      </pre>
    </div>
  );
}


// weight 3 = headline / weight 2 = mid / weight 1 = supporting
const TOPIC_CLOUD = [
  { label: 'AI in Accounts Payable',         weight: 3, color: '#f0b429' },
  { label: 'Machine Learning in FP&A',        weight: 3, color: '#e07b4a' },
  { label: 'Generative AI & Financial Close', weight: 3, color: '#4a9eff' },
  { label: 'AI Fraud Detection',              weight: 2, color: '#ef4444' },
  { label: 'Microsoft Copilot for Finance',   weight: 2, color: '#60a5fa' },
  { label: 'Agentic AI in Corporate Tax',     weight: 2, color: '#a78bfa' },
  { label: 'Prompt Engineering for Finance',  weight: 2, color: '#10b981' },
  { label: 'Claude AI for F&A',               weight: 2, color: '#f0b429' },
  { label: 'ChatGPT for Accountants',         weight: 2, color: '#e07b4a' },
  { label: 'AI in Accounts Receivable',       weight: 1, color: '#f0b429' },
  { label: 'AI Tools for CPA Firms',          weight: 1, color: '#10b981' },
  { label: 'AI in Treasury & Cash',           weight: 1, color: '#4a9eff' },
  { label: 'Robotic Process Automation',      weight: 1, color: '#a78bfa' },
  { label: 'AI in Payroll',                   weight: 1, color: '#e07b4a' },
  { label: 'LLMs in Audit & Assurance',       weight: 1, color: '#ef4444' },
];

const TOPIC_QUERY: Record<string, string> = {
  'AI in Accounts Payable':           'AI in accounts payable automation 2025',
  'Machine Learning in FP&A':         'Machine learning in FP&A forecasting 2025',
  'Generative AI & Financial Close':   'Generative AI in financial close and reporting',
  'AI Fraud Detection':               'AI fraud detection in accounting finance',
  'Microsoft Copilot for Finance':    'Microsoft Copilot for Finance 2025',
  'Agentic AI in Corporate Tax':      'Agentic AI in corporate tax compliance',
  'Prompt Engineering for Finance':   'Prompt engineering for finance professionals',
  'Claude AI for F&A':                'Claude AI for financial document analysis',
  'ChatGPT for Accountants':          'ChatGPT prompts for accountants 2025',
  'AI in Accounts Receivable':        'AI in accounts receivable collections cash application',
  'AI Tools for CPA Firms':           'AI tools for CPA firms and BPO 2025',
  'AI in Treasury & Cash':            'AI in treasury cash management 2025',
  'Robotic Process Automation':       'Robotic process automation in finance accounting',
  'AI in Payroll':                    'AI automation in payroll processing compliance',
  'LLMs in Audit & Assurance':        'Large language models AI in audit assurance 2025',
};

// Inject keyframes once
const CLOUD_STYLE_ID = 'raysho-cloud-kf';
function injectCloudKeyframes() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(CLOUD_STYLE_ID)) return;
  const s = document.createElement('style');
  s.id = CLOUD_STYLE_ID;
  s.textContent = `
    @keyframes fiq-float-a { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-5px)} }
    @keyframes fiq-float-b { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-8px)} }
    @keyframes fiq-float-c { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-3px)} }
    @keyframes fiq-pulse-ring { 0%{box-shadow:0 0 0 0px var(--fiq-col,#f0b429)} 70%{box-shadow:0 0 0 7px transparent} 100%{box-shadow:0 0 0 0px transparent} }
    @keyframes fiq-shimmer { 0%{opacity:0.55} 50%{opacity:1} 100%{opacity:0.55} }
    @keyframes fiq-spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
    @keyframes fiq-results-in { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
    .fiq-topic-btn { transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease, color 0.2s ease, border-color 0.2s ease !important; }
    .fiq-topic-btn:hover:not(.fiq-active) { transform: scale(1.06) translateY(-2px) !important; filter: brightness(1.15); }
    .fiq-active { animation: fiq-pulse-ring 1.6s ease-out infinite !important; }
    .fiq-results-wrap { animation: fiq-results-in 0.35s ease both; }
  `;
  document.head.appendChild(s);
}

const FLOAT_ANIMS = ['fiq-float-a', 'fiq-float-b', 'fiq-float-c'];

function TopicCloud({ activeTopic, loading, onSelect }: { activeTopic: string; loading: boolean; onSelect: (label: string) => void }) {
  useEffect(() => { injectCloudKeyframes(); }, []);

  // Stable shuffle on mount — gives organic look without reordering on re-render
  const [order] = useState(() => {
    const arr = [...TOPIC_CLOUD];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  });

  const sizeMap: Record<number, { fs: number; lh: number; px: string; py: string; fw: number; br: number; delay: number }> = {
    3: { fs: 15, lh: 1.25, px: '18px', py: '10px', fw: 700, br: 26, delay: 0 },
    2: { fs: 13, lh: 1.25, px: '15px', py: '9px',  fw: 500, br: 22, delay: 0.4 },
    1: { fs: 11, lh: 1.25, px: '13px', py: '7px',  fw: 400, br: 20, delay: 0.8 },
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 8px', justifyContent: 'center', alignItems: 'center', padding: '8px 0 4px' }}>
      {order.map((t, idx) => {
        const s = sizeMap[t.weight];
        const isActive = activeTopic === t.label;
        const col = t.color;
        const floatAnim = FLOAT_ANIMS[idx % 3];
        const floatDuration = [4.2, 5.1, 3.8, 6.0, 4.7][idx % 5];

        return (
          <button
            key={t.label}
            className={`fiq-topic-btn${isActive ? ' fiq-active' : ''}`}
            onClick={() => !loading && onSelect(t.label)}
            style={{
              // @ts-ignore
              '--fiq-col': col,
              fontSize: s.fs,
              lineHeight: s.lh,
              padding: `${s.py} ${s.px}`,
              borderRadius: s.br,
              border: `1px solid ${isActive ? col + 'bb' : col + '40'}`,
              background: isActive
                ? `linear-gradient(135deg, ${col}28 0%, ${col}14 100%)`
                : `linear-gradient(135deg, ${col}12 0%, ${col}07 100%)`,
              color: isActive ? col : col + 'b0',
              cursor: loading ? 'wait' : 'pointer',
              fontFamily: F.sans,
              fontWeight: s.fw,
              letterSpacing: t.weight === 3 ? '0.01em' : 0,
              transform: isActive ? 'scale(1.05) translateY(-2px)' : 'scale(1)',
              boxShadow: isActive
                ? `0 0 0 2px ${col}40, 0 4px 20px ${col}25, inset 0 1px 0 ${col}20`
                : `0 1px 4px rgba(0,0,0,0.3)`,
              // Float only when idle
              animation: !isActive && !loading
                ? `${floatAnim} ${floatDuration}s ease-in-out ${(idx * 0.27).toFixed(2)}s infinite`
                : 'none',
            }}
          >
            {/* Subtle inner shimmer for weight-3 items */}
            {t.weight === 3 && !isActive && (
              <span style={{
                position: 'absolute', inset: 0, borderRadius: 'inherit',
                background: `linear-gradient(90deg, transparent 0%, ${col}10 50%, transparent 100%)`,
                animation: `fiq-shimmer ${3 + (idx % 3)}s ease-in-out infinite`,
                pointerEvents: 'none',
              }} />
            )}
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

function LiveDiscovery({ onNavigate }: { onNavigate: (id: string) => void }) {
  const w = useWindowWidth(); const isMobile = w < 768;
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<null | Array<{ type: string; title: string; url: string; source: string; publishDate: string; summary: string; whyItMatters: string }>>(null);
  const [liveItems, setLiveItems] = useState<null | Array<{ type: string; title: string; url: string; source: string; approved_at: string; summary: string; why_it_matters: string; is_new: boolean }>>(null);
  const [error, setError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    injectCloudKeyframes();
    fetch('/api/content/feed?limit=10')
      .then(r => r.json())
      .then(d => { if (d.items?.length) setLiveItems(d.items); })
      .catch(() => {});
  }, []);

  const discover = async (label: string) => {
    if (loading) return;
    const query = TOPIC_QUERY[label] || label;
    setTopic(label); setLoading(true); setError(null); setResults(null);
    // Scroll to results area smoothly after short delay
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 200);
    try {
      const res = await fetch('/api/discover', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topic: query }) });
      const data = await res.json();
      if (data.results) setResults(data.results);
      else { setError('Live discovery unavailable — showing curated examples.'); setResults((DEMO_FEED as unknown[]).slice(0, 5) as Array<{ type: string; title: string; url: string; source: string; publishDate: string; summary: string; whyItMatters: string }>); }
    } catch { setError('Live discovery unavailable — showing curated examples.'); setResults((DEMO_FEED as unknown[]).slice(0, 5) as Array<{ type: string; title: string; url: string; source: string; publishDate: string; summary: string; whyItMatters: string }>); }
    finally { setLoading(false); }
  };

  return (
    <div>
      {/* ── Header ─────────────────────────────────────────────── */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: F.serif, fontSize: isMobile ? 22 : 26, fontWeight: 400, color: C.text, marginBottom: 6 }}>Live Intelligence Feed</h2>
        <p style={{ fontSize: 13, color: C.t2, lineHeight: 1.7 }}>AI-curated resources from 20+ F&A publications, scored weekly. On-demand search below.</p>
      </div>

      {/* ── Latest curated content ──────────────────────────────── */}
      {liveItems && liveItems.length > 0 && (
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.t3, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>Latest curated content</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {liveItems.map((item, i) => (
              <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <Tag type={item.type} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                    <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, fontWeight: 500, color: C.text, textDecoration: 'none', lineHeight: 1.4 }}>{item.title} ↗</a>
                    {item.is_new && <span style={{ fontSize: 9, fontWeight: 700, color: C.accent, background: C.acdim, border: `1px solid ${C.acbor}`, borderRadius: 3, padding: '2px 6px', flexShrink: 0 }}>NEW</span>}
                  </div>
                  <div style={{ fontSize: 12, color: C.t2, lineHeight: 1.6, marginBottom: 4 }}>{item.summary}</div>
                  {item.why_it_matters && <div style={{ fontSize: 11, color: C.accent, fontStyle: 'italic', marginBottom: 3 }}>Why it matters: {item.why_it_matters}</div>}
                  <div style={{ fontSize: 11, color: C.t3 }}>{item.source} · {new Date(item.approved_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Topic Constellation ─────────────────────────────────── */}
      <div style={{
        position: 'relative',
        background: 'linear-gradient(160deg, #0d0f14 0%, #0a0c11 55%, #0f1119 100%)',
        border: `1px solid ${C.border}`,
        borderRadius: 20,
        padding: isMobile ? '24px 16px 30px' : '32px 32px 36px',
        marginBottom: 28,
        overflow: 'hidden',
      }}>
        {/* Background glow orbs — purely decorative */}
        <div style={{ position: 'absolute', top: -60, right: -60, width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, #f0b42918 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -50, left: -20, width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle, #4a9eff12 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '40%', left: '35%', width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, #a78bfa0a 0%, transparent 65%)', pointerEvents: 'none' }} />

        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: isMobile ? 16 : 18, fontWeight: 700, color: C.text, marginBottom: 5, letterSpacing: '-0.01em' }}>
              Explore any F&A AI topic
            </div>
            <div style={{ fontSize: 12, color: C.t3, lineHeight: 1.55 }}>
              Tap a topic — Claude searches live and surfaces the freshest resources right now
            </div>
          </div>

          {/* Live search indicator */}
          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: C.accent, background: C.acdim, border: `1px solid ${C.acbor}`, borderRadius: 10, padding: '8px 14px', flexShrink: 0, whiteSpace: 'nowrap' }}>
              {/* Spinning ring */}
              <svg width="14" height="14" viewBox="0 0 14 14" style={{ animation: 'fiq-spin-slow 0.9s linear infinite', flexShrink: 0 }}>
                <circle cx="7" cy="7" r="5.5" stroke={C.accent} strokeWidth="1.5" strokeDasharray="20 14" fill="none" />
              </svg>
              Searching live…
            </div>
          )}
        </div>

        {/* The constellation cloud */}
        <TopicCloud activeTopic={topic} loading={loading} onSelect={discover} />

        {/* Bottom hint line */}
        <div style={{ textAlign: 'center', marginTop: 22 }}>
          {!topic && !loading && (
            <span style={{ fontSize: 11, color: C.t3, letterSpacing: '0.05em' }}>
              tap any topic to discover resources instantly
            </span>
          )}
          {topic && !loading && (
            <span style={{ fontSize: 11, color: C.t2 }}>
              Showing results for{' '}
              <span style={{ fontWeight: 700, color: C.accent }}>"{topic}"</span>
              {' '}· tap another topic to switch
            </span>
          )}
          {topic && loading && (
            <span style={{ fontSize: 11, color: C.t3 }}>
              Finding the latest on{' '}
              <span style={{ fontWeight: 600, color: C.t2 }}>"{topic}"</span>…
            </span>
          )}
        </div>
      </div>

      {/* ── Results ─────────────────────────────────────────────── */}
      <div ref={resultsRef}>
        {error && (
          <div style={{ fontSize: 12, color: C.accent, background: C.acdim, border: `1px solid ${C.acbor}`, padding: '10px 14px', borderRadius: 8, marginBottom: 16, lineHeight: 1.6 }}>
            {error}
          </div>
        )}
        {results && (
          <div className="fiq-results-wrap">
            <div style={{ fontSize: 11, color: C.t3, marginBottom: 14, padding: '8px 12px', background: '#0a0b0e', borderRadius: 7, border: `1px solid ${C.border}`, lineHeight: 1.6 }}>
              AI-generated results — verify independently before professional use.
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {results.map((r, i) => (
                <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <Tag type={r.type} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, fontWeight: 500, color: C.text, textDecoration: 'none', display: 'block', marginBottom: 5, lineHeight: 1.4 }}>{r.title} ↗</a>
                    <div style={{ fontSize: 12, color: C.t2, lineHeight: 1.6, marginBottom: 5 }}>{r.summary}</div>
                    <div style={{ fontSize: 11, color: C.accent, fontStyle: 'italic', marginBottom: 3 }}>Why it matters: {r.whyItMatters}</div>
                    <div style={{ fontSize: 11, color: C.t3 }}>{r.source} · {r.publishDate}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <NextSection currentId="feed" onNavigate={onNavigate} />
    </div>
  );
}

function Overview({ onNavigate }: { onNavigate: (id: string) => void }) {
  const w = useWindowWidth(); const isMobile = w < 768;
  const totalPrompts = TOWERS.reduce((acc: number, t: { prompts: unknown[] }) => acc + t.prompts.length, 0);
  const sections = [
    { id: 'tools', icon: '🤖', label: 'AI Tools Hub', color: C.orange, desc: 'Claude, ChatGPT, Copilot, Grok, Gemini — F&A use cases + prompts for each tool.' },
    { id: 'towers', icon: '🏗️', label: 'Process Towers', color: C.blue, desc: 'AP, AR, R2R, Tax, Audit, FP&A — 10 consulting-grade prompts per function.' },
    { id: 'cases', icon: '📊', label: 'Case Studies', color: C.purple, desc: 'Published results from Deloitte, EY, PwC, KPMG with source disclosures.' },
    { id: 'prompts', icon: '⚡', label: 'Prompt Library', color: C.green, desc: `${totalPrompts} ready-to-use prompts. Search, filter and copy in one click.` },
    { id: 'feed', icon: '🔍', label: 'Live Discovery', color: C.accent, desc: 'AI-curated weekly content + on-demand search for any F&A AI topic.' },
    { id: 'industry', icon: '◐', label: 'Industry Prompts', color: C.orange, desc: 'Sector-specific master prompts for Retail, Hospitality, Manufacturing, Healthcare, and more. Upload your data, get deep structured analysis with external benchmarks.' },
    { id: 'lab', icon: '⚙', label: 'Automation Lab', color: C.purple, desc: '100 deep-dive automation ideas across 10 F&A towers — AP, AR, R2R, Treasury, FP&A, Payroll, Tax, Fixed Assets, Audit, and Financial Reporting. Process maps, guides, and KPIs for every idea.' },
  ];
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: C.accent, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Raysho · AI & F&A Knowledge Repository</div>
        <h2 style={{ fontFamily: F.serif, fontSize: isMobile ? 24 : 30, fontWeight: 400, color: C.text, marginBottom: 12, lineHeight: 1.2 }}>The practitioner's guide to AI in Finance & Accounting</h2>
        <p style={{ fontSize: isMobile ? 13 : 14, color: C.t2, lineHeight: 1.8, maxWidth: 580 }}>Built for F&A professionals, consultants, and BPO operators who want to understand, apply, and stay ahead of AI. Not a course. A living platform that updates itself every week.</p>
      </div>
      {/* Freshness Banner */}
      <div style={{ background: `linear-gradient(135deg,${C.acdim} 0%,rgba(16,185,129,0.08) 100%)`, border: `1px solid ${C.acbor}`, borderRadius: 12, padding: isMobile ? '14px 16px' : '16px 22px', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ fontSize: isMobile ? 20 : 24, flexShrink: 0, marginTop: 2 }}>🔄</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: isMobile ? 13 : 14, fontWeight: 700, color: C.accent, marginBottom: 6 }}>This platform refreshes every week — the content you see today may not be here next week</div>
            <div style={{ fontSize: isMobile ? 12 : 13, color: C.t2, lineHeight: 1.75 }}>Raysho's AI engine continuously scans the internet — YouTube, industry journals, research publications — and surfaces the freshest, most relevant AI content for F&A professionals. Old content gets replaced by newer material every week. <strong style={{ color: C.text }}>If you find something useful, save that link offline before your next visit.</strong></div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
              {[['📡', 'Scans 20+ publications daily'], ['🤖', 'AI scores every item'], ['✅', 'Curated weekly'], ['💾', 'Save links you like']].map(([icon, text]) => (
                <div key={text as string} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: C.t2, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, padding: '5px 10px' }}>
                  <span>{icon}</span><span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: isMobile ? 8 : 10, marginBottom: 24 }}>
        {[{ v: '5', l: 'AI tools covered', c: C.accent }, { v: '8', l: 'Process towers', c: C.blue }, { v: String(totalPrompts), l: 'Consulting prompts', c: C.green }, { v: '6', l: 'Case studies', c: C.purple }, { v: 'Live', l: 'Discovery engine', c: C.orange }, { v: 'Free', l: 'Open access', c: C.red }].map((s, i) => <Stat key={i} label={s.l} value={s.v} color={s.c} />)}
      </div>
      {/* Section Cards */}
      <div style={{ fontSize: 12, color: C.t3, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 12 }}>What's inside</div>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 10, marginBottom: 24 }}>
        {sections.map(s => (
          <div key={s.id} onClick={() => onNavigate(s.id)}
            style={{ padding: '16px 18px', background: C.card, border: `1px solid ${C.border}`, borderRadius: 11, cursor: 'pointer', display: 'flex', gap: 14, alignItems: 'flex-start' }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = s.color + '66'; (e.currentTarget as HTMLDivElement).style.background = s.color + '0a'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = C.border; (e.currentTarget as HTMLDivElement).style.background = C.card; }}>
            <div style={{ fontSize: 20, flexShrink: 0, marginTop: 2 }}>{s.icon}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: s.color, marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 12, color: C.t2, lineHeight: 1.55 }}>{s.desc}</div>
            </div>
            <div style={{ fontSize: 16, color: s.color, flexShrink: 0, alignSelf: 'center' }}>→</div>
          </div>
        ))}
      </div>
      {/* Legal Accordion */}
      <LegalAccordion />
    </div>
  );
}

function LegalAccordion() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginTop: 8, border: `1px solid ${C.border}`, borderRadius: 10, overflow: 'hidden' }}>
      <div onClick={() => setOpen(o => !o)} style={{ padding: '12px 16px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: C.surface }}>
        <div style={{ fontSize: 12, color: C.t2, fontWeight: 500 }}>⚖️ Platform disclaimers and legal notices</div>
        <span style={{ fontSize: 12, color: C.t3, display: 'inline-block', transform: `rotate(${open ? 180 : 0}deg)`, transition: 'transform 0.2s' }}>▾</span>
      </div>
      {open && (
        <div style={{ padding: '14px 16px', background: '#09090f', borderTop: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 11, color: C.t3, lineHeight: 1.8 }}>{LEGAL.disclaimer}<br /><br />{LEGAL.contentWarning}<br /><br /><strong style={{ color: '#3d4455' }}>Subscription policy:</strong> {LEGAL.subscriptionTerms}</div>
        </div>
      )}
    </div>
  );
}

// ─── LOGO ─────────────────────────────────────────────────────────────────────
function Logo() {
  return (
    <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none' }}>
      <div style={{ width: 28, height: 28, borderRadius: 8, background: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <svg width="14" height="14" viewBox="0 0 26 26" fill="none"><path d="M7 13h12M13 7l6 6-6 6" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.text, letterSpacing: '-0.02em', lineHeight: 1 }}>Raysho</div>
        <div style={{ fontSize: 9, color: C.t3, marginTop: 2, lineHeight: 1 }}>AI · F&A Knowledge</div>
      </div>
    </Link>
  );
}

// ─── MAIN PLATFORM APP ────────────────────────────────────────────────────────
export default function PlatformPage() {
  const [section, setSection] = useState('home');
  const [legalAccepted, setLegalAccepted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const w = useWindowWidth(); const isMobile = w < 768;
  const mainRef = useRef<HTMLDivElement>(null);

  const navigate = (id: string) => {
    setSection(id);
    setMenuOpen(false);
    if (mainRef.current) mainRef.current.scrollTop = 0;
  };

  const renderSection = () => {
    if (section === 'home') return <Overview onNavigate={navigate} />;
    if (section === 'tools') return <ToolsHub onNavigate={navigate} />;
    if (section === 'towers') return <ProcessTowers onNavigate={navigate} />;
    if (section === 'cases') return <CaseStudies onNavigate={navigate} />;
    if (section === 'prompts') return <PromptLibrary onNavigate={navigate} />;
    if (section === 'industry') return <IndustryPrompts onNavigate={navigate} />;
    if (section === 'feed') return <LiveDiscovery onNavigate={navigate} />;
    if (section === 'lab') return <AutomationLab onNavigate={navigate} />;
    return null;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: C.bg, fontFamily: F.sans, color: C.text, overflow: 'hidden' }}>
      {!legalAccepted && <LegalModal onAccept={() => setLegalAccepted(true)} />}

      {isMobile ? (
        <>
          {/* Mobile header */}
          <div style={{ padding: '12px 16px', background: C.surface, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, zIndex: 100 }}>
            <Logo />
            <button onClick={() => setMenuOpen(o => !o)} style={{ background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 8, padding: '7px 10px', cursor: 'pointer', color: C.t2, fontSize: 13, fontFamily: F.sans, display: 'flex', alignItems: 'center', gap: 6, minHeight: 38 }}>
              {menuOpen ? '✕ Close' : '☰ Menu'}
            </button>
          </div>
          {menuOpen && (
            <div style={{ position: 'fixed', inset: 0, top: 57, background: C.surface, zIndex: 99, overflowY: 'auto', borderTop: `1px solid ${C.border}` }}>
              <nav style={{ padding: '10px 12px' }}>
                {NAV.map(n => {
                  const isCurrent = section === n.id;
                  return (
                    <button key={n.id} onClick={() => navigate(n.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '13px 14px', borderRadius: 9, border: 'none', background: isCurrent ? C.acdim : 'transparent', cursor: 'pointer', fontFamily: F.sans, marginBottom: 4, textAlign: 'left', minHeight: 50 }}>
                      <span style={{ fontSize: 16, color: isCurrent ? C.accent : C.t3, width: 22, textAlign: 'center', flexShrink: 0 }}>{n.icon}</span>
                      <span style={{ fontSize: 14, fontWeight: isCurrent ? 600 : 400, color: isCurrent ? C.accent : C.t2 }}>{n.label}</span>
                      {isCurrent && <span style={{ marginLeft: 'auto', fontSize: 12, color: C.accent }}>●</span>}
                    </button>
                  );
                })}
              </nav>
              <div style={{ padding: '12px 16px', borderTop: `1px solid ${C.border}`, margin: '8px 12px 0' }}>
                <div style={{ fontSize: 10, color: C.t3, lineHeight: 1.7 }}>Educational content only. Not professional advice. All trademarks belong to their respective owners.</div>
              </div>
            </div>
          )}
          <div ref={mainRef} style={{ flex: 1, overflowY: 'auto', padding: '20px 16px 32px' }}>
            <div style={{ maxWidth: 600, margin: '0 auto' }}>{renderSection()}</div>
          </div>
          <DisclaimerBanner />
        </>
      ) : (
        <>
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            {/* Sidebar */}
            <div style={{ width: 204, flexShrink: 0, background: C.surface, borderRight: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
              <div style={{ padding: '18px 16px 14px', borderBottom: `1px solid ${C.border}` }}>
                <Logo />
                <div style={{ fontSize: 9, color: '#2a2e3a', marginTop: 8, lineHeight: 1.4 }}>Not affiliated with Deloitte, EY, PwC, KPMG, McKinsey, or any AI vendor</div>
              </div>
              <nav style={{ padding: '10px 8px', flex: 1 }}>
                {NAV.map(n => {
                  const isCurrent = section === n.id;
                  return (
                    <button key={n.id} onClick={() => navigate(n.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 9, padding: '10px 11px', borderRadius: 8, border: 'none', background: isCurrent ? C.acdim : 'transparent', cursor: 'pointer', fontFamily: F.sans, marginBottom: 2, textAlign: 'left', minHeight: 40 }}>
                      <span style={{ fontSize: 14, color: isCurrent ? C.accent : C.t3, width: 18, textAlign: 'center', flexShrink: 0 }}>{n.icon}</span>
                      <span style={{ fontSize: 12, fontWeight: isCurrent ? 600 : 400, color: isCurrent ? C.accent : C.t2 }}>{n.label}</span>
                    </button>
                  );
                })}
              </nav>
              <div style={{ padding: '12px 14px', borderTop: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 10, color: C.t3, lineHeight: 1.65 }}>Educational content only. Not professional advice. All trademarks belong to their respective owners.</div>
              </div>
            </div>
            {/* Main content */}
            <div ref={mainRef} style={{ flex: 1, overflowY: 'auto', padding: '28px 36px 40px' }}>
              <div style={{ maxWidth: 820, margin: '0 auto' }}>{renderSection()}</div>
            </div>
          </div>
          <DisclaimerBanner />
        </>
      )}
    </div>
  );
}
