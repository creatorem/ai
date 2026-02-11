import React from 'react';
import { View, Text, Pressable, ScrollView, TextInput } from 'react-native';
import { RuntimeProvider } from '@creatorem/ai-chat/runtime';
import type { RuntimeHooks } from '@creatorem/ai-chat/hook-types';
import type { RuntimeComponents } from "@creatorem/ai-chat/component-types";
import { useNativeAutoScroll } from './hooks/use-native-auto-scroll';
import { useNativeMeasure } from './hooks/use-native-measure';
import { useNativeHover } from './hooks/use-native-hover';

const NativeComponents: RuntimeComponents = {
  Box: ({ className, ...props }) => <View {...props} />,
  Text: ({ className, ...props }) => <Text {...props} />,
  Button: ({ className, onClick, ...props }) => (
    <Pressable onPress={onClick} {...props}>
      {props.children}
    </Pressable>
  ),
  ScrollArea: ({ className, ...props }) => <ScrollView {...props} />,
  Input: ({ className, onChange, ...props }) => (
      <TextInput 
        onChangeText={(t) => onChange?.({ target: { value: t } })} 
        {...props} 
      />
  ),
  Textarea: ({ className, onChange, ...props }) => (
      <TextInput 
        multiline 
        onChangeText={(t) => onChange?.({ target: { value: t } })} 
        {...props} 
      />
  )
};

const NativeHooks: RuntimeHooks = {
  useAutoScroll: useNativeAutoScroll,
  useMeasure: useNativeMeasure,
  useHover: useNativeHover,
};

export const AiChatNativeProvider = ({ children }: { children: React.ReactNode }) => (
  <RuntimeProvider components={NativeComponents} hooks={NativeHooks}>
    {children}
  </RuntimeProvider>
);
