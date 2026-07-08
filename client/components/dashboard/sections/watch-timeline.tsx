"use client";

import { useMemo } from "react";

import { AreaChartView } from "@/components/charts/area-chart";
import { Heatmap } from "@/components/charts/heatmap";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useHistoryStore } from "@/lib/store";
import { aggregateByMonth } from "@/lib/analytics/stats";
import { dayKey, formatMonthKey } from "@/lib/analytics/time";

export function WatchTimeline() {
  const parsed = useHistoryStore((s) => s.parsed);

  const { series, days } = useMemo(() => {
    if (!parsed) return { series: [], days: [] };
    const series = aggregateByMonth(parsed.entries).map((m) => ({
      name: formatMonthKey(m.key),
      value: m.count,
    }));
    const counts = new Map<string, number>();
    for (const e of parsed.entries) {
      if (!e.time) continue;
      const k = dayKey(e.time);
      counts.set(k, (counts.get(k) ?? 0) + 1);
    }
    const days = [...counts.entries()].map(([day, count]) => ({ day, count }));
    return { series, days };
  }, [parsed]);

  if (!parsed) return null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Views over time</CardTitle>
          <CardDescription>Watch count per month</CardDescription>
        </CardHeader>
        <CardContent>
          <AreaChartView data={series} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Activity calendar</CardTitle>
          <CardDescription>Daily watch activity (darker = more views)</CardDescription>
        </CardHeader>
        <CardContent>
          <Heatmap days={days} />
        </CardContent>
      </Card>
    </div>
  );
}
