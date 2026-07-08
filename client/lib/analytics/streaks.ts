import type { NormalizedEntry } from "@/lib/types/watch-history";
import { dayKey } from "@/lib/analytics/time";

export interface StreakStats {
  longestStreak: number;
  longestStreakRange: { start: string; end: string } | null;
  currentStreak: number;
  mostInDay: { day: string; count: number } | null;
  totalActiveDays: number;
}

function diffInDays(a: string, b: string): number {
  const da = new Date(a + "T00:00:00");
  const db = new Date(b + "T00:00:00");
  return Math.round((db.getTime() - da.getTime()) / 86400000);
}

/**
 * Analyze daily watching streaks. A "streak" is a run of consecutive calendar
 * days with at least one watched item.
 */
export function computeStreaks(entries: NormalizedEntry[]): StreakStats {
  const counts = new Map<string, number>();
  for (const e of entries) {
    if (!e.time) continue;
    const key = dayKey(e.time);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const days = [...counts.keys()].sort();
  let mostInDay: { day: string; count: number } | null = null;
  for (const day of days) {
    const count = counts.get(day) ?? 0;
    if (!mostInDay || count > mostInDay.count) mostInDay = { day, count };
  }

  let longest = 0;
  let longestRange: { start: string; end: string } | null = null;
  let runStart: string | null = null;
  let runLen = 0;

  for (let i = 0; i < days.length; i++) {
    if (i === 0 || diffInDays(days[i - 1], days[i]) === 1) {
      if (runLen === 0) runStart = days[i];
      runLen++;
    } else {
      runLen = 1;
      runStart = days[i];
    }
    if (runLen > longest) {
      longest = runLen;
      longestRange = { start: runStart as string, end: days[i] };
    }
  }

  // Current streak: run ending on the most recent active day, provided that
  // day is today or yesterday (otherwise the streak has lapsed).
  let current = 0;
  if (days.length > 0) {
    const last = days[days.length - 1];
    const today = dayKey(new Date());
    const gap = diffInDays(last, today);
    if (gap <= 1) {
      current = 1;
      for (let i = days.length - 1; i > 0; i--) {
        if (diffInDays(days[i - 1], days[i]) === 1) current++;
        else break;
      }
    }
  }

  return {
    longestStreak: longest,
    longestStreakRange: longestRange,
    currentStreak: current,
    mostInDay,
    totalActiveDays: days.length,
  };
}
