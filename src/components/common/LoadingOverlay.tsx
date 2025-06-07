"use client"

import type React from "react"
import { View, StyleSheet, ActivityIndicator } from "react-native"
import { Text, useTheme } from "react-native-paper"

type LoadingOverlayProps = {
  message?: string
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message = "Loading..." }) => {
  const theme = useTheme()

  return (
    <View style={styles.container}>
      <View style={styles.overlay}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
  },
  overlay: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    minWidth: 200,
  },
  message: {
    marginTop: 10,
    fontSize: 16,
  },
})

export default LoadingOverlay
