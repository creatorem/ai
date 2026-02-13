import { View, ActivityIndicator, FlatList } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import {
  ActionSheet,
  ActionSheetContent,
  ActionSheetTrigger,
} from "~/components/ui/action-sheet";
import * as ThreadListPrimitive from "@creatorem/ai-react-native/primitives/thread-list";
import * as ThreadListItemPrimitive from "@creatorem/ai-react-native/primitives/thread-list-item";
import { useThreads } from "@creatorem/ai-react-native/ai-provider";
import { type FC } from "react";
import { useCSSVariable } from "uniwind";
import { Icon } from "~/components/ui/icon";
import { useDrawer } from "~/components/context/drawer-context";

export const ThreadList: FC = () => {
  const isLoading = useThreads((threads) => threads.isLoading);

  return (
    <ThreadListPrimitive.Root className="flex flex-col gap-1">
      <ThreadListNew />
      {isLoading ? <ThreadListSkeleton /> : null}
      {!isLoading ? (
        <ThreadListPrimitive.Items components={{ ThreadListItem }} />
      ) : null}
    </ThreadListPrimitive.Root>
  );
};

const ThreadListNew: FC = () => {
  const { setOpen: setDrawerOpen } = useDrawer();
  return (
    <ThreadListPrimitive.New
      variant="outline"
      className="mb-4 h-9 justify-start gap-2 rounded-lg px-3 text-sm hover:bg-muted data-active:bg-muted"
      onPress={() => {
        setDrawerOpen(false);
      }}
    >
      <Icon name="Plus" className="size-4" />
      <Text>New Thread</Text>
    </ThreadListPrimitive.New>
  );
};

const ThreadListSkeleton: FC = () => {
  const foregroundColor = useCSSVariable("--color-muted-foreground");

  return (
    <View className="mt-2 flex flex-col gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <View key={i} className="flex h-10 items-center justify-center px-3">
          <ActivityIndicator
            size="small"
            color={foregroundColor}
            style={i > 0 ? { opacity: 0 } : undefined}
          />
        </View>
      ))}
    </View>
  );
};

const ThreadListItem: FC = () => {
  const { setOpen: setDrawerOpen } = useDrawer();

  return (
    <ThreadListItemPrimitive.Root className="group flex h-9 flex-row items-center gap-2 rounded-lg transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none data-active:bg-muted">
      <ThreadListItemPrimitive.Trigger
        onPress={() => {
          setDrawerOpen(false);
        }}
        className="flex h-full min-w-0 flex-1 items-center justify-start truncate bg-transparent px-3 text-start text-sm"
      >
        <ThreadListItemPrimitive.Title
          fallback="New Chat"
          className="text-foreground"
        />
      </ThreadListItemPrimitive.Trigger>
      <ThreadListItemMore />
    </ThreadListItemPrimitive.Root>
  );
};

const ThreadListItemMore: FC = () => {
  const textMutedForeground = useCSSVariable("--color-muted-foreground");
  return (
    <ActionSheet>
      <ActionSheetTrigger asChild>
        <Button size="icon" variant="ghost">
          <Icon name="MoreHorizontal" size={20} color={textMutedForeground} />
        </Button>
      </ActionSheetTrigger>
      <ActionSheetContent>
        <View className="p-6">
          <ThreadListItemPrimitive.Archive>
            <Icon name="Archive" className="size-4" />
            <Text>Archive</Text>
          </ThreadListItemPrimitive.Archive>
        </View>
      </ActionSheetContent>
    </ActionSheet>
  );
};
