"use client";

import { SmoothScroll } from "@/components/smooth-scroll";
import { LanguageProvider } from "@/lib/language-context";
import { ReducedMotionProvider } from "@/lib/motion";
import { OverlayProvider } from "@/lib/overlay-context";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }): ReactNode {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <LanguageProvider>
        <ReducedMotionProvider>
          <OverlayProvider>
            <SmoothScroll>{children}</SmoothScroll>
          </OverlayProvider>
        </ReducedMotionProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
