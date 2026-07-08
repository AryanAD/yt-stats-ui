import { Download, Upload, BarChart3 } from "lucide-react";

const steps = [
  {
    icon: Download,
    title: "Export from Google Takeout",
    body: "Request your YouTube data from takeout.google.com and download the watch-history.json file.",
  },
  {
    icon: Upload,
    title: "Upload your file",
    body: "Drop the JSON file into the uploader below. Everything is parsed locally in your browser.",
  },
  {
    icon: BarChart3,
    title: "Explore your insights",
    body: "Browse timelines, channels, habits, streaks and more across 16+ analytics sections.",
  },
];

export function HowTo() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <h2 className="mb-2 text-center text-3xl font-bold tracking-tight">
        How it works
      </h2>
      <p className="mb-10 text-center text-muted-foreground">
        Three steps. No account, no upload, no waiting on a server.
      </p>
      <ol className="grid gap-6 sm:grid-cols-3">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <li
              key={step.title}
              className="flex flex-col items-center gap-3 rounded-lg border bg-card p-6 text-center"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="h-6 w-6" aria-hidden />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Step {i + 1}
              </span>
              <h3 className="text-lg font-semibold">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.body}</p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
