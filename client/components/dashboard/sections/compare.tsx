"use client";

import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useHistoryStore } from "@/lib/store";
import { parseWatchHistory } from "@/lib/analytics/parse";
import { parseAndValidate } from "@/lib/analytics/validate";
import {
  aggregateByChannel,
  computeOverview,
} from "@/lib/analytics/stats";
import type { OverviewStats } from "@/lib/analytics/stats";
import type { ParsedWatchHistory } from "@/lib/types/watch-history";

interface Comparison {
  fileName: string;
  overview: OverviewStats;
  topChannel: string | null;
}

export function Compare() {
  const parsedA = useHistoryStore((s) => s.parsed);
  const inputRef = useRef<HTMLInputElement>(null);
  const [b, setB] = useState<Comparison | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File) => {
    setError(null);
    if (!file.name.toLowerCase().endsWith(".json")) {
      setError("Please choose a watch-history.json file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === "string" ? reader.result : "";
      const validated = parseAndValidate(text);
      if (!validated.ok) {
        setError(validated.error);
        setB(null);
        return;
      }
      const parsed: ParsedWatchHistory = parseWatchHistory(validated.data);
      const overview = computeOverview(parsed.entries);
      const top = aggregateByChannel(parsed.entries, 1)[0];
      setB({
        fileName: file.name,
        overview,
        topChannel: top?.channel ?? null,
      });
    };
    reader.onerror = () => setError("Could not read the selected file.");
    reader.readAsText(file);
  };

  if (!parsedA) return null;

  const aOverview = computeOverview(parsedA.entries);
  const aTop = aggregateByChannel(parsedA.entries, 1)[0];

  const rows: Array<{
    label: string;
    a: string;
    b: string;
  }> = b
    ? [
        {
          label: "Total videos",
          a: aOverview.totalEntries.toLocaleString(),
          b: b.overview.totalEntries.toLocaleString(),
        },
        {
          label: "Unique channels",
          a: aOverview.uniqueChannels.toLocaleString(),
          b: b.overview.uniqueChannels.toLocaleString(),
        },
        {
          label: "Avg / day",
          a: aOverview.avgPerDay.toFixed(1),
          b: b.overview.avgPerDay.toFixed(1),
        },
        {
          label: "Top channel",
          a: aTop?.channel ?? "—",
          b: b.topChannel ?? "—",
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Compare with another export</CardTitle>
          <CardDescription>
            Load a second watch-history.json to see how your habits changed.
            Parsed locally in your browser.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <input
            ref={inputRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.target.value = "";
            }}
          />
          <Button onClick={() => inputRef.current?.click()}>
            Choose a second file
          </Button>
          {b && (
            <p className="text-sm text-muted-foreground">
              Comparing against <strong>{b.fileName}</strong>
            </p>
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}
        </CardContent>
      </Card>

      {b && (
        <Card>
          <CardHeader>
            <CardTitle>Side by side</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="py-2 font-medium">Metric</th>
                  <th className="py-2 font-medium">Current</th>
                  <th className="py-2 font-medium">Comparison</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label} className="border-b last:border-0">
                    <td className="py-2 font-medium">{row.label}</td>
                    <td className="py-2">{row.a}</td>
                    <td className="py-2">{row.b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
