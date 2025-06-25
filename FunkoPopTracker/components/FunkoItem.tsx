import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@react-navigation/native";

//Refactor this component to use the useThemeColor hook
// and remove the direct use of colors from the theme. 

export const FunkoItem = ({ item, onEdit, onDelete }: any) => {
  const { colors, dark } = useTheme();

  if (!item) {
    return null;
  }

  return (
    <View style={[styles.funkoCard, { backgroundColor: colors.card }]}>
      <View style={styles.funkoImageContainer}>
        {item.image_uri ? (
          <Image source={{ uri: item.image_uri }} style={styles.funkoImage} />
        ) : (
          <View style={[styles.noImage, { backgroundColor: dark ? "#2a2a2a" : "#f8f9fa" }]}>
            <Ionicons name="image-outline" size={40} color={colors.border} />
          </View>
        )}
      </View>
      <View style={styles.funkoInfo}>
        <Text style={[styles.funkoName, { color: colors.text }]}>{item.name}</Text>
        {item.series && (
          <Text style={[styles.funkoSeries, { color: colors.primary }]}>{item.series}</Text>
        )}
        {item.number && (
          <Text style={[styles.funkoNumber, { color: colors.text + "AA" }]}>#{item.number}</Text>
        )}
        {item.notes && (
          <Text style={[styles.funkoNotes, { color: colors.text + "88" }]} numberOfLines={2}>
            {item.notes}
          </Text>
        )}
      </View>
      <View style={styles.funkoActions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => onEdit(item)}>
          <Ionicons name="pencil" size={20} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => onDelete(item)}>
          <Ionicons name="trash" size={20} color="#FF3333" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  funkoCard: {
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
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
    marginBottom: 4,
  },
  funkoSeries: {
    fontSize: 14,
    marginBottom: 2,
  },
  funkoNumber: {
    fontSize: 14,
    marginBottom: 4,
  },
  funkoNotes: {
    fontSize: 12,
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
});
