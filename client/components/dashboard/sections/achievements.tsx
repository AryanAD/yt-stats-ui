"use client";

import { useMemo } from "react";
import { Award, Lock } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useHistoryStore } from "@/lib/store";
import { computeAchievements } from "@/lib/analytics/achievements";
import { cn } from "@/lib/utils";

export function Achievements() {
  const parsed = useHistoryStore((s) => s.parsed);

  const badges = useMemo(
    () => (parsed ? computeAchievements(parsed.entries) : []),
    [parsed],
  );

  const earned = badges.filter((b) => b.earned).length;

  if (!parsed) return null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
          <CardDescription>
            {earned} of {badges.length} unlocked
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-lg border p-4 text-center",
                  badge.earned
                    ? "border-primary/40 bg-primary/5"
                    : "opacity-60",
                )}
              >
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full",
                    badge.earned
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {badge.earned ? (
                    <Award className="h-5 w-5" aria-hidden />
                  ) : (
                    <Lock className="h-5 w-5" aria-hidden />
                  )}
                </div>
                <p className="text-sm font-semibold">{badge.title}</p>
                <p className="text-xs text-muted-foreground">
                  {badge.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
