import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cn } from "~/lib/cn";
import { ThreadList } from "./ai-chat/thread-list";

export function DrawerContent() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      overScrollMode="never"
      className={cn("w-full flex-1 bg-background px-4")}
      contentContainerStyle={[
        { paddingTop: insets.top + 8, paddingBottom: 24 },
      ]}
    >
      <ThreadList />
    </ScrollView>
  );
}
