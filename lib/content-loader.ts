import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface PlaybookFrontMatter {
  slotId: string;
  title: string;
  section: string;
  subHub: string;
  template: string;
  version: string;
  created: string;
  status: string;
  canonical: string;
  contentType: string;
  tier: number;
  refreshCadence: string;
  geography: string;
  jurisdiction: string;
  reviewedBy: string;
  claudeOptimised: boolean;
  jtbd?: string;
  icpTarget?: string;
  angle?: string;
  primaryKeyword?: string;
  secondaryKeywords?: string;
  dependency?: string;
  crossLinksDown?: string;
  crossLinksAcross?: string;
  crossLinksInHub?: string;
  voiceGatesCleared?: string;
  slug: string;
  readingTimeMinutes: number;
}

export interface Playbook {
  frontMatter: PlaybookFrontMatter;
  body: string;
  rawMarkdown: string;
}

const CONTENT_ROOT = path.join(process.cwd(), 'content');

function deriveSlugFromFilename(filename: string): string {
  return filename
    .replace(/^S-[A-Z]-\d+_/, '')
    .replace(/_v\d+_\d+\.md$/, '')
    .replace(/\.md$/, '');
}

function estimateReadingTime(body: string): number {
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

function normalizeFrontMatter(
  raw: Record<string, unknown>,
  slug: string,
  subHubFallback: string
): Omit<PlaybookFrontMatter, 'readingTimeMinutes'> {
  const subHub = (raw['sub-hub'] as string) ?? subHubFallback;
  const canonical =
    (raw.canonical as string) ?? `${subHub.replace(/\/$/, '')}/${slug}`;

  return {
    slotId: (raw['slot-id'] as string) ?? '',
    title: (raw.title as string) ?? 'Untitled',
    section: (raw.section as string) ?? 'CPA Firm Hub',
    subHub,
    template: (raw.template as string) ?? 'Playbook',
    version: String(raw.version ?? '1.0'),
    created: (raw.created as string) ?? '',
    status: (raw.status as string) ?? 'DRAFT',
    canonical,
    contentType: (raw.contentType as string) ?? 'playbook',
    tier: typeof raw.tier === 'number' ? raw.tier : 1,
    refreshCadence: (raw.refreshCadence as string) ?? 'quarterly',
    geography: (raw.geography as string) ?? 'global',
    jurisdiction: (raw.jurisdiction as string) ?? 'none',
    reviewedBy: (raw.reviewedBy as string) ?? 'Pankaj Singhal',
    claudeOptimised:
      typeof raw.claudeOptimised === 'boolean' ? raw.claudeOptimised : true,
    jtbd: raw.jtbd as string | undefined,
    icpTarget: raw['icp-target'] as string | undefined,
    angle: raw.angle as string | undefined,
    primaryKeyword: raw['primary-keyword'] as string | undefined,
    secondaryKeywords: raw['secondary-keywords'] as string | undefined,
    dependency: raw.dependency as string | undefined,
    crossLinksDown: raw['cross-links-down'] as string | undefined,
    crossLinksAcross: raw['cross-links-across'] as string | undefined,
    crossLinksInHub: raw['cross-links-in-hub'] as string | undefined,
    voiceGatesCleared: raw['voice-gates-cleared'] as string | undefined,
    slug,
  };
}

export function loadPlaybook(subHub: string, slug: string): Playbook | null {
  const dir = path.join(CONTENT_ROOT, 'firms', subHub);
  if (!fs.existsSync(dir)) return null;

  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'));
  const match = files.find((f) => deriveSlugFromFilename(f) === slug);
  if (!match) return null;

  const filepath = path.join(dir, match);
  const raw = fs.readFileSync(filepath, 'utf-8');
  const parsed = matter(raw);

  const frontMatter = normalizeFrontMatter(
    parsed.data,
    slug,
    `/firms/${subHub}/`
  );
  const readingTimeMinutes = estimateReadingTime(parsed.content);

  return {
    frontMatter: { ...frontMatter, readingTimeMinutes },
    body: parsed.content,
    rawMarkdown: raw,
  };
}

export function listPlaybooks(subHub: string): PlaybookFrontMatter[] {
  const dir = path.join(CONTENT_ROOT, 'firms', subHub);
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'));
  return files
    .map((f) => {
      const slug = deriveSlugFromFilename(f);
      const pb = loadPlaybook(subHub, slug);
      return pb?.frontMatter ?? null;
    })
    .filter((x): x is PlaybookFrontMatter => x !== null);
}
