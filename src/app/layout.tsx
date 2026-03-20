import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { Providers } from "@/providers";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Arena — Gaming Leaderboard & Tournaments",
  description: "Competitive gaming event management and leaderboard platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${GeistMono.variable} bg-[#0d0d0d] antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}