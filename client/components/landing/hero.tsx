import { FileUpload } from "@/components/landing/file-upload";

export function Hero() {
  return (
    <section className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 py-20 text-center">
      <span className="rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground">
        100% private · runs entirely in your browser
      </span>
      <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
        Turn your YouTube history into{" "}
        <span className="text-primary">beautiful insights</span>
      </h1>
      <p className="max-w-xl text-lg text-muted-foreground">
        Upload the <code className="rounded bg-muted px-1.5 py-0.5 text-sm">
          watch-history.json
        </code>{" "}
        you exported from Google Takeout and explore 16+ interactive analytics
        sections. Your data never leaves your device.
      </p>
      <FileUpload />
    </section>
  );
}
