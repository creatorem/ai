import { useRef, useCallback } from 'react';
import type { ScrollView } from 'react-native';
import type { AutoScrollConfig, AutoScrollResult } from '@creatorem/ai-chat/runtime/context';

export const useNativeAutoScroll = (config?: AutoScrollConfig): AutoScrollResult => {
  const scrollViewRef = useRef<ScrollView>(null);

  const scrollToBottom = useCallback(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, []);

  return {
    scrollToBottom,
    ref: (node) => { scrollViewRef.current = node; }
  };
};
