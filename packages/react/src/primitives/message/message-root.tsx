"use client";

import { Primitive } from "@radix-ui/react-primitive";
import {
  type ComponentRef,
  forwardRef,
  ComponentPropsWithoutRef,
  useCallback,
} from "react";
import { useAiChat } from "@creatorem/ai-store";
import { useManagedRef } from "../../utils/hooks/use-managed-ref";
import { useSizeHandle } from "../../utils/hooks/use-size-handle";
import { useComposedRefs } from "@radix-ui/react-compose-refs";
import { useThreadViewport } from "../../context/react/thread-viewport-context";
import { ThreadPrimitiveViewportSlack } from "../thread/thread-viewport-slack";

const useIsHoveringRef = () => {
  const messageMethods = useAiChat(({message}) => message.methods);

  const callbackRef = useCallback(
    (el: HTMLElement) => {
      const handleMouseEnter = () => {
        messageMethods.setIsHovering(true);
      };
      const handleMouseLeave = () => {
        messageMethods.setIsHovering(false);
      };

      el.addEventListener("mouseenter", handleMouseEnter);
      el.addEventListener("mouseleave", handleMouseLeave);

      if (el.matches(":hover")) {
        // TODO this is needed for SSR to work, figure out why
        queueMicrotask(() => messageMethods.setIsHovering(true));
      }

      return () => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
        messageMethods.setIsHovering(false);
      };
    },
    [messageMethods],
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

  // inset rules:
  // - the previous user message before the last assistant message registers its full height
  const shouldRegisterAsInset = useAiChat(
    ({ thread, message }) =>
      turnAnchor === "top" &&
      message.role === "user" &&
      message.index === thread.messages.length - 2 &&
      thread.messages.at(-1)?.role === "assistant",
  );

  const getHeight = useCallback((el: HTMLElement) => el.offsetHeight, []);

  return useSizeHandle(
    shouldRegisterAsInset ? registerUserHeight : null,
    getHeight,
  );
};

export namespace MessagePrimitiveRoot {
  export type Element = ComponentRef<typeof Primitive.div>;
  /**
   * Props for the MessagePrimitive.Root component.
   * Accepts all standard div element props.
   */
  export type Props = ComponentPropsWithoutRef<typeof Primitive.div>;
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
  const ref = useComposedRefs<HTMLDivElement>(
    forwardRef,
    isHoveringRef,
    anchorUserMessageRef,
  );

  return (
    <ThreadPrimitiveViewportSlack>
      <Primitive.div {...props} ref={ref} />
    </ThreadPrimitiveViewportSlack>
  );
});

MessagePrimitiveRoot.displayName = "MessagePrimitive.Root";
