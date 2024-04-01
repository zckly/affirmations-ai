import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";

import { cn } from "@acme/ui";
import { ThemeProvider } from "@acme/ui/theme";
import { Toaster } from "@acme/ui/toast";

import { env } from "~/env";
import { TRPCReactProvider } from "~/trpc/react";

import "~/app/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    env.VERCEL_ENV === "production"
      ? "https://turbo.t3.gg"
      : "http://localhost:3000",
  ),
  title: "Affirmations AI",
  description: "Affirmations made with AI",
  openGraph: {
    title: "Affirmations AI",
    description: "Affirmations made with AI",
    url: "https://github.com/supabase-community/create-t3-turbo",
    siteName: "Affirmations AI",
  },
  twitter: {
    card: "summary_large_image",
    site: "@wenquai",
    creator: "@wenquai",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn("min-h-screen bg-background text-foreground antialiased")}
      >
        <ThemeProvider attribute="class" defaultTheme="light">
          <TRPCReactProvider>{props.children}</TRPCReactProvider>
          <Toaster />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
