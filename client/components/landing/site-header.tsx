import Link from "next/link";
import { BarChart3 } from "lucide-react";

import { ThemeToggle } from "@/components/theme/theme-toggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <BarChart3 className="h-5 w-5 text-primary" aria-hidden />
          YouTube Insights
        </Link>
        <nav className="flex items-center gap-2" aria-label="Primary">
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
