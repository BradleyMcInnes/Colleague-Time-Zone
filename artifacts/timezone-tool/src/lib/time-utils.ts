import { useState, useEffect } from 'react';

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
 * Check if a given date/time is within "working hours" (9:00 to 17:59) for a timezone.
 */
export function isWorkingHour(date: Date, timezone: string): boolean {
  const hour = getHourInTimeZone(date, timezone);
  return hour >= 9 && hour < 18;
}

/**
 * Formats a Date object specifically for a given timezone.
 */
export function formatInTimeZone(date: Date, timezone: string, format: 'time' | 'hour' | 'weekday' | 'full') {
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
 * Returns true if the target timezone's date is different from the base timezone's date for a given exact moment.
 */
export function isDifferentDay(date: Date, baseTz: string, targetTz: string): boolean {
  const baseDay = new Intl.DateTimeFormat('en-US', { timeZone: baseTz, day: 'numeric' }).format(date);
  const targetDay = new Intl.DateTimeFormat('en-US', { timeZone: targetTz, day: 'numeric' }).format(date);
  return baseDay !== targetDay;
}
