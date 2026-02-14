import React from 'react';
import { View, Text, Pressable, ScrollView, TextInput, Image as NativeImage } from 'react-native';
import type { RuntimeComponents } from "@creatorem/ai-chat/component-type-check";
import { ComposerPrimitiveAddAttachmentFile } from "./primitives/composer/composer-add-attachment-file";
import { ThreadPrimitiveViewportSlack } from './primitives/thread/thread-viewport-slack';

export const nativeComponents: RuntimeComponents = {
  Box: ({ className, ...props }) => <View {...props} />,
  Text: ({ className, ...props }) => <Text {...props} />,
  // Form: ({ className, onSubmit, ...props }) => <View {...props} />,
  Button: ({ className, onClick, ...props }) => (
    <Pressable onPress={onClick} {...props}>
      {props.children}
    </Pressable>
  ),
  // ScrollArea: ({ className, ...props }) => <ScrollView {...props} />,
  Input: ({ className, onChange, minRows, maxRows, onHeightChange, cacheMeasurements, rowHeight, ...props }) => (
      <TextInput 
        multiline 
        onChangeText={(t) => onChange?.({ target: { value: t } } as any)} 
        {...props} 
      />
  ),

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
  ComposerPrimitiveAddAttachment: ComposerPrimitiveAddAttachmentFile,

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
  MessageSpacer: ThreadPrimitiveViewportSlack,
}
