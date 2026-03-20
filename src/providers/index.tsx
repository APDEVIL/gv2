"use client";

import { TRPCReactProvider } from "@/providers/trpc-providers";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TRPCReactProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
        forcedTheme="dark"
      >
        {children}
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#111",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.85)",
              fontFamily: "monospace",
              fontSize: "12px",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            },
          }}
        />
      </ThemeProvider>
    </TRPCReactProvider>
  );
}