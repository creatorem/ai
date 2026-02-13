import React from 'react';
import { RuntimeFunctions, RuntimeProvider } from '@creatorem/ai-chat/runtime';
import type { RuntimeHooks } from '@creatorem/ai-chat/hook-types';
import type { RuntimeComponents } from "@creatorem/ai-chat/component-types";
import { useNativeAutoScroll } from './hooks/use-native-auto-scroll';
import { useNativeMeasure } from './hooks/use-native-measure';
import { nativeComponents } from './native-components';
import Clipboard from "@react-native-clipboard/clipboard";
import { useMessageStore } from '@creatorem/ai-chat/primitives/message';
import { useEffect } from 'react';

const useMessageRootRef = <T extends React.Ref<unknown>>(ref: T) => {
  const messageStore = useMessageStore();

  useEffect(() => {
    messageStore.getState().setIsHovering(true);
  }, [messageStore])

  return ref
};

const nativeHooks: RuntimeHooks = {
  useAutoScroll: useNativeAutoScroll,
  useMeasure: useNativeMeasure,
  useMessageRootRef: useMessageRootRef as RuntimeHooks['useMessageRootRef'],
};

const nativeFunctions: RuntimeFunctions = {
  copyToClipboard: (value, callback) => {
    Clipboard.setString(value);
    callback();
  },
};

export const AiChatNativeProvider = ({ children, components, hooks, fn }: { children: React.ReactNode, components?: Partial<RuntimeComponents>, hooks?: Partial<RuntimeHooks>, fn?: Partial<RuntimeFunctions> }) => (
  <RuntimeProvider components={{ ...nativeComponents, ...components }} hooks={{ ...nativeHooks, ...hooks }} functions={{ ...nativeFunctions, ...fn }}>
    {children}
  </RuntimeProvider>
);
