"use client";

import { useMemo } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useHistoryStore } from "@/lib/store";
import { aggregateByTopic } from "@/lib/analytics/topics";

const COLORS = [
  "hsl(221 83% 53%)",
  "hsl(142 71% 45%)",
  "hsl(47 95% 53%)",
  "hsl(280 65% 60%)",
  "hsl(0 72% 51%)",
  "hsl(199 89% 48%)",
  "hsl(20 90% 55%)",
  "hsl(160 60% 45%)",
  "hsl(330 70% 55%)",
  "hsl(260 60% 55%)",
  "hsl(40 90% 50%)",
  "hsl(215 16% 47%)",
];

const tooltipStyle = {
  background: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 8,
  fontSize: 12,
  color: "hsl(var(--foreground))",
};

export function TopicDetection() {
  const parsed = useHistoryStore((s) => s.parsed);

  const data = useMemo(
    () => (parsed ? aggregateByTopic(parsed.entries) : []),
    [parsed],
  );

  if (!parsed) return null;

  const total = data.reduce((s, d) => s + d.count, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Topic detection</CardTitle>
        <CardDescription>
          Estimated categories based on video titles
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          <div style={{ width: "100%", height: 320 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="count"
                  nameKey="topic"
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  label={(entry) =>
                    `${entry.topic}: ${Math.round((entry.count / total) * 100)}%`
                  }
                  labelLine={false}
                >
                  {data.map((entry, i) => (
                    <Cell
                      key={entry.topic}
                      fill={COLORS[i % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="space-y-1 text-sm">
            {data.map((d, i) => (
              <li
                key={d.topic}
                className="flex items-center justify-between border-b py-1.5 last:border-0"
              >
                <span className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-sm"
                    style={{ background: COLORS[i % COLORS.length] }}
                  />
                  {d.topic}
                </span>
                <span className="text-muted-foreground">
                  {d.count.toLocaleString()} (
                  {Math.round((d.count / total) * 100)}%)
                </span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
