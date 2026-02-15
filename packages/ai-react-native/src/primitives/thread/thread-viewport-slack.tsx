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

const SlackNestingContext = createContext(false);

// const BASE_FONT_SIZE = 16;

// const parseLength = (value: string | number): number => {
//   if (typeof value === "number") return value;

//   const match = value.trim().match(/^([\d.]+)(em|px|rem)?$/);
//   if (!match) return 0;

//   const num = parseFloat(match[1] ?? "0");
//   const unit = match[2] ?? "px";

//   if (unit === "px") return num;
//   if (unit === "em" || unit === "rem") return num * BASE_FONT_SIZE;
//   return 0;
// };

export type ThreadViewportSlackProps = {
  // fillClampThreshold?: string | number;
  // fillClampOffset?: string | number;
  children?: ReactNode;
};

const useSlackConfig = (
  // fillClampThreshold: string | number,
  // fillClampOffset: string | number,
) => {
  // const parts = useMessage((s) => s.parts);
  // const text = parts?.[0]?.type === 'text' ? parts?.[0]?.text : '';
  // console.log( {text} )
  const messageIsLast = useMessage((s) => s.isLast);
  const messageRole = useMessage((s) => s.role);
  const messageIndex = useMessage((s) => s.index);
  const prevMessageRole = useThread((s) =>
    messageIndex >= 1 ? s.messages[messageIndex - 1]?.role : undefined,
  );

  // if(text === 'again '){
  //   console.log( {messageIsLast, messageRole, messageIndex, prevMessageRole} )
  // }

  const shouldApplySlack = useMemo(
    () =>
      messageIsLast &&
      messageRole === "assistant" &&
      messageIndex >= 1 &&
      prevMessageRole === "user",
    [messageIsLast, messageRole, messageIndex, prevMessageRole],
  );

  // console.log( {shouldApplySlack} )

  // const threshold = useMemo(
  //   () => parseLength(fillClampThreshold),
  //   [fillClampThreshold],
  // );
  // const offset = useMemo(() => parseLength(fillClampOffset), [fillClampOffset]);

  // return { shouldApplySlack, threshold, offset };
  return { shouldApplySlack };
};

export const ThreadPrimitiveViewportSlack: FC<ThreadViewportSlackProps> = ({
  children,
  // fillClampThreshold = "10em",
  // fillClampOffset = "6em",
}) => {
  const threadViewportStore = useThreadViewportStore({ optional: true });
  const isNested = useContext(SlackNestingContext);
  // const { shouldApplySlack, threshold, offset } = useSlackConfig(
  const { shouldApplySlack } =
    useSlackConfig(
      // fillClampThreshold,
      // fillClampOffset,
    );
  const [minHeight, setMinHeight] = useState(0);

  useEffect(() => {
    if (!threadViewportStore || isNested) {
      setMinHeight(0);
      return undefined;
    }

    const updateMinHeight = () => {
      const state = threadViewportStore.getState();
      let nextMinHeight = 0;

      if (state.turnAnchor === "top" && shouldApplySlack) {
        const { viewport, inset, userMessage } = state.height;
        // const clampAdjustment = userMessage <= threshold ? userMessage : offset;
        // nextMinHeight = Math.max(0, viewport - inset - clampAdjustment);
        nextMinHeight = Math.max(0, viewport - inset - userMessage);
      }

      setMinHeight(nextMinHeight);
    };

    updateMinHeight();
    return threadViewportStore.subscribe(updateMinHeight);
    // }, [threadViewportStore, isNested, shouldApplySlack, threshold, offset]);
  }, [threadViewportStore, isNested, shouldApplySlack]);

  //   const parts = useMessage((s) => s.parts);
  // const text = parts?.[0]?.type === 'text' ? parts?.[0]?.text : '';
  // console.log( {text} )
  // console.log( {minHeight} )

  return (
    <SlackNestingContext.Provider value={true}>
      {/* <View style={{ minHeight, backgroundColor: 'red', borderTopColor: 'blue', borderTopWidth: 1 }}> */}
      <View style={{ minHeight }}>{children}</View>
    </SlackNestingContext.Provider>
  );
};

ThreadPrimitiveViewportSlack.displayName = "ThreadPrimitive.ViewportSlack";
