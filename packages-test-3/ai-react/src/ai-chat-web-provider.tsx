"use client";

import { RuntimeFunctions, RuntimeProvider } from "@creatorem/ai-chat/runtime";
import { useCallback, useMemo, useRef, type ReactNode } from "react";
import { webComponents } from "./web-components";
import { RuntimeComponents } from "@creatorem/ai-chat/component-types";
import { RuntimeHooks } from "@creatorem/ai-chat/hook-types";
import { useComposedRefs } from "@creatorem/ai-chat/utils";
import { useThread, useThreadViewport } from "@creatorem/ai-chat/primitives/thread";
import { useManagedRef } from "@creatorem/ai-chat/hooks";
import { useMessage, useMessageStore } from "@creatorem/ai-chat/primitives/message";
import { useSizeHandle } from "./hooks/use-size-handle";

const useIsHoveringRef = () => {
    const messageStore = useMessageStore();

    const callbackRef = useCallback(
        (el: HTMLElement) => {
            if (typeof window === "undefined" || !window.addEventListener || !el || !el.addEventListener) return () => {};

            const handleMouseEnter = () => {
                messageStore.getState().setIsHovering(true);
            };
            const handleMouseLeave = () => {
                messageStore.getState().setIsHovering(false);
            };

            el.addEventListener("mouseenter", handleMouseEnter);
            el.addEventListener("mouseleave", handleMouseLeave);

            if (el.matches(":hover")) {
                // TODO this is needed for SSR to work, figure out why
                queueMicrotask(() => messageStore.getState().setIsHovering(true));
            }

            return () => {
                el.removeEventListener("mouseenter", handleMouseEnter);
                el.removeEventListener("mouseleave", handleMouseLeave);
                messageStore.getState().setIsHovering(false);
            };
        },
        [messageStore],
    );

    return useManagedRef(callbackRef);
};

/**
 * Hook that registers the anchor user message as a content inset.
 * Only registers if: user message, at index messages.length-2, and last message is assistant.
 */
const useMessageViewportRef = () => {
    const turnAnchor = useThreadViewport((s) => s.turnAnchor);
    const setUserMessageHeight = useThreadViewport(
        (s) => s.setUserMessageHeight,
    );

    const messageRole = useMessage(s => s.role);
    const messageIndex = useMessage(s => s.index);
    const messagesLength = useThread(s => s.messages.length);
    const lastMessageRole = useThread(s => s.messages.at(-1)?.role);

    const shouldRegisterAsInset = useMemo(
        () =>
            turnAnchor === "top" &&
            messageRole === "user" &&
            messageIndex === messagesLength - 2 &&
            lastMessageRole === "assistant",
        [turnAnchor, messageRole, messageIndex, messagesLength, lastMessageRole]
    );

    // todo this is web specific, we should use the runtime to get the height
    const getHeight = useCallback((el: HTMLElement) => el.offsetHeight, []);

    return useSizeHandle(
        shouldRegisterAsInset ? setUserMessageHeight : null,
        getHeight,
    );  
};

const useMessageRootRef = <T extends React.Ref<unknown>>(argRef: T) => {
    const isHoveringRef = useIsHoveringRef();
    const anchorUserMessageRef = useMessageViewportRef();

    const ref = useComposedRefs(argRef, isHoveringRef, anchorUserMessageRef);
    return {ref}
};

const webHooks: RuntimeHooks = {
  useMessageRootRef: useMessageRootRef as RuntimeHooks['useMessageRootRef'],
};

const webFunctions: RuntimeFunctions = {
  copyToClipboard: (value, callback) => {
    navigator.clipboard.writeText(value).then(() => {
      callback();
    });
  },
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
export const AiChatWebProvider = ({ children, components, hooks, fn }: { children: ReactNode, components?: Partial<RuntimeComponents>, hooks?: Partial<RuntimeHooks>, fn?: Partial<RuntimeFunctions> }) => {
  return (
    <RuntimeProvider hooks={{ ...webHooks, ...hooks }} components={{ ...webComponents, ...components }} functions={{ ...webFunctions, ...fn }}>
      {children}
    </RuntimeProvider>
  );
};
