import type { RawWatchHistoryInput } from "@/lib/types/watch-history";

export interface ValidationIssue {
  level: "error" | "warning";
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
}

/**
 * Check whether a parsed JSON value looks like a YouTube watch-history export.
 * We are intentionally permissive: a bare array of entries is also accepted.
 */
export function validateWatchHistory(input: unknown): ValidationResult {
  const issues: ValidationIssue[] = [];

  if (input === null || typeof input !== "object") {
    return {
      valid: false,
      issues: [{ level: "error", message: "Top-level JSON is not an object or array." }],
    };
  }

  let entries: unknown;
  let count = 0;

  if (Array.isArray(input)) {
    entries = input;
    count = input.length;
  } else {
    const obj = input as Record<string, unknown>;
    entries = obj.contents;
    if (typeof obj.title === "string") {
      // Takeout history files are titled "YouTube watch history" (or similar).
      if (!/watch history/i.test(obj.title)) {
        issues.push({
          level: "warning",
          message: `Unexpected title "${obj.title}". This may not be a watch-history export.`,
        });
      }
    }
    count = Array.isArray(obj.contents) ? obj.contents.length : 0;
  }

  if (!Array.isArray(entries)) {
    return {
      valid: false,
      issues: [
        {
          level: "error",
          message: "No `contents` array found and top level is not an array of entries.",
        },
      ],
    };
  }

  if (count === 0) {
    issues.push({ level: "warning", message: "The history contains no entries." });
  }

  // Spot check the first few entries for the expected shape.
  const sample = (entries as unknown[]).slice(0, 5);
  let missingTime = 0;
  let missingTitle = 0;
  for (const item of sample) {
    if (typeof item !== "object" || item === null) {
      issues.push({
        level: "warning",
        message: "An entry in the history is not an object.",
      });
      continue;
    }
    const entry = item as Record<string, unknown>;
    if (entry.time === undefined && entry.titleUrl === undefined) missingTime++;
    if (entry.title === undefined && entry.titleUrl === undefined) missingTitle++;
  }
  if (missingTime === sample.length && sample.length > 0) {
    issues.push({
      level: "warning",
      message: "Sample entries are missing the `time` field; timeline charts will be limited.",
    });
  }
  if (missingTitle === sample.length && sample.length > 0) {
    issues.push({
      level: "warning",
      message: "Sample entries are missing the `title`/`titleUrl` fields.",
    });
  }

  const hasError = issues.some((i) => i.level === "error");
  return { valid: !hasError, issues };
}

/**
 * Safely parse JSON text and validate its shape in one call. The returned
 * `data` is the raw, untyped input (caller should run `parseWatchHistory`).
 */
export function parseAndValidate(
  jsonText: string,
): { ok: true; data: RawWatchHistoryInput; issues: ValidationIssue[] } | {
  ok: false;
  error: string;
} {
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Invalid JSON.",
    };
  }

  const result = validateWatchHistory(parsed);
  if (!result.valid) {
    return { ok: false, error: result.issues.map((i) => i.message).join(" ") };
  }

  return { ok: true, data: parsed as RawWatchHistoryInput, issues: result.issues };
}
