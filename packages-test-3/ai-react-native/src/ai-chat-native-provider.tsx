import React from 'react';
import { View, Text, Pressable, ScrollView, TextInput, Image as NativeImage } from 'react-native';
import { RuntimeProvider } from '@creatorem/ai-chat/runtime';
import type { RuntimeHooks } from '@creatorem/ai-chat/hook-types';
import type { RuntimeComponents } from "@creatorem/ai-chat/component-types";
import { useNativeAutoScroll } from './hooks/use-native-auto-scroll';
import { useNativeMeasure } from './hooks/use-native-measure';
import { useNativeHover } from './hooks/use-native-hover';

const NativeComponents: RuntimeComponents = {
  Box: ({ className, ...props }) => <View {...props} />,
  Text: ({ className, ...props }) => <Text {...props} />,
  Form: ({ className, onSubmit, ...props }) => <View {...props} />,
  Button: ({ className, onClick, ...props }) => (
    <Pressable onPress={onClick} {...props}>
      {props.children}
    </Pressable>
  ),
  ScrollArea: ({ className, ...props }) => <ScrollView {...props} />,
  Input: ({ className, onChange, ...props }) => (
      <TextInput 
        onChangeText={(t) => onChange?.({ target: { value: t } } as any)} 
        {...props} 
      />
  ),
  Textarea: ({ className, onChange, minRows, maxRows, onHeightChange, cacheMeasurements, rowHeight, ...props }) => (
      <TextInput 
        multiline 
        onChangeText={(t) => onChange?.({ target: { value: t } } as any)} 
        {...props} 
      />
  ),

  // Action bar
  ActionBarRoot: ({ children, ...props }) => <View {...props} style={[{ flexDirection: 'row' }, props.style]}>{children}</View>,
  ActionBarPortal: ({ children }) => <>{children}</>,
  ActionBarContent: ({ children, sideOffset, ...props }) => <View {...props}>{children}</View>,
  ActionBarItem: ({ children, ...props }) => <View {...props}>{children}</View>,
  ActionBarSeparator: ({ ...props }) => <View {...props} style={[{ width: 1, backgroundColor: '#ccc', marginHorizontal: 4 }, props.style]} />,
  ActionBarTrigger: ({ children, ...props }) => <Pressable {...props}>{children}</Pressable>,

  // Thread List Item More
  ThreadListItemMoreRoot: ({ children, ...props }) => <View {...props}>{children}</View>,
  ThreadListItemMorePortal: ({ children }) => <>{children}</>,
  ThreadListItemMoreContent: ({ children, sideOffset, ...props }) => <View {...props}>{children}</View>,
  ThreadListItemMoreItem: ({ children, ...props }) => <Pressable {...props}>{children}</Pressable>,
  ThreadListItemMoreSeparator: ({ ...props }) => <View {...props} style={[{ height: 1, backgroundColor: '#ccc', marginVertical: 4 }, props.style]} />,
  ThreadListItemMoreTrigger: ({ children, ...props }) => <Pressable {...props}>{children}</Pressable>,
  
  // Content Components
  Markdown: ({ content, className, ...props }) => <Text {...props}>{content}</Text>,
  CodeBlock: ({ value, language, className, ...props }) => (
    <View {...props} style={[{ backgroundColor: '#f0f0f0', padding: 8, borderRadius: 4 }, props.style]}>
      <Text style={{ fontFamily: 'monospace' }}>{value}</Text>
    </View>
  ),
  Pre: ({ children, ...props }) => <View {...props}>{children}</View>,
  
  // Media Components
  Image: ({ src, alt, className, ...props }) => (
    <NativeImage source={{ uri: src }} accessibilityLabel={alt} {...props} style={[{ width: 200, height: 200 }, props.style]} />
  ),
  Avatar: ({ src, fallback, className }) => (
    <View style={{ width: 40, height: 40, borderRadius: 20, overflow: 'hidden', backgroundColor: '#e0e0e0' }}>
       {src ? <NativeImage source={{ uri: src }} style={{ width: '100%', height: '100%' }} /> : <Text>{fallback}</Text>}
    </View>
  ),
  
  // Attachments
  ComposerPrimitiveAddAttachment: ({ onClick, children, ...props }) => (
    <Pressable onPress={onClick} {...props}>
      {children}
    </Pressable>
  ),

  Attachment: ({ name, contentType, url, size, onRemove, className }) => (
     <View style={{ flexDirection: 'row', alignItems: 'center', padding: 8, backgroundColor: '#f5f5f5', borderRadius: 4 }}>
        <Text>{name}</Text>
        {onRemove && (
            <Pressable onPress={onRemove} style={{ marginLeft: 8 }}>
                <Text>X</Text>
            </Pressable>
        )}
     </View>
  ),

  // Layout
  Separator: ({ orientation = 'horizontal', className, ...props }) => (
    <View 
        {...props} 
        style={[
            orientation === 'horizontal' ? { height: 1, width: '100%' } : { width: 1, height: '100%' }, 
            { backgroundColor: '#e0e0e0' },
            props.style
        ]} 
    />
  ),
  
  // Logic/Wrappers
  MessageSpacer: ({ children, ...props }) => <View {...props}>{children}</View>,
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
