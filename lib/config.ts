/**
 * ============================================================================
 * SITE CONFIGURATION
 * ============================================================================
 *
 * Customize your landing page by editing the values below.
 * All text, links, and settings are centralized here for easy editing.
 */

export const siteConfig = {
  name: "OPCagt",
  tagline: "Built to evolve ideas.",
  description:
    "We craft exceptional digital experiences that captivate audiences and drive results. From strategy to execution, we bring your vision to life.",
  url: "https://OPCagt.studio",
  twitter: "@OPCagt",

  nav: {
    cta: {
      text: "Get in Touch",
      href: "#contact",
    },
    signIn: {
      text: "Sign in",
      href: "#",
    },
  },
} as const;

/**
 * ============================================================================
 * FEATURE FLAGS
 * ============================================================================
 *
 * Toggle features on/off without touching component code.
 */
export const features = {
  smoothScroll: true,
  darkMode: true,
} as const;

/**
 * ============================================================================
 * THEME CONFIGURATION
 * ============================================================================
 *
 * Colors are defined in globals.css using CSS custom properties.
 * This config controls which theme features are enabled.
 */
export const themeConfig = {
  defaultTheme: "dark" as const,
  enableSystem: true,
} as const;
