/**
 * Dark Mode Utilities
 * Provides helper functions and constants for dark mode support
 */

/**
 * WCAG 2.1 Contrast Ratio Requirements
 * AA: 4.5:1 for normal text, 3:1 for large text
 * AAA: 7:1 for normal text, 4.5:1 for large text
 */

export const CONTRAST_REQUIREMENTS = {
  AA_NORMAL: 4.5,
  AA_LARGE: 3,
  AAA_NORMAL: 7,
  AAA_LARGE: 4.5,
} as const

/**
 * Color scheme definitions for light and dark modes
 */
export const COLOR_SCHEMES = {
  light: {
    background: 'hsl(0 0% 100%)',
    foreground: 'hsl(15 10% 8%)',
    primary: 'hsl(270 100% 55%)',
    secondary: 'hsl(200 100% 50%)',
    accent: 'hsl(180 100% 50%)',
    muted: 'hsl(0 0% 92%)',
    border: 'hsl(0 0% 88%)',
  },
  dark: {
    background: 'hsl(15 10% 8%)',
    foreground: 'hsl(0 0% 98%)',
    primary: 'hsl(270 100% 65%)',
    secondary: 'hsl(200 100% 60%)',
    accent: 'hsl(180 100% 60%)',
    muted: 'hsl(15 8% 25%)',
    border: 'hsl(15 8% 20%)',
  },
} as const

/**
 * Chart color palettes optimized for dark mode
 */
export const CHART_COLORS = {
  light: {
    primary: '#7c3aed',
    secondary: '#0ea5e9',
    accent: '#06b6d4',
    success: '#16a34a',
    warning: '#d97706',
    danger: '#dc2626',
    grid: '#e5e7eb',
    text: '#1f2937',
  },
  dark: {
    primary: '#a78bfa',
    secondary: '#38bdf8',
    accent: '#22d3ee',
    success: '#86efac',
    warning: '#fbbf24',
    danger: '#f87171',
    grid: '#374151',
    text: '#f3f4f6',
  },
} as const

/**
 * Calculate relative luminance of a color
 */
export function getRelativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((val) => {
    val = val / 255
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

/**
 * Calculate contrast ratio between two RGB colors
 */
export function getContrastRatio(
  rgb1: { r: number; g: number; b: number },
  rgb2: { r: number; g: number; b: number }
): number {
  const l1 = getRelativeLuminance(rgb1.r, rgb1.g, rgb1.b)
  const l2 = getRelativeLuminance(rgb2.r, rgb2.g, rgb2.b)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Get WCAG compliance level for a contrast ratio
 */
export function getWCAGLevel(ratio: number): 'AAA' | 'AA' | 'AA-large' | 'Fail' {
  if (ratio >= CONTRAST_REQUIREMENTS.AAA_NORMAL) return 'AAA'
  if (ratio >= CONTRAST_REQUIREMENTS.AA_NORMAL) return 'AA'
  if (ratio >= CONTRAST_REQUIREMENTS.AA_LARGE) return 'AA-large'
  return 'Fail'
}

/**
 * Tailwind classes for dark mode support
 */
export const DARK_MODE_CLASSES = {
  // Text colors
  textHighContrast: 'text-foreground dark:text-foreground',
  textMuted: 'text-muted-foreground dark:text-muted-foreground',
  
  // Background colors
  bgBase: 'bg-background dark:bg-background',
  bgCard: 'bg-card dark:bg-card',
  bgMuted: 'bg-muted dark:bg-muted',
  
  // Border colors
  borderBase: 'border-border dark:border-border',
  
  // Shadows - darker in dark mode
  shadowSm: 'shadow-sm dark:shadow-md',
  shadowMd: 'shadow-md dark:shadow-lg',
  shadowLg: 'shadow-lg dark:shadow-xl',
  
  // Hover states
  hoverBg: 'hover:bg-muted/50 dark:hover:bg-muted/50',
  hoverBorder: 'hover:border-primary dark:hover:border-primary',
} as const

/**
 * Get dark mode specific Tailwind classes
 */
export function getDarkModeClass(lightClass: string, darkClass: string): string {
  return `${lightClass} dark:${darkClass}`
}

/**
 * Theme configuration for chart libraries
 */
export const getChartThemeConfig = (isDark: boolean) => ({
  colors: isDark ? CHART_COLORS.dark : CHART_COLORS.light,
  textColor: isDark ? CHART_COLORS.dark.text : CHART_COLORS.light.text,
  gridColor: isDark ? CHART_COLORS.dark.grid : CHART_COLORS.light.grid,
  backgroundColor: isDark ? COLOR_SCHEMES.dark.background : COLOR_SCHEMES.light.background,
})
