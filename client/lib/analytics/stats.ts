import type { NormalizedEntry } from "@/lib/types/watch-history";

export interface OverviewStats {
  totalEntries: number;
  uniqueChannels: number;
  entriesWithVideoId: number;
  firstWatch: Date | null;
  lastWatch: Date | null;
  /** Average number of entries per active day. */
  avgPerDay: number;
  avgPerWeek: number;
  avgPerMonth: number;
}

export interface TimeBucket {
  key: string;
  count: number;
}

export interface ChannelStat {
  channel: string;
  count: number;
  firstWatch: Date | null;
  lastWatch: Date | null;
}

function dayKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

function monthKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function weekKey(d: Date): string {
  // ISO week start (Monday).
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() - day + 1);
  return date.toISOString().slice(0, 10);
}

function monthDiff(a: Date, b: Date): number {
  return (
    (b.getFullYear() - a.getFullYear()) * 12 +
    (b.getMonth() - a.getMonth()) +
    1
  );
}

/**
 * Compute the high-level overview statistics shown on the dashboard home.
 */
export function computeOverview(entries: NormalizedEntry[]): OverviewStats {
  const withTime = entries.filter((e) => e.time);
  const uniqueChannels = new Set(
    entries.map((e) => e.channel).filter((c): c is string => Boolean(c)),
  );

  let firstWatch: Date | null = null;
  let lastWatch: Date | null = null;
  for (const e of withTime) {
    const t = e.time as Date;
    if (!firstWatch || t < firstWatch) firstWatch = t;
    if (!lastWatch || t > lastWatch) lastWatch = t;
  }

  let avgPerDay = 0;
  let avgPerWeek = 0;
  let avgPerMonth = 0;
  if (firstWatch && lastWatch && withTime.length > 0) {
    const dayMs = 24 * 60 * 60 * 1000;
    const days = Math.max(
      1,
      Math.ceil((lastWatch.getTime() - firstWatch.getTime()) / dayMs) + 1,
    );
    const weeks = Math.max(1, Math.ceil(days / 7));
    const months = Math.max(1, monthDiff(firstWatch, lastWatch));
    avgPerDay = withTime.length / days;
    avgPerWeek = withTime.length / weeks;
    avgPerMonth = withTime.length / months;
  }

  return {
    totalEntries: entries.length,
    uniqueChannels: uniqueChannels.size,
    entriesWithVideoId: entries.filter((e) => e.videoId).length,
    firstWatch,
    lastWatch,
    avgPerDay,
    avgPerWeek,
    avgPerMonth,
  };
}

/**
 * Count entries grouped by calendar day (YYYY-MM-DD). Only entries with a
 * valid time are included.
 */
export function aggregateByDay(entries: NormalizedEntry[]): TimeBucket[] {
  const map = new Map<string, number>();
  for (const e of entries) {
    if (!e.time) continue;
    const key = dayKey(e.time);
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => a.key.localeCompare(b.key));
}

/**
 * Count entries grouped by month (YYYY-MM).
 */
export function aggregateByMonth(entries: NormalizedEntry[]): TimeBucket[] {
  const map = new Map<string, number>();
  for (const e of entries) {
    if (!e.time) continue;
    const key = monthKey(e.time);
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => a.key.localeCompare(b.key));
}

/**
 * Count entries grouped by year (YYYY).
 */
export function aggregateByYear(entries: NormalizedEntry[]): TimeBucket[] {
  const map = new Map<string, number>();
  for (const e of entries) {
    if (!e.time) continue;
    const key = String(e.time.getFullYear());
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => a.key.localeCompare(b.key));
}

/**
 * Rank channels by number of watched entries.
 */
export function aggregateByChannel(
  entries: NormalizedEntry[],
  limit?: number,
): ChannelStat[] {
  const map = new Map<
    string,
    { count: number; firstWatch: Date | null; lastWatch: Date | null }
  >();
  for (const e of entries) {
    if (!e.channel) continue;
    const cur = map.get(e.channel) ?? {
      count: 0,
      firstWatch: null,
      lastWatch: null,
    };
    cur.count += 1;
    if (e.time) {
      if (!cur.firstWatch || e.time < cur.firstWatch) cur.firstWatch = e.time;
      if (!cur.lastWatch || e.time > cur.lastWatch) cur.lastWatch = e.time;
    }
    map.set(e.channel, cur);
  }
  const result = [...map.entries()]
    .map(([channel, v]) => ({
      channel,
      count: v.count,
      firstWatch: v.firstWatch,
      lastWatch: v.lastWatch,
    }))
    .sort((a, b) => b.count - a.count);
  return typeof limit === "number" ? result.slice(0, limit) : result;
}
