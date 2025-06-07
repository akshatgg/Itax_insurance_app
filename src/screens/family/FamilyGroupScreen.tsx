"use client"

import { useState } from "react"
import { View, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native"
import { Text, Card, Button, FAB, Menu, Divider, Searchbar, Chip, useTheme } from "react-native-paper"
import { Ionicons } from "@expo/vector-icons"
import * as Animatable from "react-native-animatable"
import { useNavigation } from "@react-navigation/native"
import { useFamily } from "../../contexts/FamilyContext"
import { useAuth } from "../../contexts/AuthContext"
import EmptyState from "../../components/common/EmptyState"

const FamilyGroupScreen = () => {
  const { familyMembers, familyGroup, isLoading, sortFamilyMembers, deleteFamilyMember } = useFamily()
  const { user } = useAuth()
  const navigation = useNavigation()
  const theme = useTheme()

  const [searchQuery, setSearchQuery] = useState("")
  const [sortMenuVisible, setSortMenuVisible] = useState(false)
  const [filterMenuVisible, setFilterMenuVisible] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null)

  const openSortMenu = () => setSortMenuVisible(true)
  const closeSortMenu = () => setSortMenuVisible(false)

  const openFilterMenu = () => setFilterMenuVisible(true)
  const closeFilterMenu = () => setFilterMenuVisible(false)

  const handleSort = (sortBy: "name" | "relationship" | "age") => {
    sortFamilyMembers(sortBy)
    closeSortMenu()
  }

  const handleFilter = (filter: string | null) => {
    setSelectedFilter(filter)
    closeFilterMenu()
  }

  const handleDeleteMember = (id: string, name: string) => {
    Alert.alert("Delete Family Member", `Are you sure you want to remove ${name} from your family group?`, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteFamilyMember(id)
            Alert.alert("Success", `${name} has been removed from your family group.`)
          } catch (error: any) {
            Alert.alert("Error", error.message)
          }
        },
      },
    ])
  }

  const onChangeSearch = (query: string) => setSearchQuery(query)

  const filteredMembers = familyMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.relationship.toLowerCase().includes(searchQuery.toLowerCase())

    if (selectedFilter) {
      return matchesSearch && member.relationship === selectedFilter
    }

    return matchesSearch
  })

  const relationships = Array.from(new Set(familyMembers.map((member) => member.relationship)))

  const isOwner = familyGroup && user ? familyGroup.ownerId === user.id : false

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading family members...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Family Group</Text>
        <View style={styles.headerActions}>
          <Menu
            visible={sortMenuVisible}
            onDismiss={closeSortMenu}
            anchor={
              <TouchableOpacity onPress={openSortMenu} style={styles.headerButton}>
                <Ionicons name="funnel-outline" size={22} color={theme.colors.primary} />
              </TouchableOpacity>
            }
          >
            <Menu.Item onPress={() => handleSort("name")} title="Sort by Name" />
            <Menu.Item onPress={() => handleSort("relationship")} title="Sort by Relationship" />
            <Menu.Item onPress={() => handleSort("age")} title="Sort by Age" />
          </Menu>

          <Menu
            visible={filterMenuVisible}
            onDismiss={closeFilterMenu}
            anchor={
              <TouchableOpacity onPress={openFilterMenu} style={styles.headerButton}>
                <Ionicons name="filter-outline" size={22} color={theme.colors.primary} />
              </TouchableOpacity>
            }
          >
            <Menu.Item onPress={() => handleFilter(null)} title="All Members" />
            <Divider />
            {relationships.map((relationship) => (
              <Menu.Item key={relationship} onPress={() => handleFilter(relationship)} title={relationship} />
            ))}
          </Menu>
        </View>
      </View>

      <Searchbar
        placeholder="Search family members..."
        onChangeText={onChangeSearch}
        value={searchQuery}
        style={styles.searchBar}
        iconColor={theme.colors.primary}
      />

      {selectedFilter && (
        <View style={styles.filterChipContainer}>
          <Chip
            icon="filter"
            onClose={() => handleFilter(null)}
            style={{ backgroundColor: `${theme.colors.primary}20` }}
          >
            {selectedFilter}
          </Chip>
        </View>
      )}

      {familyMembers.length === 0 ? (
        <EmptyState
          icon="people"
          title="No Family Members Yet"
          description="Add your family members to manage their insurance policies and benefits."
          buttonText="Add Family Member"
          onButtonPress={() => navigation.navigate("AddFamilyMember" as never)}
        />
      ) : filteredMembers.length === 0 ? (
        <EmptyState
          icon="search"
          title="No Results Found"
          description="Try adjusting your search or filters to find family members."
          buttonText="Clear Filters"
          onButtonPress={() => {
            setSearchQuery("")
            setSelectedFilter(null)
          }}
        />
      ) : (
        <FlatList
          data={filteredMembers}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item, index }) => (
            <Animatable.View animation="fadeInUp" delay={index * 100} duration={500} style={styles.cardContainer}>
              <Card
                style={styles.card}
                onPress={() => navigation.navigate("FamilyMemberDetails" as never, { memberId: item.id } as never)}
              >
                <Card.Content style={styles.cardContent}>
                  <View style={styles.memberInfo}>
                    <View style={[styles.avatarContainer, { backgroundColor: `${theme.colors.primary}20` }]}>
                      <Text style={[styles.avatarText, { color: theme.colors.primary }]}>{item.name.charAt(0)}</Text>
                    </View>
                    <View style={styles.memberDetails}>
                      <Text style={styles.memberName}>{item.name}</Text>
                      <Text style={styles.memberRelationship}>{item.relationship}</Text>
                      {item.isDependent && (
                        <Chip style={styles.dependentChip} textStyle={{ fontSize: 12 }}>
                          Dependent
                        </Chip>
                      )}
                    </View>
                  </View>

                  <View style={styles.policiesContainer}>
                    <Text style={styles.policiesTitle}>Policies:</Text>
                    <View style={styles.policiesList}>
                      {item.policies.length > 0 ? (
                        item.policies.map((policy, i) => (
                          <Chip key={i} style={styles.policyChip} textStyle={{ fontSize: 12 }}>
                            {policy}
                          </Chip>
                        ))
                      ) : (
                        <Text style={styles.noPoliciesText}>No policies</Text>
                      )}
                    </View>
                  </View>
                </Card.Content>
                <Card.Actions style={styles.cardActions}>
                  <Button
                    mode="text"
                    onPress={() => navigation.navigate("FamilyMemberDetails" as never, { memberId: item.id } as never)}
                    labelStyle={{ color: theme.colors.primary }}
                  >
                    View Details
                  </Button>
                  {isOwner && (
                    <Button
                      mode="text"
                      onPress={() => handleDeleteMember(item.id, item.name)}
                      labelStyle={{ color: theme.colors.error }}
                    >
                      Remove
                    </Button>
                  )}
                </Card.Actions>
              </Card>
            </Animatable.View>
          )}
        />
      )}

      <FAB
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        icon="plus"
        onPress={() => navigation.navigate("AddFamilyMember" as never)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  headerActions: {
    flexDirection: "row",
    gap: 10,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  searchBar: {
    marginHorizontal: 20,
    marginBottom: 10,
    elevation: 2,
    borderRadius: 10,
    backgroundColor: "#f5f5f5",
  },
  filterChipContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  listContainer: {
    padding: 20,
    paddingBottom: 80, // Extra space for FAB
  },
  cardContainer: {
    marginBottom: 16,
  },
  card: {
    borderRadius: 12,
    elevation: 2,
  },
  cardContent: {
    padding: 16,
  },
  memberInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  memberDetails: {
    flex: 1,
  },
  memberName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  memberRelationship: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  dependentChip: {
    alignSelf: "flex-start",
    backgroundColor: "#e6fffa",
    height: 24,
  },
  policiesContainer: {
    marginTop: 8,
  },
  policiesTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
  },
  policiesList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  policyChip: {
    backgroundColor: "#f5f5f5",
    height: 24,
  },
  noPoliciesText: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
  },
  cardActions: {
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
})

export default FamilyGroupScreen
