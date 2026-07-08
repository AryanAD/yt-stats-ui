"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Inbox } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Overview } from "@/components/dashboard/overview";
import { ChannelAnalytics } from "@/components/dashboard/sections/channel-analytics";
import { DailyHabits } from "@/components/dashboard/sections/daily-habits";
import { Heatmaps } from "@/components/dashboard/sections/heatmaps";
import { KeywordAnalysis } from "@/components/dashboard/sections/keyword-analysis";
import { SessionAnalytics } from "@/components/dashboard/sections/session-analytics";
import { Statistics } from "@/components/dashboard/sections/statistics";
import { ViewingStreaks } from "@/components/dashboard/sections/viewing-streaks";
import { WatchTimeline } from "@/components/dashboard/sections/watch-timeline";
import { Achievements } from "@/components/dashboard/sections/achievements";
import { CalendarExplorer } from "@/components/dashboard/sections/calendar-explorer";
import { ExportSection } from "@/components/dashboard/sections/export";
import { VideoAnalytics } from "@/components/dashboard/sections/video-analytics";
import { Wrapped } from "@/components/dashboard/sections/wrapped";
import { Compare } from "@/components/dashboard/sections/compare";
import { SearchFiltering } from "@/components/dashboard/sections/search-filtering";
import { TopicDetection } from "@/components/dashboard/sections/topic-detection";
import { Sidebar, type DashboardSection } from "@/components/dashboard/sidebar";
import { Reveal } from "@/components/motion/reveal";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { useHistoryStore } from "@/lib/store";

const SECTIONS: DashboardSection[] = [
  { id: "overview", label: "Overview" },
  { id: "timeline", label: "Watch Timeline" },
  { id: "daily-habits", label: "Daily Habits" },
  { id: "channels", label: "Channel Analytics" },
  { id: "videos", label: "Video Analytics" },
  { id: "keywords", label: "Keyword Analysis" },
  { id: "topics", label: "Topic Detection" },
  { id: "streaks", label: "Viewing Streaks" },
  { id: "sessions", label: "Session Analytics" },
  { id: "search", label: "Search & Filtering" },
  { id: "calendar", label: "Calendar Explorer" },
  { id: "heatmaps", label: "Heatmaps" },
  { id: "statistics", label: "Statistics" },
  { id: "achievements", label: "Achievements" },
  { id: "export", label: "Export" },
  { id: "wrapped", label: "Wrapped" },
  { id: "compare", label: "Compare" },
];

function ComingSoon({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed py-20 text-center">
      <h2 className="text-xl font-semibold">{label}</h2>
      <p className="text-sm text-muted-foreground">
        This section is coming soon.
      </p>
    </div>
  );
}

function renderSection(active: string, label: string) {
  switch (active) {
    case "overview":
      return <Overview />;
    case "timeline":
      return <WatchTimeline />;
    case "daily-habits":
      return <DailyHabits />;
    case "channels":
      return <ChannelAnalytics />;
    case "keywords":
      return <KeywordAnalysis />;
    case "streaks":
      return <ViewingStreaks />;
    case "sessions":
      return <SessionAnalytics />;
    case "heatmaps":
      return <Heatmaps />;
    case "statistics":
      return <Statistics />;
    case "topics":
      return <TopicDetection />;
    case "search":
      return <SearchFiltering />;
    case "calendar":
      return <CalendarExplorer />;
    case "achievements":
      return <Achievements />;
    case "export":
      return <ExportSection />;
    case "videos":
      return <VideoAnalytics />;
    case "wrapped":
      return <Wrapped />;
    case "compare":
      return <Compare />;
    default:
      return <ComingSoon label={label} />;
  }
}

function EmptyState() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
      <Inbox className="h-10 w-10 text-muted-foreground" aria-hidden />
      <h1 className="text-2xl font-bold">No data loaded</h1>
      <p className="max-w-sm text-muted-foreground">
        Upload your watch-history.json on the home page to see your dashboard.
      </p>
      <Link href="/" className={buttonVariants()}>
        Go to upload
      </Link>
    </div>
  );
}

export function DashboardApp() {
  const status = useHistoryStore((s) => s.status);
  const parsed = useHistoryStore((s) => s.parsed);
  const fileName = useHistoryStore((s) => s.fileName);
  const [active, setActive] = useState("overview");

  if (!parsed || status !== "ready") {
    return <EmptyState />;
  }

  const activeLabel =
    SECTIONS.find((s) => s.id === active)?.label ?? "Overview";

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar sections={SECTIONS} active={active} onSelect={setActive} />
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between gap-3 border-b px-6 py-4">
          <div className="min-w-0">
            <h1 className="text-lg font-semibold">{activeLabel}</h1>
            {fileName && (
              <p className="truncate text-xs text-muted-foreground">
                {fileName}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <select
              value={active}
              onChange={(e) => setActive(e.target.value)}
              aria-label="Select dashboard section"
              className="h-9 rounded-md border border-input bg-background px-2 text-sm md:hidden"
            >
              {SECTIONS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
            <ThemeToggle />
            <Link
              href="/"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              <ArrowLeft className="mr-2 h-4 w-4" aria-hidden />
              New file
            </Link>
          </div>
        </header>
        <main id="main" className="flex-1 p-6">
          <Reveal key={active}>{renderSection(active, activeLabel)}</Reveal>
        </main>
      </div>
    </div>
  );
}
