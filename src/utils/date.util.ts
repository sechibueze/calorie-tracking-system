export function isValidTimeZone(timeZone: string): boolean {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone });
    return true;
  } catch {
    return false;
  }
}

/** Offset (ms) of `timeZone` from UTC at the given instant, e.g. Africa/Lagos => +3_600_000. */
function offsetMs(instant: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(instant);
  const get = (type: string): number => Number(parts.find((p) => p.type === type)?.value);
  const asUtc = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second'));
  return asUtc - Math.floor(instant.getTime() / 1000) * 1000;
}

/** The UTC instant at which calendar day `date` (YYYY-MM-DD) starts in `timeZone`. */
export function startOfDayUtc(date: string, timeZone: string): Date {
  const [y, m, d] = date.split('-').map(Number) as [number, number, number];
  const guess = Date.UTC(y, m - 1, d);
  let instant = guess - offsetMs(new Date(guess), timeZone);
  const corrected = guess - offsetMs(new Date(instant), timeZone); // handles DST changes
  if (corrected !== instant) instant = corrected;
  return new Date(instant);
}

export function addDays(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export interface DateRange {
  gte?: Date;
  lt?: Date;
}

/** Inclusive calendar-day range (dateFrom..dateTo) in `timeZone` as a half-open UTC range. */
export function dayRangeToUtc(dateFrom: string | undefined, dateTo: string | undefined, timeZone: string): DateRange {
  return {
    ...(dateFrom ? { gte: startOfDayUtc(dateFrom, timeZone) } : {}),
    ...(dateTo ? { lt: startOfDayUtc(addDays(dateTo, 1), timeZone) } : {}),
  };
}