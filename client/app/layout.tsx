import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "YouTube History Insights",
  description:
    "Privacy-first, client-side analytics for your exported YouTube watch history.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
