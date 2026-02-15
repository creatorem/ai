"use client";

import { forwardRef, ComponentPropsWithoutRef } from "react";
import { useSuggestion } from "./suggestion-by-index-provider";
import { RuntimeComponents } from "@creatorem/ai-chat/component-types";
import { useRuntime } from "@creatorem/ai-chat/runtime";

export namespace SuggestionPrimitiveDescription {
  export type Element = RuntimeComponents["Text"];
  export type Props = ComponentPropsWithoutRef<RuntimeComponents["Text"]>;
}

/**
 * Renders the description/label of the suggestion.
 *
 * @example
 * ```tsx
 * <SuggestionPrimitive.Description />
 * ```
 */
export const SuggestionPrimitiveDescription = forwardRef<
  SuggestionPrimitiveDescription.Element,
  SuggestionPrimitiveDescription.Props
>((props, ref) => {
  const {
    components: { Text },
  } = useRuntime();
  const label = useSuggestion((s) => s.label);

  return (
    <Text {...props} ref={ref}>
      {props.children ?? label}
    </Text>
  );
});

SuggestionPrimitiveDescription.displayName = "SuggestionPrimitive.Description";
