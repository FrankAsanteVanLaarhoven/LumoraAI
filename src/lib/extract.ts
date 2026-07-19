// HTML -> clean Markdown + text + metadata + links, using cheerio (parsing) and
// turndown (HTML -> Markdown). Boilerplate (nav/header/footer/scripts) is stripped
// and the main content region preferred.
import * as cheerio from 'cheerio';
import TurndownService from 'turndown';

const turndown = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' });

export interface Extracted {
  title: string | null;
  markdown: string;
  text: string;
  meta: Record<string, string>;
  links: string[];
}

export function extractFromHtml(html: string, baseUrl: string): Extracted {
  const $ = cheerio.load(html);

  const meta: Record<string, string> = {};
  $('meta[name], meta[property]').each((_, el) => {
    const key = $(el).attr('name') ?? $(el).attr('property');
    const content = $(el).attr('content');
    if (key && content) meta[key] = content;
  });

  const title =
    ($('title').first().text() || meta['og:title'] || meta['twitter:title'] || '').trim() || null;

  const links = new Set<string>();
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href');
    if (!href) return;
    try {
      const abs = new URL(href, baseUrl);
      if (abs.protocol === 'http:' || abs.protocol === 'https:') {
        abs.hash = '';
        links.add(abs.toString());
      }
    } catch {
      /* ignore malformed href */
    }
  });

  // Strip non-content and boilerplate before extracting the main region.
  $('script, style, noscript, template, svg, iframe, form').remove();
  $('nav, header, footer, aside').remove();

  const main = $('article').first().length
    ? $('article').first()
    : $('main').first().length
      ? $('main').first()
      : $('body').first();

  const contentHtml = main.html() ?? $.html();
  const markdown = turndown
    .turndown(contentHtml)
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  const text = main.text().replace(/\s+/g, ' ').trim();

  return { title, markdown, text, meta, links: [...links] };
}
