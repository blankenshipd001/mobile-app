// FunkoDetailsScreen.tsx

import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFunkos } from "@/hooks/useFunkos";
import AddFunkoForm from "@/components/AddFunkoForm";
import { Funko } from "@/utils/funko";
import { useTheme } from "@react-navigation/native";

type SearchParamType = {
  id: string;
};

export default function FunkoDetailsScreen() {
  const { id } = useLocalSearchParams<SearchParamType>();
  const { getFunkoById, removeFunko, editFunko } = useFunkos();
  const router = useRouter();
  const navigation = useNavigation();
  const { dark, colors } = useTheme();

  const [funko, setFunko] = useState<Funko | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadFunko = async () => {
      setLoading(true);
      const data = await getFunkoById(id);
      if (!data) {
        Alert.alert("Not found", "Funko Pop not found.");
        router.back();
        return;
      }
      setFunko(data);
      navigation.setOptions({
        title: `${data.name}: ${data.number}` || "Funko Pop Details",
      });
      setLoading(false);
    };

    if (id) {
      loadFunko();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleEdit = () => setShowEditModal(true);
  const handleCancelEdit = () => setShowEditModal(false);

  const handleUpdate = async (updatedFunko: Funko) => {
    if (!updatedFunko.id) { 
      return Promise.reject(new Error("Missing Funko ID")); 
    }
    
    try {
      await editFunko(updatedFunko.id, updatedFunko);
      setFunko(updatedFunko);
      setShowEditModal(false);
      return true;
    } catch (error) {
      console.error("Error updating Funko:", error);
      return Promise.reject(error);
    }
  };

  const handleDelete = () => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this Funko?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          if (!funko?.id) return;
          await removeFunko(funko.id);
          router.replace("/");
        },
      },
    ]);
  };

  const styles = createStyles(colors);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading Funko Pop...</Text>
      </View>
    );
  }

  if (!funko) return null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {funko.image_uri ? (
        <Image source={{ uri: funko.image_uri }} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Ionicons name="image-outline" size={100} color={colors.border} />
        </View>
      )}

      <View style={styles.infoContainer}>
        <Text style={styles.name}>{funko.name}</Text>
        {funko.series && <Text style={styles.series}>Series: {funko.series}</Text>}
        {funko.number && <Text style={styles.number}>Number: #{funko.number}</Text>}
        {funko.purchase_price && <Text style={styles.number}>Purchase Price: ${funko.purchase_price}</Text>}
        {funko.barcode && <Text style={styles.barcode}>Barcode: {funko.barcode}</Text>}
        {funko.notes && (
          <View style={styles.notesRow}>
            <Ionicons name="document-text-outline" size={20} color={colors.text} style={{ marginRight: 8 }} />
            <Text style={styles.notes}>{funko.notes}</Text>
          </View>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Ionicons name="pencil" size={20} color="#fff" />
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity style={dark ? styles.darkDeleteButton : styles.deleteButton} onPress={handleDelete}>
          <Ionicons name="trash" size={20} color={"#fff"} />
          <Text style={styles.editButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showEditModal}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={handleCancelEdit}
      >
        <AddFunkoForm
          initialData={funko}
          isEditing
          onSubmit={handleUpdate}
          onCancel={handleCancelEdit}
        />
      </Modal>
    </ScrollView>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      paddingBottom: 40,
      paddingHorizontal: 20,
      paddingTop: 20,
      backgroundColor: colors.background,
    },
    image: {
      width: "100%",
      height: 300,
      borderRadius: 10,
      resizeMode: "contain",
      marginBottom: 20,
    },
    imagePlaceholder: {
      width: "100%",
      height: 300,
      borderRadius: 10,
      backgroundColor: colors.card,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 20,
    },
    infoContainer: {
      gap: 10,
    },
    name: {
      fontSize: 28,
      fontWeight: "bold",
      color: colors.text,
    },
    series: {
      fontSize: 18,
      color: colors.text,
    },
    number: {
      fontSize: 18,
      color: colors.text,
    },
    barcode: {
      fontSize: 16,
      color: colors.text + "99",
    },
    notesRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginTop: 10,
    },
    notes: {
      fontSize: 16,
      fontStyle: "italic",
      color: colors.text,
      flex: 1,
      flexWrap: "wrap",
    },
    actions: {
      marginTop: 30,
      flexDirection: "row",
      justifyContent: "space-around",
    },
    editButton: {
      flexDirection: "row",
      backgroundColor: colors.primary,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 10,
      alignItems: "center",
      gap: 8,
    },
    darkDeleteButton: {
      flexDirection: "row",
      backgroundColor: "#FF4C4C",
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 10,
      alignItems: "center",
      gap: 8,
    },
    deleteButton: {
      flexDirection: "row",
      backgroundColor: "#FF3B30",
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 10,
      alignItems: "center",
      gap: 8,
    },
    editButtonText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 16,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
      backgroundColor: colors.background,
    },
    loadingText: {
      marginTop: 10,
      fontSize: 16,
      color: colors.text,
    },
  });
