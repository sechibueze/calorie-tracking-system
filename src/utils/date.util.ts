const pad = (n: number) => String(n).padStart(2, '0');

/** YYYY-MM-DD in the browser's time zone. */
export const toLocalDate = (d: Date): string => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const addDays = (date: string, days: number): string => {
  const [y, m, d] = date.split('-').map(Number) as [number, number, number];
  return toLocalDate(new Date(y, m - 1, d + days));
};

export const browserTimeZone = (): string => Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

/** The local calendar day an ISO instant falls on (matches the `timezone` sent to the API). */
export const dayOf = (iso: string): string => toLocalDate(new Date(iso));

export const formatDay = (date: string): string =>
  new Date(`${date}T12:00:00`).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

export const formatTime = (iso: string): string =>
  new Date(iso).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

export const formatDateTime = (iso: string): string => `${formatDay(dayOf(iso))}, ${formatTime(iso)}`;

/** Value for <input type="datetime-local"> in local time. */
export const toDatetimeLocal = (iso: string): string => {
  const d = new Date(iso);
  return `${toLocalDate(d)}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export const nowDatetimeLocal = (): string => toDatetimeLocal(new Date().toISOString());