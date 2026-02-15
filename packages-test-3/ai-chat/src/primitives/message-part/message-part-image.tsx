"use client";

import { type ComponentRef, forwardRef, ComponentPropsWithoutRef } from "react";
import { useMessagePartImage } from "./use-message-part-image";
import { useRuntime } from "@creatorem/ai-chat/runtime";
import type { RuntimeComponents } from "@creatorem/ai-chat/component-types";

export namespace MessagePartPrimitiveImage {
  export type Element = ComponentRef<RuntimeComponents["Image"]>;
  /**
   * Props for the MessagePartPrimitive.Image component.
   */
  export type Props = Omit<
    ComponentPropsWithoutRef<RuntimeComponents["Image"]>,
    "src"
  >;
}

/**
 * Renders an image from the current message part context.
 *
 * This component displays image content from the current message part,
 * automatically setting the src attribute from the message part's image data.
 *
 * @example
 * ```tsx
 * <MessagePartPrimitive.Image
 *   alt="Generated image"
 *   className="message-image"
 *   style={{ maxWidth: '100%' }}
 * />
 * ```
 */
export const MessagePartPrimitiveImage = forwardRef<
  MessagePartPrimitiveImage.Element,
  MessagePartPrimitiveImage.Props
>((props, forwardedRef) => {
  const { image } = useMessagePartImage();
  const {
    components: { Image },
  } = useRuntime();

  return <Image src={image} {...props} ref={forwardedRef} />;
});

MessagePartPrimitiveImage.displayName = "MessagePartPrimitive.Image";
