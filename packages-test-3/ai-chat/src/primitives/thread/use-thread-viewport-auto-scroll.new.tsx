"use client";

import { useComposedRefs } from "@radix-ui/react-compose-refs";
import { useRef, type RefCallback } from "react";
import { useAiEvent } from "../../ai-provider";
import { useThreadViewport, type ThreadViewportState } from "./thread-viewport-context";
import { useOnScrollToBottom } from "../../hooks/use-on-scroll-to-bottom";

export namespace useThreadViewportAutoScroll {
  export type Options = {
    /**
     * Whether to automatically scroll to the bottom when new messages are added.
     * When enabled, the viewport will automatically scroll to show the latest content.
     *
     * Default false if `turnAnchor` is "top", otherwise defaults to true.
     */
    autoScroll?: boolean | undefined;

    /**
     * Whether to scroll to bottom when a new run starts.
     *
     * Defaults to true.
     */
    scrollToBottomOnRunStart?: boolean | undefined;

    /**
     * Whether to scroll to bottom when thread history is first loaded.
     *
     * Defaults to true.
     */
    scrollToBottomOnInitialize?: boolean | undefined;

    /**
     * Whether to scroll to bottom when switching to a different thread.
     *
     * Defaults to true.
     */
    scrollToBottomOnThreadSwitch?: boolean | undefined;
  };
}

export function useThreadViewportAutoScroll<TElement extends HTMLElement>({
  autoScroll,
  scrollToBottomOnRunStart = true,
  scrollToBottomOnInitialize = true,
  scrollToBottomOnThreadSwitch = true,
}: useThreadViewportAutoScroll.Options): RefCallback<TElement> {
  const divRef = useRef<TElement>(null);


  // const eventHandler = useAiContext(s => s.eventHandler);

  const turnAnchor = useThreadViewport((s: ThreadViewportState) => s.turnAnchor);
  const scrollToBottom = useThreadViewport((s: ThreadViewportState) => s.scrollToBottom);

  useOnScrollToBottom(({ behavior }) => {
    const div = divRef.current;
    if (!div) return;
    div.scrollTo({ top: div.scrollHeight, behavior });
  });

  // autoscroll on run start
  useAiEvent("thread.runStart", () => {
    if (!autoScroll && !scrollToBottomOnRunStart) return;
    scrollToBottom({ behavior: "smooth" });
  });
  
  // scroll to bottom instantly when thread history is first loaded
  useAiEvent("thread.initialize", () => {
    if (!autoScroll && !scrollToBottomOnInitialize) return;
    scrollToBottom({ behavior: "auto" });
  });
  
  // scroll to bottom instantly when switching threads
  useAiEvent("threadListItem.switchedTo", () => {
    if (!autoScroll && !scrollToBottomOnThreadSwitch) return;
    scrollToBottom({ behavior: "auto" });
  });

  const autoScrollRef = useComposedRefs<TElement>(divRef);
  return autoScrollRef as RefCallback<TElement>;
};
