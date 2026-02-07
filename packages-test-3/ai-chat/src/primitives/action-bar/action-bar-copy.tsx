"use client";

import { forwardRef, useMemo } from "react";
import { ActionButtonProps } from "../../utils/create-action-button";
import { composeEventHandlers } from "@radix-ui/primitive";
import { Primitive } from "@radix-ui/react-primitive";
import { useCallback } from "react";
import { useMessage } from "../message/message-by-index-provider";
import { useComposer } from "../composer/composer-root";

/**
 * Hook that provides copy functionality for action bar buttons.
 *
 * This hook returns a callback function that copies message content to the clipboard,
 * or null if copying is not available. It handles both regular message content and
 * composer text when in editing mode.
 *
 * @param options Configuration options
 * @param options.copiedDuration Duration in milliseconds to show the copied state
 * @returns A copy callback function, or null if copying is disabled
 *
 * @example
 * ```tsx
 * function CustomCopyButton() {
 *   const copy = useActionBarPrimitiveCopy({ copiedDuration: 2000 });
 *
 *   return (
 *     <button onClick={copy} disabled={!copy}>
 *       {copy ? "Copy" : "Cannot Copy"}
 *     </button>
 *   );
 * }
 * ```
 */
const useActionBarPrimitiveCopy = ({
  copiedDuration = 3000,
}: {
  copiedDuration?: number | undefined;
} = {}) => {
  const message = useMessage();
  const composer = useComposer({optional: true});

  const hasCopyableContent = useMemo(() => {
    return (
      (message.role !== "assistant" || message.status?.type !== "running") &&
      message.parts.some((c) => c.type === "text" && c.text.length > 0)
    );
  }, [message.role, message.status, message.parts]);

  const callback = useCallback(() => {
    const valueToCopy = composer?.isEditing ? composer.text : message.getCopyText();

    if (!valueToCopy) return;

    navigator.clipboard.writeText(valueToCopy).then(() => {
      message.setIsCopied(true);
      setTimeout(() => message.setIsCopied(false), copiedDuration);
    });
  }, [message, composer?.isEditing, composer?.text, copiedDuration]);

  if (!hasCopyableContent) return null;
  return callback;
};

export namespace ActionBarPrimitiveCopy {
  export type Element = HTMLButtonElement;
  /**
   * Props for the ActionBarPrimitive.Copy component.
   * Inherits all button element props and action button functionality.
   */
  export type Props = ActionButtonProps<typeof useActionBarPrimitiveCopy>;
}

/**
 * A button component that copies message content to the clipboard.
 *
 * This component automatically handles copying message text to the clipboard
 * and provides visual feedback through the data-copied attribute. It's disabled
 * when there's no copyable content available.
 *
 * @example
 * ```tsx
 * <ActionBarPrimitive.Copy copiedDuration={2000}>
 *   Copy Message
 * </ActionBarPrimitive.Copy>
 * ```
 */
export const ActionBarPrimitiveCopy = forwardRef<
  ActionBarPrimitiveCopy.Element,
  ActionBarPrimitiveCopy.Props
>(({ copiedDuration, onClick, disabled, ...props }, forwardedRef) => {
  const { isCopied } = useMessage();
  const callback = useActionBarPrimitiveCopy({ copiedDuration });
  return (
    <Primitive.button
      type="button"
      {...(isCopied ? { "data-copied": "true" } : {})}
      {...props}
      ref={forwardedRef}
      disabled={disabled || !callback}
      onClick={composeEventHandlers(onClick, () => {
        callback?.();
      })}
    />
  );
});

ActionBarPrimitiveCopy.displayName = "ActionBarPrimitive.Copy";
