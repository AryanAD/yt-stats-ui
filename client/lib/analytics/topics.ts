import type { NormalizedEntry } from "@/lib/types/watch-history";

export const TOPIC_KEYWORDS: Record<string, string[]> = {
  Music: [
    "music", "song", "lyric", "lyrics", "remix", "album", "concert", "live",
    "playlist", "rap", "pop", "rock", "edm", "lofi", "piano", "guitar", "beat",
  ],
  Gaming: [
    "game", "gaming", "gameplay", "playthrough", "fortnite", "minecraft",
    "call of duty", "fps", "xbox", "playstation", "nintendo", "speedrun",
    "walkthrough", "valorant",
  ],
  Technology: [
    "tech", "coding", "programming", "software", "hardware", "review",
    "python", "javascript", "react", "linux", "tutorial", "github", "developer",
    "app", "code", "ai", "api",
  ],
  "News & Politics": [
    "news", "politics", "election", "government", "war", "president", "climate",
    "economy", "stock", "market", "breaking",
  ],
  Education: [
    "lecture", "course", "lesson", "learn", "math", "science", "history",
    "explained", "university", "study", "how to", "tutorial",
  ],
  Sports: [
    "football", "soccer", "nba", "basketball", "cricket", "tennis", "f1",
    "formula", "olympics", "match", "premier league",
  ],
  "Comedy & Entertainment": [
    "funny", "comedy", "prank", "vlog", "reaction", "skit", "meme",
    "entertainment", "show", "podcast",
  ],
  "Cooking & Food": [
    "recipe", "cooking", "food", "chef", "baking", "kitchen", "vegan", "meal",
    "restaurant", "street food",
  ],
  Travel: [
    "travel", "trip", "vacation", "city", "country", "hotel", "flight",
    "documentary",
  ],
  "Beauty & Fashion": [
    "makeup", "beauty", "fashion", "style", "hair", "skincare", "outfit",
  ],
  Science: [
    "physics", "biology", "chemistry", "space", "universe", "nasa", "research",
    "quantum",
  ],
};

export const TOPIC_NAMES = [...Object.keys(TOPIC_KEYWORDS), "Other"];

export interface TopicCount {
  topic: string;
  count: number;
}

function classify(title: string): string {
  const lower = title.toLowerCase();
  for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    if (keywords.some((k) => lower.includes(k))) return topic;
  }
  return "Other";
}

/** Classify each entry into a topic and count occurrences. */
export function aggregateByTopic(entries: NormalizedEntry[]): TopicCount[] {
  const counts = new Map<string, number>(TOPIC_NAMES.map((t) => [t, 0]));
  for (const e of entries) {
    const topic = classify(e.title);
    counts.set(topic, (counts.get(topic) ?? 0) + 1);
  }
  return TOPIC_NAMES.map((topic) => ({
    topic,
    count: counts.get(topic) ?? 0,
  })).filter((t) => t.count > 0);
}
