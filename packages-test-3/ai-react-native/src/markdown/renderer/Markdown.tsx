import React, { useMemo } from "react";
import { View } from "react-native";
import { parseMarkdown } from "./parser";
import { renderNode } from "./renderNode";
import { createRenderers, type RendererColors } from "./renderers";
import type { HastNode, RenderersMap } from "./types";
import { useRuntime } from "@creatorem/ai-chat/runtime";

type Props = {
  content: string;
  colors: RendererColors;
  renderers?: Partial<RenderersMap>;
};

export function Markdown({ content, colors, renderers: customRenderers }: Props) {
  const components = useRuntime().components

  const renderers = useMemo(() => {
    const defaults = createRenderers(colors, components);
    if (!customRenderers) return defaults;
    return { ...defaults, ...customRenderers };
  }, [colors, customRenderers]);

  const tree = useMemo(() => parseMarkdown(content), [content]);

  return (
    <View>
      {tree.children
        .filter((node) => !(node.type === "text" && !node.value.trim()))
        .map((node, i) => renderNode(node as HastNode, renderers, i))}
    </View>
  );
}
