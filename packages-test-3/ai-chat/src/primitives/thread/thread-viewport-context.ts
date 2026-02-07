"use client";

import { createContext, useContext } from "react";
import { createContextStoreHook } from "../../utils/create-context-store-hook";
import { Unsubscribe } from "../../types/unsuscribe";
import { ReadonlyStore } from "../../utils/readonly-store";
import { UseBoundStore } from "zustand";
import { createContextHook } from "../../utils/create-context-hook";
// import { ReadonlyStore } from "../readonly-store";
// import { createContextHook } from "./utils/create-context-hook";
// import { createContextStoreHook } from "./utils/create-context-store-hook";
// import { ThreadViewportState } from "../stores";

type SizeHandle = {
  /** Update the height */
  setHeight: (height: number) => void;
  /** Unregister this handle */
  unregister: Unsubscribe;
};

export type ThreadViewportState = {
  readonly isAtBottom: boolean;
  readonly scrollToBottom: (config?: {
    behavior?: ScrollBehavior | undefined;
  }) => void;
  readonly onScrollToBottom: (
    callback: ({ behavior }: { behavior: ScrollBehavior }) => void,
  ) => Unsubscribe;

  /** Controls scroll anchoring: "top" anchors user messages at top, "bottom" is classic behavior */
  readonly turnAnchor: "top" | "bottom";

  /** Raw height values from registered elements */
  readonly height: {
    /** Total viewport height */
    readonly viewport: number;
    /** Total content inset height (footer, anchor message, etc.) */
    readonly inset: number;
    /** Height of the anchor user message (full height) */
    readonly userMessage: number;
  };

  /** Register a viewport and get a handle to update its height */
  readonly registerViewport: () => SizeHandle;

  /** Register a content inset (footer, anchor message, etc.) and get a handle to update its height */
  readonly registerContentInset: () => SizeHandle;

  /** Register the anchor user message height */
  readonly registerUserMessageHeight: () => SizeHandle;
};

export type ThreadViewportContextValue = {
  useThreadViewport: UseBoundStore<ReadonlyStore<ThreadViewportState>>;
};

// (options?: {
//   optional?: boolean | undefined;
// } | undefined) => ThreadViewportContextValue | null

export const ThreadViewportContext =
  createContext<ThreadViewportContextValue | null>(null);

const useThreadViewportContext = createContextHook(
  ThreadViewportContext,
  "ThreadPrimitive.Viewport",
);

export const { useThreadViewport, useThreadViewportStore } =
  createContextStoreHook(useThreadViewportContext, "useThreadViewport");
