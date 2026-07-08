import { parseWatchHistory } from "../lib/analytics/parse";
import { computeOverview } from "../lib/analytics/stats";
import { parseAndValidate } from "../lib/analytics/validate";
import type { OverviewStats } from "../lib/analytics/stats";
import type { ParsedWatchHistory } from "../lib/types/watch-history";

export interface ProcessRequest {
  type: "process";
  jsonText: string;
}

export interface ProcessResult {
  type: "result";
  parsed: ParsedWatchHistory;
  overview: OverviewStats;
  warnings: string[];
}

export interface ProcessError {
  type: "error";
  error: string;
}

const ctx: Worker = self as unknown as Worker;

ctx.onmessage = (event: MessageEvent<ProcessRequest>) => {
  const data = event.data;
  if (!data || data.type !== "process") return;

  const validated = parseAndValidate(data.jsonText);
  if (!validated.ok) {
    const error: ProcessError = { type: "error", error: validated.error };
    ctx.postMessage(error);
    return;
  }

  const parsed = parseWatchHistory(validated.data);
  const overview = computeOverview(parsed.entries);
  const warnings = validated.issues
    .filter((i) => i.level === "warning")
    .map((i) => i.message);

  const result: ProcessResult = { type: "result", parsed, overview, warnings };
  ctx.postMessage(result);
};
