/**
 * lib/content.ts
 *
 * Raysho content loader. Filesystem-backed. No database.
 *
 * Responsibilities:
 *  - Walk content/ directory
 *  - Parse YAML frontmatter + markdown body
 *  - Map file paths to URL slugs (strip S-ID prefix and version suffix)
 *  - Compile markdown body to HTML at build time
 *  - Provide getAllPages() and getPageByRoute() for static generation
 *
 * Commit at: repo-root/lib/content.ts
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeStringify from 'rehype-stringify';

const CONTENT_ROOT = path.join(process.cwd(), 'content');

/**
 * Strip a leading H1 from the markdown body.
 * Markdown source files start with `# Title`. PageShell already renders
 * frontmatter.title as H1, so compiling the body H1 would duplicate it.
 * Safe no-op if the body does not start with H1.
 */
function stripLeadingH1(md: string): string {
  return md.replace(/^\s*#\s+[^\n]+\n*/, '');
}

export type Section = 'firms' | 'practitioners' | 'intelligence';
export type Template =
  | 'Playbook'
  | 'Prompt Pack'
  | 'Framework'
  | 'Case Study'
  | 'Curated Insight'
  | 'Video Entry'
  | 'Tool Entry';

export interface CrossLink {
  label: string;
  href: string | null; // null for "leaf" or "anchor" self-declared markers
  reason?: string;
}

export interface PageFrontmatter {
  slotId: string;
  title: string;
  section: string;
  subHub: string;
  template: Template;
  version: string;
  created: string;
  voiceApproved: string;
  status: string;
  length: string;
  wave: string;
  icpTarget: string;
  jtbd: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  angle: string;
  crossLinksUp: CrossLink;
  crossLinksDown: CrossLink;
  crossLinksAcross: CrossLink;
  crossRef: string;
  voiceGatesCleared: string;
  emDashCheck: string;
  forbiddenWordSweep: string;
  taxonomy: {
    practiceArea?: string | string[];
    firmSize?: string | string[];
    geography?: string | string[];
    difficulty?: string;
    contentType?: string;
    claudeOptimised?: boolean;
  };
  raw: Record<string, unknown>;
}

export interface Page {
  route: {
    section: string;
    hub: string;
    slug: string;
    fullPath: string; // /firms/outsourcing/offshore-model-playbook
  };
  frontmatter: PageFrontmatter;
  bodyHtml: string;
  bodyMarkdown: string;
  filePath: string;
  updatedAt: string;
}

/**
 * Transform raw filename to URL slug.
 *   S-F-001_offshore-model-playbook_v1_0.md → offshore-model-playbook
 */
function filenameToSlug(filename: string): string {
  const base = filename.replace(/\.md$/, '');
  // Strip leading S-F-NNN_ or S-P-NNN_ or S-I-NNN_
  let slug = base.replace(/^S-[A-Z]-\d{3}_/, '');
  // Strip trailing _vN_M
  slug = slug.replace(/_v\d+_\d+$/, '');
  return slug;
}

/**
 * Parse a cross-link string from frontmatter. Supports:
 *   "S-F-007 OCR pipelines for CPA firms (/firms/automation/)"
 *   "/intelligence/tools/ (offshoring-specific SaaS tracker)"
 *   "(this is a firm-hub anchor, no parent)"
 *   "(this is a leaf practitioner piece, no further down-link)"
 */
function parseCrossLink(value: unknown): CrossLink {
  if (typeof value !== 'string') {
    return { label: '', href: null };
  }
  const trimmed = value.trim();
  if (!trimmed || /^\(.*(no parent|no further|anchor|leaf).*\)$/i.test(trimmed)) {
    return { label: trimmed, href: null };
  }
  // Pattern: "<label> (<href>)"
  const match = trimmed.match(/^(.*?)\s*\((\/[^)]*)\)\s*$/);
  if (match) {
    return { label: match[1].trim(), href: match[2].trim() };
  }
  // Pattern: "<href> (<reason>)" — href starts with /
  if (trimmed.startsWith('/')) {
    const m2 = trimmed.match(/^(\/\S+?)\s*(?:\((.*)\))?\s*$/);
    if (m2) {
      const label = m2[2] || m2[1];
      const reason = m2[2] && m2[2] !== label ? m2[2] : undefined;
      return { label, href: m2[1], reason };
    }
  }
  // Fallback: treat the whole string as a label with no resolvable href
  return { label: trimmed, href: null };
}

function parseKeywords(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === 'string') return value.split(',').map((s) => s.trim()).filter(Boolean);
  return [];
}

function normaliseFrontmatter(raw: Record<string, unknown>): PageFrontmatter {
  const taxonomyRaw = (raw.taxonomy || {}) as Record<string, unknown>;
  return {
    slotId: String(raw['slot-id'] || ''),
    title: String(raw.title || ''),
    section: String(raw.section || ''),
    subHub: String(raw['sub-hub'] || ''),
    template: (raw.template as Template) || 'Playbook',
    version: String(raw.version || ''),
    created: String(raw.created || ''),
    voiceApproved: String(raw['voice-approved'] || ''),
    status: String(raw.status || ''),
    length: String(raw.length || ''),
    wave: String(raw.wave || ''),
    icpTarget: String(raw['icp-target'] || ''),
    jtbd: String(raw.jtbd || ''),
    primaryKeyword: String(raw['primary-keyword'] || ''),
    secondaryKeywords: parseKeywords(raw['secondary-keywords']),
    angle: String(raw.angle || ''),
    crossLinksUp: parseCrossLink(raw['cross-links-up']),
    crossLinksDown: parseCrossLink(raw['cross-links-down']),
    crossLinksAcross: parseCrossLink(raw['cross-links-across']),
    crossRef: String(raw['cross-ref'] || ''),
    voiceGatesCleared: String(raw['voice-gates-cleared'] || ''),
    emDashCheck: String(raw['em-dash-check'] || ''),
    forbiddenWordSweep: String(raw['forbidden-word-sweep'] || ''),
    taxonomy: {
      practiceArea: taxonomyRaw['practice-area'] as string | string[] | undefined,
      firmSize: taxonomyRaw['firm-size'] as string | string[] | undefined,
      geography: taxonomyRaw['geography'] as string | string[] | undefined,
      difficulty: taxonomyRaw['difficulty'] as string | undefined,
      contentType: taxonomyRaw['content-type'] as string | undefined,
      claudeOptimised: Boolean(taxonomyRaw['claude-optimised']),
    },
    raw,
  };
}

async function compileMarkdown(markdown: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, { behavior: 'wrap' })
    .use(rehypeStringify)
    .process(stripLeadingH1(markdown));
  return String(file);
}

/**
 * Walk content/ and return every .md file with its route mapping.
 * Skips files with suffix _VOICE_VALIDATION_SLICE (voice-validation drafts are not ingested).
 */
async function walkContent(): Promise<Page[]> {
  if (!fs.existsSync(CONTENT_ROOT)) {
    console.warn(`[content] ${CONTENT_ROOT} does not exist. Returning empty set.`);
    return [];
  }

  const pages: Page[] = [];

  const sections = fs
    .readdirSync(CONTENT_ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory());

  for (const sectionDir of sections) {
    const sectionPath = path.join(CONTENT_ROOT, sectionDir.name);
    const hubs = fs
      .readdirSync(sectionPath, { withFileTypes: true })
      .filter((d) => d.isDirectory());

    for (const hubDir of hubs) {
      const hubPath = path.join(sectionPath, hubDir.name);
      const files = fs
        .readdirSync(hubPath, { withFileTypes: true })
        .filter((d) => d.isFile() && d.name.endsWith('.md'));

      for (const file of files) {
        if (file.name.includes('VOICE_VALIDATION_SLICE')) continue;

        const filePath = path.join(hubPath, file.name);
        const fileStat = fs.statSync(filePath);
        const raw = fs.readFileSync(filePath, 'utf8');
        const parsed = matter(raw);
        const frontmatter = normaliseFrontmatter(parsed.data as Record<string, unknown>);
        const bodyHtml = await compileMarkdown(parsed.content);
        const slug = filenameToSlug(file.name);
        const route = {
          section: sectionDir.name,
          hub: hubDir.name,
          slug,
          fullPath: `/${sectionDir.name}/${hubDir.name}/${slug}`,
        };

        pages.push({
          route,
          frontmatter,
          bodyHtml,
          bodyMarkdown: parsed.content,
          filePath,
          updatedAt: fileStat.mtime.toISOString(),
        });
      }
    }
  }

  return pages;
}

/* ---------- Public API ---------- */

let cache: Page[] | null = null;

export async function getAllPages(): Promise<Page[]> {
  if (cache) return cache;
  cache = await walkContent();
  return cache;
}

export async function getPageByRoute(
  section: string,
  hub: string,
  slug: string,
): Promise<Page | null> {
  const pages = await getAllPages();
  return (
    pages.find(
      (p) =>
        p.route.section === section && p.route.hub === hub && p.route.slug === slug,
    ) || null
  );
}

export async function getPagesBySection(section: string): Promise<Page[]> {
  const pages = await getAllPages();
  return pages.filter((p) => p.route.section === section);
}

export async function getPagesByHub(section: string, hub: string): Promise<Page[]> {
  const pages = await getAllPages();
  return pages.filter((p) => p.route.section === section && p.route.hub === hub);
}

/**
 * Resolve a cross-link href that was specified as an S-ID reference.
 * e.g. "S-F-007" → "/firms/automation/ocr-pipelines-for-cpa-firms"
 * If the cross-link already has an href in its label, this is a no-op.
 */
export async function resolveCrossLink(link: CrossLink): Promise<CrossLink> {
  if (link.href) return link;
  const match = link.label.match(/^(S-[A-Z]-\d{3})/);
  if (!match) return link;
  const slotId = match[1];
  const pages = await getAllPages();
  const found = pages.find((p) => p.frontmatter.slotId === slotId);
  if (!found) return link;
  return { ...link, href: found.route.fullPath };
}

/* ---------- Route parameter helpers ---------- */

export async function getAllRouteParams(): Promise<
  Array<{ section: string; hub: string; slug: string }>
> {
  const pages = await getAllPages();
  return pages.map((p) => ({
    section: p.route.section,
    hub: p.route.hub,
    slug: p.route.slug,
  }));
}
