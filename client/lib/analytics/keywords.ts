import type { NormalizedEntry } from "@/lib/types/watch-history";

const STOPWORDS = new Set([
  "the", "and", "for", "with", "that", "this", "from", "your", "have", "are",
  "but", "not", "you", "all", "any", "can", "her", "was", "one", "our", "out",
  "day", "get", "has", "him", "his", "how", "its", "may", "new", "now", "old",
  "see", "two", "who", "boy", "did", "she", "they", "way", "will", "into",
  "more", "some", "time", "very", "when", "what", "which", "who", "why", "off",
  "than", "them", "then", "there", "these", "those", "were", "been", "being",
  "does", "done", "just", "like", "about", "over", "also", "after", "before",
  "because", "could", "each", "most", "other", "such", "only", "their", "here",
  "where", "while", "would", "should", "video", "videos", "watch", "watching",
  "official", "trailer", "full", "episode", "ep", "part", "live", "stream",
  "audio", "song", "songs", "music", "lyric", "lyrics", "remix", "ft", "feat",
]);

export interface Keyword {
  text: string;
  count: number;
}

function tokenize(title: string): string[] {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !STOPWORDS.has(w) && !/^\d+$/.test(w));
}

/**
 * Extract the most frequent keywords from video titles.
 * `ngram` of 1 returns single words, 2 returns bigrams.
 */
export function extractKeywords(
  entries: NormalizedEntry[],
  limit = 30,
  ngram = 1,
): Keyword[] {
  const counts = new Map<string, number>();

  for (const e of entries) {
    const tokens = tokenize(e.title);
    if (ngram === 1) {
      for (const t of tokens) counts.set(t, (counts.get(t) ?? 0) + 1);
    } else {
      for (let i = 0; i + ngram <= tokens.length; i++) {
        const gram = tokens.slice(i, i + ngram).join(" ");
        counts.set(gram, (counts.get(gram) ?? 0) + 1);
      }
    }
  }

  return [...counts.entries()]
    .map(([text, count]) => ({ text, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}
