import type { NormalizedEntry } from "@/lib/types/watch-history";

function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function csvEscape(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

export function entriesToCSV(entries: NormalizedEntry[]): string {
  const header = ["title", "channel", "time", "videoId", "url"];
  const rows = entries.map((e) =>
    [
      e.title,
      e.channel ?? "",
      e.timeISO ?? "",
      e.videoId ?? "",
      e.videoId ? `https://www.youtube.com/watch?v=${e.videoId}` : "",
    ]
      .map(csvEscape)
      .join(","),
  );
  return [header.join(","), ...rows].join("\n");
}

export function downloadCSV(
  entries: NormalizedEntry[],
  filename = "youtube-history.csv",
) {
  downloadBlob(
    filename,
    new Blob([entriesToCSV(entries)], { type: "text/csv;charset=utf-8" }),
  );
}

export function downloadJSON(
  entries: NormalizedEntry[],
  filename = "youtube-history.json",
) {
  downloadBlob(
    filename,
    new Blob([JSON.stringify(entries, null, 2)], {
      type: "application/json",
    }),
  );
}

export async function downloadPng(
  node: HTMLElement,
  filename = "youtube-insights.png",
) {
  const { toPng } = await import("html-to-image");
  const dataUrl = await toPng(node, { pixelRatio: 2, cacheBust: true });
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  a.click();
}
