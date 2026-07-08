import type { NormalizedEntry } from "@/lib/types/watch-history";
import {
  getHour,
  getMonthOfYear,
  getWeekday,
  HOURS,
  MONTHS,
  WEEKDAYS,
} from "@/lib/analytics/time";

export interface LabeledBucket {
  label: string;
  index: number;
  count: number;
}

function zeroFilledLabels(
  labels: readonly string[],
): Map<string, LabeledBucket> {
  const map = new Map<string, LabeledBucket>();
  labels.forEach((label, index) => {
    map.set(label, { label, index, count: 0 });
  });
  return map;
}

/** Watch count per hour of day (0-23), zero-filled. */
export function aggregateByHour(entries: NormalizedEntry[]): LabeledBucket[] {
  const map = zeroFilledLabels(HOURS.map(String));
  for (const e of entries) {
    if (!e.time) continue;
    const key = String(getHour(e.time));
    const bucket = map.get(key);
    if (bucket) bucket.count++;
  }
  return [...map.values()];
}

/** Watch count per weekday (Mon-Sun), zero-filled. */
export function aggregateByWeekday(
  entries: NormalizedEntry[],
): LabeledBucket[] {
  const map = zeroFilledLabels(WEEKDAYS);
  for (const e of entries) {
    if (!e.time) continue;
    const key = WEEKDAYS[getWeekday(e.time)];
    const bucket = map.get(key);
    if (bucket) bucket.count++;
  }
  return [...map.values()];
}

/** Watch count per calendar month (Jan-Dec), zero-filled. */
export function aggregateByMonthOfYear(
  entries: NormalizedEntry[],
): LabeledBucket[] {
  const map = zeroFilledLabels(MONTHS);
  for (const e of entries) {
    if (!e.time) continue;
    const key = MONTHS[getMonthOfYear(e.time)];
    const bucket = map.get(key);
    if (bucket) bucket.count++;
  }
  return [...map.values()];
}
