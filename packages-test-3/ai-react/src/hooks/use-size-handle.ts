"use client";

import { useCallback } from "react";
import { useManagedRef } from "@creatorem/ai-chat/hooks";

/**
 * Hook that creates a ref for tracking element size via a SizeHandle.
 * Automatically sets up ResizeObserver and reports height changes.
 *
 * @param register - Function that returns a SizeHandle (e.g., registerContentInset)
 * @param getHeight - Optional function to compute height (defaults to el.offsetHeight)
 * @returns A ref callback to attach to the element
 */
export const useSizeHandle = (
  setHeight: ((height: number) => void) | null | undefined,
  getHeight?: (el: HTMLElement) => number,
) => {
  const callbackRef = useCallback(
    (el: HTMLElement) => {
      if (!setHeight) return;

      const updateHeight = () => {
        const height = getHeight ? getHeight(el) : el.offsetHeight;
        setHeight(height);
      };

      const ro = new ResizeObserver(updateHeight);
      ro.observe(el);
      updateHeight();

      return () => {
        ro.disconnect();
      };
    },
    [setHeight, getHeight],
  );

  return useManagedRef(callbackRef);
};
