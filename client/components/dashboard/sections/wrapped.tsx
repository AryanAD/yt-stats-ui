"use client";

import { useMemo, useRef } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useHistoryStore } from "@/lib/store";
import { generateHighlights } from "@/lib/analytics/highlights";
import { computeOverview } from "@/lib/analytics/stats";
import { downloadPng } from "@/lib/export";

export function Wrapped() {
  const parsed = useHistoryStore((s) => s.parsed);
  const cardRef = useRef<HTMLDivElement>(null);

  const { overview, highlights } = useMemo(() => {
    if (!parsed) return { overview: null, highlights: [] };
    return {
      overview: computeOverview(parsed.entries),
      highlights: generateHighlights(parsed.entries),
    };
  }, [parsed]);

  if (!parsed || !overview) return null;

  const handlePng = async () => {
    if (cardRef.current) await downloadPng(cardRef.current, "youtube-wrapped.png");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button variant="secondary" onClick={handlePng}>
          Download Wrapped (PNG)
        </Button>
      </div>

      <div
        ref={cardRef}
        className="rounded-xl bg-gradient-to-br from-indigo-600 via-fuchsia-600 to-rose-500 p-8 text-white"
      >
        <p className="text-sm uppercase tracking-widest text-white/80">
          Your YouTube Wrapped
        </p>
        <p className="mt-2 text-5xl font-extrabold">
          {overview.totalEntries.toLocaleString()}
        </p>
        <p className="text-white/90">videos watched</p>

        <ul className="mt-6 space-y-3">
          {highlights.map((h, i) => (
            <li key={i} className="flex items-start gap-3 text-lg">
              <span className="text-2xl">{h.emoji}</span>
              <span>{h.text}</span>
            </li>
          ))}
        </ul>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>About this recap</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Generated entirely in your browser from your watch-history.json.
            Nothing was uploaded to create this summary.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
