"use client"
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext"
import { useAuth } from "../context/AuthContext"
import ResponsiveLayout from "../components/ResponsiveLayout"
import Card from "../components/Card"
import Button from "../components/Button"

const ProfileScreen = () => {
  const { theme, toggleTheme, isDark } = useTheme()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: async () => {
          try {
            await logout()
          } catch (error) {
            console.log("Logout error:", error)
          }
        },
      },
    ])
  }

  const menuItems = [
    {
      id: "1",
      title: "Personal Information",
      icon: "person-outline",
      onPress: () => {
        // Navigate to personal info
      },
    },
    {
      id: "2",
      title: "Documents",
      icon: "document-outline",
      onPress: () => {
        // Navigate to documents
      },
    },
    {
      id: "3",
      title: "Payment Methods",
      icon: "card-outline",
      onPress: () => {
        // Navigate to payment methods
      },
    },
    {
      id: "4",
      title: "Notifications",
      icon: "notifications-outline",
      onPress: () => {
        // Navigate to notifications
      },
    },
    {
      id: "5",
      title: "Privacy & Security",
      icon: "shield-outline",
      onPress: () => {
        // Navigate to privacy
      },
    },
    {
      id: "6",
      title: "Help & Support",
      icon: "help-circle-outline",
      onPress: () => {
        // Navigate to help
      },
    },
  ]

  return (
    <ResponsiveLayout>
      <Card style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <View style={styles.profileInfo}>
            <View style={[styles.profileImageContainer, { backgroundColor: `${theme.colors.primary}20` }]}>
              {user?.photoURL ? (
                <Image source={{ uri: user.photoURL }} style={styles.profileImage} />
              ) : (
                <Text
                  style={[
                    styles.profileInitial,
                    { color: theme.colors.primary, fontFamily: theme.typography.fontFamily.bold },
                  ]}
                >
                  {user?.name?.charAt(0) || "U"}
                </Text>
              )}
            </View>
            <View>
              <Text
                style={[styles.profileName, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.bold }]}
              >
                {user?.name || "User"}
              </Text>
              <Text
                style={[
                  styles.profileEmail,
                  { color: theme.colors.gray[500], fontFamily: theme.typography.fontFamily.regular },
                ]}
              >
                {user?.email || "user@example.com"}
              </Text>
            </View>
          </View>
          <Button
            title="Edit"
            onPress={() => {
              // Navigate to edit profile
            }}
            variant="outline"
            size="small"
          />
        </View>
      </Card>

      <View style={styles.menuContainer}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.menuItem, { borderBottomColor: theme.colors.border }]}
            onPress={item.onPress}
          >
            <View style={styles.menuItemContent}>
              <Ionicons name={item.icon as any} size={24} color={theme.colors.primary} style={styles.menuItemIcon} />
              <Text
                style={[
                  styles.menuItemText,
                  { color: theme.colors.text, fontFamily: theme.typography.fontFamily.medium },
                ]}
              >
                {item.title}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.gray[400]} />
          </TouchableOpacity>
        ))}
      </View>

      <Card style={styles.preferencesCard}>
        <View style={styles.preferenceItem}>
          <View style={styles.preferenceContent}>
            <Ionicons name="moon-outline" size={24} color={theme.colors.primary} style={styles.preferenceIcon} />
            <Text
              style={[
                styles.preferenceText,
                { color: theme.colors.text, fontFamily: theme.typography.fontFamily.medium },
              ]}
            >
              Dark Mode
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.toggleButton, { backgroundColor: isDark ? theme.colors.primary : theme.colors.gray[300] }]}
            onPress={toggleTheme}
          >
            <View
              style={[
                styles.toggleCircle,
                {
                  backgroundColor: theme.colors.white,
                  transform: [{ translateX: isDark ? 16 : 0 }],
                },
              ]}
            />
          </TouchableOpacity>
        </View>
      </Card>

      <Button
        title="Logout"
        onPress={handleLogout}
        variant="outline"
        style={[styles.logoutButton, { borderColor: theme.colors.error }]}
        textStyle={{ color: theme.colors.error }}
      />
    </ResponsiveLayout>
  )
}

const styles = StyleSheet.create({
  profileCard: {
    marginBottom: 24,
  },
  profileHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileInitial: {
    fontSize: 24,
  },
  profileName: {
    fontSize: 18,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
  },
  menuContainer: {
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemIcon: {
    marginRight: 16,
  },
  menuItemText: {
    fontSize: 16,
  },
  preferencesCard: {
    marginBottom: 24,
  },
  preferenceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  preferenceContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  preferenceIcon: {
    marginRight: 16,
  },
  preferenceText: {
    fontSize: 16,
  },
  toggleButton: {
    width: 40,
    height: 24,
    borderRadius: 12,
    padding: 2,
  },
  toggleCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  logoutButton: {
    marginTop: 8,
  },
})

export default ProfileScreen
