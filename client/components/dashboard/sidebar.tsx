"use client";

import { BarChart3 } from "lucide-react";

export interface DashboardSection {
  id: string;
  label: string;
}

interface SidebarProps {
  sections: DashboardSection[];
  active: string;
  onSelect: (id: string) => void;
}

export function Sidebar({ sections, active, onSelect }: SidebarProps) {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r bg-muted/30 md:flex">
      <div className="flex items-center gap-2 border-b px-5 py-4">
        <BarChart3 className="h-5 w-5 text-primary" aria-hidden />
        <span className="font-semibold">YouTube Insights</span>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {sections.map((section) => {
          const isActive = section.id === active;
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => onSelect(section.id)}
              className={
                "w-full rounded-md px-3 py-2 text-left text-sm transition-colors " +
                (isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground")
              }
              aria-current={isActive ? "page" : undefined}
            >
              {section.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
