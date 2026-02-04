import { resource, tapEffect, tapInlineResource } from "@creatorem/ai-tap";
import type { AssistantRuntime } from "./runtime/assistant-runtime";
import { ThreadListClient } from "./client/thread-list-runtime-client";
import {
  tapAssistantClientRef,
  Derived,
  attachDefaultPeers,
} from "@creatorem/ai-store";
import { ModelContext } from "../client/model-context-client";
import { Tools, Suggestions } from "../model-context";

export const RuntimeAdapter = resource((runtime: AssistantRuntime) => {
  const clientRef = tapAssistantClientRef();

  tapEffect(() => {
    return runtime.registerModelContextProvider(
      clientRef.current!.modelContext(),
    );
  }, [runtime, clientRef]);

  return tapInlineResource(
    ThreadListClient({
      runtime: runtime.threads,
      __internal_assistantRuntime: runtime,
    }),
  );
});

attachDefaultPeers(RuntimeAdapter, {
  modelContext: ModelContext(),
  tools: Tools({}),
  suggestions: Suggestions(),
  threadListItem: Derived({
    source: "threads",
    query: { type: "main" },
    get: (aui) => aui.threads().item("main"),
  }),
  thread: Derived({
    source: "threads",
    query: { type: "main" },
    get: (aui) => aui.threads().thread("main"),
  }),
  composer: Derived({
    source: "thread",
    query: {},
    get: (aui) => aui.threads().thread("main").composer,
  }),
});
