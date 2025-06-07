"use client"

import type React from "react"
import { View, ScrollView, type ViewStyle, type StyleProp } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useTheme } from "../context/ThemeContext"
import { responsive } from "../theme"

type ResponsiveLayoutProps = {
  children: React.ReactNode
  scrollable?: boolean
  style?: StyleProp<ViewStyle>
  contentContainerStyle?: StyleProp<ViewStyle>
  padded?: boolean
}

const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  scrollable = true,
  style,
  contentContainerStyle,
  padded = true,
}) => {
  const insets = useSafeAreaInsets()
  const { theme } = useTheme()

  const containerStyle = {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: insets.top,
    paddingBottom: insets.bottom,
    paddingLeft: insets.left,
    paddingRight: insets.right,
  }

  const contentStyle = {
    padding: padded ? theme.spacing.m : 0,
    ...(responsive.isLargeDevice && {
      maxWidth: 800,
      alignSelf: "center",
      width: "100%",
    }),
  }

  if (scrollable) {
    return (
      <ScrollView
        style={[containerStyle, style]}
        contentContainerStyle={[contentStyle, contentContainerStyle]}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    )
  }

  return (
    <View style={[containerStyle, style]}>
      <View style={[contentStyle, contentContainerStyle]}>{children}</View>
    </View>
  )
}

export default ResponsiveLayout
