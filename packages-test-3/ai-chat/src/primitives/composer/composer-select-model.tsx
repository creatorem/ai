"use client";

import { useCallback } from "react";
import { useAiContextStore } from "../../ai-provider";
import { ActionButtonElement, ActionButtonProps, createActionButton } from "../../utils/create-action-button";

type SelectModelProps = {
  model: string;
};

const useComposerSelectModel = ({ model }: SelectModelProps) => {
  const aiContextStore = useAiContextStore();

  return useCallback(() => {
    aiContextStore.setState({ selectedModel: model });
  }, [aiContextStore, model]);
};

export namespace ComposerPrimitiveSelectModel {
  export type Element = ActionButtonElement;
  export type Props = ActionButtonProps<typeof useComposerSelectModel>;
}

export const ComposerPrimitiveSelectModel = createActionButton(
  "ComposerPrimitive.SelectModel",
  useComposerSelectModel,
  ["model"],
);
