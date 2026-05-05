import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { formatTHB, formatDate, formatElapsed } from '../utils/format';

describe('formatTHB', () => {
  it('formats large numbers correctly', () => {
    expect(formatTHB(15240)).toBe('฿15,240.00');
  });

  it('formats zero correctly', () => {
    expect(formatTHB(0)).toBe('฿0.00');
  });

  it('formats negative numbers correctly with minus before ฿', () => {
    expect(formatTHB(-75)).toBe('-฿75.00');
  });

  it('rounds decimal numbers correctly', () => {
    expect(formatTHB(0.999)).toBe('฿1.00');
  });
});

describe('formatDate', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-22T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns "Today" for current date', () => {
    expect(formatDate(new Date('2026-04-22T10:00:00Z'))).toBe('Today');
  });

  it('returns "Yesterday" for previous date', () => {
    expect(formatDate(new Date('2026-04-21T10:00:00Z'))).toBe('Yesterday');
  });

  it('returns formatted date for other dates', () => {
    expect(formatDate(new Date('2026-04-20T10:00:00Z'))).toBe('20 Apr 2026');
  });
});

describe('formatElapsed', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-22T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns "Just now" for less than 1 minute', () => {
    const startTime = new Date('2026-04-22T11:59:40Z');
    expect(formatElapsed(startTime)).toBe('Just now');
  });

  it('returns minutes for less than 60 minutes', () => {
    const startTime = new Date('2026-04-22T11:48:00Z');
    expect(formatElapsed(startTime)).toBe('12 min');
  });

  it('returns hours and minutes for more than 60 minutes', () => {
    const startTime = new Date('2026-04-22T10:45:00Z');
    expect(formatElapsed(startTime)).toBe('1 hr 15 min');
  });

  it('returns hours only if minutes are zero', () => {
    const startTime = new Date('2026-04-22T10:00:00Z');
    expect(formatElapsed(startTime)).toBe('2 hr');
  });
});
