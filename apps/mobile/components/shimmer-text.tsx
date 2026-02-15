import React, { useEffect } from "react";
import { Text, StyleSheet } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useCSSVariable } from "uniwind";
import { cn } from "~/lib/cn";

type ShimmerTextProps = {
  text: string;
  className?: string;
  duration?: number;
};

export const ShimmerText = ({
  text,
  className,
  duration = 3500,
}: ShimmerTextProps) => {
  const textColor = useCSSVariable("--color-foreground");
  const secondaryColor = useCSSVariable("--color-secondary");
  const translateX = useSharedValue(-100);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(100, {
        duration,
        easing: Easing.linear,
      }),
      -1,
      false,
    );
  }, [duration, translateX]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: `${translateX.value}%` }],
  }));

  return (
    <MaskedView
      maskElement={
        <Text className={cn("text-transparent", className)}>{text}</Text>
      }
    >
      <Animated.View
        className={"absolute -left-full h-full w-[300%]"}
        style={animatedStyle}
      >
        <LinearGradient
          colors={[textColor, secondaryColor, textColor]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="flex-1"
        />
      </Animated.View>
      <Text className={cn("text-transparent", className)}>{text}</Text>
    </MaskedView>
  );
};
