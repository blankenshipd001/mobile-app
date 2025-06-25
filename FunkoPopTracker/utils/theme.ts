// theme.ts
import { DarkTheme, DefaultTheme, Theme } from "@react-navigation/native";

export const MyDarkTheme: Theme = {
  ...DarkTheme,
  dark: true,
  colors: {
    ...DarkTheme.colors,
    primary: "#5C6BC0", // Indigo 500 for header/buttons
    background: "#000000", // Main background
    card: "#1C1C1E", // Header background
    text: "#FFFFFF", // Text color
    border: "#333333", // Subtle border
    notification: "#FF4081", // Optional (e.g., badge color)
  },
  fonts: {
    regular: { fontFamily: "System", fontWeight: "normal" as "normal" },
    medium: { fontFamily: "System", fontWeight: "500" as "500" },
    bold: { fontFamily: "System", fontWeight: "700" as "700" },
    heavy: { fontFamily: "System", fontWeight: "900" as "900" },
  },
};

export const MyLightTheme: Theme = {
  ...DefaultTheme,
  dark: false,
  ...DefaultTheme.colors,
  colors: {
    primary: "#5C6BC0", // Same Indigo 500
    background: "#F5F5F5", // Light background
    card: "#FFFFFF", // Header background
    text: "#000000", // Dark text
    border: "#CCCCCC",
    notification: "#FF4081", // Optional (e.g., badge color)
  },
  fonts: {
    regular: { fontFamily: "System", fontWeight: "normal" as "normal" },
    medium: { fontFamily: "System", fontWeight: "500" as "500" },
    bold: { fontFamily: "System", fontWeight: "700" as "700" },
    heavy: { fontFamily: "System", fontWeight: "900" as "900" },
  },
};
