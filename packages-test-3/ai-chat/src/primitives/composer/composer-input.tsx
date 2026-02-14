"use client";

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
import { useThread } from "@creatorem/ai-chat/primitives/thread";
import { useAiContext } from "../../ai-provider";
import { useOnScrollToBottom } from "../../hooks/use-on-scroll-to-bottom";
import { useRuntime } from "@creatorem/ai-chat/runtime";
import type { RuntimeComponents } from "@creatorem/ai-chat/component-types";
import { composeEventHandlers } from "../../utils/compose-event-handlers";
import { useEscapeKeydown } from "../../hooks/use-escape-keydown";
import { useComposedRefs } from "@creatorem/ai-chat/utils";

export namespace ComposerPrimitiveInput {
  export type Element = RuntimeComponents['Input'];
  export type Props = React.ComponentPropsWithoutRef<RuntimeComponents['Input']> & {
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
    const { components: { Input } } = useRuntime();
    console.log( {composerType} )

    const value = useMemo(() => {
      return text;
    }, [text]);


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
      if (textareaRef.current && 'contains' in textareaRef.current && typeof textareaRef.current.contains === 'function' && !textareaRef.current.contains(e.target as Node)) return;

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

        if (!isThreadRunning && textareaRef.current && 'closest' in textareaRef.current && typeof textareaRef.current.closest === 'function') {
          e.preventDefault();

          textareaRef.current.closest("form")?.requestSubmit();
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

      if ('focus' in textarea && typeof textarea.focus === 'function' && 'setSelectionRange' in textarea && typeof textarea.setSelectionRange === 'function' && 'value' in textarea && typeof textarea.value === 'string') {
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

    console.log( 'ComposerPrimitiveInput' )

    return (
      <Input
        name="input"
        value={value}
        {...rest}
        ref={ref}
        disabled={isDisabled}
        onChange={composeEventHandlers(onChange, (value) => {
          composerStore.getState().setText(value);
        })}
        onKeyDown={composeEventHandlers(onKeyDown, handleKeyPress)}
        onPaste={composeEventHandlers(onPaste, handlePaste)}
      />
    );
  },
);

ComposerPrimitiveInput.displayName = "ComposerPrimitive.Input";
