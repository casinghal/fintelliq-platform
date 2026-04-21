import Link from 'next/link';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-2 text-body-s text-text-muted">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            {item.href ? (
              <Link
                href={item.href}
                className="transition-colors duration-base ease-standard hover:text-text-primary"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-text-primary">{item.label}</span>
            )}
            {i < items.length - 1 && (
              <span className="text-line-solid" aria-hidden>
                /
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
