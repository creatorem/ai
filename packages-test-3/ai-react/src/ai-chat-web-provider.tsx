"use client";

// @ts-expect-error normal because we extends web specific types here
import { RuntimeProvider, type RuntimeHooks } from "@creatorem/ai-chat/runtime";
import { useWebAutoScroll } from "./hooks/use-web-auto-scroll";
import { useCallback, useRef, type ReactNode } from "react";
import { webComponents } from "./web-components";

/**
 * Web-specific implementation of useMeasure using ResizeObserver.
 */
const useWebMeasure = () => {
  const sizeRef = useRef({ width: 0, height: 0 });
  const elRef = useRef<HTMLElement | null>(null);
  const roRef = useRef<ResizeObserver | null>(null);

  const ref = useCallback((node: HTMLElement | null) => {
    if (roRef.current) {
      roRef.current.disconnect();
      roRef.current = null;
    }

    if (node) {
      elRef.current = node;
      const ro = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (entry) {
          sizeRef.current = {
            width: entry.contentRect.width,
            height: entry.contentRect.height,
          };
        }
      });
      ro.observe(node);
      roRef.current = ro;
      // Initial measurement
      sizeRef.current = {
        width: node.offsetWidth,
        height: node.offsetHeight,
      };
    }
  }, []);

  return { ref, ...sizeRef.current };
};

/**
 * Web-specific implementation of useHover using mouseenter/mouseleave.
 */
const useWebHover = (callback: (isHovering: boolean) => void) => {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const ref = useCallback((el: HTMLElement | null) => {
    if (!el) return;

    const handleMouseEnter = () => callbackRef.current(true);
    const handleMouseLeave = () => callbackRef.current(false);

    el.addEventListener("mouseenter", handleMouseEnter);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mouseenter", handleMouseEnter);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return ref;
};

const webHooks: RuntimeHooks = {
  useAutoScroll: useWebAutoScroll,
  useMeasure: useWebMeasure,
  useHover: useWebHover,
};

/**
 * AiChatWebProvider wraps the RuntimeProvider with web-specific implementations.
 * 
 * Use this provider in web (React DOM) applications to inject the correct
 * platform primitives (DOM elements, ResizeObserver, mouse events, etc.)
 * into the shared @creatorem/ai-chat components.
 *
 * @example
 * ```tsx
 * import { AiChatWebProvider } from '@creatorem/ai-react';
 * 
 * function App() {
 *   return (
 *     <AiChatWebProvider>
 *       <AiProvider ...>
 *         <ThreadPrimitive.Root>...</ThreadPrimitive.Root>
 *       </AiProvider>
 *     </AiChatWebProvider>
 *   );
 * }
 * ```
 */
export const AiChatWebProvider = ({ children }: { children: ReactNode }) => {
  return (
    <RuntimeProvider hooks={webHooks} components={webComponents}>
      {children}
    </RuntimeProvider>
  );
};
