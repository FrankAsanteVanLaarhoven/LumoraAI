'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { sectionFromPath } from '@/lib/nav';

function Clock() {
  const [t, setT] = useState('—');
  useEffect(() => {
    const tick = () => setT(new Date().toISOString().slice(11, 19) + ' UTC');
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);
  return <span className="clock">{t}</span>;
}

export default function TopBar() {
  const pathname = usePathname();
  const section = sectionFromPath(pathname);

  return (
    <header className="topbar">
      <div className="tb-crumb">
        <span className="tb-root">Console</span>
        <span className="tb-sep">/</span>
        <span className="tb-title">{section?.label ?? 'Overview'}</span>
      </div>

      <div className="tb-right">
        <div className="tb-search" role="search" aria-label="Command (disabled in shell)">
          <span className="tb-search-ico">⌕</span>
          <span className="tb-search-hint">Search</span>
          <kbd>⌘K</kbd>
        </div>
        <span className="tb-badge">SELF-HOSTED</span>
        <Clock />
      </div>
    </header>
  );
}
