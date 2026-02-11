"use client";

import React, { ComponentProps, forwardRef, useCallback, useMemo } from "react";
import { useThread } from "@creatorem/ai-chat/primitives/thread";
import { useManagedRef } from "../../hooks/use-managed-ref";
import { useThreadViewport } from "../thread/thread-viewport-context";
import { useSizeHandle } from "../../hooks/use-size-handle";
import { useComposedRefs } from "@creatorem/ai-chat/utils";
import { useMessage, useMessageStore } from "./message-by-index-provider";
import { useRuntime } from "@creatorem/ai-chat/runtime";
import type { RuntimeComponents } from "@creatorem/ai-chat/component-types";

export { useMessage, useMessageStore } from "./message-by-index-provider";


const useIsHoveringRef = () => {
    const messageStore = useMessageStore();

    const callbackRef = useCallback(
        (el: HTMLElement) => {
            if (typeof window === "undefined" || !window.addEventListener || !el || !el.addEventListener) return;

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
    const registerUserHeight = useThreadViewport(
        (s) => s.registerUserMessageHeight,
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
        shouldRegisterAsInset ? registerUserHeight : null,
        getHeight,
    );
};

export namespace MessagePrimitiveRoot {
    export type Element = RuntimeComponents['Box'];
    export type Props = ComponentProps<RuntimeComponents['Box']>;
}

/**
 * The root container component for a message.
 *
 * This component provides the foundational wrapper for message content and handles
 * hover state management for the message. It automatically tracks when the user
 * is hovering over the message, which can be used by child components like action bars.
 *
 * When `turnAnchor="top"` is set on the viewport, this component
 * registers itself as the scroll anchor if it's the last user message.
 *
 * @example
 * ```tsx
 * <MessagePrimitive.Root>
 *   <MessagePrimitive.Content />
 *   <ActionBarPrimitive.Root>
 *     <ActionBarPrimitive.Copy />
 *     <ActionBarPrimitive.Edit />
 *   </ActionBarPrimitive.Root>
 * </MessagePrimitive.Root>
 * ```
 */
export const MessagePrimitiveRoot = forwardRef<
    MessagePrimitiveRoot.Element,
    MessagePrimitiveRoot.Props
>((props, forwardRef) => {
    const isHoveringRef = useIsHoveringRef();
    const anchorUserMessageRef = useMessageViewportRef();
    const { components: { Box, MessageSpacer } } = useRuntime();

    const ref = useComposedRefs(
        forwardRef,
        isHoveringRef,
        anchorUserMessageRef,
    );

    return (
        <MessageSpacer>
            <Box 
                {...props} 
                ref={ref} 
            />
        </MessageSpacer>
    );
});

MessagePrimitiveRoot.displayName = "MessagePrimitive.Root";
