import '../global.css';
import React from 'react';
import { Stack } from 'expo-router';
import { Platform, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';

function ThemedLayout() {
      const colorScheme = useColorScheme();
      
      return (
        <>
          <StatusBar
          style={colorScheme === 'dark' ? 'dark' : 'light'}
          backgroundColor="transparent"
          translucent={true}
          />
          <Stack screenOptions={{
            headerShown: false
          }}>
            <Stack.Screen
              name="(drawer)"
              options={{ headerShown: false }}
            />

          </Stack>
      </>
  );
}

export default function RootLayout() {
    const colorScheme = useColorScheme();

    return (
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <GestureHandlerRootView className={`bg-light-primary dark:bg-dark-primary ${Platform.OS === 'ios' ? 'pb-0' : ''}`} style={{ flex: 1 }}>
            <ThemedLayout />
      </GestureHandlerRootView>
      </ThemeProvider>
  );
}
