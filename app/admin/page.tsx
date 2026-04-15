'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

type QueueItem = {
  id: string;
  title: string;
  url: string;
  source: string;
  type: string;
  summary: string | null;
  why_it_matters: string | null;
  score: number | null;
  tower: string | null;
  published_at: string | null;
  ingested_at: string;
  status: string;
};

type ApprovedItem = {
  id: string;
  title: string;
  source: string;
  type: string;
  approved_at: string;
  is_new: boolean;
  tower: string | null;
};

const C = {
  bg: '#07080c', surface: '#0f1117', card: '#14161f',
  border: 'rgba(255,255,255,0.07)', accent: '#f0b429',
  acdim: 'rgba(240,180,41,0.09)', acbor: 'rgba(240,180,41,0.28)',
  text: '#eef0f4', t2: '#8891a4', t3: '#3d4455',
  green: '#10b981', red: '#ef4444',
};

function ScoreBadge({ score }: { score: number | null }) {
  if (score === null) return null;
  const color = score >= 8 ? C.green : score >= 6.5 ? C.accent : C.red;
  return (
    <span style={{ fontSize: 11, fontWeight: 700, color, background: color + '18', border: `1px solid ${color}44`, borderRadius: 4, padding: '2px 8px' }}>
      {score.toFixed(1)}
    </span>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [approved, setApproved] = useState<ApprovedItem[]>([]);
  const [tab, setTab] = useState<'queue' | 'approved' | 'cron'>('queue');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [cronLoading, setCronLoading] = useState(false);
  const [cronLog, setCronLog] = useState<string[] | null>(null);
  const [filter, setFilter] = useState<'pending' | 'all'>('pending');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [qRes, aRes] = await Promise.all([
        fetch('/api/admin/queue'),
        fetch('/api/admin/approved'),
      ]);
      if (qRes.status === 401 || aRes.status === 401) { router.push('/admin/login'); return; }
      const qData = await qRes.json();
      const aData = await aRes.json();
      setQueue(qData.items || []);
      setApproved(aData.items || []);
    } catch {
      // silently fail — user will see empty state
    } finally { setLoading(false); }
  }, [router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const approve = async (id: string) => {
    setActionLoading(id);
    await fetch('/api/content/approve', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    await fetchData();
    setActionLoading(null);
  };

  const reject = async (id: string) => {
    setActionLoading(id);
    await fetch('/api/content/reject', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    await fetchData();
    setActionLoading(null);
  };

  const runCron = async () => {
    setCronLoading(true); setCronLog(null);
    // Calls admin proxy route — CRON_SECRET stays server-side, never reaches browser
    const res = await fetch('/api/admin/run-ingestion', { method: 'POST' });
    const data = await res.json();
    setCronLog(data.log || [data.error || 'Done']);
    setCronLoading(false);
    await fetchData();
  };

  const logout = async () => {
    await fetch('/api/admin-logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const pendingCount = queue.filter(i => i.status === 'pending').length;
  const displayQueue = filter === 'pending' ? queue.filter(i => i.status === 'pending') : queue;

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'DM Sans', sans-serif", color: C.text }}>

      {/* Header */}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: '0 24px', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="13" height="13" viewBox="0 0 26 26" fill="none"><path d="M7 13h12M13 7l6 6-6 6" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-0.02em' }}>FintelliQ Admin</span>
            {pendingCount > 0 && (
              <span style={{ fontSize: 11, fontWeight: 700, background: C.accent, color: '#000', borderRadius: 20, padding: '2px 9px' }}>
                {pendingCount} pending
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <a href="/platform" target="_blank" style={{ fontSize: 12, color: C.t2, padding: '6px 12px', borderRadius: 7, border: `1px solid ${C.border}`, textDecoration: 'none' }}>View platform ↗</a>
            <button onClick={logout} style={{ fontSize: 12, color: C.t3, background: 'transparent', border: 'none', cursor: 'pointer', padding: '6px 10px' }}>Sign out</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 24px' }}>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 28 }}>
          {[
            { label: 'Pending review', value: String(pendingCount), color: pendingCount > 0 ? C.accent : C.t3 },
            { label: 'Total in queue', value: String(queue.length), color: C.text },
            { label: 'Approved & live', value: String(approved.length), color: C.green },
            { label: 'New badge active', value: String(approved.filter(i => i.is_new).length), color: '#60a5fa' },
          ].map(s => (
            <div key={s.label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '16px 18px', textAlign: 'center' }}>
              <div style={{ fontSize: 26, fontFamily: "'DM Serif Display', Georgia, serif", color: s.color, fontWeight: 400, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: C.t3, marginTop: 6 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, borderBottom: `1px solid ${C.border}`, marginBottom: 20 }}>
          {([['queue', 'Review Queue'], ['approved', 'Live Content'], ['cron', 'Run Ingestion']] as const).map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)}
              style={{ padding: '10px 18px', border: 'none', borderBottom: `2px solid ${tab === id ? C.accent : 'transparent'}`, background: 'transparent', color: tab === id ? C.accent : C.t3, fontSize: 13, fontWeight: tab === id ? 600 : 400, cursor: 'pointer', fontFamily: 'inherit' }}>
              {label}
            </button>
          ))}
        </div>

        {loading && <div style={{ textAlign: 'center', padding: 40, color: C.t3, fontSize: 13 }}>Loading…</div>}

        {/* ── REVIEW QUEUE TAB ── */}
        {!loading && tab === 'queue' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
              <div style={{ fontSize: 13, color: C.t2 }}>
                AI-scored items awaiting your approval. Items scoring 6.5+ reached this queue automatically.
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {(['pending', 'all'] as const).map(f => (
                  <button key={f} onClick={() => setFilter(f)}
                    style={{ fontSize: 11, padding: '5px 12px', borderRadius: 20, border: `1px solid ${filter === f ? C.accent : C.border}`, background: filter === f ? C.acdim : 'transparent', color: filter === f ? C.accent : C.t2, cursor: 'pointer', fontFamily: 'inherit' }}>
                    {f === 'pending' ? 'Pending only' : 'All items'}
                  </button>
                ))}
              </div>
            </div>

            {displayQueue.length === 0 && (
              <div style={{ textAlign: 'center', padding: 48, color: C.t3, fontSize: 14, background: C.card, borderRadius: 12, border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>✅</div>
                <div>Queue is clear — all items reviewed.</div>
                <div style={{ fontSize: 12, marginTop: 6 }}>Run ingestion to fetch new content from YouTube and RSS feeds.</div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {displayQueue.map(item => (
                <div key={item.id} style={{ background: C.card, border: `1px solid ${item.status === 'approved' ? C.green + '44' : item.status === 'rejected' ? C.red + '33' : C.border}`, borderRadius: 11, padding: '16px 18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap', marginBottom: 10 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 5 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', padding: '2px 7px', borderRadius: 3, background: '#14161f', color: C.t2, border: `1px solid ${C.border}` }}>{item.type}</span>
                        <ScoreBadge score={item.score} />
                        {item.tower && <span style={{ fontSize: 10, color: C.accent, background: C.acdim, border: `1px solid ${C.acbor}`, borderRadius: 3, padding: '2px 7px' }}>{item.tower}</span>}
                        {item.status !== 'pending' && (
                          <span style={{ fontSize: 10, fontWeight: 600, color: item.status === 'approved' ? C.green : C.red, background: (item.status === 'approved' ? C.green : C.red) + '18', border: `1px solid ${(item.status === 'approved' ? C.green : C.red)}44`, borderRadius: 3, padding: '2px 7px', textTransform: 'uppercase' }}>{item.status}</span>
                        )}
                      </div>
                      <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, fontWeight: 600, color: C.text, textDecoration: 'none', display: 'block', marginBottom: 4, lineHeight: 1.4 }}>{item.title} ↗</a>
                      <div style={{ fontSize: 12, color: C.t3, marginBottom: 6 }}>{item.source} · Published: {item.published_at || 'unknown'}</div>
                      {item.summary && <div style={{ fontSize: 12, color: C.t2, lineHeight: 1.65, marginBottom: 4 }}>{item.summary}</div>}
                      {item.why_it_matters && <div style={{ fontSize: 12, color: C.accent, fontStyle: 'italic' }}>Why it matters: {item.why_it_matters}</div>}
                    </div>
                    {item.status === 'pending' && (
                      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                        <button onClick={() => approve(item.id)} disabled={actionLoading === item.id}
                          style={{ padding: '8px 18px', borderRadius: 8, border: 'none', background: C.green, color: '#000', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', minHeight: 38 }}>
                          {actionLoading === item.id ? '…' : '✓ Approve'}
                        </button>
                        <button onClick={() => reject(item.id)} disabled={actionLoading === item.id}
                          style={{ padding: '8px 16px', borderRadius: 8, border: `1px solid ${C.border}`, background: 'transparent', color: C.t2, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', minHeight: 38 }}>
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── APPROVED / LIVE TAB ── */}
        {!loading && tab === 'approved' && (
          <div>
            <div style={{ fontSize: 13, color: C.t2, marginBottom: 16 }}>
              {approved.length} items currently live on the platform. Items with a NEW badge are visible to subscribers for 7 days.
            </div>
            {approved.length === 0 && (
              <div style={{ textAlign: 'center', padding: 48, color: C.t3, fontSize: 14, background: C.card, borderRadius: 12, border: `1px solid ${C.border}` }}>
                No approved content yet. Review the queue to publish items.
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {approved.map(item => (
                <div key={item.id} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 9, padding: '13px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 10, color: C.t3, background: '#14161f', border: `1px solid ${C.border}`, padding: '2px 6px', borderRadius: 3 }}>{item.type}</span>
                      {item.tower && <span style={{ fontSize: 10, color: C.accent, background: C.acdim, border: `1px solid ${C.acbor}`, borderRadius: 3, padding: '2px 6px' }}>{item.tower}</span>}
                      {item.is_new && <span style={{ fontSize: 9, fontWeight: 700, color: C.accent, background: C.acdim, border: `1px solid ${C.acbor}`, borderRadius: 3, padding: '2px 6px' }}>NEW</span>}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: C.text, lineHeight: 1.4 }}>{item.title}</div>
                    <div style={{ fontSize: 11, color: C.t3, marginTop: 2 }}>{item.source} · Approved {new Date(item.approved_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                  </div>
                  <span style={{ fontSize: 11, color: C.green, background: C.green + '15', border: `1px solid ${C.green}44`, borderRadius: 4, padding: '3px 9px', flexShrink: 0 }}>● Live</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── CRON / INGESTION TAB ── */}
        {!loading && tab === 'cron' && (
          <div>
            <div style={{ background: C.acdim, border: `1px solid ${C.acbor}`, borderRadius: 12, padding: '18px 20px', marginBottom: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.accent, marginBottom: 8 }}>Content Ingestion Engine</div>
              <div style={{ fontSize: 13, color: C.t2, lineHeight: 1.7 }}>
                Clicking "Run now" triggers the full ingestion pipeline: YouTube API (8 keyword queries) + 20 RSS feeds → Claude scoring → items above 6.5 score appear in your Review Queue.
              </div>
              <div style={{ fontSize: 12, color: C.t3, marginTop: 8, lineHeight: 1.6 }}>
                This runs automatically every day at 06:00 UTC via Netlify Scheduled Function. Use "Run now" to manually trigger a fresh fetch at any time.
              </div>
            </div>
            <button onClick={runCron} disabled={cronLoading}
              style={{ padding: '13px 28px', borderRadius: 9, border: 'none', background: cronLoading ? '#2a2e3a' : C.accent, color: cronLoading ? C.t3 : '#000', fontSize: 14, fontWeight: 700, cursor: cronLoading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', marginBottom: 20, minHeight: 48 }}>
              {cronLoading ? '⏳ Running ingestion pipeline…' : '▶ Run ingestion now'}
            </button>
            {cronLog && (
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '16px 18px' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: C.text, marginBottom: 10 }}>Ingestion log:</div>
                {cronLog.map((line, i) => (
                  <div key={i} style={{ fontSize: 12, color: C.t2, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.8, padding: '2px 0', borderBottom: i < cronLog.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                    {'→ '}{line}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
