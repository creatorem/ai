import { View } from "react-native";
import { useState } from "react";
import { ToolCallMessagePartComponent } from "@creatorem/ai-chat/types/message-part-component-types";
import { cn } from "~/lib/cn";
import { Button } from "../ui/button";
import { Text } from "../ui/text";
import { Icon } from "../ui/icon";

export const ToolFallback: ToolCallMessagePartComponent = ({
  toolName,
  argsText,
  result,
  status,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const isCancelled =
    status?.type === "incomplete" && status.reason === "cancelled";
  const cancelledReason =
    isCancelled && status.error
      ? typeof status.error === "string"
        ? status.error
        : JSON.stringify(status.error)
      : null;

  return (
    <View
      className={cn(
        "mb-4 flex w-full flex-col gap-3 rounded-lg border py-3",
        isCancelled && "border-muted-foreground/30 bg-muted/30",
      )}
    >
      <View className="flex items-center gap-2 px-4">
        {isCancelled ? (
          <Icon name="XCircle" className="size-4 text-muted-foreground" />
        ) : (
          <Icon name="Check" className="size-4" />
        )}
        <Text
          className={cn(
            "grow",
            isCancelled && "text-muted-foreground line-through",
          )}
        >
          {isCancelled ? "Cancelled tool: " : "Used tool: "}
          <Text className="font-semibold">{toolName}</Text>
        </Text>
        <Button onPress={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? (
            <Icon name="ChevronUp" />
          ) : (
            <Icon name="ChevronDown" />
          )}
        </Button>
      </View>
      {!isCollapsed && (
        <View className="flex flex-col gap-2 border-t pt-2">
          {cancelledReason && (
            <View className="px-4">
              <Text className="font-semibold text-muted-foreground">
                Cancelled reason:
              </Text>
              <Text className="text-muted-foreground">{cancelledReason}</Text>
            </View>
          )}
          <View className={cn("px-4", isCancelled && "opacity-60")}>
            <Text className="whitespace-pre-wrap">{argsText}</Text>
          </View>
          {!isCancelled && result !== undefined && (
            <View className="border-t border-dashed px-4 pt-2">
              <Text className="font-semibold">Result:</Text>
              <Text className="whitespace-pre-wrap">
                {typeof result === "string"
                  ? result
                  : JSON.stringify(result, null, 2)}
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};
