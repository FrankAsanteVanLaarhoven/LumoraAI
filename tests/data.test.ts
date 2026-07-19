import { describe, it, expect } from 'vitest';
import { NAV, GROUPS } from '../src/lib/nav';
import { ENTITLEMENTS, SIGNALS, CHANNELS, PRODUCTS } from '../src/lib/data';

describe('navigation', () => {
  it('exposes 9 unique sections under /console', () => {
    expect(NAV).toHaveLength(9);
    expect(new Set(NAV.map((n) => n.key)).size).toBe(9);
    NAV.forEach((n) => expect(n.href.startsWith('/console/')).toBe(true));
  });

  it('assigns every section to a known group', () => {
    NAV.forEach((n) => expect(GROUPS).toContain(n.group));
  });
});

describe('domain invariants', () => {
  it('entitlement usage and limits are sane', () => {
    ENTITLEMENTS.forEach((e) => {
      expect(e.used).toBeGreaterThanOrEqual(0);
      expect(e.limit).toBeGreaterThan(0);
    });
  });

  it('signal confidence is a probability in (0, 1]', () => {
    SIGNALS.forEach((s) => {
      expect(s.confidence).toBeGreaterThan(0);
      expect(s.confidence).toBeLessThanOrEqual(1);
    });
  });

  it('channels and products carry an id and status', () => {
    [...CHANNELS, ...PRODUCTS].forEach((row) => {
      expect(row.id).toBeTruthy();
      expect(row.status).toBeTruthy();
    });
  });
});
