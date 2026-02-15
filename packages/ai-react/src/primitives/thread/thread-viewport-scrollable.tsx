"use client";

import { useComposedRefs } from "@creatorem/ai-chat/utils";
import {
  ComponentPropsWithoutRef,
  ComponentRef,
  forwardRef,
  useCallback,
  useRef,
} from "react";
import {
  type ThreadPrimitiveViewport,
  useThreadViewport,
} from "@creatorem/ai-chat/primitives/thread";
import { useSizeHandle } from "../../hooks/use-size-handle";
import { Primitive } from "@radix-ui/react-primitive";
import { useAiEvent } from "@creatorem/ai-chat/ai-provider";
import { useThreadViewportStore } from "@creatorem/ai-chat/primitives/thread";
import { writableStore } from "@creatorem/ai-chat/utils";
import { useOnResizeContent } from "../../hooks/use-on-resize-content";
import { useManagedRef, useOnScrollToBottom } from "@creatorem/ai-chat/hooks";
import type { AutoScrollConfig } from "@creatorem/ai-chat/runtime";

const useThreadViewportAutoScroll = <TElement extends HTMLElement>(
  config?: AutoScrollConfig,
) => {
  const {
    autoScroll: autoScrollProp,
    scrollToBottomOnRunStart = true,
    scrollToBottomOnInitialize = true,
    scrollToBottomOnThreadSwitch = true,
  } = config ?? {};
  const divRef = useRef<TElement>(null);

  const threadViewportStore = useThreadViewportStore();
  const autoScroll =
    autoScrollProp ?? threadViewportStore.getState().turnAnchor !== "top";

  const lastScrollTop = useRef<number>(0);
  const scrollingToBottomBehaviorRef = useRef<ScrollBehavior | null>(null);

  const scrollToBottom = useCallback((behavior?: ScrollBehavior) => {
    const div = divRef.current;
    if (!div) return;
    const b = behavior ?? "smooth";
    scrollingToBottomBehaviorRef.current = b;
    div.scrollTo({ top: div.scrollHeight, behavior: b });
  }, []);

  const handleScroll = () => {
    const div = divRef.current;
    if (!div) return;

    const isAtBottom = threadViewportStore.getState().isAtBottom;
    const newIsAtBottom =
      Math.abs(div.scrollHeight - div.scrollTop - div.clientHeight) < 1 ||
      div.scrollHeight <= div.clientHeight;

    if (!newIsAtBottom && lastScrollTop.current < div.scrollTop) {
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

    lastScrollTop.current = div.scrollTop;
  };

  const resizeRef = useOnResizeContent(() => {
    const scrollBehavior = scrollingToBottomBehaviorRef.current;
    if (scrollBehavior) {
      scrollToBottom(scrollBehavior);
    } else if (autoScroll && threadViewportStore.getState().isAtBottom) {
      scrollToBottom("instant");
    }
    handleScroll();
  });

  const scrollRef = useManagedRef<HTMLElement>((el) => {
    const onScroll = () => handleScroll();
    el.addEventListener("scroll", onScroll);
    return () => {
      el.removeEventListener("scroll", onScroll);
    };
  });

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

  const autoScrollRef = useComposedRefs<TElement>(resizeRef, scrollRef, divRef);
  return autoScrollRef;
};

const useViewportSizeRef = () => {
  const threadViewportStore = useThreadViewportStore();
  const getHeight = useCallback((el: HTMLElement) => el.clientHeight, []);
  return useSizeHandle(
    threadViewportStore.getState().setViewportHeight,
    getHeight,
  );
};

export const ThreadPrimitiveViewportScrollable = forwardRef<
  ComponentRef<typeof Primitive.div>,
  ThreadPrimitiveViewport.Props & ComponentPropsWithoutRef<typeof Primitive.div>
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
    const viewportSizeRef = useViewportSizeRef();
    const ref = useComposedRefs(forwardedRef, autoScrollRef, viewportSizeRef);

    return (
      <Primitive.div
        {...rest}
        ref={ref}
        style={{
          ...style,
          overflowY: "auto",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </Primitive.div>
    );
  },
);

ThreadPrimitiveViewportScrollable.displayName =
  "ThreadPrimitive.ViewportScrollable";
