"use client"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../context/ThemeContext"
import { useData } from "../context/DataContext"
import ResponsiveLayout from "../components/ResponsiveLayout"
import Card from "../components/Card"
import Button from "../components/Button"

const DashboardScreen = () => {
  const navigation = useNavigation()
  const { theme } = useTheme()
  const { policies, claims, payments, isLoading, refreshData } = useData()

  const activePolicies = policies.filter((policy) => policy.status === "active")
  const pendingClaims = claims.filter((claim) => claim.status === "pending")
  const upcomingPayments = payments.filter((payment) => payment.status === "pending")

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  }

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString("en-IN")}`
  }

  return (
    <ResponsiveLayout>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.bold }]}>
          Dashboard
        </Text>
        <TouchableOpacity
          style={[styles.refreshButton, { backgroundColor: theme.colors.background }]}
          onPress={refreshData}
        >
          <Ionicons name="refresh-outline" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <Card style={[styles.statCard, { backgroundColor: `${theme.colors.primary}10` }]}>
          <View style={styles.statContent}>
            <Ionicons name="shield-checkmark-outline" size={24} color={theme.colors.primary} />
            <Text
              style={[styles.statValue, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.bold }]}
            >
              {activePolicies.length}
            </Text>
            <Text
              style={[
                styles.statLabel,
                { color: theme.colors.gray[500], fontFamily: theme.typography.fontFamily.regular },
              ]}
            >
              Active Policies
            </Text>
          </View>
        </Card>

        <Card style={[styles.statCard, { backgroundColor: `${theme.colors.warning}10` }]}>
          <View style={styles.statContent}>
            <Ionicons name="document-text-outline" size={24} color={theme.colors.warning} />
            <Text
              style={[styles.statValue, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.bold }]}
            >
              {pendingClaims.length}
            </Text>
            <Text
              style={[
                styles.statLabel,
                { color: theme.colors.gray[500], fontFamily: theme.typography.fontFamily.regular },
              ]}
            >
              Pending Claims
            </Text>
          </View>
        </Card>

        <Card style={[styles.statCard, { backgroundColor: `${theme.colors.info}10` }]}>
          <View style={styles.statContent}>
            <Ionicons name="calendar-outline" size={24} color={theme.colors.info} />
            <Text
              style={[styles.statValue, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.bold }]}
            >
              {upcomingPayments.length}
            </Text>
            <Text
              style={[
                styles.statLabel,
                { color: theme.colors.gray[500], fontFamily: theme.typography.fontFamily.regular },
              ]}
            >
              Due Payments
            </Text>
          </View>
        </Card>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.bold }]}>
        My Policies
      </Text>

      {activePolicies.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Text
            style={[
              styles.emptyText,
              { color: theme.colors.gray[500], fontFamily: theme.typography.fontFamily.regular },
            ]}
          >
            You don't have any active policies yet.
          </Text>
          <Button
            title="Get a Quote"
            onPress={() => {
              // Navigate to quote screen
            }}
            variant="outline"
            size="small"
            style={{ marginTop: theme.spacing.m }}
          />
        </Card>
      ) : (
        activePolicies.map((policy) => (
          <Card
            key={policy.id}
            style={styles.policyCard}
            onPress={() => navigation.navigate("PolicyDetails" as never, { policyId: policy.id } as never)}
          >
            <View style={styles.policyHeader}>
              <View style={[styles.policyIconContainer, { backgroundColor: `${theme.colors.primary}20` }]}>
                <Ionicons
                  name={
                    policy.type === "auto"
                      ? "car-outline"
                      : policy.type === "health"
                        ? "medkit-outline"
                        : policy.type === "life"
                          ? "heart-outline"
                          : "home-outline"
                  }
                  size={20}
                  color={theme.colors.primary}
                />
              </View>
              <View style={styles.policyInfo}>
                <Text
                  style={[
                    styles.policyName,
                    { color: theme.colors.text, fontFamily: theme.typography.fontFamily.medium },
                  ]}
                >
                  {policy.name}
                </Text>
                <Text
                  style={[
                    styles.policyType,
                    { color: theme.colors.gray[500], fontFamily: theme.typography.fontFamily.regular },
                  ]}
                >
                  {policy.type.charAt(0).toUpperCase() + policy.type.slice(1)} Insurance
                </Text>
              </View>
              <Text
                style={[
                  styles.policyCoverage,
                  { color: theme.colors.primary, fontFamily: theme.typography.fontFamily.bold },
                ]}
              >
                {formatCurrency(policy.coverageAmount)}
              </Text>
            </View>

            <View style={styles.policyDetails}>
              <View style={styles.policyDetail}>
                <Text
                  style={[
                    styles.policyDetailLabel,
                    { color: theme.colors.gray[500], fontFamily: theme.typography.fontFamily.regular },
                  ]}
                >
                  Premium
                </Text>
                <Text
                  style={[
                    styles.policyDetailValue,
                    { color: theme.colors.text, fontFamily: theme.typography.fontFamily.medium },
                  ]}
                >
                  {formatCurrency(policy.premium)}/year
                </Text>
              </View>

              <View style={styles.policyDetail}>
                <Text
                  style={[
                    styles.policyDetailLabel,
                    { color: theme.colors.gray[500], fontFamily: theme.typography.fontFamily.regular },
                  ]}
                >
                  Valid Till
                </Text>
                <Text
                  style={[
                    styles.policyDetailValue,
                    { color: theme.colors.text, fontFamily: theme.typography.fontFamily.medium },
                  ]}
                >
                  {formatDate(policy.endDate)}
                </Text>
              </View>
            </View>
          </Card>
        ))
      )}

      <Text
        style={[
          styles.sectionTitle,
          { color: theme.colors.text, fontFamily: theme.typography.fontFamily.bold, marginTop: theme.spacing.l },
        ]}
      >
        Quick Actions
      </Text>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate("NewClaim" as never)}>
          <View style={[styles.actionIconContainer, { backgroundColor: `${theme.colors.primary}20` }]}>
            <Ionicons name="document-text-outline" size={24} color={theme.colors.primary} />
          </View>
          <Text
            style={[styles.actionText, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.medium }]}
          >
            File a Claim
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate("Payments" as never)}>
          <View style={[styles.actionIconContainer, { backgroundColor: `${theme.colors.primary}20` }]}>
            <Ionicons name="card-outline" size={24} color={theme.colors.primary} />
          </View>
          <Text
            style={[styles.actionText, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.medium }]}
          >
            Make Payment
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            // Navigate to support
          }}
        >
          <View style={[styles.actionIconContainer, { backgroundColor: `${theme.colors.primary}20` }]}>
            <Ionicons name="headset-outline" size={24} color={theme.colors.primary} />
          </View>
          <Text
            style={[styles.actionText, { color: theme.colors.text, fontFamily: theme.typography.fontFamily.medium }]}
          >
            Get Support
          </Text>
        </TouchableOpacity>
      </View>
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
  title: {
    fontSize: 24,
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statCard: {
    width: "31%",
    padding: 12,
  },
  statContent: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  emptyCard: {
    alignItems: "center",
    padding: 24,
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
  },
  policyCard: {
    marginBottom: 12,
  },
  policyHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  policyIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  policyInfo: {
    flex: 1,
  },
  policyName: {
    fontSize: 16,
    marginBottom: 2,
  },
  policyType: {
    fontSize: 12,
  },
  policyCoverage: {
    fontSize: 16,
  },
  policyDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  policyDetail: {
    alignItems: "flex-start",
  },
  policyDetailLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  policyDetailValue: {
    fontSize: 14,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  actionButton: {
    width: "31%",
    alignItems: "center",
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    textAlign: "center",
  },
})

export default DashboardScreen
