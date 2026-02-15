"use client";

import { forwardRef, ComponentPropsWithoutRef } from "react";
import { useSuggestion } from "./suggestion-by-index-provider";
import { RuntimeComponents } from "@creatorem/ai-chat/component-types";
import { useRuntime } from "@creatorem/ai-chat/runtime";

export namespace SuggestionPrimitiveTitle {
  export type Element = RuntimeComponents["Text"];
  export type Props = ComponentPropsWithoutRef<RuntimeComponents["Text"]>;
}

/**
 * Renders the title of the suggestion.
 *
 * @example
 * ```tsx
 * <SuggestionPrimitive.Title />
 * ```
 */
export const SuggestionPrimitiveTitle = forwardRef<
  SuggestionPrimitiveTitle.Element,
  SuggestionPrimitiveTitle.Props
>((props, ref) => {
  const {
    components: { Text },
  } = useRuntime();
  const title = useSuggestion((s) => s.title);

  return (
    <Text {...props} ref={ref}>
      {props.children ?? title}
    </Text>
  );
});

SuggestionPrimitiveTitle.displayName = "SuggestionPrimitive.Title";
