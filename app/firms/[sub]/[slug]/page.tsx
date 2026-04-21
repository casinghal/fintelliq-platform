import { notFound } from 'next/navigation';
import { loadPlaybook } from '@/lib/content-loader';
import { PlaybookTemplate } from '@/components/PlaybookTemplate';
import type { Metadata } from 'next';

interface PageProps {
  params: { sub: string; slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { sub, slug } = params;
  const playbook = loadPlaybook(sub, slug);

  if (!playbook) {
    return { title: 'Not found' };
  }

  const { frontMatter } = playbook;
  return {
    title: `${frontMatter.title} | Raysho`,
    description: frontMatter.jtbd ?? frontMatter.angle ?? frontMatter.title,
    alternates: {
      canonical: frontMatter.canonical,
    },
    openGraph: {
      title: frontMatter.title,
      description: frontMatter.jtbd ?? frontMatter.angle,
      type: 'article',
    },
  };
}

export default function PlaybookPage({ params }: PageProps) {
  const { sub, slug } = params;
  const playbook = loadPlaybook(sub, slug);

  if (!playbook) {
    notFound();
  }

  return <PlaybookTemplate playbook={playbook} />;
}
