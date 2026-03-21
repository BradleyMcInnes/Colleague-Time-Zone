import { useState, useEffect, useMemo } from 'react';

/**
 * Returns the current Date, updating every `interval` milliseconds.
 */
export function useCurrentTime(interval = 60000) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), interval);
    return () => clearInterval(timer);
  }, [interval]);

  return time;
}

/**
 * Compute 24 UTC instants that represent each hour (0–23) of TODAY
 * anchored to midnight in the given base timezone, regardless of the
 * system/browser timezone.
 *
 * Strategy: determine how many milliseconds past midnight (in the base tz)
 * "now" is, subtract that to land on midnight UTC-equivalent, then add
 * hourly offsets.
 */
export function getBaseTzDayInstants(baseTimezone: string, now: Date): Date[] {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: baseTimezone,
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(now);

  const getPart = (type: string) =>
    parseInt(parts.find(p => p.type === type)?.value ?? '0', 10);

  const h = getPart('hour');
  const m = getPart('minute');
  const s = getPart('second');

  // Normalise hour=24 (midnight edge-case in some Intl implementations)
  const normalH = h === 24 ? 0 : h;

  const msSinceMidnight =
    (normalH * 3600 + m * 60 + s) * 1000 + now.getMilliseconds();

  // UTC timestamp for 00:00:00 today in the base timezone
  const midnightUtcMs = now.getTime() - msSinceMidnight;

  return Array.from({ length: 24 }, (_, i) => new Date(midnightUtcMs + i * 3_600_000));
}

/**
 * Hook that returns the 24 day instants and the current base-tz hour index,
 * both recomputed whenever currentTime changes.
 */
export function useBaseTzDay(baseTimezone: string, currentTime: Date) {
  return useMemo(() => {
    const instants = getBaseTzDayInstants(baseTimezone, currentTime);
    const currentHourIndex = getHourInTimeZone(currentTime, baseTimezone);
    return { instants, currentHourIndex };
  }, [baseTimezone, currentTime]);
}

/**
 * Get the 24-hour integer for a given date in a target timezone.
 */
export function getHourInTimeZone(date: Date, timezone: string): number {
  const str = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    hour: 'numeric',
    hour12: false,
  }).format(date);

  const hour = parseInt(str, 10);
  return hour === 24 ? 0 : hour;
}

/**
 * Check if a given date/time is within "working hours" (9:00 to 17:59)
 * for a given timezone.
 */
export function isWorkingHour(date: Date, timezone: string): boolean {
  const hour = getHourInTimeZone(date, timezone);
  return hour >= 9 && hour < 18;
}

/**
 * Formats a Date object for a given timezone.
 */
export function formatInTimeZone(
  date: Date,
  timezone: string,
  format: 'time' | 'hour' | 'weekday' | 'full',
): string {
  const options: Intl.DateTimeFormatOptions = { timeZone: timezone };

  if (format === 'time') {
    options.hour = 'numeric';
    options.minute = '2-digit';
    options.hour12 = true;
  } else if (format === 'hour') {
    options.hour = 'numeric';
    options.hour12 = true;
  } else if (format === 'weekday') {
    options.weekday = 'short';
  } else if (format === 'full') {
    options.weekday = 'short';
    options.hour = 'numeric';
    options.minute = '2-digit';
    options.hour12 = true;
  }

  return new Intl.DateTimeFormat('en-US', options).format(date);
}

/**
 * Returns true if the target timezone's calendar date differs from the base
 * timezone's calendar date for the same UTC instant.
 */
export function isDifferentDay(date: Date, baseTz: string, targetTz: string): boolean {
  const baseDay = new Intl.DateTimeFormat('en-US', { timeZone: baseTz, day: 'numeric' }).format(date);
  const targetDay = new Intl.DateTimeFormat('en-US', { timeZone: targetTz, day: 'numeric' }).format(date);
  return baseDay !== targetDay;
}
