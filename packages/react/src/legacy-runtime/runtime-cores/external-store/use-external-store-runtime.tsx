"use client";

import { useEffect, useMemo, useState } from "react";
import { ExternalStoreRuntimeCore } from "./external-store-runtime-core";
import { ExternalStoreAdapter } from "./external-store-adapter";
import {
  AssistantRuntime,
  AssistantRuntimeImpl,
} from "../../runtime/assistant-runtime";
import { useRuntimeAdapters } from "../adapters/runtime-adapter-provider";

export const useExternalStoreRuntime = <T,>(
  store: ExternalStoreAdapter<T>,
): AssistantRuntime => {
  const [runtime] = useState(() => new ExternalStoreRuntimeCore(store));

  useEffect(() => {
    runtime.setAdapter(store);
  });

  const { modelContext } = useRuntimeAdapters() ?? {};

  useEffect(() => {
    if (!modelContext) return undefined;
    return runtime.registerModelContextProvider(modelContext);
  }, [modelContext, runtime]);

  return useMemo(() => new AssistantRuntimeImpl(runtime), [runtime]);
};
