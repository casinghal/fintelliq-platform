import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Playbook } from '@/lib/content-loader';
import { Breadcrumb } from './Breadcrumb';
import { ReadingTime } from './ReadingTime';
import { RelatedContent } from './RelatedContent';

interface PlaybookTemplateProps {
  playbook: Playbook;
}

export function PlaybookTemplate({ playbook }: PlaybookTemplateProps) {
  const { frontMatter, body } = playbook;

  const breadcrumbItems = [
    { label: 'Raysho', href: '/' },
    { label: 'CPA Firms', href: '/firms/' },
    { label: 'Automation', href: frontMatter.subHub },
    { label: frontMatter.title.split(':')[0] },
  ];

  return (
    <article className="min-h-screen bg-bg">
      <div className="max-w-3xl mx-auto px-6 py-12 md:px-8 md:py-16">
        <Breadcrumb items={breadcrumbItems} />

        <header className="mb-12">
          <h1 className="text-display-m md:text-display-l mb-6">
            {frontMatter.title}
          </h1>
          <div className="flex items-center gap-4 text-body-s text-text-muted">
            <ReadingTime minutes={frontMatter.readingTimeMinutes} />
            <span aria-hidden>·</span>
            <span>{frontMatter.created}</span>
            <span aria-hidden>·</span>
            <span>{frontMatter.reviewedBy}</span>
          </div>
        </header>

        <div className="prose-playbook">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: () => null,
              h2: ({ children }) => (
                <h2 className="text-headline-l mt-12 mb-4">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-headline-m mt-8 mb-3">{children}</h3>
              ),
              p: ({ children }) => (
                <p className="text-body-l text-text-primary mb-6">{children}</p>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  className="text-accent hover:text-text-primary underline underline-offset-4 transition-colors duration-base ease-standard"
                >
                  {children}
                </a>
              ),
              code: ({ className, children, ...rest }) => {
                const isBlock = className?.startsWith('language-');
                if (isBlock) {
                  return (
                    <pre className="bg-surface border border-line rounded-lg p-4 overflow-x-auto my-6 shadow-card">
                      <code className="font-mono text-body-s text-text-primary">
                        {children}
                      </code>
                    </pre>
                  );
                }
                return (
                  <code
                    className="font-mono text-body-s bg-surface px-1.5 py-0.5 rounded border border-line"
                    {...rest}
                  >
                    {children}
                  </code>
                );
              },
              blockquote: ({ children }) => (
                <blockquote className="border-l-2 border-accent pl-6 my-6 text-body-l text-text-muted italic">
                  {children}
                </blockquote>
              ),
              ul: ({ children }) => (
                <ul className="text-body-l text-text-primary mb-6 space-y-2 list-disc list-outside ml-6">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="text-body-l text-text-primary mb-6 space-y-2 list-decimal list-outside ml-6">
                  {children}
                </ol>
              ),
              hr: () => <hr className="border-line my-12" />,
              table: ({ children }) => (
                <div className="overflow-x-auto my-8">
                  <table className="w-full text-body-m border-collapse">
                    {children}
                  </table>
                </div>
              ),
              th: ({ children }) => (
                <th className="text-left font-display font-semibold text-text-primary border-b border-line p-3">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="text-text-primary border-b border-line p-3">
                  {children}
                </td>
              ),
            }}
          >
            {body}
          </ReactMarkdown>
        </div>

        <RelatedContent
          items={[
            {
              title: 'Bank feed setup for QBO and Xero',
              href: '/firms/automation/bank-feed-setup-for-qbo-and-xero',
              contextLabel: 'Pairs with AP capture — the day-one client request list',
            },
            {
              title: 'Close automation for CPA firms',
              href: '/firms/automation/close-automation-for-cpa-firms',
              contextLabel: 'AP capture is a feeder into close',
            },
            {
              title: 'AI-assisted bank reconciliation',
              href: '/firms/automation/ai-assisted-bank-reconciliation',
              contextLabel: 'Validation layer shares logic with extraction QA',
            },
          ]}
        />
      </div>
    </article>
  );
}
