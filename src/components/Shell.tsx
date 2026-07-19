'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/', label: 'Workbench' },
  { href: '/activity', label: 'Activity' },
  { href: '/governance', label: 'Governance' },
];

export default function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return (
    <div className="app">
      <aside className="rail">
        <div className="rail-brand">
          <span className="brand-mark" />
          <b>
            LUMORA<span>AI</span>
          </b>
        </div>
        <nav className="rail-nav">
          {NAV.map((n) => {
            const active = n.href === '/' ? path === '/' : path.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`rail-item ${active ? 'active' : ''}`}
                aria-current={active ? 'page' : undefined}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="rail-foot">
          <span className="led ok" /> self-hosted
        </div>
      </aside>
      <div className="app-main">{children}</div>
    </div>
  );
}
