'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV, GROUPS } from '@/lib/nav';
import { cx } from '@/lib/format';
import { Icon } from './icons';

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="side-brand">
        <span className="brand-mark" aria-hidden />
        <span className="brand-text">
          LUMORA<span>AI</span>
        </span>
      </div>

      <nav className="side-nav">
        {GROUPS.map((group) => (
          <div className="side-group" key={group}>
            <div className="side-group-label">{group}</div>
            {NAV.filter((n) => n.group === group).map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={cx('nav-item', active && 'active')}
                  aria-current={active ? 'page' : undefined}
                >
                  <span className="nav-ico">
                    <Icon name={item.key} />
                  </span>
                  <span className="nav-label">{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="side-foot">
        <span className="led ok" />
        <span>self-hosted · single-node</span>
      </div>
    </aside>
  );
}
