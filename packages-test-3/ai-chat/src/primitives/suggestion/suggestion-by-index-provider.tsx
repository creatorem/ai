"use client";

import React, { useRef } from "react";
import { createStore, useStore, type StoreApi } from 'zustand';

export type SuggestionState = {
    title: string;
    label: string;
    prompt: string;
};

// -- Suggestions (array) context --

type SuggestionsCtxType = {
    suggestions: SuggestionState[];
};

const SuggestionsStoreCtx = React.createContext<StoreApi<SuggestionsCtxType> | null>(null);

export function useSuggestions(): SuggestionsCtxType;
export function useSuggestions<T>(selector: (state: SuggestionsCtxType) => T): T;
export function useSuggestions<T>(selector?: (state: SuggestionsCtxType) => T) {
    const store = React.useContext(SuggestionsStoreCtx);
    if (!store) throw new Error("useSuggestions must be used within a SuggestionsProvider.");
    return useStore(store, selector as any);
}

export function useSuggestionsStore(): StoreApi<SuggestionsCtxType> {
    const store = React.useContext(SuggestionsStoreCtx);
    if (!store) throw new Error("useSuggestions must be used within a SuggestionsProvider.");
    return store;
}

export const SuggestionsProvider: React.FC<
    React.PropsWithChildren<{ suggestions: SuggestionState[] }>
> = ({ suggestions, children }) => {
    const storeRef = useRef<StoreApi<SuggestionsCtxType> | null>(null);
    if (storeRef.current === null) {
        storeRef.current = createStore<SuggestionsCtxType>(() => ({ suggestions }));
    }

    storeRef.current.setState({ suggestions });

    return (
        <SuggestionsStoreCtx.Provider value={storeRef.current}>
            {children}
        </SuggestionsStoreCtx.Provider>
    );
};

// -- Suggestion (single item) context --

const SuggestionStoreCtx = React.createContext<StoreApi<SuggestionState> | null>(null);

export function useSuggestion(): SuggestionState;
export function useSuggestion<T>(selector: (state: SuggestionState) => T): T;
export function useSuggestion<T>(selector?: (state: SuggestionState) => T) {
    const store = React.useContext(SuggestionStoreCtx);
    if (!store) throw new Error("useSuggestion must be used within a SuggestionByIndexProvider.");
    return useStore(store, selector as any);
}

export function useSuggestionStore(): StoreApi<SuggestionState> {
    const store = React.useContext(SuggestionStoreCtx);
    if (!store) throw new Error("useSuggestion must be used within a SuggestionByIndexProvider.");
    return store;
}

export const SuggestionByIndexProvider: React.FC<
    React.PropsWithChildren<{ index: number }>
> = ({ index, children }) => {
    const suggestion = useSuggestions(s => s.suggestions[index]!);

    const storeRef = useRef<StoreApi<SuggestionState> | null>(null);
    if (storeRef.current === null) {
        storeRef.current = createStore<SuggestionState>(() => ({ ...suggestion }));
    }

    storeRef.current.setState({ ...suggestion });

    return (
        <SuggestionStoreCtx.Provider value={storeRef.current}>
            {children}
        </SuggestionStoreCtx.Provider>
    );
};
