import React from "react";
import { Platform, Linking, Pressable } from "react-native";
import type { RendererProps, RendererPropsFor, RenderersMap } from "./types";
import type { useRuntime } from "@creatorem/ai-chat/runtime";

export type RendererColors = {
  textColor: string;
  textSecondaryColor: string;
};

const monoFont = Platform.OS === "ios" ? "Menlo" : "monospace";

export function createRenderers(colors: RendererColors, components: ReturnType<typeof useRuntime>['components']): RenderersMap {
  const { textColor, textSecondaryColor } = colors;
  const { Text, Box } = components;
  return {
    p: ({ children }: RendererProps) => (
      <Text style={{ color: textColor, fontSize: 16, lineHeight: 24, marginVertical: 4 }}>
        {children}
      </Text>
    ),

    strong: ({ children }: RendererProps) => (
      <Text style={{ fontWeight: "700", color: textColor }}>{children}</Text>
    ),

    em: ({ children }: RendererProps) => (
      <Text style={{ fontStyle: "italic" }}>{children}</Text>
    ),

    del: ({ children }: RendererProps) => (
      <Text style={{ textDecorationLine: "line-through" }}>{children}</Text>
    ),

    h1: ({ children }: RendererProps) => (
      <Text
        style={{
          color: textColor,
          fontSize: 24,
          fontWeight: "700",
          marginBottom: 8,
          marginTop: 16,
        }}
      >
        {children}
      </Text>
    ),

    h2: ({ children }: RendererProps) => (
      <Text
        style={{
          color: textColor,
          fontSize: 20,
          fontWeight: "700",
          marginBottom: 8,
          marginTop: 12,
        }}
      >
        {children}
      </Text>
    ),

    h3: ({ children }: RendererProps) => (
      <Text
        style={{
          color: textColor,
          fontSize: 18,
          fontWeight: "600",
          marginBottom: 6,
          marginTop: 10,
        }}
      >
        {children}
      </Text>
    ),

    h4: ({ children }: RendererProps) => (
      <Text
        style={{
          color: textColor,
          fontSize: 16,
          fontWeight: "600",
          marginBottom: 4,
          marginTop: 8,
        }}
      >
        {children}
      </Text>
    ),

    h5: ({ children }: RendererProps) => (
      <Text
        style={{
          color: textColor,
          fontSize: 15,
          fontWeight: "600",
          marginBottom: 4,
          marginTop: 8,
        }}
      >
        {children}
      </Text>
    ),

    h6: ({ children }: RendererProps) => (
      <Text
        style={{
          color: textColor,
          fontSize: 14,
          fontWeight: "600",
          marginBottom: 4,
          marginTop: 8,
        }}
      >
        {children}
      </Text>
    ),

    ul: ({ children }: RendererProps) => (
      <Box style={{ paddingLeft: 12, marginVertical: 8 }}>{children}</Box>
    ),

    ol: ({ children }: RendererProps) => (
      <Box style={{ paddingLeft: 12, marginVertical: 8 }}>{children}</Box>
    ),

    li: ({ children, node }: RendererProps) => {
      const parent = (node as any).__parent;
      const isOrdered = parent?.tagName === "ol";
      const index = parent?.children
        ? parent.children.filter((c: any) => c.type === "element").indexOf(node)
        : 0;
      const bullet = isOrdered ? `${index + 1}. ` : "\u2022 ";

      return (
        <Box style={{ flexDirection: "row", marginVertical: 4 }}>
          <Text style={{ color: textColor, fontSize: 16, lineHeight: 24 }}>
            {bullet}
          </Text>
          <Box style={{ flex: 1 }}>{children}</Box>
        </Box>
      );
    },

    blockquote: ({ children }: RendererProps) => (
      <Box
        style={{
          borderLeftWidth: 3,
          borderLeftColor: textColor,
          paddingLeft: 12,
          marginVertical: 8,
          opacity: 0.8,
        }}
      >
        {children}
      </Box>
    ),

    a: ({ children, href }: RendererPropsFor<"a">) => (
      <Pressable
        onPress={() => {
          if (href) Linking.openURL(href);
        }}
      >
        <Text style={{ color: textColor, textDecorationLine: "underline" }}>
          {children}
        </Text>
      </Pressable>
    ),

    code: ({ children, node, className }: RendererPropsFor<"code">) => {
      const isBlock = (node as any).__parent?.tagName === "pre";

      if (isBlock) {
        return (
          <Text
            style={{
              fontFamily: monoFont,
              fontSize: 14,
              color: textColor,
            }}
          >
            {children}
          </Text>
        );
      }

      return (
        <Text
          style={{
            backgroundColor: textSecondaryColor,
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: 4,
            fontFamily: monoFont,
            fontSize: 14,
          }}
        >
          {children}
        </Text>
      );
    },

    pre: ({ children }: RendererProps) => (
      <Box
        style={{
          backgroundColor: textSecondaryColor,
          padding: 12,
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
          // @ts-ignore
          fontFamily: monoFont,
          fontSize: 14,
        }}
      >
        {children}
      </Box>
    ),

    hr: () => (
      <Box
        style={{
          borderBottomWidth: 1,
          borderBottomColor: textColor,
          marginVertical: 12,
          opacity: 0.3,
        }}
      />
    ),

    img: ({ src, alt }: RendererPropsFor<"img">) => {
      if (!src) return null;
      return (
        <Text style={{ color: textColor, textDecorationLine: "underline" }}>
          {alt || src}
        </Text>
      );
    },

    br: () => <Text>{"\n"}</Text>,

    table: ({ children }: RendererProps) => (
      <Box style={{ marginVertical: 8, borderWidth: 1, borderColor: textColor, borderRadius: 4, opacity: 0.8 }}>
        {children}
      </Box>
    ),

    thead: ({ children }: RendererProps) => (
      <Box style={{ backgroundColor: textSecondaryColor }}>{children}</Box>
    ),

    tbody: ({ children }: RendererProps) => <Box>{children}</Box>,

    tr: ({ children }: RendererProps) => (
      <Box
        style={{
          flexDirection: "row",
          borderBottomWidth: 1,
          borderBottomColor: textColor,
        }}
      >
        {children}
      </Box>
    ),

    th: ({ children }: RendererProps) => (
      <Text
        style={{
          flex: 1,
          fontWeight: "700",
          color: textColor,
          padding: 8,
          fontSize: 14,
        }}
      >
        {children}
      </Text>
    ),

    td: ({ children }: RendererProps) => (
      <Text
        style={{
          flex: 1,
          color: textColor,
          padding: 8,
          fontSize: 14,
        }}
      >
        {children}
      </Text>
    ),

    input: ({ checked }: RendererPropsFor<"input">) => (
      <Text style={{ fontSize: 16 }}>{checked ? "\u2611 " : "\u2610 "}</Text>
    ),
  } as RenderersMap;
}
