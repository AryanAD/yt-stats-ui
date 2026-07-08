import { ShieldCheck, Lock, EyeOff } from "lucide-react";

const points = [
  {
    icon: EyeOff,
    title: "Nothing leaves your device",
    body: "Your history file is read in the browser and kept in memory only. It is never sent to any server.",
  },
  {
    icon: Lock,
    title: "No account required",
    body: "There is no sign-up and no database. Open the page, upload, and explore — that is the whole flow.",
  },
  {
    icon: ShieldCheck,
    title: "Open source",
    body: "The entire codebase is public so anyone can verify exactly how their data is handled.",
  },
];

export function Privacy() {
  return (
    <section className="border-y bg-muted/40 py-16">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-10 flex flex-col items-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ShieldCheck className="h-6 w-6" aria-hidden />
          </div>
          <h2 className="text-3xl font-bold tracking-tight">
            Your privacy is the product
          </h2>
          <p className="max-w-xl text-muted-foreground">
            This tool exists because analytics should not require giving up your
            data. Here is our promise to you.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {points.map((point) => {
            const Icon = point.icon;
            return (
              <div key={point.title} className="flex flex-col gap-2">
                <Icon className="h-5 w-5 text-primary" aria-hidden />
                <h3 className="font-semibold">{point.title}</h3>
                <p className="text-sm text-muted-foreground">{point.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
