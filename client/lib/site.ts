export const siteConfig = {
  name: "YouTube History Insights",
  description:
    "Privacy-first, client-side analytics for your exported YouTube watch history.",
  // Replace with the real repository URL before publishing.
  repoUrl: "https://github.com/your-username/yt-history-insights",
  nav: [
    { title: "Home", href: "/" },
    { title: "Dashboard", href: "/dashboard" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
