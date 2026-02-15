"use client";

import { forwardRef, useCallback, useMemo } from "react";
import { ActionButtonProps } from "../../utils/create-action-button";
import { useMessage, useMessageStore } from "../message";
import { useRuntime } from "@creatorem/ai-chat/runtime";
import type { RuntimeComponents } from "@creatorem/ai-chat/component-types";

const useActionBarFeedbackPositive = () => {
  const messageStore = useMessageStore();

  const callback = useCallback(() => {
    messageStore.getState().submitFeedback({ type: "positive" });
  }, [messageStore]);

  return callback;
};

export namespace ActionBarPrimitiveFeedbackPositive {
  export type Element = RuntimeComponents["Button"];
  export type Props = ActionButtonProps<typeof useActionBarFeedbackPositive>;
}

export const ActionBarPrimitiveFeedbackPositive = forwardRef<
  ActionBarPrimitiveFeedbackPositive.Element,
  ActionBarPrimitiveFeedbackPositive.Props
>(({ onClick, disabled, ...props }, forwardedRef) => {
  const metadata = useMessage((s) => s.metadata);
  const isSubmitted = useMemo(
    () => metadata.submittedFeedback?.type === "positive",
    [metadata],
  );

  const callback = useActionBarFeedbackPositive();

  const {
    components: { Button },
  } = useRuntime();

  return (
    <Button
      type="button"
      {...(isSubmitted ? { "data-submitted": "true" } : {})}
      {...props}
      ref={forwardedRef}
      disabled={disabled || !callback}
      // @ts-expect-error
      onClick={(e: React.MouseEvent) => {
        onClick?.(e);
        callback?.();
      }}
    />
  );
});

ActionBarPrimitiveFeedbackPositive.displayName =
  "ActionBarPrimitive.FeedbackPositive";
