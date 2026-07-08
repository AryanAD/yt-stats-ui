"use client";

import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { useHistoryWorker } from "@/hooks/useHistoryWorker";
import { useHistoryStore } from "@/lib/store";

const MAX_FILE_BYTES = 200 * 1024 * 1024; // 200MB safety ceiling.

export function FileUpload() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { processFile } = useHistoryWorker();
  const status = useHistoryStore((s) => s.status);
  const error = useHistoryStore((s) => s.error);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleFile = (file: File) => {
    setLocalError(null);
    if (!file.name.toLowerCase().endsWith(".json")) {
      setLocalError("Please choose a watch-history.json file.");
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setLocalError("That file is too large to process safely.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === "string" ? reader.result : "";
      processFile(file.name, file.size, text);
    };
    reader.onerror = () => setLocalError("Could not read the selected file.");
    reader.readAsText(file);
  };

  const busy = status === "parsing";

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-3">
      <input
        ref={inputRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
      <Button onClick={() => inputRef.current?.click()} disabled={busy}>
        {busy ? "Processing…" : "Upload watch-history.json"}
      </Button>
      {localError && (
        <p className="text-sm text-destructive">{localError}</p>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
