import React, { useState } from "react";
import {
  ActionSheetSelect,
  ActionSheetSelectContent,
  ActionSheetSelectItem,
  ActionSheetSelectTrigger,
  ActionSheetSelectValue,
} from "./ui/action-sheet-select";
import { Text } from "./ui/text";
import { View } from "react-native";

export const ModelSwitch = () => {
  const [selectedModel, setSelectedModel] = useState("ChatGPT");

  return (
    <ActionSheetSelect
      labels={{
        ChatGPT: "ChatGPT",
        Claude: "Claude",
        Gemini: "Gemini",
      }}
      value={selectedModel}
      onValueChange={setSelectedModel}
    >
      <ActionSheetSelectTrigger>
        <ActionSheetSelectValue placeholder={"Select an AI Model"} />
      </ActionSheetSelectTrigger>
      <ActionSheetSelectContent>
        <View className="mb-4">
          <Text className="mb-2 font-semibold text-xl">
            Select AI Model
          </Text>
          <Text className="text-muted-foreground">
            Choose the AI model to chat with
          </Text>
        </View>

        <ActionSheetSelectItem value="ChatGPT" />
        <ActionSheetSelectItem value="Claude" />
        <ActionSheetSelectItem value="Gemini" />
      </ActionSheetSelectContent>
    </ActionSheetSelect>
  );
};
