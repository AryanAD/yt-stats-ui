"use client";

import { useMemo } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useHistoryStore } from "@/lib/store";
import { getHour, getWeekday, WEEKDAYS } from "@/lib/analytics/time";
import { cn } from "@/lib/utils";

export function Heatmaps() {
  const parsed = useHistoryStore((s) => s.parsed);

  const { matrix, max, hourTotals } = useMemo(() => {
    const matrix: number[][] = Array.from({ length: 7 }, () =>
      new Array(24).fill(0),
    );
    if (parsed) {
      for (const e of parsed.entries) {
        if (!e.time) continue;
        matrix[getWeekday(e.time)][getHour(e.time)]++;
      }
    }
    const hourTotals = Array.from({ length: 24 }, (_, h) =>
      matrix.reduce((sum, row) => sum + row[h], 0),
    );
    let max = 0;
    for (const row of matrix) for (const v of row) if (v > max) max = v;
    return { matrix, max, hourTotals };
  }, [parsed]);

  if (!parsed) return null;

  const level = (v: number) =>
    max === 0 ? 0 : v / max > 0.66 ? 4 : v / max > 0.33 ? 3 : v / max > 0 ? 2 : 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hour × weekday heatmap</CardTitle>
        <CardDescription>
          When you watch most — rows are weekdays, columns are hours
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <div className="inline-flex flex-col gap-2">
          <div className="flex gap-[3px] pl-12 text-[10px] text-muted-foreground">
            {Array.from({ length: 24 }, (_, h) => (
              <div key={h} className="w-4 text-center">
                {h % 6 === 0 ? h : ""}
              </div>
            ))}
          </div>
          {WEEKDAYS.map((label, wd) => (
            <div key={label} className="flex items-center gap-[3px]">
              <div className="w-10 pr-2 text-right text-[10px] text-muted-foreground">
                {label}
              </div>
              {Array.from({ length: 24 }, (_, h) => {
                const v = matrix[wd][h];
                return (
                  <div
                    key={h}
                    title={`${label} ${h}:00 — ${v} views`}
                    className={cn(
                      "h-4 w-4 rounded-sm",
                      v === 0 ? "bg-muted" : "bg-primary/25",
                      level(v) === 3 && "bg-primary/55",
                      level(v) === 4 && "bg-primary",
                    )}
                  />
                );
              })}
            </div>
          ))}
          <div className="flex gap-[3px] pl-12 text-[10px] text-muted-foreground">
            {hourTotals.map((v, h) => (
              <div key={h} className="w-4 text-center">
                {v > 0 && h % 6 === 0 ? v : ""}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
