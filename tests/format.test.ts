import { describe, it, expect } from 'vitest';
import { fnv1a, shortHash, pct, cx, fmtNum } from '../src/lib/format';

describe('format helpers', () => {
  it('fnv1a is deterministic and 8 hex chars', () => {
    expect(fnv1a('abc')).toBe(fnv1a('abc'));
    expect(fnv1a('abc')).toMatch(/^[0-9a-f]{8}$/);
    expect(fnv1a('abc')).not.toBe(fnv1a('abd'));
  });

  it('pct clamps to 0..100 and guards divide-by-zero', () => {
    expect(pct(50, 100)).toBe(50);
    expect(pct(200, 100)).toBe(100);
    expect(pct(-5, 100)).toBe(0);
    expect(pct(1, 0)).toBe(0);
  });

  it('cx joins only truthy parts', () => {
    expect(cx('a', false, null, undefined, 'b')).toBe('a b');
  });

  it('shortHash abbreviates long hashes, leaves short ones', () => {
    expect(shortHash('0123456789abcdef')).toContain('…');
    expect(shortHash('short')).toBe('short');
  });

  it('fmtNum groups thousands', () => {
    expect(fmtNum(1234567)).toBe('1,234,567');
  });
});
