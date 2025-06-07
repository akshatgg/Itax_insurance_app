"use client"
import { createStackNavigator } from "@react-navigation/stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext"
import { useAuth } from "../context/AuthContext"
import { Platform, View, Text } from "react-native"

// Auth Screens
import LoginScreen from "../screens/auth/LoginScreen"
import RegisterScreen from "../screens/auth/RegisterScreen"
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen"

// Main Screens
import HomeScreen from "../screens/HomeScreen"
import DashboardScreen from "../screens/DashboardScreen"
import ProfileScreen from "../screens/ProfileScreen"
import PolicyDetailsScreen from "../screens/PolicyDetailsScreen"
import NewClaimScreen from "../screens/NewClaimScreen"
import PaymentsScreen from "../screens/PaymentsScreen"
import PaymentMethodsScreen from "../screens/PaymentMethodsScreen"
import PaymentSuccessScreen from "../screens/PaymentSuccessScreen"
import PaymentFailedScreen from "../screens/PaymentFailedScreen"
import NotificationsScreen from "../screens/NotificationsScreen"
import OfflineQueueScreen from "../screens/OfflineQueueScreen"

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

const AuthNavigator = () => {
  const { theme } = useTheme()

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.white,
        headerTitleStyle: {
          fontFamily: theme.typography.fontFamily.medium,
        },
        ...Platform.select({
          ios: {
            headerShadowVisible: false,
          },
          android: {
            headerElevation: 0,
          },
        }),
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ title: "Reset Password" }} />
    </Stack.Navigator>
  )
}

const TabNavigator = () => {
  const { theme } = useTheme()
  const { unreadNotifications } = useAuth()

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline"
          } else if (route.name === "Dashboard") {
            iconName = focused ? "grid" : "grid-outline"
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline"
          } else if (route.name === "Payments") {
            iconName = focused ? "card" : "card-outline"
          } else if (route.name === "Notifications") {
            iconName = focused ? "notifications" : "notifications-outline"
          }

          return (
            <>
              <Ionicons name={iconName as any} size={size} color={color} />
              {route.name === "Notifications" && unreadNotifications > 0 && (
                <View
                  style={{
                    position: "absolute",
                    top: -2,
                    right: -6,
                    backgroundColor: theme.colors.error,
                    borderRadius: 10,
                    width: 16,
                    height: 16,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 10,
                      fontWeight: "bold",
                    }}
                  >
                    {unreadNotifications > 9 ? "9+" : unreadNotifications}
                  </Text>
                </View>
              )}
            </>
          )
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.gray[500],
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
          ...Platform.select({
            ios: {
              shadowOpacity: 0.1,
              shadowRadius: 4,
              shadowColor: "#000",
              shadowOffset: { height: -2, width: 0 },
            },
            android: {
              elevation: 8,
            },
          }),
        },
        headerStyle: {
          backgroundColor: theme.colors.primary,
          ...Platform.select({
            ios: {
              shadowOpacity: 0,
            },
            android: {
              elevation: 0,
            },
          }),
        },
        headerTintColor: theme.colors.white,
        headerTitleStyle: {
          fontFamily: theme.typography.fontFamily.medium,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Payments" component={PaymentsScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  )
}

const MainNavigator = () => {
  const { theme } = useTheme()

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.white,
        headerTitleStyle: {
          fontFamily: theme.typography.fontFamily.medium,
        },
        ...Platform.select({
          ios: {
            headerShadowVisible: false,
          },
          android: {
            headerElevation: 0,
          },
        }),
        cardStyleInterpolator: ({ current, layouts }) => {
          return {
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
            },
          }
        },
      }}
    >
      <Stack.Screen name="Main" component={TabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="PolicyDetails" component={PolicyDetailsScreen} options={{ title: "Policy Details" }} />
      <Stack.Screen name="NewClaim" component={NewClaimScreen} options={{ title: "File a Claim" }} />
      <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} options={{ title: "Payment Methods" }} />
      <Stack.Screen
        name="PaymentSuccess"
        component={PaymentSuccessScreen}
        options={{
          title: "Payment Successful",
          headerLeft: () => null, // Disable back button
        }}
      />
      <Stack.Screen name="PaymentFailed" component={PaymentFailedScreen} options={{ title: "Payment Failed" }} />
      <Stack.Screen name="OfflineQueue" component={OfflineQueueScreen} options={{ title: "Offline Queue" }} />
    </Stack.Navigator>
  )
}

const Navigation = () => {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return null // Or a loading screen
  }

  return user ? <MainNavigator /> : <AuthNavigator />
}

export default Navigation
