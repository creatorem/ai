"use client";

import { type ComponentType, type FC, memo, useMemo } from "react";
import { SuggestionByIndexProvider, useSuggestions } from "../suggestion/suggestion-by-index-provider";

export namespace ThreadPrimitiveSuggestions {
  export type Props = {
    /**
     * Component to render for each suggestion.
     */
    components: {
      /** Component used to render each suggestion */
      Suggestion: ComponentType;
    };
  };
}

type SuggestionComponentProps = {
  components: ThreadPrimitiveSuggestions.Props["components"];
};

const SuggestionComponent: FC<SuggestionComponentProps> = ({ components }) => {
  const Component = components.Suggestion;
  return <Component />;
};

export namespace ThreadPrimitiveSuggestionByIndex {
  export type Props = {
    index: number;
    components: ThreadPrimitiveSuggestions.Props["components"];
  };
}

/**
 * Renders a single suggestion at the specified index.
 *
 * This component provides suggestion context for a specific suggestion
 * and renders it using the provided component configuration.
 *
 * @example
 * ```tsx
 * <ThreadPrimitive.SuggestionByIndex
 *   index={0}
 *   components={{
 *     Suggestion: MySuggestion
 *   }}
 * />
 * ```
 */
export const ThreadPrimitiveSuggestionByIndex: FC<ThreadPrimitiveSuggestionByIndex.Props> =
  memo(
    ({ index, components }) => {
      return (
        <SuggestionByIndexProvider index={index}>
          <SuggestionComponent components={components} />
        </SuggestionByIndexProvider>
      );
    },
    (prev, next) =>
      prev.index === next.index &&
      prev.components.Suggestion === next.components.Suggestion,
  );

ThreadPrimitiveSuggestionByIndex.displayName =
  "ThreadPrimitive.SuggestionByIndex";

/**
 * Renders all suggestions using the provided component configuration.
 *
 * This component automatically renders all suggestions from the suggestions scope,
 * providing the appropriate suggestion context for each one.
 *
 * @example
 * ```tsx
 * <ThreadPrimitive.Suggestions
 *   components={{
 *     Suggestion: MySuggestion
 *   }}
 * />
 * ```
 */
export const ThreadPrimitiveSuggestionsImpl: FC<
  ThreadPrimitiveSuggestions.Props
> = ({ components }) => {
  const { suggestions } = useSuggestions()
  // const suggestionsLength = useAuiState(
  //   ({ suggestions }) => suggestions.suggestions.length,
  // );

  const suggestionElements = useMemo(() => {
    if (suggestions.length === 0) return null;
    return Array.from({ length: suggestions.length }, (_, index) => (
      <ThreadPrimitiveSuggestionByIndex
        key={index}
        index={index}
        components={components}
      />
    ));
  }, [suggestions.length, components]);

  return suggestionElements;
};

ThreadPrimitiveSuggestionsImpl.displayName = "ThreadPrimitive.Suggestions";

export const ThreadPrimitiveSuggestions = memo(
  ThreadPrimitiveSuggestionsImpl,
  (prev, next) => prev.components.Suggestion === next.components.Suggestion,
);
