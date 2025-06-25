import React from "react";
import {
  View,
  StyleSheet,
  Text,
} from "react-native";
import { useTheme } from "@react-navigation/native";

interface HomePageHeaderProps {
  count: number;
}

export const HomePageHeader: React.FC<HomePageHeaderProps> = ({ count }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.header, { backgroundColor: colors.primary }]}>
      <Text style={[styles.headerTitle, { color: colors.background }]}>
        My Funko Collection
      </Text>
      <Text
        style={[styles.headerSubtitle, { color: colors.background + "CC" }]}
      >
        {count} {count === 1 ? "item" : "items"}
      </Text>
    </View>
  );
};


const styles = StyleSheet.create({
  header: {
    padding: 10,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 5,
  },
});
