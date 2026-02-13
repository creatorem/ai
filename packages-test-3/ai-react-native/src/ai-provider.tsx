'use client';

import React from "react";
import { AiProvider as Provider } from "@creatorem/ai-chat/ai-provider";
import { AiChatNativeProvider } from "./ai-chat-native-provider";
import { RuntimeHooks } from "@creatorem/ai-chat/hook-types";
import { RuntimeComponents } from "@creatorem/ai-chat/component-types";
import { asyncStorageThreadAdapter } from "./adapters/async-storage-adapter";

export * from "@creatorem/ai-chat/ai-provider";

export function AiProvider({components,hooks, adapters: adaptersProp, ...props}: React.ComponentPropsWithoutRef<typeof Provider> & {components?: Partial<RuntimeComponents>, hooks?: Partial<RuntimeHooks>}) {
    const adapters = {
        ...adaptersProp,
        thread: adaptersProp?.thread ?? asyncStorageThreadAdapter,
    };
    
    return (
        <AiChatNativeProvider components={components} hooks={hooks}>
            <Provider {...props} adapters={adapters} />
        </AiChatNativeProvider>
    )
};
