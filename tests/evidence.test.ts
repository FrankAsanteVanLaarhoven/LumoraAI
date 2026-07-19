import { describe, it, expect } from 'vitest';
import { EVIDENCE, verifyEvidence } from '../src/lib/data';

describe('evidence ledger', () => {
  it('is a non-empty, sequentially numbered chain', () => {
    expect(EVIDENCE.length).toBeGreaterThan(0);
    EVIDENCE.forEach((r, i) => expect(r.seq).toBe(i + 1));
  });

  it('verifies as an intact hash chain', () => {
    expect(verifyEvidence(EVIDENCE)).toBe(true);
  });

  it('detects tampering with any field', () => {
    const tampered = EVIDENCE.map((r) => ({ ...r }));
    tampered[1] = { ...tampered[1], target: 'MUTATED' };
    expect(verifyEvidence(tampered)).toBe(false);
  });

  it('detects reordering of records', () => {
    const reordered = [EVIDENCE[1], EVIDENCE[0], ...EVIDENCE.slice(2)];
    expect(verifyEvidence(reordered)).toBe(false);
  });

  it('links each record to the previous hash', () => {
    for (let i = 1; i < EVIDENCE.length; i++) {
      expect(EVIDENCE[i].prev).toBe(EVIDENCE[i - 1].hash);
    }
  });
});
