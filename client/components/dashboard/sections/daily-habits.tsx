"use client";

import { useMemo } from "react";

import { BarChartView } from "@/components/charts/bar-chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useHistoryStore } from "@/lib/store";
import {
  aggregateByHour,
  aggregateByMonthOfYear,
  aggregateByWeekday,
} from "@/lib/analytics/habits";

function toSeries(buckets: { label: string; count: number }[]) {
  return buckets.map((b) => ({ name: b.label, value: b.count }));
}

export function DailyHabits() {
  const parsed = useHistoryStore((s) => s.parsed);

  const { hour, weekday, month } = useMemo(() => {
    if (!parsed) return { hour: [], weekday: [], month: [] };
    return {
      hour: toSeries(aggregateByHour(parsed.entries)),
      weekday: toSeries(aggregateByWeekday(parsed.entries)),
      month: toSeries(aggregateByMonthOfYear(parsed.entries)),
    };
  }, [parsed]);

  if (!parsed) return null;

  return (
    <div className="grid gap-6 lg:grid-cols-1">
      <Card>
        <CardHeader>
          <CardTitle>Time of day</CardTitle>
          <CardDescription>When you usually watch</CardDescription>
        </CardHeader>
        <CardContent>
          <BarChartView data={hour} height={240} />
        </CardContent>
      </Card>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Day of week</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChartView data={weekday} height={240} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Month of year</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChartView data={month} height={240} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
