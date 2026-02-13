import React from "react";
import {
  View,
  Pressable,
  ScrollView,
  Image as NativeImage,
} from "react-native";
import type { RuntimeComponents } from "@creatorem/ai-chat/component-type-check";
import { Text } from "../ui/text";
import { Button } from "../ui/button";
import { cn } from "~/utils/cn";
import { AutoResizeTextarea } from "../ui/autoresize-textarea";

export const appNativeComponents = {
  Box: View,
  Text: Text,
  Form: View,
  Button: ({
    onClick,
    ...props
  }: React.ComponentProps<RuntimeComponents["Button"]> &
    Omit<React.ComponentProps<typeof Button>, "onPress">) => (
    <Button onPress={onClick} {...props}>
      {props.children}
    </Button>
  ),
  ScrollArea: ScrollView,
  Input: AutoResizeTextarea,

  // Content Components
  Markdown: ({ content, ...props }) => <Text {...props}>{content}</Text>,
  CodeBlock: ({ value, language, ...props }) => (
    <View
      {...props}
      style={[
        { backgroundColor: "#f0f0f0", padding: 8, borderRadius: 4 },
        props.style,
      ]}
    >
      <Text style={{ fontFamily: "monospace" }}>{value}</Text>
    </View>
  ),
  Pre: ({ children, ...props }) => <View {...props}>{children}</View>,

  // Media Components
  Image: ({ src, alt, ...props }) => (
    <NativeImage
      source={{ uri: src }}
      accessibilityLabel={alt}
      alt={alt}
      {...props}
      style={[{ width: 200, height: 200 }, props.style]}
    />
  ),
  Avatar: ({ src, fallback, className, ...props }) => (
    <View
      // style={{
      //   width: 40,
      //   height: 40,
      //   borderRadius: 20,
      //   overflow: "hidden",
      //   backgroundColor: "#e0e0e0",
      // }}
      className={cn(
        "size-10 overflow-hidden rounded-full bg-background",
        className,
      )}
      {...props}
    >
      {src ? (
        <NativeImage
          source={{ uri: src }}
          style={{ width: "100%", height: "100%" }}
        />
      ) : (
        <Text>{fallback}</Text>
      )}
    </View>
  ),

  // Attachments
  ComposerPrimitiveAddAttachment: ({ onClick, children, ...props }) => (
    <Pressable onPress={onClick} {...props}>
      {children}
    </Pressable>
  ),

  Attachment: ({ name, contentType, url, size, onRemove, className }) => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 8,
        backgroundColor: "#f5f5f5",
        borderRadius: 4,
      }}
    >
      <Text>{name}</Text>
      {onRemove && (
        <Pressable onPress={onRemove} style={{ marginLeft: 8 }}>
          <Text>X</Text>
        </Pressable>
      )}
    </View>
  ),

  // Layout
  Separator: ({ orientation = "horizontal", className, ...props }) => (
    <View
      {...props}
      style={[
        orientation === "horizontal"
          ? { height: 1, width: "100%" }
          : { width: 1, height: "100%" },
        { backgroundColor: "#e0e0e0" },
        props.style,
      ]}
    />
  ),

  // Logic/Wrappers
  MessageSpacer: ({ children, ...props }) => <View {...props}>{children}</View>,
} satisfies RuntimeComponents;
