"use client";

import { useCallback, useEffect, useRef } from "react";

import { useHistoryStore } from "@/lib/store";
import type {
  ProcessError,
  ProcessRequest,
  ProcessResult,
} from "@/workers/process.worker";

/**
 * Owns the data-processing Web Worker and feeds results into the Zustand
 * store. Keeps heavy parsing/aggregation off the main thread.
 */
export function useHistoryWorker() {
  const workerRef = useRef<Worker | null>(null);
  const setResult = useHistoryStore((s) => s.setResult);
  const setError = useHistoryStore((s) => s.setError);

  useEffect(() => {
    const worker = new Worker(
      new URL("../workers/process.worker.ts", import.meta.url),
    );
    workerRef.current = worker;

    worker.onmessage = (event: MessageEvent<ProcessResult | ProcessError>) => {
      const data = event.data;
      if (data.type === "result") {
        setResult(data.parsed, data.overview, data.warnings);
      } else {
        setError(data.error);
      }
    };
    worker.onerror = (e) => setError(e.message || "Worker error.");

    return () => worker.terminate();
  }, [setResult, setError]);

  const processFile = useCallback(
    (fileName: string, fileSize: number, jsonText: string) => {
      const worker = workerRef.current;
      if (!worker) {
        setError("Data processing worker is unavailable.");
        return;
      }
      useHistoryStore.getState().startParsing(fileName, fileSize);
      const message: ProcessRequest = { type: "process", jsonText };
      worker.postMessage(message);
    },
    [setError],
  );

  return { processFile };
}
