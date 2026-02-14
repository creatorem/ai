"use client";

import React, { ComponentProps, forwardRef, useCallback, useMemo } from "react";
import { useRuntime } from "@creatorem/ai-chat/runtime";
import type { RuntimeComponents } from "@creatorem/ai-chat/component-types";

export { useMessage, useMessageStore } from "./message-by-index-provider";

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
    const { hooks: {useMessageRootRef}, components: { Box, MessageSpacer } } = useRuntime();
    const {ref, ...otherProps} = useMessageRootRef(forwardRef);

    return (
        <MessageSpacer>
            <Box 
                {...props} 
                ref={ref} 
                {...otherProps}
            />
        </MessageSpacer>
    );
});

MessagePrimitiveRoot.displayName = "MessagePrimitive.Root";
