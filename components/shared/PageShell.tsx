/**
 * components/shared/PageShell.tsx
 *
 * Shared shell for every content page.
 *
 * Structure per scaffolding 3.2:
 *   - Header block: breadcrumb, title, byline metadata (refresh date, difficulty)
 *   - Body block (children)
 *   - Metadata footer: updated date, reviewed-by, forward-to-colleague line
 *
 * Anti-AI-trace guarantees baked in:
 *   - No eyebrow pill above H1 (rule 1)
 *   - No trailing full stop added by the shell to title (rule 2)
 *   - No mono uppercase eyebrow (rule 3)
 *   - Plain rgba divider only (rule 8)
 *
 * Commit at: repo-root/components/shared/PageShell.tsx
 */

import type { ReactNode } from 'react';
import type { Page } from '@/lib/content';
import { Breadcrumb } from './Breadcrumb';

export interface PageShellProps {
  page: Page;
  children: ReactNode;
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return iso;
  }
}

function capitaliseFirst(s: string): string {
  if (!s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function PageShell({ page, children }: PageShellProps) {
  const { frontmatter, route, updatedAt } = page;
  const difficultyLabel = capitaliseFirst(frontmatter.taxonomy.difficulty || '');

  return (
    <article className="min-h-screen bg-[#0A0C12] text-[#E8E8E4]">
      <div className="mx-auto max-w-3xl px-6 py-10 md:px-10 md:py-16">
        {/* Header block */}
        <header className="mb-10">
          <Breadcrumb
            section={route.section}
            hub={route.hub}
            pageTitle={frontmatter.title}
          />
          <h1
            className="mt-6 font-[family-name:'Plus_Jakarta_Sans'] font-extrabold text-[clamp(2rem,4vw,3rem)] leading-[1.15] tracking-tight text-[#E8E8E4]"
          >
            {/* Trailing full stops on H1 are stripped at render per anti-AI-trace rule 2 */}
            {frontmatter.title.replace(/\.$/, '')}
          </h1>
          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[rgba(232,232,228,0.65)]">
            <span>Updated {formatDate(updatedAt)}</span>
            {difficultyLabel && (
              <>
                <span aria-hidden>·</span>
                <span>{difficultyLabel}</span>
              </>
            )}
            {frontmatter.length && (
              <>
                <span aria-hidden>·</span>
                <span>{frontmatter.length.replace(/\s*\(.*\)\s*$/, '')}</span>
              </>
            )}
          </div>
        </header>

        {/* Body block — children render without a shared prose wrapper.
            Playbook template wraps its compiled body in .raysho-prose itself;
            CrosslinkStrip has its own styles and must stay outside prose. */}
        {children}

        {/* Metadata footer */}
        <footer className="mt-16 pt-8 border-t border-[rgba(255,255,255,0.08)] text-sm text-[rgba(232,232,228,0.65)]">
          <p>
            Updated: {formatDate(updatedAt)}. Reviewed by: Pankaj Singhal.
          </p>
          <p className="mt-2">
            Was this useful? Forward it to a colleague.
          </p>
        </footer>
      </div>
    </article>
  );
}
