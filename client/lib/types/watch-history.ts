// Type definitions for the Google Takeout YouTube "watch-history.json" export.
//
// The export has changed shape over the years. Two common forms exist:
//   1. An object with a `contents` array of history items.
//   2. A bare array of history items (newer Takeout exports).
//
// We model the raw shape loosely (so validation can report problems) and also
// define a normalized shape used throughout the app.

export interface WatchHistoryThumbnail {
  url: string;
  width?: number;
  height?: number;
}

export interface WatchHistorySubtitle {
  name: string;
  url?: string;
}

export interface WatchHistoryEntry {
  title?: string;
  titleUrl?: string;
  description?: string;
  channel?: string;
  channelUrl?: string;
  thumbnails?: WatchHistoryThumbnail[];
  subtitles?: WatchHistorySubtitle[];
  time?: string;
  products?: string[];
  /** Present in some newer exports for non-video events. */
  details?: Array<{ name?: string; url?: string }>;
}

export interface WatchHistoryInterval {
  start?: string;
  end?: string;
}

/**
 * Raw top-level shape of watch-history.json (object form).
 */
export interface RawWatchHistory {
  title?: string;
  interval?: WatchHistoryInterval;
  heading?: string;
  titleUrl?: string;
  description?: string;
  contents?: WatchHistoryEntry[];
}

/**
 * Either the object form or a bare array of entries.
 */
export type RawWatchHistoryInput = RawWatchHistory | WatchHistoryEntry[];

/**
 * A fully parsed and validated history item in the shape the app relies on.
 */
export interface NormalizedEntry {
  /** Stable unique id derived from video id + timestamp (falls back to index). */
  id: string;
  title: string;
  /** YouTube video id extracted from titleUrl, if available. */
  videoId: string | null;
  channel: string | null;
  channelUrl: string | null;
  /** Parsed Date object; null when the time field is missing/invalid. */
  time: Date | null;
  /** ISO string of `time`, or null. */
  timeISO: string | null;
  thumbnails: WatchHistoryThumbnail[];
}

export interface ParsedWatchHistory {
  entries: NormalizedEntry[];
  interval: WatchHistoryInterval;
  /** Count of raw items that could not be normalized into a usable entry. */
  skipped: number;
}
