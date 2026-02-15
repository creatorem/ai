"use client";

import React from "react";
import { AiProvider as Provider } from "@creatorem/ai-chat/ai-provider";
import { AiChatWebProvider } from "./ai-chat-web-provider";
import { RuntimeHooks } from "@creatorem/ai-chat/hook-types";
import { RuntimeComponents } from "@creatorem/ai-chat/component-types";
import { localStorageThreadAdapter } from "./adapters/local-storage-adapter";

export * from "@creatorem/ai-chat/ai-provider";

export function AiProvider({
  components,
  hooks,
  adapters: adaptersProp,
  ...props
}: React.ComponentPropsWithoutRef<typeof Provider> & {
  components?: Partial<RuntimeComponents>;
  hooks?: Partial<RuntimeHooks>;
}) {
  const adapters = {
    ...adaptersProp,
    thread: adaptersProp?.thread ?? localStorageThreadAdapter,
  };

  return (
    <AiChatWebProvider components={components} hooks={hooks}>
      <Provider {...props} adapters={adapters} />
    </AiChatWebProvider>
  );
}
