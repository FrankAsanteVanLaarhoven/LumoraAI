// Dynamic (JavaScript) rendering via a headless Chromium, for SPA / JS-rendered
// pages whose content isn't in the static HTML. This is NOT evasion: we set the
// honest LumoraCrawler User-Agent (no fingerprint spoofing) and callers still
// enforce robots.txt + rate limits before rendering. SSRF is guarded on the
// initial URL. playwright-core is loaded lazily and reuses an already-installed
// browser via executablePath — no download at install time.
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import os from 'node:os';
import { USER_AGENT } from './ua';
import { assertPublicUrl } from './ssrf';

const REL: [string, string][] = [
  ['chromium-', 'chrome-linux64/chrome'],
  ['chromium-', 'chrome-linux/chrome'],
  ['chromium_headless_shell-', 'chrome-linux64/headless_shell'],
  ['chromium_headless_shell-', 'chrome-linux/headless_shell'],
];

function findChromium(): string | null {
  const env = process.env.LUMORA_CHROMIUM_PATH;
  if (env && existsSync(env)) return env;
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH || join(os.homedir(), '.cache', 'ms-playwright');
  let dirs: string[];
  try {
    dirs = readdirSync(base);
  } catch {
    return null;
  }
  for (const [prefix, rel] of REL) {
    const dir = dirs.find((d) => d.startsWith(prefix));
    if (dir) {
      const p = join(base, dir, rel);
      if (existsSync(p)) return p;
    }
  }
  return null;
}

export function renderAvailable(): boolean {
  return findChromium() !== null;
}

export interface RenderResult {
  html: string;
  finalUrl: string;
}

export async function renderHtml(url: string, timeoutMs = 25_000): Promise<RenderResult | { error: string }> {
  const guard = await assertPublicUrl(url);
  if (!guard.ok) return { error: guard.reason ?? 'blocked URL' };

  let chromium: typeof import('playwright-core').chromium;
  try {
    ({ chromium } = await import('playwright-core'));
  } catch {
    return { error: 'JS rendering unavailable: playwright-core not installed' };
  }

  const executablePath = findChromium() ?? undefined;
  let browser: Awaited<ReturnType<typeof chromium.launch>>;
  try {
    browser = await chromium.launch({
      headless: true,
      executablePath,
      args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
    });
  } catch (e) {
    const hint = executablePath ? '' : ' (no chromium found — run: npx playwright install chromium)';
    return { error: `browser launch failed: ${e instanceof Error ? e.message : 'unknown'}${hint}` };
  }

  try {
    const context = await browser.newContext({ userAgent: USER_AGENT });
    const page = await context.newPage();
    await page.goto(url, { waitUntil: 'networkidle', timeout: timeoutMs }).catch(() => null);
    const html = await page.content();
    const finalUrl = page.url();
    await browser.close();
    return { html, finalUrl };
  } catch (e) {
    await browser.close().catch(() => {});
    return { error: e instanceof Error ? e.message : 'render failed' };
  }
}
