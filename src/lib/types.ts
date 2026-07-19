// Domain types for the web-data extraction engine.

export interface PageResult {
  url: string;
  finalUrl?: string;
  status: number;
  ok: boolean;
  title: string | null;
  markdown: string;
  text: string;
  meta: Record<string, string>;
  links: string[];
  bytes: number;
  fetchedAt: string;
  rendered: boolean;
  error?: string;
}

export interface CrawlOptions {
  depth?: number;
  limit?: number;
  sameOrigin?: boolean;
}

export interface CrawlResult {
  seed: string;
  pages: PageResult[];
  visited: number;
  skipped: { url: string; reason: string }[];
}

export interface AuditEntry {
  id: string;
  ts: string;
  action: string;
  target: string;
  outcome: string;
  detail?: string;
}
