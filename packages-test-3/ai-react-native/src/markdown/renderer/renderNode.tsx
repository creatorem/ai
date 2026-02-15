import React from "react";
import { Text, View } from "react-native";
import type { HastNode, RenderersMap } from "./types";
import type { Element, Text as HastText } from "hast";

const BLOCK_TAGS = new Set([
  "div",
  "ul",
  "strong",
  "ol",
  "li",
  "blockquote",
  "pre",
  "table",
  "thead",
  "tbody",
  "tr",
  "hr",
  "section",
  "article",
]);

/**
 * Annotate each child element with a __parent reference
 * so renderers (like `li`, `code`) can inspect their parent context.
 */
function annotateParent(node: Element): void {
  if (!node.children) return;
  for (const child of node.children) {
    if (child.type === "element") {
      (child as any).__parent = node;
      annotateParent(child);
    }
  }
}

/**
 * Convert HAST `node.properties` into a flat props object
 * that can be spread onto a React component.
 */
function extractProperties(
  properties: Element["properties"],
): Record<string, unknown> {
  if (!properties) return {};
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(properties)) {
    // className comes as string[] in HAST — join to a single string
    if (key === "className" && Array.isArray(value)) {
      result[key] = value.join(" ");
    } else {
      result[key] = value;
    }
  }
  return result;
}

/** Extract the language and raw code string from a <pre> node's <code> child. */
function extractCodeInfo(node: Element): { language: string; code: string } {
  const codeChild = node.children?.find(
    (c): c is Element => c.type === "element" && c.tagName === "code",
  );
  const className = codeChild?.properties?.className;
  const lang =
    (Array.isArray(className) ? className : [className])
      .filter(Boolean)
      .join(" ")
      .match(/language-(\S+)/)?.[1] ?? "";

  const code = collectText(codeChild ?? node);
  return { language: lang, code };
}

/** Recursively collect all text content from a HAST node. */
function collectText(node: Element | HastText): string {
  if (node.type === "text") return node.value;
  if ("children" in node) {
    return node.children
      .map((c) => collectText(c as Element | HastText))
      .join("");
  }
  return "";
}

export function renderNode(
  node: HastNode,
  renderers: RenderersMap,
  key: number = 0,
): React.ReactNode {
  // Always wrap text in <Text> so it never lands as a raw string inside a <View>.
  if (node.type === "text") {
    return <Text key={key}>{node.value}</Text>;
  }

  if (node.type === "element") {
    annotateParent(node);

    const Renderer = renderers[node.tagName];
    const isBlock = BLOCK_TAGS.has(node.tagName);

    // Filter out whitespace-only text nodes that sit between block children
    // (e.g. the "\n" between <li> elements) to avoid empty <Text> gaps.
    const children = node.children
      ?.filter((child) => {
        if (isBlock && child.type === "text" && !child.value.trim()) {
          return false;
        }
        return true;
      })
      .map((child, i) => renderNode(child as HastNode, renderers, i));

    if (Renderer) {
      const props = extractProperties(node.properties);

      // For <pre> nodes, render a CodeHeader above the code block when provided.
      if (node.tagName === "pre" && renderers.CodeHeader) {
        const { language, code } = extractCodeInfo(node);
        const CodeHeader = renderers.CodeHeader;
        return (
          <View key={key} style={{ marginVertical: 8 }}>
            <CodeHeader language={language} code={code} />
            <Renderer node={node} {...(props as any)}>
              {children}
            </Renderer>
          </View>
        );
      }

      return (
        <Renderer key={key} node={node} {...(props as any)}>
          {children}
        </Renderer>
      );
    }

    if (__DEV__) {
      console.warn(
        `[MarkdownRenderer] Missing renderer for tag <${node.tagName}>. Falling back to Text wrapper.`,
      );
    }

    // Fallback for unknown tags: wrap in <Text>
    return <Text key={key}>{children}</Text>;
  }

  return null;
}
