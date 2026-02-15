import React, { useEffect, useMemo } from "react";
import { View } from "react-native";
import { parseMarkdown } from "./parser";
import { renderNode } from "./renderNode";
import { createRenderers, type RendererColors } from "./renderers";
import type { HastNode, RenderersMap } from "./types";
import { useRuntime } from "@creatorem/ai-chat/runtime";
import type { RootContent, Element } from "hast";

type Props = {
  content: string;
  colors: RendererColors;
  renderers?: Partial<RenderersMap>;
};

function collectElementTags(nodes: RootContent[], tags: Set<string>): void {
  for (const node of nodes) {
    if (node.type !== "element") continue;
    const element = node as Element;
    tags.add(element.tagName);
    if (element.children?.length) {
      collectElementTags(element.children as RootContent[], tags);
    }
  }
}

export function Markdown({
  content,
  colors,
  renderers: customRenderers,
}: Props) {
  const components = useRuntime().components;

  const renderers = useMemo<RenderersMap>(() => {
    const defaults = createRenderers(colors, components);
    if (!customRenderers) return defaults;
    return { ...defaults, ...customRenderers } as RenderersMap;
  }, [colors, customRenderers, components]);

  const tree = useMemo(() => parseMarkdown(content), [content]);
  const customRendererKeys = useMemo(
    () => new Set(Object.keys(customRenderers ?? {})),
    [customRenderers],
  );

  useEffect(() => {
    if (!__DEV__) return;

    const usedTags = new Set<string>();
    collectElementTags(tree.children as RootContent[], usedTags);

    const nonCustomizedTags = Array.from(usedTags)
      .filter((tag) => !customRendererKeys.has(tag))
      .sort();

    if (nonCustomizedTags.length > 0) {
      console.log(
        "[MarkdownRenderer] Tags using default renderer:",
        nonCustomizedTags,
      );
    }
  }, [tree, customRendererKeys]);

  return (
    <View>
      {tree.children
        .filter((node) => !(node.type === "text" && !node.value.trim()))
        .map((node, i) => renderNode(node as HastNode, renderers, i))}
    </View>
  );
}
