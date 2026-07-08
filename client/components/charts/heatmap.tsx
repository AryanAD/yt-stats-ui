"use client";

import { useMemo } from "react";

import { cn } from "@/lib/utils";

export interface HeatmapDay {
  day: string; // YYYY-MM-DD
  count: number;
}

interface Cell {
  key: string;
  count: number;
  date: Date;
}

function toDate(day: string): Date {
  return new Date(day + "T00:00:00");
}

function ymd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function intensity(count: number, max: number): number {
  if (count <= 0 || max === 0) return 0;
  const ratio = count / max;
  if (ratio > 0.75) return 4;
  if (ratio > 0.5) return 3;
  if (ratio > 0.25) return 2;
  return 1;
}

const WEEKDAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

/**
 * GitHub-style contribution heatmap of watch activity per day.
 */
export function Heatmap({ days }: { days: HeatmapDay[] }) {
  const { weeks, max, monthLabels } = useMemo(() => {
    const values = new Map(days.map((d) => [d.day, d.count]));
    const dates = days
      .map((d) => toDate(d.day))
      .sort((a, b) => a.getTime() - b.getTime());

    if (dates.length === 0) {
      return { weeks: [] as Cell[][], max: 0, monthLabels: [] as { col: number; label: string }[] };
    }

    const start = new Date(dates[0]);
    start.setDate(start.getDate() - start.getDay()); // back to Sunday
    const end = new Date(dates[dates.length - 1]);
    end.setDate(end.getDate() + (6 - end.getDay())); // forward to Saturday

    const weeks: Cell[][] = [];
    let current: Cell[] = [];
    let monthLabels: { col: number; label: string }[] = [];
    let lastMonth = -1;
    let col = 0;

    for (
      let cur = new Date(start);
      cur <= end;
      cur.setDate(cur.getDate() + 1)
    ) {
      const key = ymd(cur);
      const count = values.get(key) ?? 0;
      current.push({ key, count, date: new Date(cur) });

      if (current.length === 7) {
        weeks.push(current);
        const firstOfCol = current[0].date;
        const m = firstOfCol.getMonth();
        if (m !== lastMonth) {
          monthLabels.push({ col, label: firstOfCol.toLocaleString("en", { month: "short" }) });
          lastMonth = m;
        }
        col++;
        current = [];
      }
    }
    if (current.length > 0) weeks.push(current);

    let max = 0;
    for (const c of values.values()) if (c > max) max = c;
    return { weeks, max, monthLabels };
  }, [days]);

  if (weeks.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No dated activity to display.</p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="inline-flex flex-col gap-1">
        <div className="flex gap-[3px] pl-9 text-[10px] text-muted-foreground">
          {weeks.map((_, col) => {
            const label = monthLabels.find((m) => m.col === col);
            return (
              <div key={col} className="w-3">
                {label ? label.label : ""}
              </div>
            );
          })}
        </div>
        <div className="flex gap-[3px]">
          <div className="flex w-9 flex-col gap-[3px] pr-1 text-[10px] text-muted-foreground">
            {WEEKDAY_LABELS.map((l, i) => (
              <div key={i} className="h-3 leading-3">
                {l}
              </div>
            ))}
          </div>
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((cell) => (
                <div
                  key={cell.key}
                  title={`${cell.key}: ${cell.count} views`}
                  className={cn(
                    "h-3 w-3 rounded-sm",
                    cell.count === 0
                      ? "bg-muted"
                      : "bg-primary/20",
                    intensity(cell.count, max) === 2 && "bg-primary/40",
                    intensity(cell.count, max) === 3 && "bg-primary/70",
                    intensity(cell.count, max) === 4 && "bg-primary",
                  )}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
