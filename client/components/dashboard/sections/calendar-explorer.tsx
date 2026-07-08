"use client";

import { useMemo, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useHistoryStore } from "@/lib/store";
import { dayKey } from "@/lib/analytics/time";
import { cn } from "@/lib/utils";
import type { NormalizedEntry } from "@/lib/types/watch-history";

const WEEKDAY_HEADERS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function CalendarExplorer() {
  const parsed = useHistoryStore((s) => s.parsed);
  const [year, setYear] = useState<number | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const { years, byDay } = useMemo(() => {
    if (!parsed) return { years: [] as number[], byDay: new Map<string, NormalizedEntry[]>() };
    const map = new Map<string, NormalizedEntry[]>();
    for (const e of parsed.entries) {
      if (!e.time) continue;
      const k = dayKey(e.time);
      const arr = map.get(k);
      if (arr) arr.push(e);
      else map.set(k, [e]);
    }
    const yrs = [
      ...new Set(
        parsed.entries
          .filter((e) => e.time)
          .map((e) => (e.time as Date).getFullYear()),
      ),
    ].sort((a, b) => a - b);
    return { years: yrs, byDay: map };
  }, [parsed]);

  const activeYear = year ?? years[years.length - 1] ?? null;

  const selectedEntries = selectedDay ? byDay.get(selectedDay) ?? [] : [];

  if (!parsed || activeYear === null) return null;

  const renderMonth = (month: number) => {
    const first = new Date(activeYear, month, 1);
    const startWeekday = first.getDay();
    const daysInMonth = new Date(activeYear, month + 1, 0).getDate();
    const cells: (number | null)[] = [
      ...Array(startWeekday).fill(null),
      ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];

    return (
      <div key={month} className="rounded-md border p-2">
        <p className="mb-2 text-center text-sm font-medium">
          {MONTH_NAMES[month]}
        </p>
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-muted-foreground">
          {WEEKDAY_HEADERS.map((d, i) => (
            <div key={i}>{d}</div>
          ))}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-1">
          {cells.map((day, i) => {
            if (day === null) return <div key={i} />;
            const key = `${activeYear}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const count = byDay.get(key)?.length ?? 0;
            const isSelected = selectedDay === key;
            return (
              <button
                key={i}
                type="button"
                disabled={count === 0}
                onClick={() => setSelectedDay(key)}
                title={count ? `${count} videos` : ""}
                className={cn(
                  "flex h-7 items-center justify-center rounded text-xs",
                  count === 0 && "text-muted-foreground/40",
                  count > 0 && !isSelected && "bg-primary/15 hover:bg-primary/30",
                  isSelected && "bg-primary text-primary-foreground",
                )}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Calendar explorer</CardTitle>
            <CardDescription>Click a day to see what you watched</CardDescription>
          </div>
          <select
            value={activeYear}
            onChange={(e) => {
              setYear(Number(e.target.value));
              setSelectedDay(null);
            }}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 12 }, (_, m) => m).map(renderMonth)}
          </div>
        </CardContent>
      </Card>

      {selectedDay && (
        <Card>
          <CardHeader>
            <CardTitle>{selectedDay}</CardTitle>
            <CardDescription>
              {selectedEntries.length} video
              {selectedEntries.length === 1 ? "" : "s"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="max-h-[40vh] space-y-2 overflow-auto">
              {selectedEntries
                .slice()
                .sort((a, b) => (a.time?.getTime() ?? 0) - (b.time?.getTime() ?? 0))
                .map((e) => (
                  <li
                    key={e.id}
                    className="flex items-center justify-between gap-4 border-b py-2 text-sm last:border-0"
                  >
                    <span className="min-w-0 flex-1 truncate font-medium">
                      {e.title}
                    </span>
                    <span className="shrink-0 text-muted-foreground">
                      {e.channel ?? "—"}
                    </span>
                    <span className="shrink-0 text-muted-foreground">
                      {e.time ? e.time.toLocaleTimeString() : ""}
                    </span>
                  </li>
                ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
