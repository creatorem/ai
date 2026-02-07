import "./types/store-augmentation";

// Re-export from @creatorem/ai-store
// export {
//   useAui,
//   AuiProvider,
//   useAuiState,
//   useAuiEvent,
//   AuiIf,
//   type AssistantClient,
//   type AssistantState,
//   type AssistantEventScope,
//   type AssistantEventSelector,
//   type AssistantEventName,
//   type AssistantEventPayload,
//   type AssistantEventCallback,
// } from "@creatorem/ai-store";

export * from "./context";
// export * from "./model-context";
export * from "./primitives";
export * from "@creatorem/ai-store/types";
// export * from "./devtools";

// export * as INTERNAL from "./internal";
// export type { ToolExecutionStatus } from "./internal";

// export type { Assistant } from "./augmentations";

// ============================================================================
// Backwards compatibility - deprecated exports
// ============================================================================

/**
 * @deprecated Use `useAui` instead. This alias will be removed in v0.13.
 */
export { useAiChat, useAiChatShallow } from "@creatorem/ai-store";

/**
 * @deprecated Use `AuiIf` instead. This alias will be removed in v0.13.
 */
export { AiUiIf as AssistantIf } from "@creatorem/ai-store";
