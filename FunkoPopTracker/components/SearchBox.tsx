import React from "react";
import {
    Platform,
    StyleSheet,
    TextInput,
  View
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

interface SearchBoxProps {
    doSearch: (text: string) => void;
    searchString: string;
}

export const SearchBox: React.FC<SearchBoxProps> = ({ doSearch, searchString }) => {
  const { colors, dark } = useTheme();

    return (
              <View
        style={[
          styles.searchContainer,
          {
            backgroundColor: dark ? "#1e1e1e" : "#fff",
            borderColor: colors.border,
          },
        ]}
      >
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search by name or number"
          placeholderTextColor={colors.text + "88"}
          value={searchString}
          onChangeText={doSearch}
        />
        <Ionicons name="search" size={20} color={colors.text} />
      </View>
    )
}

const styles = StyleSheet.create({
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