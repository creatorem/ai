import type { Element, RootContent } from "hast";

export type HastNode = RootContent;

export type RendererProps = {
  children?: React.ReactNode;
  node: Element;
};

/** Extra props each tag receives (extracted from HAST `node.properties`). */
export type TagPropsMap = {
  a: { href?: string; title?: string; target?: string; rel?: string };
  img: {
    src?: string;
    alt?: string;
    width?: string | number;
    height?: string | number;
  };
  input: { type?: string; checked?: boolean; disabled?: boolean };
  code: { className?: string };
  pre: { className?: string };
  td: { colSpan?: number; rowSpan?: number };
  th: { colSpan?: number; rowSpan?: number };
  ol: { start?: number };
};

/**
 * Resolve the full prop type for a given tag.
 *
 * @example
 * const MyLink: React.FC<RendererPropsFor<"a">> = ({ href, children }) => { … }
 */
export type RendererPropsFor<K extends string> = K extends keyof TagPropsMap
  ? RendererProps & TagPropsMap[K]
  : RendererProps;

export type RendererTag =
  | "p"
  | "strong"
  | "em"
  | "del"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "ul"
  | "ol"
  | "li"
  | "blockquote"
  | "a"
  | "code"
  | "pre"
  | "hr"
  | "img"
  | "br"
  | "table"
  | "thead"
  | "tbody"
  | "tr"
  | "th"
  | "td"
  | "input";

/** Props for the CodeHeader component rendered above fenced code blocks. */
export type CodeHeaderProps = {
  language: string;
  code: string;
};

export type RenderersMap = {
  [K in RendererTag]?: React.ComponentType<RendererPropsFor<K>>;
} & {
  /** Optional header rendered above fenced code blocks. */
  CodeHeader?: React.ComponentType<CodeHeaderProps>;
} & Record<string, React.ComponentType<RendererProps>>;
