"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useHistoryStore } from "@/lib/store";

function formatDate(d: Date | null): string {
  return d ? d.toLocaleDateString() : "—";
}

export function ResultsPreview() {
  const status = useHistoryStore((s) => s.status);
  const overview = useHistoryStore((s) => s.overview);
  const warnings = useHistoryStore((s) => s.warnings);

  if (status === "idle" || status === "parsing") return null;

  if (!overview) {
    return (
      <p className="text-sm text-muted-foreground">No data to display yet.</p>
    );
  }

  const stats: Array<[string, string]> = [
    ["Total entries", overview.totalEntries.toLocaleString()],
    ["Unique channels", overview.uniqueChannels.toLocaleString()],
    ["With video id", overview.entriesWithVideoId.toLocaleString()],
    ["First watch", formatDate(overview.firstWatch)],
    ["Last watch", formatDate(overview.lastWatch)],
    ["Avg / day", overview.avgPerDay.toFixed(1)],
    ["Avg / week", overview.avgPerWeek.toFixed(1)],
    ["Avg / month", overview.avgPerMonth.toFixed(1)],
  ];

  return (
    <div className="w-full max-w-3xl">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map(([label, value]) => (
          <Card key={label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      {warnings.length > 0 && (
        <ul className="mt-4 list-disc pl-5 text-sm text-muted-foreground">
          {warnings.map((w, i) => (
            <li key={i}>{w}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
