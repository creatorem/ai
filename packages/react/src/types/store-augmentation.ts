import "@creatorem/ai-store";

import type { ThreadsClientSchema } from "./scopes/threads";
import type { ThreadListItemClientSchema } from "./scopes/thread-list-item";
import type { ThreadClientSchema } from "./scopes/thread";
import type { MessageClientSchema } from "./scopes/message";
import type { PartClientSchema } from "./scopes/part";
import type { ComposerClientSchema } from "./scopes/composer";
import type { AttachmentClientSchema } from "./scopes/attachment";
import type { ToolsClientSchema } from "./scopes/tools";
import type { ModelContextClientSchema } from "./scopes/model-context";
import type { SuggestionsClientSchema } from "./scopes/suggestions";
import type { SuggestionClientSchema } from "./scopes/suggestion";

declare module "@creatorem/ai-store" {
  interface ClientRegistry {
    threads: ThreadsClientSchema;
    threadListItem: ThreadListItemClientSchema;
    thread: ThreadClientSchema;
    message: MessageClientSchema;
    part: PartClientSchema;
    composer: ComposerClientSchema;
    attachment: AttachmentClientSchema;
    tools: ToolsClientSchema;
    modelContext: ModelContextClientSchema;
    suggestions: SuggestionsClientSchema;
    suggestion: SuggestionClientSchema;
  }
}
