import React, { useCallback } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { cn } from "~/utils/cn";
import { Icon } from "./ui/icon";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

type HeaderProps = {
  title?: string;
  children?: React.ReactNode;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightComponents?: React.ReactNode[];
  leftComponent?: React.ReactNode;
  className?: string;
  variant?: "default" | "transparent" | "blurred";
};

export const Header: React.FC<HeaderProps> = ({
  title,
  children,
  showBackButton = false,
  onBackPress,
  rightComponents = [],
  leftComponent,
  className,
  variant = "default",
}) => {
  const insets = useSafeAreaInsets();

  const handleBackPress = useCallback(() => {
    if (!showBackButton) return;
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  }, [showBackButton, onBackPress]);

  return (
    <Animated.View
      entering={FadeIn.duration(320)}
      exiting={FadeOut.duration(220)}
      style={{ paddingTop: insets.top }}
    >
      {variant === "default" && (
        <View className="absolute inset-0 bg-background" />
      )}
      <View
        className={cn(
          `relative z-50 flex w-full flex-row justify-between px-6`,
          className,
        )}
      >
        {(showBackButton || leftComponent || title) && (
          <View className="flex-row items-center">
            {showBackButton && (
              <TouchableOpacity
                onPress={handleBackPress}
                className="relative z-50 mr-4 py-4"
              >
                <Icon name="ArrowLeft" size={24} />
              </TouchableOpacity>
            )}

            {leftComponent ||
              (title && (
                <View className="relative z-50 flex-row items-center py-4">
                  {leftComponent}

                  {title && (
                    <Text className="font-bold text-foreground text-xl">
                      {title}
                    </Text>
                  )}
                </View>
              ))}
          </View>
        )}

        {rightComponents.length > 0 && (
          <View className="relative z-50 flex-row items-center justify-end">
            {rightComponents.map((component, index) => (
              <View key={index} className="ml-6">
                {component}
              </View>
            ))}
          </View>
        )}
        {children}
      </View>
    </Animated.View>
  );
};
