"use client"
import type React from "react"
import { useEffect, useRef } from "react"
import { View, Text, StyleSheet, Animated, Easing, Dimensions } from "react-native"
import { useTheme } from "../context/ThemeContext"
import LottieView from "lottie-react-native"

interface AnimatedSplashProps {
  onAnimationComplete: () => void
}

const AnimatedSplash: React.FC<AnimatedSplashProps> = ({ onAnimationComplete }) => {
  const { theme } = useTheme()
  const { width, height } = Dimensions.get("window")

  const fadeAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0.9)).current
  const textFadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    // Sequence of animations
    Animated.sequence([
      // Fade in and scale up logo
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.out(Easing.cubic),
        }),
      ]),

      // Fade in text
      Animated.timing(textFadeAnim, {
        toValue: 1,
        duration: 500,
        delay: 200,
        useNativeDriver: true,
      }),

      // Hold for a moment
      Animated.delay(500),

      // Fade out everything
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(textFadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      // Animation complete callback
      onAnimationComplete()
    })
  }, [])

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <LottieView
          source={require("../../assets/animations/insurance-logo.json")}
          autoPlay
          loop={false}
          style={styles.logo}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.textContainer,
          {
            opacity: textFadeAnim,
          },
        ]}
      >
        <Text style={[styles.appName, { color: theme.colors.primary }]}>EcoSure</Text>
        <Text style={[styles.tagline, { color: theme.colors.text }]}>Insurance made simple</Text>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    width: 150,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  appName: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
  },
})

export default AnimatedSplash
