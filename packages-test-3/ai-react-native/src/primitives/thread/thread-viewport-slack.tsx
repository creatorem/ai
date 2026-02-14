"use client";

import {
  createContext,
  type FC,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { View } from "react-native";
import { useThreadViewportStore } from "@creatorem/ai-chat/primitives/thread";
import { useThread } from "@creatorem/ai-chat/primitives/thread";
import { useMessage } from "@creatorem/ai-chat/primitives/message";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const SlackNestingContext = createContext(false);

const BASE_FONT_SIZE = 16;

const parseLength = (value: string | number): number => {
  if (typeof value === "number") return value;

  const match = value.trim().match(/^([\d.]+)(em|px|rem)?$/);
  if (!match) return 0;

  const num = parseFloat(match[1] ?? "0");
  const unit = match[2] ?? "px";

  if (unit === "px") return num;
  if (unit === "em" || unit === "rem") return num * BASE_FONT_SIZE;
  return 0;
};

export type ThreadViewportSlackProps = {
  fillClampThreshold?: string | number;
  fillClampOffset?: string | number;
  children?: ReactNode;
};

const useSlackConfig = (
  fillClampThreshold: string | number,
  fillClampOffset: string | number,
) => {
  const messageIsLast = useMessage((s) => s.isLast);
  const messageRole = useMessage((s) => s.role);
  const messageIndex = useMessage((s) => s.index);
  const prevMessageRole = useThread((s) =>
    messageIndex >= 1 ? s.messages[messageIndex - 1]?.role : undefined,
  );

  const shouldApplySlack = useMemo(
    () =>
      messageIsLast &&
      messageRole === "assistant" &&
      messageIndex >= 1 &&
      prevMessageRole === "user",
    [messageIsLast, messageRole, messageIndex, prevMessageRole],
  );

  const threshold = useMemo(
    () => parseLength(fillClampThreshold),
    [fillClampThreshold],
  );
  const offset = useMemo(() => parseLength(fillClampOffset), [fillClampOffset]);

  return { shouldApplySlack, threshold, offset };
};

const ThreadPrimitiveViewportSlackFallback: FC<ThreadViewportSlackProps> = ({
  children,
  fillClampThreshold = "10em",
  fillClampOffset = "6em",
}) => {
  const threadViewportStore = useThreadViewportStore({ optional: true });
  const isNested = useContext(SlackNestingContext);
  const { shouldApplySlack, threshold, offset } = useSlackConfig(
    fillClampThreshold,
    fillClampOffset,
  );
  // const minHeight = useSharedValue(0);
  const [minHeight, setMinHeight] = useState(0); 

  useEffect(() => {
    if (!threadViewportStore || isNested) {
      // minHeight.value = withTiming(0, { duration: 140 });
      setMinHeight(0);
      return undefined;
    }

    const updateMinHeight = () => {
      const state = threadViewportStore.getState();
      let nextMinHeight = 0;

      if (state.turnAnchor === "top" && shouldApplySlack) {
        const { viewport, inset, userMessage } = state.height;
        const clampAdjustment = userMessage <= threshold ? userMessage : offset;
        nextMinHeight = Math.max(0, viewport - inset - clampAdjustment);
      }

      // minHeight.value = withTiming(nextMinHeight, { duration: 140 });
      setMinHeight(nextMinHeight);
    };

    updateMinHeight();
    return threadViewportStore.subscribe(updateMinHeight);
  }, [threadViewportStore, isNested, shouldApplySlack, threshold, offset]);

  // const animatedStyle = useAnimatedStyle(() => {
  //   return {
  //     minHeight: minHeight.value,
  //     flexShrink: 0,
  //   };
  // });

  console.log( {minHeight} )

  return (
    <SlackNestingContext.Provider value={true}>
      {/* <Animated.View style={animatedStyle}> */}
      <View style={{ minHeight }}>
        {children}
      </View>
    </SlackNestingContext.Provider>
  );
};

export const ThreadPrimitiveViewportSlack: FC<ThreadViewportSlackProps> = (
  props,
) => {
  return <ThreadPrimitiveViewportSlackFallback {...props} />;
};

ThreadPrimitiveViewportSlack.displayName = "ThreadPrimitive.ViewportSlack";
