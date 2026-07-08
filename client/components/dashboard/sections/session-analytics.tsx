"use client";

import { useMemo } from "react";

import { StatCard } from "@/components/dashboard/stat-card";
import { useHistoryStore } from "@/lib/store";
import { computeSessions } from "@/lib/analytics/sessions";
import { formatDayKey } from "@/lib/analytics/time";

export function SessionAnalytics() {
  const parsed = useHistoryStore((s) => s.parsed);

  const sessions = useMemo(
    () => (parsed ? computeSessions(parsed.entries) : null),
    [parsed],
  );

  if (!parsed || !sessions) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total sessions"
          value={sessions.totalSessions.toLocaleString()}
          hint={
            sessions.busiestDay
              ? `Busiest: ${formatDayKey(sessions.busiestDay.day)} (${sessions.busiestDay.sessions})`
              : undefined
          }
        />
        <StatCard
          label="Avg videos / session"
          value={sessions.avgVideosPerSession.toFixed(1)}
        />
        <StatCard
          label="Avg session length"
          value={`${sessions.avgDurationMin.toFixed(0)} min`}
        />
        <StatCard
          label="Longest session"
          value={`${sessions.longestSession?.count.toLocaleString() ?? "—"} videos`}
          hint={
            sessions.longestSession
              ? formatDayKey(
                  `${sessions.longestSession.start.getFullYear()}-${String(sessions.longestSession.start.getMonth() + 1).padStart(2, "0")}-${String(sessions.longestSession.start.getDate()).padStart(2, "0")}`,
                )
              : undefined
          }
        />
      </div>
    </div>
  );
}
