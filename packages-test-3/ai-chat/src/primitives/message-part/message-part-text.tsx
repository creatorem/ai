"use client";

import {
  type ComponentRef,
  forwardRef,
  ComponentPropsWithoutRef,
} from "react";
import { useMessagePartText } from "./use-message-part-text";
import { useRuntime } from "@creatorem/ai-chat/runtime";
import type { RuntimeComponents } from "@creatorem/ai-chat/component-types";
import { useSmoothStream } from "../../utils/smooth-stream";

export namespace MessagePartPrimitiveText {
  export type Element = ComponentRef<RuntimeComponents['Text'] >;
  export type Props = Omit<
    ComponentPropsWithoutRef<RuntimeComponents['Text'] >,
    "children" | "asChild"
  > & {
    /**
     * Whether to enable smooth text streaming animation.
     * When enabled, text appears with a typing effect as it streams in.
     * @default true
     */
    smooth?: boolean;
  };
}

/**
 * Renders the text content of a message part with optional smooth streaming.
 *
 * This component displays text content from the current message part context,
 * with support for smooth streaming animation that shows text appearing
 * character by character as it's generated.
 *
 * @example
 * ```tsx
 * <MessagePartPrimitive.Text
 *   smooth={true}
 *   component="p"
 *   className="message-text"
 * />
 * ```
 */
export const MessagePartPrimitiveText = forwardRef<
  MessagePartPrimitiveText.Element,
  MessagePartPrimitiveText.Props
>(({ smooth = true, ...rest }, forwardedRef) => {
  const { text, status } = useSmoothStream(useMessagePartText(), smooth);
  const { components: { Text } } = useRuntime();

  return (
    <Text data-status={status.type} {...rest} ref={forwardedRef}>
      {text}
    </Text>
  );
});

MessagePartPrimitiveText.displayName = "MessagePartPrimitive.Text";
