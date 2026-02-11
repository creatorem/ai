import React from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import DrawerProvider from '~/components/drawer-context';
import { Drawer } from 'expo-router/drawer';
import { DrawerContent } from '~/components/drawer-content';

import 'react-native-reanimated';

export const drawerRef = React.createRef();

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
              <DrawerProvider>
            <Drawer
                ref={drawerRef}
                screenOptions={{
                    headerShown: false,
                    drawerType: 'slide',
                    drawerPosition: 'left',
                    drawerStyle: {
                        //backgroundColor:  colors.bg,
                        backgroundColor: 'red',
                        width: '85%',
                        flex: 1,
                    },
                    overlayColor: 'rgba(0,0,0, 0.4)',
                    swipeEdgeWidth: 100
                }}
                drawerContent={(props) => <DrawerContent />}
            >
                <Drawer.Screen
                    name="index"
                    options={{
                        title: 'Menu',
                        drawerLabel: 'Menu',
                    }}
                //redirect={true}
                />
               
            </Drawer>
        </DrawerProvider>
    </ThemeProvider>
  );
}
