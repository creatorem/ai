"use client";

import React, { useContext, useMemo } from "react";

export type SuggestionState = {
    title: string;
    label: string;
    prompt: string;
};

// -- Suggestions (array) context --

type SuggestionsCtxType = {
    suggestions: SuggestionState[];
};

const SuggestionsCtx = React.createContext<SuggestionsCtxType | null>(null);

export const useSuggestions = (): SuggestionsCtxType => {
    const ctx = useContext(SuggestionsCtx);
    if (!ctx) {
        throw new Error("useSuggestions must be used within a SuggestionsProvider.");
    }
    return ctx;
};

export const SuggestionsProvider: React.FC<
    React.PropsWithChildren<{ suggestions: SuggestionState[] }>
> = ({ suggestions, children }) => {
    const contextValue = useMemo<SuggestionsCtxType>(
        () => ({ suggestions }),
        [suggestions],
    );

    return (
        <SuggestionsCtx.Provider value={contextValue}>
            {children}
        </SuggestionsCtx.Provider>
    );
};

// -- Suggestion (single item) context --

const SuggestionCtx = React.createContext<SuggestionState | null>(null);

export const useSuggestion = (): SuggestionState => {
    const ctx = useContext(SuggestionCtx);
    if (!ctx) {
        throw new Error("useSuggestion must be used within a SuggestionByIndexProvider.");
    }
    return ctx;
};

export const SuggestionByIndexProvider: React.FC<
    React.PropsWithChildren<{ index: number }>
> = ({ index, children }) => {
    const { suggestions } = useSuggestions();
    const suggestion = suggestions[index]!;

    const contextValue = useMemo<SuggestionState>(
        () => ({ ...suggestion }),
        [suggestion],
    );

    return (
        <SuggestionCtx.Provider value={contextValue}>
            {children}
        </SuggestionCtx.Provider>
    );
};
