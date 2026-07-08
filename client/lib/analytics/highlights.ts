import type { NormalizedEntry } from "@/lib/types/watch-history";
import {
  aggregateByChannel,
  aggregateByMonth,
  aggregateByYear,
  computeOverview,
} from "@/lib/analytics/stats";
import { aggregateByHour, aggregateByWeekday } from "@/lib/analytics/habits";
import { computeStreaks } from "@/lib/analytics/streaks";
import { computeSessions } from "@/lib/analytics/sessions";
import { aggregateByTopic } from "@/lib/analytics/topics";

export interface Highlight {
  emoji: string;
  text: string;
}

const WEEKDAY_LABELS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function formatHour(h: number): string {
  const period = h < 12 ? "AM" : "PM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour} ${period}`;
}

/**
 * Generate a client-side "Wrapped"-style list of fun insights from a history.
 * Uses only the locally computed analytics — no external services.
 */
export function generateHighlights(entries: NormalizedEntry[]): Highlight[] {
  if (!entries.length) return [];

  const overview = computeOverview(entries);
  const streaks = computeStreaks(entries);
  const hour = aggregateByHour(entries);
  const weekday = aggregateByWeekday(entries);
  const sessions = computeSessions(entries);
  const topChannel = aggregateByChannel(entries, 1)[0];
  const topTopic = aggregateByTopic(entries)[0];
  const busiestYear = aggregateByYear(entries).reduce(
    (a, b) => (b.count > a.count ? b : a),
    { key: "", count: 0 },
  );
  const busiestMonth = aggregateByMonth(entries).reduce(
    (a, b) => (b.count > a.count ? b : a),
    { key: "", count: 0 },
  );

  const peakHour = hour.reduce((a, b) => (b.count > a.count ? b : a));
  const peakDay = weekday.reduce((a, b) => (b.count > a.count ? b : a));
  const nightViews = hour.slice(0, 6).reduce((s, b) => s + b.count, 0);
  const nightOwlPct = overview.totalEntries
    ? Math.round((nightViews / overview.totalEntries) * 100)
    : 0;

  const highlights: Highlight[] = [
    {
      emoji: "📺",
      text: `You watched ${overview.totalEntries.toLocaleString()} videos`,
    },
  ];

  if (overview.firstWatch && overview.lastWatch) {
    highlights.push({
      emoji: "🗓️",
      text: `Your history spans ${overview.firstWatch.getFullYear()}–${overview.lastWatch.getFullYear()}`,
    });
  }
  if (busiestYear.count > 0) {
    highlights.push({
      emoji: "🔥",
      text: `${busiestYear.key} was your biggest year with ${busiestYear.count.toLocaleString()} views`,
    });
  }
  if (busiestMonth.count > 0) {
    const [y, m] = busiestMonth.key.split("-");
    highlights.push({
      emoji: "📈",
      text: `${new Date(Number(y), Number(m) - 1, 1).toLocaleString("en", { month: "long" })} ${y} was your busiest month`,
    });
  }
  if (streaks.longestStreak > 1) {
    highlights.push({
      emoji: "⚡",
      text: `Longest streak: ${streaks.longestStreak} days in a row`,
    });
  }
  if (peakHour.count > 0) {
    highlights.push({
      emoji: "🕐",
      text: `You watch the most around ${formatHour(peakHour.index)}`,
    });
  }
  if (peakDay.count > 0) {
    highlights.push({
      emoji: "📅",
      text: `${WEEKDAY_LABELS[peakDay.index]} is your biggest watch day`,
    });
  }
  if (nightOwlPct >= 15) {
    highlights.push({
      emoji: "🦉",
      text: `${nightOwlPct}% of your views happen between midnight and 5am`,
    });
  }
  if (sessions.longestSession) {
    highlights.push({
      emoji: "🍿",
      text: `Longest binge: ${sessions.longestSession.count} videos in one sitting`,
    });
  }
  if (topChannel) {
    highlights.push({
      emoji: "⭐",
      text: `Your #1 channel was ${topChannel.channel}`,
    });
  }
  if (topTopic) {
    highlights.push({
      emoji: "🏷️",
      text: `Your top topic was ${topTopic.topic}`,
    });
  }

  return highlights;
}
