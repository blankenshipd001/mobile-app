import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
  SafeAreaView,
  StatusBar,
  TextInput,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useFunkos } from "../hooks/useFunkos";
import { Funko } from "@/utils/funko";
import AddFunkoForm from "../components/AddFunkoForm";
import { FunkoItem } from "../components/FunkoItem";
import { HomePageHeader } from "@/components/HomePageHeader";

export default function HomeScreen() {
  const { colors, dark } = useTheme();
  const { funkos, loading, addFunko, removeFunko, editFunko } = useFunkos();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingFunko, setEditingFunko] = useState<Funko | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const filteredFunkos = funkos.filter(
    (f) =>
      (typeof f.name === "string" &&
        f.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (f.number !== undefined && f.number.toString().includes(searchQuery))
  );

  const handleAddFunko = async (funkoData: Funko) => {
    const success = await addFunko(funkoData);
    if (success) setShowAddForm(false);
    return success;
  };

  const handleEditFunko = async (funkoData: Funko) => {
    if (!editingFunko?.id) return false;
    const success = await editFunko(editingFunko.id, funkoData);
    if (success) setEditingFunko(null);
    return success;
  };

  const handleDeleteFunko = (funko: Funko) => {
    Alert.alert(
      "Delete Funko Pop",
      `Are you sure you want to delete "${funko.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => removeFunko(funko.id),
        },
      ]
    );
  };

  const renderFunkoItem = ({ item }: any) => (
    <TouchableOpacity onPress={() => router.push(`/funko/${item.id}`)} activeOpacity={0.8}>
      <FunkoItem item={item} onEdit={() => setEditingFunko(item)} onDelete={() => handleDeleteFunko(item)}/>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="cube-outline" size={80} color={colors.border} />
      <Text style={[styles.emptyStateText, { color: colors.text }]}>No Funko Pops yet!</Text>
      <Text style={[styles.emptyStateSubtext, { color: colors.text + "AA" }]}>
        Scan a barcode or add one manually to get started
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading your collection...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={dark ? "light-content" : "dark-content"} backgroundColor={colors.primary} />

      <View style={[styles.searchContainer, { backgroundColor: dark ? "#1e1e1e" : "#fff", borderColor: colors.border }]}>
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search by name or number"
          placeholderTextColor={colors.text + "88"}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Ionicons name="search" size={20} color={colors.text} />
      </View>

      <HomePageHeader count={filteredFunkos.length} />

      <FlatList
        data={filteredFunkos}
        keyExtractor={(item: Funko) => item.id.toString()}
        renderItem={renderFunkoItem}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={
          funkos.length === 0 ? styles.emptyListContainer : styles.listContainer
        }
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.fab}>
        <TouchableOpacity style={[styles.fabButton, { backgroundColor: colors.primary}]} onPress={() => setShowAddForm(true)}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <Modal visible={showAddForm} animationType="slide" presentationStyle="fullScreen">
        <AddFunkoForm onSubmit={handleAddFunko} onCancel={() => setShowAddForm(false)} initialData={{ barcode: "" }} />
      </Modal>

      <Modal visible={!!editingFunko} animationType="slide" presentationStyle="fullScreen">
        <AddFunkoForm
          onSubmit={handleEditFunko}
          onCancel={() => setEditingFunko(null)}
          initialData={editingFunko}
          isEditing
        />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
  },
  listContainer: {
    padding: 15,
    paddingBottom: 100,
  },
  emptyListContainer: {
    flex: 1,
    padding: 15,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
  },
  emptyStateText: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "center",
  },
  emptyStateSubtext: {
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
    lineHeight: 22,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
  },
  fabButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginRight: 8,
    paddingVertical: Platform.OS === "ios" ? 6 : 2,
  },
});
