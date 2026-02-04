// hooks
export { useAui } from "./use-aui";
export { useAuiState } from "./use-aui-state";
export { useAuiEvent } from "./use-aui-event";

// components
export { AuiIf } from "./aui-if";
export { AuiProvider } from "./utils/react-assistant-context";

// resources
export { Derived } from "./derived";
export { attachDefaultPeers } from "./attach-default-peers";

// tap hooks
export {
  tapAssistantClientRef,
  tapAssistantEmit,
} from "./utils/tap-assistant-context";
export { tapClientResource } from "./tap-client-resource";
export { tapClientLookup } from "./tap-client-lookup";
export { tapClientList } from "./tap-client-list";

// types
export type {
  ClientRegistry,
  ClientOutput,
  AssistantClient,
  AssistantState,
} from "./types/client";
export type {
  AssistantEventName,
  AssistantEventCallback,
  AssistantEventPayload,
  AssistantEventSelector,
  AssistantEventScope,
} from "./types/events";
export type { DefaultPeers } from "./attach-default-peers";
