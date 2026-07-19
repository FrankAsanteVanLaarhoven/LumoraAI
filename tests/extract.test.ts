import { describe, it, expect } from 'vitest';
import { extractFromHtml } from '../src/lib/extract';

const HTML = `<!doctype html><html><head>
  <title>Hello World</title>
  <meta name="description" content="a test page">
  <meta property="og:title" content="OG Hello">
</head><body>
  <nav>NAVIGATION</nav>
  <header>SITE HEADER</header>
  <main>
    <h1>Main Heading</h1>
    <p>Some <a href="/about">about</a> text and an <a href="https://ext.example/x">external</a> link.</p>
  </main>
  <footer>SITE FOOTER</footer>
  <script>window.evil = 1;</script>
</body></html>`;

describe('html extraction', () => {
  const r = extractFromHtml(HTML, 'https://site.test/page');

  it('pulls the title and metadata', () => {
    expect(r.title).toBe('Hello World');
    expect(r.meta.description).toBe('a test page');
    expect(r.meta['og:title']).toBe('OG Hello');
  });

  it('produces markdown of the main content and drops boilerplate/scripts', () => {
    expect(r.markdown).toContain('Main Heading');
    expect(r.markdown).not.toContain('NAVIGATION');
    expect(r.markdown).not.toContain('SITE FOOTER');
    expect(r.markdown).not.toContain('window.evil');
  });

  it('resolves links to absolute http(s) URLs', () => {
    expect(r.links).toContain('https://site.test/about');
    expect(r.links).toContain('https://ext.example/x');
  });
});
