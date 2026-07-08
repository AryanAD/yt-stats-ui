"use client";

import { useMemo } from "react";

import { StatCard } from "@/components/dashboard/stat-card";
import { useHistoryStore } from "@/lib/store";
import { computeStreaks } from "@/lib/analytics/streaks";
import { formatDayKey } from "@/lib/analytics/time";

export function ViewingStreaks() {
  const parsed = useHistoryStore((s) => s.parsed);

  const streaks = useMemo(
    () => (parsed ? computeStreaks(parsed.entries) : null),
    [parsed],
  );

  if (!parsed || !streaks) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Longest streak"
          value={`${streaks.longestStreak} days`}
          hint={
            streaks.longestStreakRange
              ? `${formatDayKey(streaks.longestStreakRange.start)} – ${formatDayKey(streaks.longestStreakRange.end)}`
              : undefined
          }
        />
        <StatCard label="Current streak" value={`${streaks.currentStreak} days`} />
        <StatCard
          label="Total active days"
          value={streaks.totalActiveDays.toLocaleString()}
        />
        <StatCard
          label="Most in a day"
          value={streaks.mostInDay?.count.toLocaleString() ?? "—"}
          hint={
            streaks.mostInDay ? formatDayKey(streaks.mostInDay.day) : undefined
          }
        />
      </div>
    </div>
  );
}
