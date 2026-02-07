"use client";

import { useChat, type UIMessage } from "@ai-sdk/react";
import type { AssistantCloud } from "assistant-cloud";
import {
  useAISDKRuntime,
  type AISDKRuntimeAdapter,
  type CustomToCreateMessageFunction,
} from "./use-aisdk-runtime";
import { ChatInit, ChatTransport } from "ai";
import { AssistantChatTransport } from "./assistant-chat-transport";
import { useEffect, useMemo, useRef } from "react";
import { AiChatStore, useAiChat, useAiChatShallow } from "../../../store";
import { createLocalStorageThreadAdapter } from '../adapters/use-local-storage-thread-adapter';


export type UseChatRuntimeOptions<UI_MESSAGE extends UIMessage = UIMessage> =
  ChatInit<UI_MESSAGE> & {
    cloud?: AssistantCloud | undefined;
    adapters?: AISDKRuntimeAdapter["adapters"] | undefined;
    toCreateMessage?: CustomToCreateMessageFunction;
  };

const useDynamicChatTransport = <UI_MESSAGE extends UIMessage = UIMessage>(
  transport: ChatTransport<UI_MESSAGE>,
): ChatTransport<UI_MESSAGE> => {
  const transportRef = useRef<ChatTransport<UI_MESSAGE>>(transport);
  useEffect(() => {
    transportRef.current = transport;
  });
  const dynamicTransport = useMemo(
    () =>
      new Proxy(transportRef.current, {
        get(_, prop) {
          const res =
            transportRef.current[prop as keyof ChatTransport<UI_MESSAGE>];
          return typeof res === "function"
            ? res.bind(transportRef.current)
            : res;
        },
      }),
    [],
  );
  return dynamicTransport;
};

export const useChatRuntime = <UI_MESSAGE extends UIMessage = UIMessage>(
  options?: UseChatRuntimeOptions<UI_MESSAGE>,
): AiChatStore => {
  const {
    adapters,
    transport: transportOptions,
    toCreateMessage,
    ...chatOptions
  } = options ?? {};

  const transport = useDynamicChatTransport(
    transportOptions ?? new AssistantChatTransport(),
  );

  // useAiChat.getState().adapters.
  // const localStoreAdapter = useMemo(() => createLocalStorageThreadAdapter(), []);
  // const setAdapters = useAiChat(({setAdapters}) => setAdapters)
  // setAdapters(localStoreAdapter);


  // const id = useAuiState(({ threadListItem }) => threadListItem.id);
  // const id = useAiChat(({ threadListItem }) => threadListItem.id);
  // const chat = useChat({
  //   ...chatOptions,
  //   id,
  //   transport,
  // });

  // const runtime = useAISDKRuntime(chat, {
  //   adapters,
  //   ...(toCreateMessage && { toCreateMessage }),
  // });

  const store = useAiChat.getState()

  if (transport instanceof AssistantChatTransport) {
    transport.setStore(store);
  }

  return store;
};

// export const useChatRuntime = <UI_MESSAGE extends UIMessage = UIMessage>({
//   options
// }: UseChatRuntimeOptions<UI_MESSAGE> = {}): AiChatStore => {
//   // const localStoreAdapter = useLocalStorageThreadAdapter();
//       return useChatThreadRuntime(options);
// };
