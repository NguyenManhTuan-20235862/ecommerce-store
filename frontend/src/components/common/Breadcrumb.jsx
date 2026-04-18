import { Link } from "react-router";

export default function Breadcrumb({ items = [] }) {
  if (!items.length) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="text-sm text-neutral-500">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item.label} className="flex items-center gap-2">
              {item.to && !isLast ? (
                <Link
                  to={item.to}
                  className="transition hover:text-neutral-900"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-neutral-800">{item.label}</span>
              )}

              {!isLast && <span aria-hidden="true">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
