"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useColorScheme } from "react-native"
import { lightTheme, darkTheme, type Theme } from "../theme"

type ThemeContextType = {
  theme: Theme
  isDark: boolean
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  isDark: false,
  toggleTheme: () => {},
  setTheme: () => {},
})

export const useTheme = () => useContext(ThemeContext)

export const ThemeProvider: React.FC<{
  children: React.ReactNode
  initialTheme?: Theme
}> = ({ children, initialTheme }) => {
  const colorScheme = useColorScheme()
  const [theme, setTheme] = useState<Theme>(initialTheme || (colorScheme === "dark" ? darkTheme : lightTheme))

  useEffect(() => {
    if (!initialTheme) {
      setTheme(colorScheme === "dark" ? darkTheme : lightTheme)
    }
  }, [colorScheme, initialTheme])

  const toggleTheme = () => {
    setTheme(theme.isDark ? lightTheme : darkTheme)
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark: theme.isDark,
        toggleTheme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}
