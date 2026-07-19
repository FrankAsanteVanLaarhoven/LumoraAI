import { describe, it, expect } from 'vitest';
import { parseRobots, rulesForAgent, isAllowed } from '../src/lib/robots';

const TXT = `
# example
User-agent: *
Disallow: /private
Allow: /private/public
Crawl-delay: 2

User-agent: LumoraCrawler
Disallow: /secret
`;

describe('robots.txt matcher', () => {
  const groups = parseRobots(TXT);

  it('applies the agent-specific group and ignores the wildcard when matched', () => {
    const rules = rulesForAgent(groups, 'LumoraCrawler');
    expect(isAllowed(rules, '/secret')).toBe(false);
    expect(isAllowed(rules, '/private')).toBe(true); // not in the specific group
  });

  it('honours longest-match with Allow winning ties, for the wildcard group', () => {
    const rules = rulesForAgent(groups, 'SomeOtherAgent');
    expect(isAllowed(rules, '/private/data')).toBe(false);
    expect(isAllowed(rules, '/private/public')).toBe(true);
    expect(isAllowed(rules, '/open')).toBe(true);
    expect(rules.crawlDelay).toBe(2);
  });

  it('supports * and $ wildcards', () => {
    const rules = rulesForAgent(parseRobots('User-agent: *\nDisallow: /*.pdf$'), 'x');
    expect(isAllowed(rules, '/docs/a.pdf')).toBe(false);
    expect(isAllowed(rules, '/docs/a.pdfx')).toBe(true);
  });

  it('an empty Disallow permits everything', () => {
    const rules = rulesForAgent(parseRobots('User-agent: *\nDisallow:'), 'x');
    expect(isAllowed(rules, '/anything')).toBe(true);
  });
});
