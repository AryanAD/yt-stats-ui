import { FileUpload } from "@/components/landing/file-upload";
import { ResultsPreview } from "@/components/landing/results-preview";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-8 text-center">
      <div className="flex flex-col gap-3">
        <h1 className="text-4xl font-bold tracking-tight">
          YouTube History Insights
        </h1>
        <p className="max-w-xl text-muted-foreground">
          Privacy-first, client-side analytics for your exported YouTube watch
          history. Your data never leaves your browser.
        </p>
      </div>
      <FileUpload />
      <ResultsPreview />
    </main>
  );
}
