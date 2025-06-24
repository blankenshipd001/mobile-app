import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
  Modal,
  SafeAreaView,
  StatusBar,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useFunkos } from "../hooks/useFunkos";
import { Funko } from "@/utils/funko";
import AddFunkoForm from "../components/AddFunkoForm";

export default function HomeScreen() {
  const { colors } = useTheme();
  const { funkos, loading, addFunko, removeFunko, editFunko } = useFunkos();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingFunko, setEditingFunko] = useState<Funko | null>(null);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // Filtered list using name or number
  const filteredFunkos = funkos.filter(
    (f) =>
      (typeof f.name === "string" &&
        f.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (f.number !== undefined && f.number.toString().includes(searchQuery))
  );

  const handleAddFunko = async (funkoData: Funko) => {
    const dataWithBarcode = {
      ...funkoData,
      barcode: funkoData.barcode,
    };
    
    const success = await addFunko(dataWithBarcode);

    if (success) {
      setShowAddForm(false);
    }
    
    return success;
  };

  const handleEditFunko = async (funkoData: Funko) => {
    if (!editingFunko || !editingFunko.id) {
      return false;
    }

    const success = await editFunko(editingFunko.id, funkoData);
    
    if (success) {
      setEditingFunko(null);
    }
    
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

  const startEdit = (funko: Funko) => {
    setEditingFunko(funko);
  };

  const cancelEdit = () => {
    setEditingFunko(null);
  };

  const cancelAdd = () => {
    setShowAddForm(false);
  };

  const renderFunkoItem = ({ item }: any) => (
    <TouchableOpacity
      onPress={() => router.push(`/funko/${item.id}`)}
      activeOpacity={0.8}
    >
      <View style={styles.funkoCard}>
        <View style={styles.funkoImageContainer}>
          {item.image_uri ? (
            <Image source={{ uri: item.image_uri }} style={styles.funkoImage} />
          ) : (
            <View style={styles.noImage}>
              <Ionicons name="image-outline" size={40} color="#999" />
            </View>
          )}
        </View>

        <View style={styles.funkoInfo}>
          <Text style={styles.funkoName}>{item.name}</Text>
          {item.series && <Text style={styles.funkoSeries}>{item.series}</Text>}
          {item.number && (
            <Text style={styles.funkoNumber}>#{item.number}</Text>
          )}
          {item.notes && (
            <Text style={styles.funkoNotes} numberOfLines={2}>
              {item.notes}
            </Text>
          )}
        </View>

        <View style={styles.funkoActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => startEdit(item)}
          >
            <Ionicons name="pencil" size={20} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDeleteFunko(item)}
          >
            <Ionicons name="trash" size={20} color="#FF3333" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="cube-outline" size={80} color="#ccc" />
      <Text style={styles.emptyStateText}>No Funko Pops yet!</Text>
      <Text style={styles.emptyStateSubtext}>
        Scan a barcode or add one manually to get started
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading your collection...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* <StatusBar style={colors.text === '#fff' ? 'light' : 'dark'} /> */}
      <StatusBar barStyle="light-content" backgroundColor="#007AFF" />

      {/* Search Input */}
      <View style={[styles.searchContainer, { borderColor: colors.border }]}>
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search by name or number"
          placeholderTextColor={colors.text + "88"}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Ionicons name="search" size={20} color={colors.text} />
      </View>

      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Text style={[styles.headerTitle, { color: colors.background }]}>
          My Funko Collection
        </Text>
        <Text style={[styles.headerSubtitle, { color: colors.background }]}>
          {filteredFunkos.length}{" "}
          {filteredFunkos.length === 1 ? "item" : "items"}
        </Text>
      </View>

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
        <TouchableOpacity
          style={styles.fabButton}
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
          onCancel={cancelAdd}
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
          onCancel={cancelEdit}
          initialData={editingFunko}
          isEditing={true}
        />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "#666",
  },
  header: {
    backgroundColor: "#007AFF",
    padding: 20,
    paddingBottom: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    marginTop: 5,
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
    color: "#333",
    marginTop: 20,
    textAlign: "center",
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
    textAlign: "center",
    lineHeight: 22,
  },
  funkoCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  funkoImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: "hidden",
    marginRight: 15,
  },
  funkoImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  noImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
    alignItems: "center",
  },
  funkoInfo: {
    flex: 1,
    paddingRight: 10,
  },
  funkoName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  funkoSeries: {
    fontSize: 14,
    color: "#007AFF",
    marginBottom: 2,
  },
  funkoNumber: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  funkoNotes: {
    fontSize: 12,
    color: "#999",
    fontStyle: "italic",
  },
  funkoActions: {
    flexDirection: "column",
    alignItems: "center",
  },
  actionButton: {
    padding: 8,
    marginVertical: 2,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    flexDirection: "column",
  },
  fabButton: {
    backgroundColor: "#007AFF",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
    backgroundColor: "rgba(255,255,255,0.9)", // will be overridden with theme
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginRight: 8,
    paddingVertical: 4,
  },
});
