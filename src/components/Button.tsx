"use client"

import type React from "react"
import { TouchableOpacity, Text, ActivityIndicator, type StyleProp, type ViewStyle, type TextStyle } from "react-native"
import { useTheme } from "../context/ThemeContext"

type ButtonProps = {
  title: string
  onPress: () => void
  variant?: "primary" | "secondary" | "outline" | "text"
  size?: "small" | "medium" | "large"
  loading?: boolean
  disabled?: boolean
  style?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
  fullWidth?: boolean
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  loading = false,
  disabled = false,
  style,
  textStyle,
  fullWidth = false,
}) => {
  const { theme } = useTheme()

  const getButtonStyle = () => {
    const baseStyle: ViewStyle = {
      borderRadius: theme.borderRadius.m,
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row",
      width: fullWidth ? "100%" : undefined,
    }

    // Size styles
    switch (size) {
      case "small":
        baseStyle.paddingVertical = theme.spacing.xs
        baseStyle.paddingHorizontal = theme.spacing.m
        break
      case "large":
        baseStyle.paddingVertical = theme.spacing.m
        baseStyle.paddingHorizontal = theme.spacing.xl
        break
      default: // medium
        baseStyle.paddingVertical = theme.spacing.s
        baseStyle.paddingHorizontal = theme.spacing.l
    }

    // Variant styles
    switch (variant) {
      case "secondary":
        baseStyle.backgroundColor = theme.colors.secondary
        break
      case "outline":
        baseStyle.backgroundColor = "transparent"
        baseStyle.borderWidth = 1
        baseStyle.borderColor = theme.colors.primary
        break
      case "text":
        baseStyle.backgroundColor = "transparent"
        break
      default: // primary
        baseStyle.backgroundColor = theme.colors.primary
    }

    // Disabled state
    if (disabled || loading) {
      baseStyle.opacity = 0.6
    }

    return baseStyle
  }

  const getTextStyle = () => {
    const baseStyle: TextStyle = {
      fontFamily: theme.typography.fontFamily.medium,
    }

    // Size styles
    switch (size) {
      case "small":
        baseStyle.fontSize = theme.typography.fontSize.s
        break
      case "large":
        baseStyle.fontSize = theme.typography.fontSize.l
        break
      default: // medium
        baseStyle.fontSize = theme.typography.fontSize.m
    }

    // Variant styles
    switch (variant) {
      case "secondary":
        baseStyle.color = theme.colors.primary
        break
      case "outline":
      case "text":
        baseStyle.color = theme.colors.primary
        break
      default: // primary
        baseStyle.color = theme.colors.white
    }

    return baseStyle
  }

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "primary" ? theme.colors.white : theme.colors.primary}
          style={{ marginRight: theme.spacing.s }}
        />
      ) : null}
      <Text style={[getTextStyle(), textStyle]}>{title}</Text>
    </TouchableOpacity>
  )
}

export default Button
