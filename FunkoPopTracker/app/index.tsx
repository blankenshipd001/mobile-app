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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useFunkos } from "../hooks/useFunkos";
import { Funko } from "@/utils/funko";
import { AddFunkoForm } from "../components/AddFunkoForm";
import { FunkoItem } from "../components/FunkoItem";
import { useOptions } from "../context/OptionsContext";
import { HomePageHeader } from "@/components/HomePageHeader";
import { SearchBox } from "@/components/SearchBox";

export default function HomeScreen() {
  const { colors, dark } = useTheme();
  const { funkos, loading, addFunko, removeFunko, editFunko } = useFunkos();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingFunko, setEditingFunko] = useState<Funko | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSeries, setExpandedSeries] = useState<string[]>([]);
  const router = useRouter();
  const { options, loading: optionsLoading } = useOptions();

  const filteredFunkos = funkos
    .filter(
      (f) =>
        (typeof f.name === "string" &&
          f.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (f.number !== undefined && f.number.toString().includes(searchQuery))
    )
    .sort((a, b) => {
      if (options.sortOrder === "name") {
        return (a.name ?? "").localeCompare(b.name ?? "");
      } else if (options.sortOrder === "number") {
        return (Number(a.number) || 0) - (Number(b.number) || 0);
      }
      return 0;
    });

  // Group and sort series alphabetically
  const groupedBySeries = filteredFunkos.reduce((acc, funko) => {
    const seriesKey = funko.series ?? "Unknown";
    if (!acc[seriesKey]) acc[seriesKey] = [];
    acc[seriesKey].push(funko);
    return acc;
  }, {} as Record<string, Funko[]>);
  const groupedSeriesArray = Object.entries(groupedBySeries).sort(([a], [b]) =>
    a.localeCompare(b)
  );

  const toggleSeries = (series: string) => {
    setExpandedSeries((prev) =>
      prev.includes(series)
        ? prev.filter((s) => s !== series)
        : [...prev, series]
    );
  };

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

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="cube-outline" size={80} color={colors.border} />
      <Text style={[styles.emptyStateText, { color: colors.text }]}>
        No Funko Pops yet!
      </Text>
      <Text style={[styles.emptyStateSubtext, { color: colors.text + "AA" }]}>
        Scan a barcode or add one manually to get started
      </Text>
    </View>
  );

  if (loading || optionsLoading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Loading your collection...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar
        barStyle={dark ? "light-content" : "dark-content"}
        backgroundColor={colors.primary}
      />
      <HomePageHeader count={filteredFunkos.length} />
      <SearchBox searchString={searchQuery} doSearch={setSearchQuery} />

      {options.groupBySeries ? (
        <FlatList
          data={groupedSeriesArray}
          keyExtractor={([series]) => series}
          renderItem={({ item: [series, items] }) => (
            <View style={{ marginBottom: 12 }}>
              <TouchableOpacity
                onPress={() => toggleSeries(series)}
                activeOpacity={0.8}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: colors.card,
                  borderRadius: 8,
                  padding: 12,
                  borderWidth: 1,
                  borderColor: colors.border,
                  marginBottom: 8,
                }}
              >
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                >
                  {series}
                </Text>
                <Ionicons
                  name={
                    expandedSeries.includes(series)
                      ? "chevron-up"
                      : "chevron-down"
                  }
                  size={18}
                  color={colors.text}
                />
              </TouchableOpacity>

              {expandedSeries.includes(series) && (
                <FlatList
                  data={items}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => router.push(`/funko/${item.id}`)}
                      activeOpacity={0.8}
                    >
                      <FunkoItem
                        item={item}
                        compact={options.compactMode}
                        onEdit={() => setEditingFunko(item)}
                        onDelete={() => handleDeleteFunko(item)}
                      />
                    </TouchableOpacity>
                  )}
                  scrollEnabled={false}
                  contentContainerStyle={{ paddingVertical: 8 }}
                />
              )}
            </View>
          )}
          contentContainerStyle={
            funkos.length === 0
              ? styles.emptyListContainer
              : styles.listContainer
          }
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
        />
      ) : (
        <FlatList
          data={filteredFunkos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push(`/funko/${item.id}`)}
              activeOpacity={0.8}
            >
              <FunkoItem
                item={item}
                compact={options.compactMode}
                onEdit={() => setEditingFunko(item)}
                onDelete={() => handleDeleteFunko(item)}
              />
            </TouchableOpacity>
          )}
          contentContainerStyle={
            funkos.length === 0
              ? styles.emptyListContainer
              : styles.listContainer
          }
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
        />
      )}

      <View style={styles.fab}>
        <TouchableOpacity
          style={[styles.fabButton, { backgroundColor: colors.primary }]}
          onPress={() => setShowAddForm(true)}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <Modal
        visible={showAddForm}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <AddFunkoForm
          onSubmit={handleAddFunko}
          onCancel={() => setShowAddForm(false)}
          initialData={{ barcode: "" }}
        />
      </Modal>

      <Modal
        visible={!!editingFunko}
        animationType="slide"
        presentationStyle="fullScreen"
      >
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

// styles unchanged
const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { fontSize: 18 },
  listContainer: { padding: 15, paddingBottom: 100 },
  emptyListContainer: { flex: 1, padding: 15 },
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
  fab: { position: "absolute", bottom: 30, right: 20 },
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
});
