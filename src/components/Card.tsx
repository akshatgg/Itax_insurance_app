"use client"

import type React from "react"
import { View, type StyleProp, type ViewStyle, TouchableOpacity } from "react-native"
import { useTheme } from "../context/ThemeContext"

type CardProps = {
  children: React.ReactNode
  style?: StyleProp<ViewStyle>
  onPress?: () => void
  variant?: "elevated" | "outlined" | "filled"
}

const Card: React.FC<CardProps> = ({ children, style, onPress, variant = "elevated" }) => {
  const { theme } = useTheme()

  const getCardStyle = () => {
    const baseStyle: ViewStyle = {
      borderRadius: theme.borderRadius.m,
      padding: theme.spacing.m,
      backgroundColor: theme.colors.card,
    }

    switch (variant) {
      case "outlined":
        baseStyle.backgroundColor = "transparent"
        baseStyle.borderWidth = 1
        baseStyle.borderColor = theme.colors.border
        break
      case "filled":
        baseStyle.backgroundColor = theme.colors.background
        baseStyle.borderWidth = 0
        break
      default: // elevated
        baseStyle.shadowColor = theme.colors.shadow
        baseStyle.shadowOffset = { width: 0, height: 2 }
        baseStyle.shadowOpacity = 0.1
        baseStyle.shadowRadius = 8
        baseStyle.elevation = 2
    }

    return baseStyle
  }

  const CardComponent = onPress ? TouchableOpacity : View

  return (
    <CardComponent style={[getCardStyle(), style]} onPress={onPress} activeOpacity={onPress ? 0.7 : 1}>
      {children}
    </CardComponent>
  )
}

export default Card
