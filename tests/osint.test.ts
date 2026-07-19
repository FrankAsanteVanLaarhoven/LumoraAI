import { describe, it, expect } from 'vitest';
import { normalizeDomain } from '../src/lib/osint/domain';

describe('normalizeDomain', () => {
  it('accepts valid domains and strips scheme / path / wildcard', () => {
    expect(normalizeDomain('Example.com')).toBe('example.com');
    expect(normalizeDomain('https://sub.example.co.uk/path?q=1')).toBe('sub.example.co.uk');
    expect(normalizeDomain('*.example.com')).toBe('example.com');
    expect(normalizeDomain('example.com:443')).toBe('example.com');
  });

  it('rejects IPs, localhost, and malformed input', () => {
    expect(normalizeDomain('127.0.0.1')).toBeNull();
    expect(normalizeDomain('localhost')).toBeNull();
    expect(normalizeDomain('not a domain')).toBeNull();
    expect(normalizeDomain('')).toBeNull();
    expect(normalizeDomain('nodots')).toBeNull();
  });
});
