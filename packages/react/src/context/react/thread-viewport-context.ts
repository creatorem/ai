"use client";

import { createContext } from "react";
import { ReadonlyStore } from "../readonly-store";
import { UseBoundStore } from "zustand";
import { createContextHook } from "./utils/create-context-hook";
import { createContextStoreHook } from "./utils/create-context-store-hook";
import { ThreadViewportState } from "../stores";

export type ThreadViewportContextValue = {
  useThreadViewport: UseBoundStore<ReadonlyStore<ThreadViewportState>>;
};

export const ThreadViewportContext =
  createContext<ThreadViewportContextValue | null>(null);

const useThreadViewportContext = createContextHook(
  ThreadViewportContext,
  "ThreadPrimitive.Viewport",
);

export const { useThreadViewport, useThreadViewportStore } =
  createContextStoreHook(useThreadViewportContext, "useThreadViewport");
