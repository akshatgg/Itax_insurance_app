"use client"

import { useState, useEffect } from "react"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { NavigationContainer } from "@react-navigation/native"
import { StatusBar } from "expo-status-bar"
import { ThemeProvider } from "./src/context/ThemeContext"
import { AuthProvider } from "./src/context/AuthContext"
import { DataProvider } from "./src/context/DataContext"
import Navigation from "./src/navigation"
import { useFonts } from "expo-font"
import * as SplashScreen from "expo-splash-screen"
import { useColorScheme } from "react-native"
import { lightTheme, darkTheme } from "./src/theme"
import { Asset } from "expo-asset"
import * as Notifications from "expo-notifications"
import NetInfo from "@react-native-community/netinfo"
import { notificationService } from "./src/services/notification-service"
import AnimatedSplash from "./src/components/AnimatedSplash"

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync()

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

// Preload assets
const preloadAssets = async () => {
  const images = [
    require("./assets/splash.png"),
    require("./assets/icon.png"),
    require("./assets/animations/payment-success.json"),
    require("./assets/animations/payment-failed.json"),
    // Bank logos
    require("./assets/banks/sbi.png"),
    require("./assets/banks/hdfc.png"),
    require("./assets/banks/icici.png"),
    require("./assets/banks/axis.png"),
    require("./assets/banks/kotak.png"),
    require("./assets/banks/pnb.png"),
    require("./assets/banks/bob.png"),
    require("./assets/banks/idfc.png"),
    require("./assets/banks/yes.png"),
    require("./assets/banks/federal.png"),
    // UPI logos
    require("./assets/upi/phonepe.png"),
    require("./assets/upi/paytm.png"),
    require("./assets/upi/bhim.png"),
    require("./assets/upi/gpay.png"),
    require("./assets/upi/amazonpay.png"),
  ]

  const cacheImages = images.map((image) => {
    if (typeof image === "string") {
      return Image.prefetch(image)
    } else {
      return Asset.fromModule(image).downloadAsync()
    }
  })

  return Promise.all(cacheImages)
}

export default function App() {
  const [isReady, setIsReady] = useState(false)
  const [showSplash, setShowSplash] = useState(true)
  const colorScheme = useColorScheme()
  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("./assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Medium": require("./assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Bold": require("./assets/fonts/Poppins-Bold.ttf"),
  })

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await preloadAssets()

        // Check network status
        const netInfoState = await NetInfo.fetch()
        if (!netInfoState.isConnected) {
          notificationService.addNotification({
            title: "You're Offline",
            body: "Some features may be limited until you reconnect to the internet.",
          })
        }

        // Simulate a bit of loading time for the splash screen
        await new Promise((resolve) => setTimeout(resolve, 2000))
      } catch (e) {
        console.warn(e)
      } finally {
        // Tell the application to render
        setIsReady(true)
      }
    }

    prepare()
  }, [])

  useEffect(() => {
    if (isReady && fontsLoaded) {
      SplashScreen.hideAsync()

      // Show our custom animated splash and then hide it
      setTimeout(() => {
        setShowSplash(false)
      }, 2000)
    }
  }, [isReady, fontsLoaded])

  if (!isReady || !fontsLoaded) {
    return null
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider initialTheme={colorScheme === "dark" ? darkTheme : lightTheme}>
        <AuthProvider>
          <DataProvider>
            <NavigationContainer>
              <StatusBar style="auto" />
              {showSplash ? <AnimatedSplash onAnimationComplete={() => setShowSplash(false)} /> : <Navigation />}
            </NavigationContainer>
          </DataProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  )
}
