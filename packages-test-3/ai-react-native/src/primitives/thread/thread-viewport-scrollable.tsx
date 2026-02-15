"use client";

import { useComposedRefs } from "@creatorem/ai-chat/utils";
import {
  ComponentPropsWithoutRef,
  ComponentRef,
  forwardRef,
  useCallback,
  useRef,
} from "react";
import { useThreadViewport, type ThreadPrimitiveViewport } from "@creatorem/ai-chat/primitives/thread";
import { useAiEvent } from "@creatorem/ai-chat/ai-provider";
import { useThreadViewportStore } from "@creatorem/ai-chat/primitives/thread";
import { writableStore } from "@creatorem/ai-chat/utils";
import { useOnScrollToBottom } from "@creatorem/ai-chat/hooks";
import type { AutoScrollConfig } from "@creatorem/ai-chat/runtime";
import { LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent, ScrollView } from "react-native";

const useThreadViewportAutoScroll = (
  config?: AutoScrollConfig
) => {
  const {
    autoScroll: autoScrollProp,
    scrollToBottomOnRunStart = true,
    scrollToBottomOnInitialize = true,
    scrollToBottomOnThreadSwitch = true,
  } = config ?? {};
    const scrollRef = useRef<ScrollView>(null);

  const threadViewportStore = useThreadViewportStore();
  const autoScroll = autoScrollProp ?? threadViewportStore.getState().turnAnchor !== "top";

  const lastScrollTop = useRef<number>(0);
  const scrollingToBottomBehaviorRef = useRef<ScrollBehavior | null>(null);


  const scrollToBottom = useCallback((behavior?: ScrollBehavior) => {
    scrollRef.current?.scrollToEnd({ animated: behavior === "smooth" });
  }, []);

    const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset, layoutMeasurement, contentSize } = e.nativeEvent;

      const PADDING_TO_BOTTOM = 40;
      
      const isAtBottom = threadViewportStore.getState().isAtBottom;
      const newIsAtBottom =
        contentOffset.y + layoutMeasurement.height >=
        contentSize.height - PADDING_TO_BOTTOM;

    if (!newIsAtBottom && lastScrollTop.current < contentOffset.y) {
      // ignore scroll down
    } else {
      if (newIsAtBottom) {
        scrollingToBottomBehaviorRef.current = null;
      }

      const shouldUpdate =
        newIsAtBottom || scrollingToBottomBehaviorRef.current === null;

      if (shouldUpdate && newIsAtBottom !== isAtBottom) {
        writableStore(threadViewportStore).setState({
          isAtBottom: newIsAtBottom,
        });
      }
    }

    lastScrollTop.current = contentOffset.y;
    };

  // no resize on native
  // const resizeRef = useOnResizeContent(() => {
  //   const scrollBehavior = scrollingToBottomBehaviorRef.current;
  //   if (scrollBehavior) {
  //     scrollToBottom(scrollBehavior);
  //   } else if (autoScroll && threadViewportStore.getState().isAtBottom) {
  //     scrollToBottom("instant");
  //   }
  //   handleScroll();
  // });

  useOnScrollToBottom(({ behavior }) => {
    scrollToBottom(behavior);
  });

  useAiEvent("thread.runStart", () => {
    if (!scrollToBottomOnRunStart) return;
    scrollToBottom("smooth");
  });

  useAiEvent("thread.initialize", () => {
    if (!scrollToBottomOnInitialize) return;
    scrollingToBottomBehaviorRef.current = "instant";
    requestAnimationFrame(() => {
      scrollToBottom("instant");
    });
  });

  useAiEvent("threadListItem.switchedTo", () => {
    if (!scrollToBottomOnThreadSwitch) return;
    scrollingToBottomBehaviorRef.current = "instant";
    requestAnimationFrame(() => {
      scrollToBottom("instant");
    });
  });

  return { onScroll: handleScroll, ref: scrollRef  };
};

const useViewportSizeRef = () => {
  const setViewportHeight = useThreadViewport((s) => s.setViewportHeight);

    const handleLayout = (event: LayoutChangeEvent) => {
      setViewportHeight(event.nativeEvent.layout.height);
    }
    return { onLayout: handleLayout };
};

export const ThreadPrimitiveViewportScrollable = forwardRef<
  ComponentRef<typeof ScrollView>,
  ThreadPrimitiveViewport.Props & ComponentPropsWithoutRef<typeof ScrollView>
>(
  (
    {
      autoScroll,
      scrollToBottomOnRunStart,
      scrollToBottomOnInitialize,
      scrollToBottomOnThreadSwitch,
      children,
      style,
      ...rest
    },
    forwardedRef,
  ) => {
    const autoScrollRef = useThreadViewportAutoScroll({
      autoScroll,
      scrollToBottomOnRunStart,
      scrollToBottomOnInitialize,
      scrollToBottomOnThreadSwitch,
    });
    const {onLayout} = useViewportSizeRef();

      const ref = useComposedRefs(forwardedRef, autoScrollRef.ref);

    return (
        <ScrollView {...rest} ref={ref} onScroll={autoScrollRef.onScroll} scrollEventThrottle={16} onLayout={onLayout}>
          {children}
        </ScrollView>
    );
  },
);

ThreadPrimitiveViewportScrollable.displayName =
  "ThreadPrimitive.ViewportScrollable";

