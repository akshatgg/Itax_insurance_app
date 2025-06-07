"use client"
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext"
import { useAuth } from "../context/AuthContext"
import ResponsiveLayout from "../components/ResponsiveLayout"
import Card from "../components/Card"
import Button from "../components/Button"
import { responsive } from "../theme"

const insuranceTypes = [
  {
    id: "1",
    title: "Auto Insurance",
    icon: "car-outline",
    description: "Protect your vehicle with comprehensive coverage",
    color: "#10b981",
  },
  {
    id: "2",
    title: "Health Insurance",
    icon: "medkit-outline",
    description: "Get the best healthcare coverage for you and your family",
    color: "#3b82f6",
  },
  {
    id: "3",
    title: "Life Insurance",
    icon: "heart-outline",
    description: "Secure your family's financial future",
    color: "#f59e0b",
  },
  {
    id: "4",
    title: "Home Insurance",
    icon: "home-outline",
    description: "Protect your most valuable asset",
    color: "#8b5cf6",
  },
]

const features = [
  {
    id: "1",
    title: "Paperless Policies",
    icon: "leaf-outline",
    description: "Eco-friendly digital documentation",
  },
  {
    id: "2",
    title: "24/7 Support",
    icon: "headset-outline",
    description: "Get help whenever you need it",
  },
  {
    id: "3",
    title: "Quick Claims",
    icon: "flash-outline",
    description: "Fast and hassle-free claims process",
  },
]

const HomeScreen = () => {
  const navigation = useNavigation()
  const { theme } = useTheme()
  const { user } = useAuth()

  const renderInsuranceItem = ({ item, index }: { item: (typeof insuranceTypes)[0]; index: number }) => (
    <TouchableOpacity
      style={[
        styles.insuranceItem,
        {
          marginLeft: index % 2 === 0 ? 0 : responsive.scale(8),
          marginRight: index % 2 === 0 ? responsive.scale(8) : 0,
          width: responsive.isLargeDevice ? `${100 / 3 - 2}%` : `${100 / 2 - 2}%`,
        },
      ]}
      onPress={() => {
        // Navigate to insurance details
      }}
    >
      <Card>
        <View style={[styles.iconContainer, { backgroundColor: `${item.color}20` }]}>
          <Ionicons name={item.icon as any} size={24} color={item.color} />
        </View>
        <Text
          style={[styles.insuranceTitle, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.medium }]}
        >
          {item.title}
        </Text>
        <Text
          style={[
            styles.insuranceDescription,
            { color: theme.colors.gray[500], fontFamily: theme.typography.fontFamily.regular },
          ]}
          numberOfLines={2}
        >
          {item.description}
        </Text>
      </Card>
    </TouchableOpacity>
  )

  const renderFeatureItem = ({ item }: { item: (typeof features)[0] }) => (
    <Card style={styles.featureCard}>
      <View style={styles.featureContent}>
        <View style={[styles.featureIconContainer, { backgroundColor: `${theme.colors.primary}20` }]}>
          <Ionicons name={item.icon as any} size={24} color={theme.colors.primary} />
        </View>
        <View style={styles.featureTextContainer}>
          <Text
            style={[styles.featureTitle, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.medium }]}
          >
            {item.title}
          </Text>
          <Text
            style={[
              styles.featureDescription,
              { color: theme.colors.gray[500], fontFamily: theme.typography.fontFamily.regular },
            ]}
          >
            {item.description}
          </Text>
        </View>
      </View>
    </Card>
  )

  return (
    <ResponsiveLayout>
      <View style={styles.header}>
        <View>
          <Text
            style={[
              styles.greeting,
              { color: theme.colors.gray[500], fontFamily: theme.typography.fontFamily.regular },
            ]}
          >
            Hello,
          </Text>
          <Text style={[styles.userName, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.bold }]}>
            {user?.name || "Guest"}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.notificationButton, { backgroundColor: theme.colors.background }]}
          onPress={() => {
            // Navigate to notifications
          }}
        >
          <Ionicons name="notifications-outline" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <Card style={[styles.heroCard, { backgroundColor: theme.colors.primary }]}>
        <View style={styles.heroContent}>
          <View style={styles.heroTextContainer}>
            <Text
              style={[styles.heroTitle, { color: theme.colors.white, fontFamily: theme.typography.fontFamily.bold }]}
            >
              Protect What Matters
            </Text>
            <Text
              style={[
                styles.heroSubtitle,
                { color: "rgba(255, 255, 255, 0.8)", fontFamily: theme.typography.fontFamily.regular },
              ]}
            >
              Get comprehensive insurance coverage that fits your needs
            </Text>
            <Button
              title="Get a Quote"
              onPress={() => {
                // Navigate to quote screen
              }}
              variant="secondary"
              style={{ marginTop: theme.spacing.m }}
            />
          </View>
          <Image source={require("../../assets/hero-image.png")} style={styles.heroImage} resizeMode="contain" />
        </View>
      </Card>

      <Text style={[styles.sectionTitle, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.bold }]}>
        Insurance Solutions
      </Text>

      <View style={styles.insuranceGrid}>
        {insuranceTypes.map((item, index) => renderInsuranceItem({ item, index }))}
      </View>

      <Text
        style={[
          styles.sectionTitle,
          { color: theme.colors.text, fontFamily: theme.typography.fontFamily.bold, marginTop: theme.spacing.l },
        ]}
      >
        Why Choose EcoSure?
      </Text>

      {features.map((item) => renderFeatureItem({ item }))}
    </ResponsiveLayout>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  greeting: {
    fontSize: 14,
  },
  userName: {
    fontSize: 20,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  heroCard: {
    marginBottom: 24,
    padding: 0,
    overflow: "hidden",
  },
  heroContent: {
    flexDirection: "row",
    padding: 16,
  },
  heroTextContainer: {
    flex: 1,
    paddingRight: 8,
  },
  heroTitle: {
    fontSize: 24,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
  },
  heroImage: {
    width: 120,
    height: 120,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  insuranceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -8,
  },
  insuranceItem: {
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  insuranceTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  insuranceDescription: {
    fontSize: 12,
  },
  featureCard: {
    marginBottom: 12,
  },
  featureContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
  },
})

export default HomeScreen
