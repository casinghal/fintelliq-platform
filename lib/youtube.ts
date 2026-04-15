const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || '';

// Graceful skip if key not configured
if (!YOUTUBE_API_KEY) {
  console.warn('YOUTUBE_API_KEY not set — YouTube ingestion disabled');
}

const KEYWORDS = [
  'AI in accounting 2025',
  'ChatGPT for accountants',
  'accounts payable automation AI',
  'generative AI accounting',
  'Microsoft Copilot finance',
  'AI in audit accounting',
  'Claude AI accounting finance',
  'AI financial reporting',
  'agentic AI finance',
  'accounting automation AI',
  'AI FPA finance planning',
  'AI tax compliance 2025',
  'AI financial analysis tools',
  'machine learning accounts payable',
  'AI month end close automation',
  'Claude AI accounting finance',
  'ChatGPT for accountants 2025',
  'Microsoft Copilot finance accounting',
  'AI tools CFO finance 2025',
];

type YouTubeItem = {
  title: string;
  url: string;
  source: string;
  type: 'VIDEO';
  published_at: string;
  summary: string;
};

export async function fetchYouTubeContent(): Promise<YouTubeItem[]> {
  if (!YOUTUBE_API_KEY) return []; // Skip gracefully if key not configured
  const results: YouTubeItem[] = [];
  const seen = new Set<string>();

  // Run first 8 keywords per daily call to stay comfortably under 10K quota
  const activeKeywords = KEYWORDS.slice(0, 8);

  for (const keyword of activeKeywords) {
    try {
      const url = new URL('https://www.googleapis.com/youtube/v3/search');
      url.searchParams.set('part', 'snippet');
      url.searchParams.set('q', keyword);
      url.searchParams.set('type', 'video');
      url.searchParams.set('maxResults', '5');
      url.searchParams.set('order', 'date');
      url.searchParams.set('publishedAfter', getThirtyDaysAgo());
      url.searchParams.set('relevanceLanguage', 'en');
      url.searchParams.set('key', YOUTUBE_API_KEY);

      const res = await fetch(url.toString());
      if (!res.ok) continue;
      const data = await res.json();

      for (const item of data.items || []) {
        const videoId = item.id?.videoId;
        if (!videoId || seen.has(videoId)) continue;
        seen.add(videoId);

        results.push({
          title: item.snippet.title,
          url: `https://www.youtube.com/watch?v=${videoId}`,
          source: item.snippet.channelTitle,
          type: 'VIDEO',
          published_at: item.snippet.publishedAt?.split('T')[0] || '',
          summary: item.snippet.description?.slice(0, 200) || '',
        });
      }

      // Small delay to be polite to the API
      await sleep(300);
    } catch {
      // Skip failed keyword — don't abort whole run
      continue;
    }
  }

  return results;
}

function getThirtyDaysAgo(): string {
  const d = new Date();
  d.setDate(d.getDate() - 30);
  return d.toISOString();
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
