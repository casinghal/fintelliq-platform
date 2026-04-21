import Link from 'next/link';

export interface RelatedItem {
  title: string;
  href: string;
  contextLabel?: string;
}

export function RelatedContent({
  items,
  heading = 'Related reading',
}: {
  items: RelatedItem[];
  heading?: string;
}) {
  if (items.length === 0) return null;

  return (
    <aside className="mt-16 pt-8 border-t border-line">
      <h2 className="text-headline-m mb-6">{heading}</h2>
      <ul className="space-y-4">
        {items.map((item, i) => (
          <li key={i}>
            <Link
              href={item.href}
              className="block group transition-colors duration-base ease-standard"
            >
              <span className="text-body-l text-text-primary group-hover:text-accent">
                {item.title}
              </span>
              {item.contextLabel && (
                <span className="block text-body-s text-text-muted mt-1">
                  {item.contextLabel}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
