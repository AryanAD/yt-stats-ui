"use client";

import { useMemo, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useHistoryStore } from "@/lib/store";
import { extractKeywords } from "@/lib/analytics/keywords";

export function KeywordAnalysis() {
  const parsed = useHistoryStore((s) => s.parsed);
  const [ngram, setNgram] = useState<1 | 2>(1);

  const keywords = useMemo(
    () => (parsed ? extractKeywords(parsed.entries, 50, ngram) : []),
    [parsed, ngram],
  );

  if (!parsed) return null;

  const max = keywords[0]?.count ?? 1;
  const min = keywords[keywords.length - 1]?.count ?? 1;

  const sizeFor = (count: number) => {
    if (max === min) return 18;
    const ratio = (count - min) / (max - min);
    return Math.round(13 + ratio * 27);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant={ngram === 1 ? "default" : "outline"}
          onClick={() => setNgram(1)}
        >
          Words
        </Button>
        <Button
          size="sm"
          variant={ngram === 2 ? "default" : "outline"}
          onClick={() => setNgram(2)}
        >
          Phrases
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Keyword cloud</CardTitle>
          <CardDescription>
            Most frequent terms from your video titles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 py-4">
            {keywords.map((k) => (
              <span
                key={k.text}
                className="font-semibold leading-none text-primary"
                style={{ fontSize: sizeFor(k.count) }}
                title={`${k.text}: ${k.count}`}
              >
                {k.text}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top {ngram === 1 ? "words" : "phrases"}</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm sm:grid-cols-3">
            {keywords.slice(0, 30).map((k, i) => (
              <li
                key={k.text}
                className="flex items-center justify-between border-b py-1"
              >
                <span className="truncate">
                  <span className="mr-2 text-muted-foreground">{i + 1}.</span>
                  {k.text}
                </span>
                <span className="ml-2 text-muted-foreground">{k.count}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
