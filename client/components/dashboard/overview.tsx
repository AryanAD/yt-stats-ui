"use client";

import { useMemo } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useHistoryStore } from "@/lib/store";
import { aggregateByChannel, computeOverview } from "@/lib/analytics/stats";

function formatDate(d: Date | null): string {
  return d ? d.toLocaleDateString() : "—";
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}

export function Overview() {
  const parsed = useHistoryStore((s) => s.parsed);

  const { overview, topChannels } = useMemo(() => {
    if (!parsed) return { overview: null, topChannels: [] };
    return {
      overview: computeOverview(parsed.entries),
      topChannels: aggregateByChannel(parsed.entries, 10),
    };
  }, [parsed]);

  if (!parsed || !overview) return null;

  const stats: Array<[string, string]> = [
    ["Total entries", overview.totalEntries.toLocaleString()],
    ["Unique channels", overview.uniqueChannels.toLocaleString()],
    ["With video id", overview.entriesWithVideoId.toLocaleString()],
    ["First watch", formatDate(overview.firstWatch)],
    ["Last watch", formatDate(overview.lastWatch)],
    ["Avg / day", overview.avgPerDay.toFixed(1)],
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {stats.map(([label, value]) => (
          <StatCard key={label} label={label} value={value} />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top channels</CardTitle>
        </CardHeader>
        <CardContent>
          {topChannels.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No channel data available in this export.
            </p>
          ) : (
            <ul className="divide-y">
              {topChannels.map((channel, i) => (
                <li
                  key={channel.channel}
                  className="flex items-center justify-between py-2 text-sm"
                >
                  <span className="flex items-center gap-3">
                    <span className="w-5 text-muted-foreground">{i + 1}</span>
                    <span className="font-medium">{channel.channel}</span>
                  </span>
                  <span className="text-muted-foreground">
                    {channel.count.toLocaleString()} views
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
