"use client";

import { useComposedRefs } from "@radix-ui/react-compose-refs";
import {
  ClipboardEvent,
  type KeyboardEvent,
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { useComposer, useComposerStore } from "./composer-provider";
import { useThread } from "../thread/thread-root";
import { useAiContext } from "../../ai-provider";
import { useOnScrollToBottom } from "../../hooks/use-on-scroll-to-bottom";
import { useRuntime } from "@creatorem/ai-chat/runtime";
import type { RuntimeComponents } from "@creatorem/ai-chat/component-types";
import { composeEventHandlers } from "../../utils/compose-event-handlers";
import { useEscapeKeydown } from "../../hooks/use-escape-keydown";

export namespace ComposerPrimitiveInput {
  export type Element = RuntimeComponents['Textarea'];
  export type Props = React.ComponentPropsWithoutRef<RuntimeComponents['Textarea']> & {
    /**
     * Whether to render as a child component using Slot.
     * When true, the component will merge its props with its child.
     */
    // asChild?: boolean | undefined;
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
    const text = useComposer(s => s.text);
    const composerType = useComposer(s => s.type);
    const composerStore = useComposerStore();
    const isThreadDisabled = useThread(s => s.isDisabled);
    const isThreadRunning = useThread(s => s.isRunning);
    const threadCapabilities = useThread(s => s.capabilities);
    const { components: { Textarea } } = useRuntime();

    const value = useMemo(() => {
      return text;
    }, [text]);

    // const Component = asChild ? Slot : TextareaAutosize;

    const isDisabled = useMemo(
      () =>
        // isThreadDisabled || composer.dictation?.inputDisabled,
        disabledProp || isThreadDisabled,
      [disabledProp, isThreadDisabled]);

    const textareaRef = useRef<ComposerPrimitiveInput.Element>(null);
    const ref = useComposedRefs(forwardedRef, textareaRef);

    useEscapeKeydown((e) => {
      if (!cancelOnEscape) return;

      // Only handle ESC if it originated from within this input
      if (textareaRef.current instanceof HTMLElement && !textareaRef.current?.contains(e.target as Node)) return;

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

        if (!isThreadRunning && textareaRef.current instanceof HTMLElement) {
          e.preventDefault();

          textareaRef.current?.closest("form")?.requestSubmit();
        }
      }
    };

    const handlePaste = async (e: ClipboardEvent<unknown>) => {
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

      if (textarea instanceof HTMLTextAreaElement) {
        textarea.focus({ preventScroll: true });
        textarea.setSelectionRange(textarea.value.length, textarea.value.length);
      }
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
      <Textarea
        name="input"
        value={value}
        {...rest}
        ref={ref}
        disabled={isDisabled}
        onChange={composeEventHandlers(onChange, (e) => {
          composerStore.getState().setText(e.target.value);
        })}
        onKeyDown={composeEventHandlers(onKeyDown, handleKeyPress)}
        onPaste={composeEventHandlers(onPaste, handlePaste)}
      />
    );
  },
);

ComposerPrimitiveInput.displayName = "ComposerPrimitive.Input";
