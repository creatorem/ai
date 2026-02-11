'use client';

import React from "react";
import { AiProvider as Provider } from "@creatorem/ai-chat/ai-provider";
import { AiChatWebProvider } from "./ai-chat-web-provider";

export * from "@creatorem/ai-chat/ai-provider";

export function AiProvider(props: React.ComponentPropsWithoutRef<typeof Provider>) {
    return (
        <AiChatWebProvider>
            <Provider {...props} />
        </AiChatWebProvider>
    )
};
