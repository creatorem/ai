import "../global.css";
import React from "react";
import { Stack } from "expo-router";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider, useTheme } from "~/components/context/theme-provider";

function ThemedLayout() {
  const { isDark } = useTheme();

  return (
    <>
      <StatusBar
        style={isDark ? "dark" : "light"}
        backgroundColor="transparent"
        translucent={true}
      />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView
      className={`bg-light-primary dark:bg-dark-primary ${Platform.OS === "ios" ? "pb-0" : ""}`}
      style={{ flex: 1 }}
    >
      <ThemeProvider>
        <ThemedLayout />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
