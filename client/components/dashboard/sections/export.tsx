"use client";

import { useMemo, useRef } from "react";

import { AreaChartView } from "@/components/charts/area-chart";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/stat-card";
import { useHistoryStore } from "@/lib/store";
import {
  aggregateByChannel,
  aggregateByMonth,
  computeOverview,
} from "@/lib/analytics/stats";
import { downloadCSV, downloadJSON, downloadPng } from "@/lib/export";
import { formatMonthKey } from "@/lib/analytics/time";

export function ExportSection() {
  const parsed = useHistoryStore((s) => s.parsed);
  const fileName = useHistoryStore((s) => s.fileName);
  const cardRef = useRef<HTMLDivElement>(null);

  const { overview, series, topChannels } = useMemo(() => {
    if (!parsed) return { overview: null, series: [], topChannels: [] };
    return {
      overview: computeOverview(parsed.entries),
      series: aggregateByMonth(parsed.entries).map((m) => ({
        name: formatMonthKey(m.key),
        value: m.count,
      })),
      topChannels: aggregateByChannel(parsed.entries, 5),
    };
  }, [parsed]);

  if (!parsed || !overview) return null;

  const handlePng = async () => {
    if (cardRef.current) await downloadPng(cardRef.current, "youtube-insights.png");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <Button onClick={() => downloadCSV(parsed.entries)}>
          Export data (CSV)
        </Button>
        <Button
          variant="outline"
          onClick={() => downloadJSON(parsed.entries)}
        >
          Export data (JSON)
        </Button>
        <Button variant="secondary" onClick={handlePng}>
          Download summary image (PNG)
        </Button>
      </div>

      <div ref={cardRef} className="rounded-xl border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">YouTube History Insights</h2>
            <p className="text-sm text-muted-foreground">
              {fileName ?? "My watch history"}
            </p>
          </div>
          <span className="text-xs text-muted-foreground">100% private</span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Total videos" value={overview.totalEntries.toLocaleString()} />
          <StatCard label="Channels" value={overview.uniqueChannels.toLocaleString()} />
          <StatCard
            label="First watch"
            value={overview.firstWatch?.toLocaleDateString() ?? "—"}
          />
          <StatCard
            label="Last watch"
            value={overview.lastWatch?.toLocaleDateString() ?? "—"}
          />
        </div>
        <div className="mt-4" style={{ width: "100%", height: 200 }}>
          <AreaChartView data={series} height={200} />
        </div>
        <div className="mt-2">
          <p className="mb-1 text-sm font-medium">Top channels</p>
          <ol className="text-sm text-muted-foreground">
            {topChannels.map((c, i) => (
              <li key={c.channel}>
                {i + 1}. {c.channel} — {c.count.toLocaleString()}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>About exports</CardTitle>
          <CardDescription>
            Everything is generated in your browser — nothing is uploaded.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
