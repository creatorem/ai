import React from "react";
import { Header } from "~/components/header";
import { View, KeyboardAvoidingView, Platform } from "react-native";
import { ModelSwitch } from "~/components/model-switch";
import { Thread } from "~/components/ai-chat/thread";
import { OpenDrawerButton } from "~/components/context/drawer-context";

const HomeScreen = () => {
  const rightComponents = [<ModelSwitch key="model-switch" />];
  const leftComponent = [<OpenDrawerButton key="drawer-button" />];

  return (
    <View className="relative flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={0}
        style={{ flex: 1 }}
      >
        <Header
          leftComponent={leftComponent}
          rightComponents={rightComponents}
        />
        <View className="flex-1">
          <Thread />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default HomeScreen;
