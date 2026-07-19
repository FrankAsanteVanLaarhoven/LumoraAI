import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

export default function ConsoleLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="shell">
      <Sidebar />
      <div className="main">
        <TopBar />
        <main className="content">{children}</main>
      </div>
    </div>
  );
}
