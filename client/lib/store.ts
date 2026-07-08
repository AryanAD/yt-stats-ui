import { create } from "zustand";

import type { ParsedWatchHistory } from "@/lib/types/watch-history";
import type { OverviewStats } from "@/lib/analytics/stats";

export type ProcessingStatus = "idle" | "parsing" | "ready" | "error";

export interface HistoryState {
  status: ProcessingStatus;
  fileName: string | null;
  fileSize: number | null;
  parsed: ParsedWatchHistory | null;
  overview: OverviewStats | null;
  warnings: string[];
  error: string | null;

  startParsing: (fileName: string, fileSize: number) => void;
  setResult: (
    parsed: ParsedWatchHistory,
    overview: OverviewStats,
    warnings: string[],
  ) => void;
  setError: (error: string) => void;
  reset: () => void;
}

const initialState = {
  status: "idle" as ProcessingStatus,
  fileName: null,
  fileSize: null,
  parsed: null,
  overview: null,
  warnings: [] as string[],
  error: null,
};

export const useHistoryStore = create<HistoryState>((set) => ({
  ...initialState,

  startParsing: (fileName, fileSize) =>
    set({ ...initialState, status: "parsing", fileName, fileSize }),

  setResult: (parsed, overview, warnings) =>
    set({ status: "ready", parsed, overview, warnings, error: null }),

  setError: (error) => set({ ...initialState, status: "error", error }),

  reset: () => set(initialState),
}));
