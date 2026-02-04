import { ComponentType } from "react";
import type { ModelContextProvider } from "../../../model-context/model-context-types";
import type { Unsubscribe } from "../../../types/unsubscribe";
import { ThreadListRuntimeCore } from "./thread-list-runtime-core";

export type AssistantRuntimeCore = {
  readonly threads: ThreadListRuntimeCore;

  registerModelContextProvider: (provider: ModelContextProvider) => Unsubscribe;
  getModelContextProvider: () => ModelContextProvider;

  /**
   * EXPERIMENTAL: A component that is rendered inside the AssistantRuntimeProvider.
   *
   * Note: This field is expected to never change.
   * To update the component, use a zustand store.
   */
  readonly RenderComponent?: ComponentType | undefined;
};
