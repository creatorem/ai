import React, {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
} from "react";
import { Pressable, View } from "react-native";
import { Icon } from "~/components/ui/icon";
import {
  DrawerActions,
  NavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { useCSSVariable } from "uniwind";

interface DrawerContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DrawerContext = createContext<DrawerContextType | undefined>(undefined);

export function DrawerProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <DrawerContext.Provider value={{ open, setOpen }}>
      {children}
    </DrawerContext.Provider>
  );
}

export function useDrawer() {
  const context = useContext(DrawerContext);

  if (context === undefined) {
    throw new Error("useDrawer must be used within a DrawerProvider");
  }

  return context;
}

export const OpenDrawerButton = () => {
  const { open, setOpen } = useDrawer();
  const textColor = useCSSVariable("--color-foreground");
  const navigation = useNavigation<NavigationProp<any>>();

  const openDrawer = useCallback(() => {
    setOpen(true);
    navigation.dispatch(DrawerActions.openDrawer());
  }, [setOpen]);

  useEffect(() => {
    if (open) {
      navigation.dispatch(DrawerActions.openDrawer());
    } else {
      navigation.dispatch(DrawerActions.closeDrawer());
    }
  }, [open, navigation.dispatch]);

  return (
    <View className={`rounded-full`}>
      <Pressable
        onPress={openDrawer}
        style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
        className="rounded-full border border-border bg-background p-3"
      >
        <Icon name="Menu" size={24} color={textColor} />
      </Pressable>
    </View>
  );
};
