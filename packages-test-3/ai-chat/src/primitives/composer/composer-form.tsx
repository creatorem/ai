"use client";

import {
  type ComponentRef,
  forwardRef,
  ComponentPropsWithoutRef,
} from "react";
import { useComposerSend } from "./composer-send";
import { composeEventHandlers } from "@creatorem/ai-chat/utils";
import { RuntimeComponents } from "@creatorem/ai-chat/component-types";
import { useRuntime } from "@creatorem/ai-chat/runtime";

export namespace ComposerPrimitiveRoot {
  export type Element = ComponentRef<RuntimeComponents['Form']>;
  /**
   * Props for the ComposerPrimitive.Root component.
   * Accepts all standard form element props.
   */
  export type Props = ComponentPropsWithoutRef<RuntimeComponents['Form']>;
}

/**
 * The root form container for message composition.
 *
 * This component provides a form wrapper that handles message submission when the form
 * is submitted (e.g., via Enter key or submit button). It automatically prevents the
 * default form submission and triggers the composer's send functionality.
 *
 * @example
 * ```tsx
 * <ComposerPrimitive.Root>
 *   <ComposerPrimitive.Input placeholder="Type your message..." />
 *   <ComposerPrimitive.Send>Send</ComposerPrimitive.Send>
 * </ComposerPrimitive.Root>
 * ```
 */
export const ComposerPrimitiveForm = forwardRef<
  ComposerPrimitiveRoot.Element,
  ComposerPrimitiveRoot.Props
>(({ onSubmit, ...rest }, forwardedRef) => {
  const { components: { Form } } = useRuntime();
  const send = useComposerSend();

  const handleSubmit: ComposerPrimitiveRoot.Props['onSubmit'] = (e) => {
    e.preventDefault();

    if (!send) return;
    send();
  };

  return (
    <Form
      {...rest}
      ref={forwardedRef}
      onSubmit={composeEventHandlers(onSubmit, handleSubmit)}
    />
  );
});
