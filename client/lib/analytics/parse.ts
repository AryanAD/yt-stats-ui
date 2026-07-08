import type {
  NormalizedEntry,
  ParsedWatchHistory,
  RawWatchHistory,
  RawWatchHistoryInput,
  WatchHistoryEntry,
  WatchHistoryInterval,
} from "@/lib/types/watch-history";

const VIDEO_ID_RE = /[?&]v=([\w-]{6,})/;
const SHORT_RE = /youtu\.be\/([\w-]{6,})/;

/**
 * Extract a YouTube video id from a watch-history titleUrl.
 * Returns null when no id can be found.
 */
export function extractVideoId(titleUrl?: string): string | null {
  if (!titleUrl) return null;
  const vMatch = VIDEO_ID_RE.exec(titleUrl);
  if (vMatch) return vMatch[1];
  const shortMatch = SHORT_RE.exec(titleUrl);
  if (shortMatch) return shortMatch[1];
  return null;
}

function resolveChannel(entry: WatchHistoryEntry): {
  channel: string | null;
  channelUrl: string | null;
} {
  if (entry.channel) {
    return { channel: entry.channel, channelUrl: entry.channelUrl ?? null };
  }
  // Newer exports place the channel under `subtitles`.
  const subtitle = entry.subtitles?.[0];
  if (subtitle?.name) {
    return { channel: subtitle.name, channelUrl: subtitle.url ?? null };
  }
  return { channel: null, channelUrl: null };
}

function parseTime(time?: string): Date | null {
  if (!time) return null;
  const date = new Date(time);
  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * Convert a single raw history item into the normalized shape the app uses.
 * Returns null when the entry cannot be turned into anything useful
 * (e.g. missing title and missing video id).
 */
export function normalizeEntry(
  raw: WatchHistoryEntry,
  index: number,
): NormalizedEntry | null {
  const videoId = extractVideoId(raw.titleUrl ?? undefined);
  const title = raw.title ?? (videoId ? `Video ${videoId}` : "");
  if (!title && !videoId) return null;

  const { channel, channelUrl } = resolveChannel(raw);
  const time = parseTime(raw.time);

  const id =
    (videoId && time ? `${videoId}-${time.getTime()}` : null) ??
    `entry-${index}`;

  return {
    id,
    title,
    videoId,
    channel,
    channelUrl,
    time,
    timeISO: time ? time.toISOString() : null,
    thumbnails: raw.thumbnails ?? [],
  };
}

/**
 * Normalize the raw Takeout structure (object or array form) into a list of
 * usable entries plus the export interval.
 */
export function parseWatchHistory(
  input: RawWatchHistoryInput,
): ParsedWatchHistory {
  let entries: WatchHistoryEntry[] = [];
  let interval: WatchHistoryInterval = {};

  if (Array.isArray(input)) {
    entries = input;
  } else {
    const obj = input as RawWatchHistory;
    entries = obj.contents ?? [];
    interval = obj.interval ?? {};
  }

  let skipped = 0;
  const normalized: NormalizedEntry[] = [];
  for (let i = 0; i < entries.length; i++) {
    const entry = normalizeEntry(entries[i], i);
    if (entry) {
      normalized.push(entry);
    } else {
      skipped++;
    }
  }

  return { entries: normalized, interval, skipped };
}
