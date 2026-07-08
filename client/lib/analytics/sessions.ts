import type { NormalizedEntry } from "@/lib/types/watch-history";

export interface SessionStat {
  start: Date;
  end: Date;
  count: number;
  durationMin: number;
}

export interface SessionStats {
  sessions: SessionStat[];
  totalSessions: number;
  avgVideosPerSession: number;
  avgDurationMin: number;
  longestSession: SessionStat | null;
  busiestDay: { day: string; sessions: number } | null;
}

const SESSION_GAP_MS = 45 * 60 * 1000;

/**
 * Group watched items into viewing sessions. A new session starts whenever the
 * gap since the previous item exceeds 45 minutes.
 */
export function computeSessions(entries: NormalizedEntry[]): SessionStats {
  const timed = entries
    .filter((e) => e.time)
    .map((e) => e.time as Date)
    .sort((a, b) => a.getTime() - b.getTime());

  const sessions: SessionStat[] = [];
  let current: Date[] = [];

  const flush = () => {
    if (current.length === 0) return;
    const start = current[0];
    const end = current[current.length - 1];
    sessions.push({
      start,
      end,
      count: current.length,
      durationMin: Math.max(0, (end.getTime() - start.getTime()) / 60000),
    });
    current = [];
  };

  for (const t of timed) {
    if (
      current.length > 0 &&
      t.getTime() - current[current.length - 1].getTime() > SESSION_GAP_MS
    ) {
      flush();
    }
    current.push(t);
  }
  flush();

  if (sessions.length === 0) {
    return {
      sessions,
      totalSessions: 0,
      avgVideosPerSession: 0,
      avgDurationMin: 0,
      longestSession: null,
      busiestDay: null,
    };
  }

  let totalCount = 0;
  let totalDuration = 0;
  let longest: SessionStat = sessions[0];
  for (const s of sessions) {
    totalCount += s.count;
    totalDuration += s.durationMin;
    if (s.count > longest.count) longest = s;
  }

  // Busiest day by number of sessions.
  const perDay = new Map<string, number>();
  for (const s of sessions) {
    const key = `${s.start.getFullYear()}-${String(s.start.getMonth() + 1).padStart(2, "0")}-${String(s.start.getDate()).padStart(2, "0")}`;
    perDay.set(key, (perDay.get(key) ?? 0) + 1);
  }
  let busiestDay: { day: string; sessions: number } | null = null;
  for (const [day, count] of perDay) {
    if (!busiestDay || count > busiestDay.sessions)
      busiestDay = { day, sessions: count };
  }

  return {
    sessions,
    totalSessions: sessions.length,
    avgVideosPerSession: totalCount / sessions.length,
    avgDurationMin: totalDuration / sessions.length,
    longestSession: longest,
    busiestDay,
  };
}
