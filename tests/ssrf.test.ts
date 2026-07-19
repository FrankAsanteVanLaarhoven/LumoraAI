import { describe, it, expect } from 'vitest';
import { isPrivateV4, assertPublicUrl } from '../src/lib/ssrf';

describe('ssrf guard', () => {
  it('classifies private / reserved IPv4', () => {
    for (const ip of ['10.0.0.1', '127.0.0.1', '169.254.169.254', '192.168.1.1', '172.16.5.5', '0.0.0.0']) {
      expect(isPrivateV4(ip)).toBe(true);
    }
    for (const ip of ['8.8.8.8', '1.1.1.1', '93.184.216.34']) {
      expect(isPrivateV4(ip)).toBe(false);
    }
  });

  it('blocks non-public hosts and bad protocols', async () => {
    expect((await assertPublicUrl('http://127.0.0.1/')).ok).toBe(false);
    expect((await assertPublicUrl('http://169.254.169.254/latest/meta-data')).ok).toBe(false);
    expect((await assertPublicUrl('http://localhost:8080')).ok).toBe(false);
    expect((await assertPublicUrl('ftp://8.8.8.8')).ok).toBe(false);
    expect((await assertPublicUrl('not a url')).ok).toBe(false);
  });

  it('allows a public IP literal', async () => {
    expect((await assertPublicUrl('http://8.8.8.8/')).ok).toBe(true);
  });
});
