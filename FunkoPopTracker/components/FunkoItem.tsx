import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@react-navigation/native";

export const FunkoItem = ({ item, onEdit, onDelete, compact = false }: any) => {
  const { colors, dark } = useTheme();

  if (!item) {
    return null;
  }

  return (
    <View style={[styles.funkoCard, { backgroundColor: colors.card }, compact && styles.funkoCardCompact]}>
      <View style={[styles.funkoImageContainer, compact && styles.funkoImageContainerCompact]}>
        {item.image_uri ? (
          <Image
            source={{ uri: item.image_uri }}
            style={[styles.funkoImage, compact && styles.funkoImageCompact]}
          />
        ) : (
          <View style={[styles.noImage, { backgroundColor: dark ? "#2a2a2a" : "#f8f9fa" }]}>
            <Ionicons name="image-outline" size={compact ? 24 : 40} color={colors.border} />
          </View>
        )}
      </View>

      <View style={[styles.funkoInfo, compact && styles.funkoInfoCompact]}>
        <Text style={[styles.funkoName, { color: colors.text }, compact && styles.funkoNameCompact]}>
          {item.name}
        </Text>
        {item.series && (
          <Text style={[styles.funkoSeries, { color: colors.primary }, compact && styles.funkoSeriesCompact]}>
            {item.series}
          </Text>
        )}
        {item.number && (
          <Text style={[styles.funkoNumber, { color: colors.text + "AA" }, compact && styles.funkoNumberCompact]}>
            #{item.number}
          </Text>
        )}
        {item.notes && !compact && (
          <Text style={[styles.funkoNotes, { color: colors.text + "88" }]} numberOfLines={2}>
            {item.notes}
          </Text>
        )}
      </View>

      {!compact && (
        <View style={styles.funkoActions}>
          <TouchableOpacity style={styles.actionButton} onPress={() => onEdit(item)}>
            <Ionicons name="pencil" size={20} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => onDelete(item)}>
            <Ionicons name="trash" size={20} color={dark ? "#FF4C4C" : "#FF3333"} />
          </TouchableOpacity>
        </View>
      )}
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
  funkoCardCompact: {
    padding: 8,
    marginBottom: 8,
  },
  funkoImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: "hidden",
    marginRight: 15,
  },
  funkoImageContainerCompact: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  funkoImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  funkoImageCompact: {
    borderRadius: 6,
  },
  noImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  funkoInfo: {
    flex: 1,
    paddingRight: 10,
  },
  funkoInfoCompact: {
    paddingRight: 5,
  },
  funkoName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  funkoNameCompact: {
    fontSize: 14,
    marginBottom: 2,
  },
  funkoSeries: {
    fontSize: 14,
    marginBottom: 2,
  },
  funkoSeriesCompact: {
    fontSize: 12,
  },
  funkoNumber: {
    fontSize: 14,
    marginBottom: 4,
  },
  funkoNumberCompact: {
    fontSize: 12,
    marginBottom: 2,
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
