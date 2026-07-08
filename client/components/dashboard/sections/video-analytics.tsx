"use client";

import { useMemo } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/stat-card";
import { useHistoryStore } from "@/lib/store";
import type { NormalizedEntry } from "@/lib/types/watch-history";

interface Rewatch {
  id: string;
  title: string;
  channel: string | null;
  count: number;
}

export function VideoAnalytics() {
  const parsed = useHistoryStore((s) => s.parsed);

  const { rewatches, uniqueVideos, total } = useMemo(() => {
    if (!parsed) return { rewatches: [], uniqueVideos: 0, total: 0 };
    const byId = new Map<string, NormalizedEntry[]>();
    for (const e of parsed.entries) {
      if (!e.videoId) continue;
      const arr = byId.get(e.videoId);
      if (arr) arr.push(e);
      else byId.set(e.videoId, [e]);
    }
    const list: Rewatch[] = [];
    for (const [id, items] of byId) {
      if (items.length > 1) {
        list.push({
          id,
          title: items[0].title,
          channel: items[0].channel,
          count: items.length,
        });
      }
    }
    list.sort((a, b) => b.count - a.count);
    return {
      rewatches: list,
      uniqueVideos: byId.size,
      total: parsed.entries.length,
    };
  }, [parsed]);

  if (!parsed) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard label="Total entries" value={total.toLocaleString()} />
        <StatCard label="Unique videos" value={uniqueVideos.toLocaleString()} />
        <StatCard
          label="Rewatched"
          value={rewatches.length.toLocaleString()}
          hint="Videos watched more than once"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Most rewatched</CardTitle>
          <CardDescription>Videos you came back to again and again</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="max-h-[50vh] space-y-2 overflow-auto">
            {rewatches.slice(0, 50).map((r) => (
              <li
                key={r.id}
                className="flex items-center justify-between gap-4 border-b py-2 text-sm last:border-0"
              >
                <span className="min-w-0 flex-1 truncate font-medium">
                  {r.title}
                </span>
                <span className="shrink-0 text-muted-foreground">
                  {r.channel ?? "—"}
                </span>
                <span className="shrink-0 font-semibold">{r.count}×</span>
              </li>
            ))}
            {rewatches.length === 0 && (
              <li className="py-6 text-center text-muted-foreground">
                No rewatched videos found in this export.
              </li>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
