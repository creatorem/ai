import React from "react";
import { Pressable, View } from "react-native";
import { Icon } from "~/components/ui/icon";
import {
  DrawerActions,
  useNavigation,
  NavigationProp,
} from "@react-navigation/native";
import { useCSSVariable } from "uniwind";

export const DrawerButton = () => {
  const textColor = useCSSVariable("--color-foreground");
  const navigation = useNavigation<NavigationProp<any>>();

  const handlePress = () => {
    try {
      navigation.dispatch(DrawerActions.openDrawer());
    } catch (e) {
      console.warn("Drawer navigation context not available:", e);
    }
  };

  return (
    <View className={`rounded-full`}>
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
        className="rounded-full border border-border bg-background p-3"
      >
        <Icon name="Menu" size={24} color={textColor} />
      </Pressable>
    </View>
  );
};
