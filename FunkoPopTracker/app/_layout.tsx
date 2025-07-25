import React from "react";
import { ThemeProvider } from "@react-navigation/native";
import "react-native-reanimated";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { MyDarkTheme, MyLightTheme } from "@/utils/theme";
import { useColorScheme } from "@/hooks/useColorScheme";
import { OptionsProvider } from "../context/OptionsContext";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import Toast from "react-native-toast-message";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <>
      <ThemeProvider
        value={colorScheme === "dark" ? MyDarkTheme : MyLightTheme}
      >
        <ActionSheetProvider>
          <OptionsProvider>
            <Stack>
              <Stack.Screen name="index" options={{ title: "Home" }} />
              <Stack.Screen name="+not-found" />
              <Stack.Screen
                name="[id]"
                options={({
                  route,
                }: {
                  route: { params?: { name?: string } };
                }) => ({
                  title: route.params?.name || "Details",
                })}
              />
            </Stack>
            <StatusBar style="auto" />
          </OptionsProvider>
        </ActionSheetProvider>

        <Toast />
      </ThemeProvider>
    </>
  );
}
