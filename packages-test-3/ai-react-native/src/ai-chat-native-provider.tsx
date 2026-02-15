import React, { useCallback, useContext, useMemo } from "react";
import { RuntimeFunctions, RuntimeProvider } from "@creatorem/ai-chat/runtime";
import type { RuntimeHooks } from "@creatorem/ai-chat/hook-types";
import type { RuntimeComponents } from "@creatorem/ai-chat/component-types";
import { nativeComponents } from "./native-components";
import Clipboard from "@react-native-clipboard/clipboard";
import { useEffect } from "react";
import { ThreadViewportContext } from "../../ai-chat/src/primitives/thread/thread-viewport-context";

import { useComposedRefs } from "@creatorem/ai-chat/utils";
import { useThread } from "@creatorem/ai-chat/primitives/thread";
import { useManagedRef } from "@creatorem/ai-chat/hooks";
import {
  useMessage,
  useMessageStore,
} from "@creatorem/ai-chat/primitives/message";
import { LayoutChangeEvent } from "react-native";

/**
 * Hook that registers the anchor user message as a content inset.
 * Only registers if: user message, at index messages.length-2, and last message is assistant.
 */
const useMessageViewportRef: RuntimeHooks["useMessageRootRef"] = (ref) => {
  // hook order issue when using useThreadViewport
  // const turnAnchor = useThreadViewport((s) => s.turnAnchor);
  const viewportContext = useContext(ThreadViewportContext);
  const turnAnchor = viewportContext?.useThreadViewport((s) => s.turnAnchor);

  const messageRole = useMessage((s) => s.role);
  const messageIndex = useMessage((s) => s.index);
  const messagesLength = useThread((s) => s.messages.length);
  const lastMessageRole = useThread((s) => s.messages.at(-1)?.role);

  const shouldRegisterAsInset = useMemo(
    () =>
      turnAnchor === "top" &&
      messageRole === "user" &&
      messageIndex === messagesLength - 2 &&
      lastMessageRole === "assistant",
    [turnAnchor, messageRole, messageIndex, messagesLength, lastMessageRole],
  );

  // hook order issue when using useThreadViewport
  const setUserMessageHeight = viewportContext?.useThreadViewport(
    (s) => s.setUserMessageHeight,
  );

  const handleLayout = (event: LayoutChangeEvent) => {
    if (!shouldRegisterAsInset) return;
    setUserMessageHeight?.(event.nativeEvent.layout.height);
  };

  return { onLayout: handleLayout, ref };
};

const useMessageRootRef = <T extends React.Ref<unknown>>(ref: T) => {
  const messageStore = useMessageStore();

  useEffect(() => {
    messageStore.getState().setIsHovering(true);
  }, [messageStore]);

  return useMessageViewportRef(ref);
};

const nativeHooks: RuntimeHooks = {
  useMessageRootRef,
};

const nativeFunctions: RuntimeFunctions = {
  copyToClipboard: (value, callback) => {
    Clipboard.setString(value);
    callback();
  },
};

export const AiChatNativeProvider = ({
  children,
  components,
  hooks,
  fn,
}: {
  children: React.ReactNode;
  components?: Partial<RuntimeComponents>;
  hooks?: Partial<RuntimeHooks>;
  fn?: Partial<RuntimeFunctions>;
}) => (
  <RuntimeProvider
    components={{ ...nativeComponents, ...components }}
    hooks={{ ...nativeHooks, ...hooks }}
    functions={{ ...nativeFunctions, ...fn }}
  >
    {children}
  </RuntimeProvider>
);
