import type { NormalizedEntry } from "@/lib/types/watch-history";
import { aggregateByChannel, computeOverview } from "@/lib/analytics/stats";
import { aggregateByHour, aggregateByWeekday } from "@/lib/analytics/habits";
import { computeStreaks } from "@/lib/analytics/streaks";
import { computeSessions } from "@/lib/analytics/sessions";

export interface Badge {
  id: string;
  title: string;
  description: string;
  earned: boolean;
}

function share(buckets: { count: number }[], total: number): number {
  const sum = buckets.reduce((s, b) => s + b.count, 0);
  return total ? sum / total : 0;
}

/**
 * Derive fun achievement badges from the user's watching behaviour.
 */
export function computeAchievements(entries: NormalizedEntry[]): Badge[] {
  const overview = computeOverview(entries);
  const total = overview.totalEntries;
  const channels = aggregateByChannel(entries).length;
  const streaks = computeStreaks(entries);
  const sessions = computeSessions(entries);

  const hour = aggregateByHour(entries);
  const weekday = aggregateByWeekday(entries);
  const nightOwl = share(hour.slice(0, 6), total); // 00:00–05:59
  const earlyBird = share(hour.slice(5, 12), total); // 05:00–11:59
  const weekend = share([weekday[5], weekday[6]], total);

  const defs: Array<Omit<Badge, "earned"> & { test: boolean }> = [
    {
      id: "centurion",
      title: "Centurion",
      description: "Watched 100 videos.",
      test: total >= 100,
    },
    {
      id: "thousand",
      title: "Thousand Club",
      description: "Watched 1,000 videos.",
      test: total >= 1000,
    },
    {
      id: "film-buff",
      title: "Film Buff",
      description: "Watched 10,000 videos.",
      test: total >= 10000,
    },
    {
      id: "channel-surfer",
      title: "Channel Surfer",
      description: "Watched 50+ different channels.",
      test: channels >= 50,
    },
    {
      id: "collector",
      title: "Collector",
      description: "Watched 200+ different channels.",
      test: channels >= 200,
    },
    {
      id: "night-owl",
      title: "Night Owl",
      description: "Watches mostly between midnight and 6am.",
      test: nightOwl >= 0.3,
    },
    {
      id: "early-bird",
      title: "Early Bird",
      description: "Watches mostly in the morning.",
      test: earlyBird >= 0.3,
    },
    {
      id: "weekend-warrior",
      title: "Weekend Warrior",
      description: "More than half of watching is on weekends.",
      test: weekend >= 0.55,
    },
    {
      id: "marathon",
      title: "Marathon",
      description: "A single session of 20+ videos.",
      test: (sessions.longestSession?.count ?? 0) >= 20,
    },
    {
      id: "binge-master",
      title: "Binge Master",
      description: "25+ videos in a single day.",
      test: (streaks.mostInDay?.count ?? 0) >= 25,
    },
    {
      id: "on-a-streak",
      title: "On a Streak",
      description: "A 30+ day watching streak.",
      test: streaks.longestStreak >= 30,
    },
    {
      id: "dedicated",
      title: "Dedicated",
      description: "Watched on 365+ different days.",
      test: streaks.totalActiveDays >= 365,
    },
  ];

  return defs.map(({ test, ...rest }) => ({ ...rest, earned: test }));
}
