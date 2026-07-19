import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LumoraAI — Web Data & OSINT',
  description: 'Ethical, self-hosted web-data extraction & OSINT: robots-respecting, SSRF-guarded, authorization-gated, audited.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
