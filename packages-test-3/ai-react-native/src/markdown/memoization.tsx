import type { Element } from "hast";
import { ComponentType, memo } from "react";
import { RenderersMap } from "./renderer";

// Skip __parent to avoid circular references injected by renderNode's annotateParent.
const skipCycles = (key: string, value: unknown) =>
  key === "__parent" ? undefined : value;

const areChildrenEqual = (prev: string | unknown, next: string | unknown) => {
  if (typeof prev === "string") return prev === next;
  return JSON.stringify(prev, skipCycles) === JSON.stringify(next, skipCycles);
};

export const areNodesEqual = (
  prev: Element | undefined,
  next: Element | undefined,
) => {
  if (!prev || !next) return false;

  const excludeMetadata = (props: Element["properties"]) => {
    const { position, data, ...rest } =
      (props as Record<string, unknown>) || {};
    return rest;
  };

  return (
    JSON.stringify(excludeMetadata(prev.properties)) ===
      JSON.stringify(excludeMetadata(next.properties)) &&
    areChildrenEqual(prev.children, next.children)
  );
};

export const memoCompareNodes = (
  prev: { node?: Element | undefined },
  next: { node?: Element | undefined },
) => {
  return areNodesEqual(prev.node, next.node);
};

export const memoizeMarkdownComponents = (components: RenderersMap = {}) => {
  return Object.fromEntries(
    Object.entries(components ?? {}).map(([key, value]) => {
      if (!value) return [key, value];

      const Component = value as ComponentType;
      const WithoutNode = ({ node, ...props }: { node?: Element }) => {
        return <Component {...props} />;
      };
      return [key, memo(WithoutNode, memoCompareNodes)];
    }),
  );
};
