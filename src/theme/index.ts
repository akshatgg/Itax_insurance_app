import { Dimensions } from "react-native"

const { width, height } = Dimensions.get("window")

// Responsive sizing
const scale = (size: number) => (width / 375) * size
const verticalScale = (size: number) => (height / 812) * size
const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor

// Base colors
const baseColors = {
  primary: "#14b8a6",
  secondary: "#99f6e4",
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
  info: "#3b82f6",
  black: "#000000",
  white: "#ffffff",
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
  },
}

// Light theme
export const lightTheme = {
  colors: {
    ...baseColors,
    background: baseColors.white,
    card: baseColors.white,
    text: baseColors.gray[900],
    border: baseColors.gray[200],
    notification: baseColors.error,
    shadow: "rgba(0, 0, 0, 0.1)",
  },
  spacing: {
    xs: scale(4),
    s: scale(8),
    m: scale(16),
    l: scale(24),
    xl: scale(32),
    xxl: scale(48),
  },
  borderRadius: {
    s: scale(4),
    m: scale(8),
    l: scale(16),
    xl: scale(24),
    xxl: scale(32),
  },
  typography: {
    fontFamily: {
      regular: "Poppins-Regular",
      medium: "Poppins-Medium",
      bold: "Poppins-Bold",
    },
    fontSize: {
      xs: scale(10),
      s: scale(12),
      m: scale(14),
      l: scale(16),
      xl: scale(18),
      xxl: scale(20),
      xxxl: scale(24),
      display: scale(32),
    },
  },
  isDark: false,
}

// Dark theme
export const darkTheme = {
  ...lightTheme,
  colors: {
    ...baseColors,
    background: baseColors.gray[900],
    card: baseColors.gray[800],
    text: baseColors.white,
    border: baseColors.gray[700],
    notification: baseColors.error,
    shadow: "rgba(0, 0, 0, 0.3)",
  },
  isDark: true,
}

// Responsive utilities
export const responsive = {
  scale,
  verticalScale,
  moderateScale,
  isSmallDevice: width < 375,
  isMediumDevice: width >= 375 && width < 768,
  isLargeDevice: width >= 768,
  width,
  height,
}

export type Theme = typeof lightTheme
