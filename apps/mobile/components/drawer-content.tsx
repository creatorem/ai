import { View, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cn } from "~/utils/cn";

export function DrawerContent() {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      bounces={false}
      overScrollMode="never"
      className={cn(`w-full flex-1 bg-background px-6`)}
      contentContainerStyle={[{ paddingTop: insets.top }]}
    >
      <View className="h-20 w-full" />
    </ScrollView>
  );
}
