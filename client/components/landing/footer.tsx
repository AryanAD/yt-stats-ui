import { Github } from "lucide-react";

import { siteConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-muted-foreground sm:flex-row">
        <p>
          © {new Date().getFullYear()} {siteConfig.name}. Privacy-first and
          open source.
        </p>
        <a
          href={siteConfig.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
        >
          <Github className="h-4 w-4" aria-hidden />
          View on GitHub
        </a>
      </div>
    </footer>
  );
}
