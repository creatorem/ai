"use client";

import { composeEventHandlers } from "@radix-ui/primitive";
import { useComposedRefs } from "@radix-ui/react-compose-refs";
import { Slot } from "@radix-ui/react-slot";
import {
  ClipboardEvent,
  type KeyboardEvent,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import TextareaAutosize, {
  type TextareaAutosizeProps,
} from "react-textarea-autosize";
import { useEscapeKeydown } from "@radix-ui/react-use-escape-keydown";
import { useComposer, useComposerStore } from "./composer-provider";
import { useThread } from "../thread/thread-root";
import { useAiContext } from "../ai-provider";
import { useOnScrollToBottom } from "../../hooks/use-on-scroll-to-bottom";
// import { useOnScrollToBottom } from "../../utils/hooks/use-on-scroll-to-bottom";
// import { useAuiState, useAui } from "@creatorem/ai-assistant-store";
// import { flushResourcesSync } from "@creatorem/ai-tap";

export namespace ComposerPrimitiveInput {
  export type Element = HTMLTextAreaElement;
  export type Props = TextareaAutosizeProps & {
    /**
     * Whether to render as a child component using Slot.
     * When true, the component will merge its props with its child.
     */
    asChild?: boolean | undefined;
    /**
     * Whether to submit the message when Enter is pressed (without Shift).
     * @default true
     */
    submitOnEnter?: boolean | undefined;
    /**
     * Whether to cancel message composition when Escape is pressed.
     * @default true
     */
    cancelOnEscape?: boolean | undefined;
    /**
     * Whether to automatically focus the input when a new run starts.
     * @default true
     */
    unstable_focusOnRunStart?: boolean | undefined;
    /**
     * Whether to automatically focus the input when scrolling to bottom.
     * @default true
     */
    unstable_focusOnScrollToBottom?: boolean | undefined;
    /**
     * Whether to automatically focus the input when switching threads.
     * @default true
     */
    unstable_focusOnThreadSwitched?: boolean | undefined;
    /**
     * Whether to automatically add pasted files as attachments.
     * @default true
     */
    addAttachmentOnPaste?: boolean | undefined;
  };
}

/**
 * A text input component for composing messages.
 *
 * This component provides a rich text input experience with automatic resizing,
 * keyboard shortcuts, file paste support, and intelligent focus management.
 * It integrates with the composer context to manage message state and submission.
 *
 * @example
 * ```tsx
 * <ComposerPrimitive.Input
 *   placeholder="Type your message..."
 *   submitOnEnter={true}
 *   addAttachmentOnPaste={true}
 * />
 * ```
 */
export const ComposerPrimitiveInput = forwardRef<
  ComposerPrimitiveInput.Element,
  ComposerPrimitiveInput.Props
>(
  (
    {
      autoFocus = false,
      asChild,
      disabled: disabledProp,
      onChange,
      onKeyDown,
      onPaste,
      submitOnEnter = true,
      cancelOnEscape = true,
      unstable_focusOnRunStart = true,
      unstable_focusOnScrollToBottom = true,
      unstable_focusOnThreadSwitched = true,
      addAttachmentOnPaste = true,
      ...rest
    },
    forwardedRef,
  ) => {
    const eventHandler = useAiContext(s => s.eventHandler);
    const isEditing = useComposer(s => s.isEditing);
    const text = useComposer(s => s.text);
    const composerType = useComposer(s => s.type);
    const composerStore = useComposerStore();
    const isThreadDisabled = useThread(s => s.isDisabled);
    const isThreadRunning = useThread(s => s.isRunning);
    const threadCapabilities = useThread(s => s.capabilities);

    const value = useMemo(() => {
      if (!isEditing) return "";
      return text;
    }, [isEditing, text]);

    const Component = asChild ? Slot : TextareaAutosize;

    const isDisabled = useMemo(
      () =>
        // isThreadDisabled || composer.dictation?.inputDisabled,
        disabledProp || isThreadDisabled,
      [disabledProp, isThreadDisabled]);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const ref = useComposedRefs(forwardedRef, textareaRef);

    useEscapeKeydown((e) => {
      if (!cancelOnEscape) return;

      // Only handle ESC if it originated from within this input
      if (!textareaRef.current?.contains(e.target as Node)) return;

      const { canCancel, cancel } = composerStore.getState();
      if (canCancel) {
        cancel();
        e.preventDefault();
      }
    });

    const handleKeyPress = (e: KeyboardEvent) => {
      if (isDisabled || !submitOnEnter) return;

      // ignore IME composition events
      if (e.nativeEvent.isComposing) return;

      if (e.key === "Enter" && e.shiftKey === false) {

        if (!isThreadRunning) {
          e.preventDefault();

          textareaRef.current?.closest("form")?.requestSubmit();
        }
      }
    };

    const handlePaste = async (e: ClipboardEvent<HTMLTextAreaElement>) => {
      if (!addAttachmentOnPaste) return;
      const files = Array.from(e.clipboardData?.files || []);

      if (threadCapabilities.attachments && files.length > 0) {
        try {
          e.preventDefault();
          await Promise.all(
            files.map((file) => composerStore.getState().addAttachment(file)),
          );
        } catch (error) {
          console.error("Error adding attachment:", error);
        }
      }
    };

    const autoFocusEnabled = autoFocus && !isDisabled;
    const focus = useCallback(() => {
      const textarea = textareaRef.current;
      if (!textarea || !autoFocusEnabled) return;

      textarea.focus({ preventScroll: true });
      textarea.setSelectionRange(textarea.value.length, textarea.value.length);
    }, [autoFocusEnabled]);

    useEffect(() => focus(), [focus]);

    useOnScrollToBottom(() => {
      if (
        composerType === "thread" &&
        unstable_focusOnScrollToBottom
      ) {
        focus();
      }
    });

    useEffect(() => {
      if (
        composerType !== "thread" ||
        !unstable_focusOnRunStart
      )
        return undefined;

      return eventHandler.on("thread.runStart", focus);
    }, [unstable_focusOnRunStart, eventHandler, focus, composerType]);

    useEffect(() => {
      if (
        composerType !== "thread" ||
        !unstable_focusOnThreadSwitched
      )
        return undefined;

      return eventHandler.on("threadListItem.switchedTo", focus);
    }, [unstable_focusOnThreadSwitched, eventHandler, focus, composerType]);

    return (
      // @ts-ignore
      <Component
        name="input"
        value={value}
        {...rest}
        ref={ref as React.ForwardedRef<HTMLTextAreaElement>}
        disabled={isDisabled}
        onChange={composeEventHandlers(onChange, (e) => {
          if (!isEditing) return;
          composerStore.getState().setText(e.target.value);
        })}
        onKeyDown={composeEventHandlers(onKeyDown, handleKeyPress)}
        onPaste={composeEventHandlers(onPaste, handlePaste)}
      />
    );
  },
);

ComposerPrimitiveInput.displayName = "ComposerPrimitive.Input";
