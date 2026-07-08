"use client";

import { useMemo } from "react";

import { StatCard } from "@/components/dashboard/stat-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useHistoryStore } from "@/lib/store";
import {
  aggregateByChannel,
  computeOverview,
} from "@/lib/analytics/stats";
import {
  aggregateByHour,
  aggregateByMonthOfYear,
  aggregateByWeekday,
} from "@/lib/analytics/habits";

export function Statistics() {
  const parsed = useHistoryStore((s) => s.parsed);

  const facts = useMemo(() => {
    if (!parsed) return null;
    const overview = computeOverview(parsed.entries);
    const top = aggregateByChannel(parsed.entries, 1)[0];
    const weekday = aggregateByWeekday(parsed.entries);
    const month = aggregateByMonthOfYear(parsed.entries);
    const hour = aggregateByHour(parsed.entries);

    const busiestWeekday = weekday.reduce((a, b) => (b.count > a.count ? b : a));
    const busiestMonth = month.reduce((a, b) => (b.count > a.count ? b : a));

    const weekend = weekday[5].count + weekday[6].count;
    const weekendShare = overview.totalEntries
      ? Math.round((weekend / overview.totalEntries) * 100)
      : 0;

    const nightOwl = hour
      .slice(0, 6)
      .reduce((sum, h) => sum + h.count, 0);
    const nightOwlShare = overview.totalEntries
      ? Math.round((nightOwl / overview.totalEntries) * 100)
      : 0;

    return {
      total: overview.totalEntries,
      topChannel: top?.channel ?? "—",
      busiestWeekday: busiestWeekday.label,
      busiestMonth: busiestMonth.label,
      weekendShare,
      nightOwlShare,
    };
  }, [parsed]);

  if (!parsed || !facts) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard label="Total videos watched" value={facts.total.toLocaleString()} />
        <StatCard label="Top channel" value={facts.topChannel} />
        <StatCard label="Favorite day" value={facts.busiestWeekday} />
        <StatCard label="Favorite month" value={facts.busiestMonth} />
        <StatCard label="Weekend watching" value={`${facts.weekendShare}%`} />
        <StatCard label="Night owl (12–6am)" value={`${facts.nightOwlShare}%`} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>About your history</CardTitle>
          <CardDescription>
            Your data is summarized entirely in your browser.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            You have watched <strong>{facts.total.toLocaleString()}</strong>{" "}
            tracked items, with <strong>{facts.topChannel}</strong> as your most
            watched channel. Your peak day of the week is{" "}
            <strong>{facts.busiestWeekday}</strong> and your busiest month is{" "}
            <strong>{facts.busiestMonth}</strong>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
