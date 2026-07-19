import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LumoraAI Console',
  description: 'LumoraAI — command console for cybersecurity operations, commerce, and assurance.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
