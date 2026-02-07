"use client";

import type { FC, PropsWithChildren } from "react";
import { useEffect, useState } from "react";
import { writableStore } from "../../utils/readonly-store";
import { ThreadViewportContext, ThreadViewportContextValue, useThreadViewportStore } from "./thread-viewport-context";
import { makeThreadViewportStore, ThreadViewportStoreOptions } from "./thread-viewport-runtime";

export type ThreadViewportProviderProps = PropsWithChildren<{
  options?: ThreadViewportStoreOptions;
}>;

const useThreadViewportStoreValue = (options: ThreadViewportStoreOptions) => {
  const outerViewport = useThreadViewportStore({ optional: true });
  const [store] = useState(() => makeThreadViewportStore(options));

  // Forward scrollToBottom from outer viewport to inner viewport
  useEffect(() => {
    return outerViewport?.getState().onScrollToBottom(() => {
      store.getState().scrollToBottom();
    });
  }, [outerViewport, store]);

  useEffect(() => {
    if (!outerViewport) return;
    return store.subscribe((state) => {
      if (outerViewport.getState().isAtBottom !== state.isAtBottom) {
        writableStore(outerViewport).setState({ isAtBottom: state.isAtBottom });
      }
    });
  }, [store, outerViewport]);

  // Sync options to store when they change
  useEffect(() => {
    const nextState = {
      turnAnchor: options.turnAnchor ?? "bottom",
    };

    const currentState = store.getState();
    if (currentState.turnAnchor !== nextState.turnAnchor) {
      writableStore(store).setState(nextState);
    }
  }, [store, options.turnAnchor]);

  return store;
};

export const ThreadPrimitiveViewportProvider: FC<
  ThreadViewportProviderProps
> = ({ children, options = {} }) => {
  const useThreadViewport = useThreadViewportStoreValue(options);

  const [context] = useState<ThreadViewportContextValue>(() => {
    return {
      useThreadViewport,
    };
  });

  return (
    <ThreadViewportContext.Provider value={context}>
      {children}
    </ThreadViewportContext.Provider>
  );
};
