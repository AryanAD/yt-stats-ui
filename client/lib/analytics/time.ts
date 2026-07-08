export const HOURS = Array.from({ length: 24 }, (_, i) => i);

// Monday-first weekday labels (getWeekday returns 0 for Monday).
export const WEEKDAYS = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
] as const;

export const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

/** Hour of day, 0-23. */
export function getHour(d: Date): number {
  return d.getHours();
}

/** Local-date key in YYYY-MM-DD form. */
export function dayKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Weekday index with Monday = 0, Sunday = 6. */
export function getWeekday(d: Date): number {
  return (d.getDay() + 6) % 7;
}

/** Month of year, 0-11. */
export function getMonthOfYear(d: Date): number {
  return d.getMonth();
}

export function formatMonthKey(key: string): string {
  const [year, month] = key.split("-");
  const idx = Number(month) - 1;
  return `${MONTHS[idx] ?? month} ${year}`;
}

export function formatDayKey(key: string): string {
  const [, month, day] = key.split("-");
  const idx = Number(month) - 1;
  return `${MONTHS[idx] ?? month} ${day}`;
}
