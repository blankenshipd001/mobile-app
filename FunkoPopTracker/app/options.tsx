// app/options.tsx
import React from "react";
import { View, Text, Switch, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "@react-navigation/native";
import { useOptions } from "../context/OptionsContext";
import { useActionSheet } from "@expo/react-native-action-sheet";

export default function OptionsScreen() {
  const { colors, dark } = useTheme();
  const { options, setOptions } = useOptions();
  const { showActionSheetWithOptions } = useActionSheet();

  const handleSortOrder = () => {
    // Dynamically add ✅ to selected
    const optionLabels = [
      options.sortOrder === "name" ? "✓ Name" : "Name",
      options.sortOrder === "number" ? "✓ Number" : "Number",
      options.sortOrder === "dateAdded" ? "✓ Date Added" : "Date Added",
      "Cancel"
    ];
    const cancelButtonIndex = 3;

    showActionSheetWithOptions(
      {
        options: optionLabels,
        cancelButtonIndex,
        title: "Select Sort Order",
      },
      (selectedIndex) => {
        switch (selectedIndex) {
          case 0:
            setOptions((prev) => ({ ...prev, sortOrder: "name" }));
            break;
          case 1:
            setOptions((prev) => ({ ...prev, sortOrder: "number" }));
            break;
        //   case 2:
        //     setOptions((prev) => ({ ...prev, sortOrder: "dateAdded" }));
        //     break;
        }
      }
    );
  };

  const handleReset = () => {
    setOptions({ groupBySeries: true, compactMode: false, sortOrder: "name" });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Options</Text>

      <View style={[styles.optionCard, { backgroundColor: dark ? "#2a2a2a" : "#f9f9f9", borderColor: colors.border }]}>
        <View style={styles.optionRow}>
          <Text style={{ color: colors.text }}>Group by series</Text>
          <Switch
            value={options.groupBySeries}
            onValueChange={(value) =>
              setOptions((prev) => ({ ...prev, groupBySeries: value }))
            }
            trackColor={{ false: "#767577", true: colors.primary }}
            thumbColor={options.groupBySeries ? colors.background : "#f4f3f4"}
          />
        </View>

        <View style={styles.optionRow}>
          <Text style={{ color: colors.text }}>Compact mode</Text>
          <Switch
            value={options.compactMode}
            onValueChange={(value) =>
              setOptions((prev) => ({ ...prev, compactMode: value }))
            }
            trackColor={{ false: "#767577", true: colors.primary }}
            thumbColor={options.compactMode ? colors.background : "#f4f3f4"}
          />
        </View>

        <TouchableOpacity style={styles.optionRow} onPress={handleSortOrder}>
          <Text style={{ color: colors.text }}>Sort order</Text>
          <Text style={{ color: colors.primary, textTransform: "capitalize" }}>
            {options.sortOrder}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.resetButton, { borderColor: colors.primary }]}
        onPress={handleReset}
      >
        <Text style={[styles.resetButtonText, { color: colors.primary }]}>
          Reset to defaults
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  optionCard: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ccc",
  },
  resetButton: {
    marginTop: 30,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
