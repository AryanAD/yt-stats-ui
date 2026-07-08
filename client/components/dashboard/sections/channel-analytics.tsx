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
import { useHistoryStore } from "@/lib/store";
import { aggregateByChannel } from "@/lib/analytics/stats";
import type { ChannelStat } from "@/lib/analytics/stats";

type SortKey = "count" | "channel" | "first" | "last";

export function ChannelAnalytics() {
  const parsed = useHistoryStore((s) => s.parsed);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("count");

  const channels = useMemo<ChannelStat[]>(() => {
    if (!parsed) return [];
    const all = aggregateByChannel(parsed.entries);
    const filtered = all.filter((c) =>
      c.channel.toLowerCase().includes(query.trim().toLowerCase()),
    );
    const sorted = [...filtered];
    sorted.sort((a, b) => {
      if (sort === "channel") return a.channel.localeCompare(b.channel);
      if (sort === "first")
        return (b.firstWatch?.getTime() ?? 0) - (a.firstWatch?.getTime() ?? 0);
      if (sort === "last")
        return (b.lastWatch?.getTime() ?? 0) - (a.lastWatch?.getTime() ?? 0);
      return b.count - a.count;
    });
    return sorted;
  }, [parsed, query, sort]);

  if (!parsed) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Channel analytics</CardTitle>
        <CardDescription>
          Every channel you have watched, ranked by views
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Filter channels…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="max-h-[60vh] overflow-auto rounded-md border">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-card">
              <tr className="border-b text-left text-muted-foreground">
                <th className="px-3 py-2 font-medium">#</th>
                <th
                  className="cursor-pointer px-3 py-2 font-medium hover:text-foreground"
                  onClick={() => setSort("channel")}
                >
                  Channel
                </th>
                <th
                  className="cursor-pointer px-3 py-2 text-right font-medium hover:text-foreground"
                  onClick={() => setSort("count")}
                >
                  Views
                </th>
                <th
                  className="hidden cursor-pointer px-3 py-2 font-medium hover:text-foreground sm:table-cell"
                  onClick={() => setSort("first")}
                >
                  First watch
                </th>
                <th
                  className="hidden cursor-pointer px-3 py-2 font-medium hover:text-foreground sm:table-cell"
                  onClick={() => setSort("last")}
                >
                  Last watch
                </th>
              </tr>
            </thead>
            <tbody>
              {channels.map((c, i) => (
                <tr key={c.channel} className="border-b last:border-0">
                  <td className="px-3 py-2 text-muted-foreground">{i + 1}</td>
                  <td className="px-3 py-2 font-medium">{c.channel}</td>
                  <td className="px-3 py-2 text-right">
                    {c.count.toLocaleString()}
                  </td>
                  <td className="hidden px-3 py-2 text-muted-foreground sm:table-cell">
                    {c.firstWatch?.toLocaleDateString() ?? "—"}
                  </td>
                  <td className="hidden px-3 py-2 text-muted-foreground sm:table-cell">
                    {c.lastWatch?.toLocaleDateString() ?? "—"}
                  </td>
                </tr>
              ))}
              {channels.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-3 py-6 text-center text-muted-foreground"
                  >
                    No channels match “{query}”.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
