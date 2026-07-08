"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useHistoryWorker } from "@/hooks/useHistoryWorker";
import { useHistoryStore } from "@/lib/store";

const MAX_FILE_BYTES = 200 * 1024 * 1024; // 200MB safety ceiling.

export function FileUpload() {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { processFile } = useHistoryWorker();
  const status = useHistoryStore((s) => s.status);
  const error = useHistoryStore((s) => s.error);
  const [localError, setLocalError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (status === "ready") {
      router.push("/dashboard");
    }
  }, [status, router]);

  const handleFile = useCallback(
    (file: File) => {
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
    },
    [processFile],
  );

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const busy = status === "parsing";

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-3">
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={
          "flex w-full cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed p-8 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
          (dragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/30 hover:border-primary/60")
        }
      >
        <UploadCloud className="h-8 w-8 text-muted-foreground" aria-hidden />
        <p className="text-sm font-medium">
          {busy ? "Processing your file…" : "Drag & drop watch-history.json"}
        </p>
        <p className="text-xs text-muted-foreground">
          or click to browse — nothing is uploaded
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        disabled={busy}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />

      {localError && <p className="text-sm text-destructive">{localError}</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
