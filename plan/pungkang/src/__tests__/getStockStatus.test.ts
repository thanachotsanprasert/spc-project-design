import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getStockStatus } from '../utils/getStockStatus';

describe('getStockStatus', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-22T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns Empty when quantity is 0', () => {
    expect(getStockStatus(0, 10, null)).toBe('Empty');
  });

  it('returns Empty when quantity is negative', () => {
    expect(getStockStatus(-1, 10, null)).toBe('Empty');
  });

  it('returns Exp Soon when expiry is exactly 3 days away', () => {
    // 2026-04-22 + 3 days = 2026-04-25
    expect(getStockStatus(20, 10, '2026-04-25T12:00:00Z')).toBe('Exp Soon');
  });

  it('returns Good when expiry is 4 days away and quantity is above reorder point', () => {
    expect(getStockStatus(20, 10, '2026-04-26T12:00:00Z')).toBe('Good');
  });

  it('returns Low Stock when quantity is exactly reorder point', () => {
    expect(getStockStatus(10, 10, null)).toBe('Low Stock');
  });

  it('returns Good when quantity is reorder point + 1', () => {
    expect(getStockStatus(11, 10, null)).toBe('Good');
  });

  it('skips expiry check when expiryDate is null', () => {
    expect(getStockStatus(11, 10, null)).toBe('Good');
  });

  it('prioritizes Exp Soon over Low Stock', () => {
    // quantity 5 is Low Stock (<= 10), but expiry is Exp Soon
    expect(getStockStatus(5, 10, '2026-04-24T12:00:00Z')).toBe('Exp Soon');
  });
});
