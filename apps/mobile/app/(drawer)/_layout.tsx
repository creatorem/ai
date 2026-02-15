import React from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useColorScheme } from "react-native";
import { DrawerProvider } from "~/components/context/drawer-context";
import { Drawer } from "expo-router/drawer";
import { DrawerContent } from "~/components/drawer-content";
import { AiProvider } from "@creatorem/ai-react-native/ai-provider";
import { useCSSVariable } from "uniwind";
import { fetch as expoFetch } from "expo/fetch";
import { appNativeComponents } from "~/components/ai-chat/components-provider";

export const drawerRef = React.createRef();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const backgroundColor = useCSSVariable("--color-background");

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AiProvider
        components={appNativeComponents}
        chatOptions={{
          transportOptions: {
            api: "http://localhost:3000/api/chat",
            fetch: expoFetch as unknown as typeof globalThis.fetch,
          },
        }}
      >
        <DrawerProvider>
          <Drawer
            ref={drawerRef}
            screenOptions={{
              headerShown: false,
              drawerType: "slide",
              drawerPosition: "left",
              drawerStyle: {
                backgroundColor,
                width: "85%",
                flex: 1,
              },
              overlayColor: "rgba(0,0,0, 0.4)",
              swipeEdgeWidth: 100,
            }}
            drawerContent={() => <DrawerContent />}
          >
            <Drawer.Screen
              name="index"
              options={{
                title: "Menu",
                drawerLabel: "Menu",
              }}
            />
          </Drawer>
        </DrawerProvider>
      </AiProvider>
    </ThemeProvider>
  );
}
