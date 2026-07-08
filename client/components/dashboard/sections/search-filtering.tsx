"use client";

import { useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useHistoryStore } from "@/lib/store";
import { aggregateByChannel } from "@/lib/analytics/stats";

export function SearchFiltering() {
  const parsed = useHistoryStore((s) => s.parsed);
  const [query, setQuery] = useState("");
  const [channel, setChannel] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const channels = useMemo(
    () => (parsed ? aggregateByChannel(parsed.entries).map((c) => c.channel) : []),
    [parsed],
  );

  const results = useMemo(() => {
    if (!parsed) return [];
    const q = query.trim().toLowerCase();
    return parsed.entries.filter((e) => {
      if (channel && e.channel !== channel) return false;
      if (q && !e.title.toLowerCase().includes(q) && !(e.channel ?? "").toLowerCase().includes(q))
        return false;
      if (from && e.timeISO && e.timeISO.slice(0, 10) < from) return false;
      if (to && e.timeISO && e.timeISO.slice(0, 10) > to) return false;
      return true;
    });
  }, [parsed, query, channel, from, to]);

  if (!parsed) return null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Search &amp; filter</CardTitle>
          <CardDescription>
            Filter your history by title, channel, and date range
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Search titles or channels…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="flex flex-col gap-1 text-sm text-muted-foreground">
              Channel
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                className="h-10 rounded-md border border-input bg-background px-3 text-foreground"
              >
                <option value="">All channels</option>
                {channels.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm text-muted-foreground">
              From
              <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            </label>
            <label className="flex flex-col gap-1 text-sm text-muted-foreground">
              To
              <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            </label>
          </div>
          <p className="text-sm text-muted-foreground">
            {results.length.toLocaleString()} matching{" "}
            {results.length === 1 ? "video" : "videos"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="max-h-[50vh] space-y-2 overflow-auto">
            {results.map((e) => (
              <div
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
                  {e.time ? e.time.toLocaleDateString() : "—"}
                </span>
              </div>
            ))}
            {results.length === 0 && (
              <p className="py-6 text-center text-muted-foreground">
                No videos match your filters.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
