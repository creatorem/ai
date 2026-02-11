'use client';

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createStore, useStore, type StoreApi } from 'zustand';
import { useAiContext, useThreads, useThreadsStore } from "../../ai-provider";
import { localStorageThreadAdapter, saveThread, deleteThread as deleteStoredThread, archiveThread as archiveStoredThread, unarchiveThread as unarchiveStoredThread, renameThread as renameStoredThread } from "@creatorem/ai-chat/adapters/local-storage-adapter";
import { generateId } from "ai";

export type ThreadListItem = {
    id: string;
    title: string;
    status: 'regular' | 'archived';
    isActive: boolean;
};

export type ThreadListState = {
    isLoading: boolean;
    threads: ThreadListItem[];
    archivedThreads: ThreadListItem[];
    activeThreadId: string | null;
};

export type ThreadListMethods = {
    switchToThread(threadId: string): void;
    switchToNewThread(): void;
    createThread(): string;
    deleteThread(threadId: string): void;
    archiveThread(threadId: string): void;
    unarchiveThread(threadId: string): void;
    renameThread(threadId: string, newTitle: string): void;
};

export type ThreadListCtxType = ThreadListState & ThreadListMethods;

const ThreadListStoreCtx = React.createContext<StoreApi<ThreadListCtxType> | null>(null);

export function useThreadList(): ThreadListCtxType;
export function useThreadList<T>(selector: (state: ThreadListCtxType) => T): T;
export function useThreadList<T>(selector?: (state: ThreadListCtxType) => T) {
    const store = React.useContext(ThreadListStoreCtx);
    if (!store) throw new Error('This component must be used within ThreadListProvider.');
    return useStore(store, selector as any);
}

export function useThreadListStore(): StoreApi<ThreadListCtxType> {
    const store = React.useContext(ThreadListStoreCtx);
    if (!store) throw new Error('This component must be used within ThreadListProvider.');
    return store;
}

export function ThreadListProvider({ children }: { children: React.ReactNode }) {
    const adapters = useAiContext(s => s.adapters);
    const threadsStore = useThreadsStore();
    const threadIds = useThreads(s => s.threadIds);
    const archivedThreadIds = useThreads(s => s.archivedThreadIds);
    const threadsIsLoading = useThreads(s => s.isLoading);
    const activeThreadId = useThreads(s => s.activeThreadId);
    
    const threadAdapter = adapters?.thread ?? localStorageThreadAdapter;
    
    const [isLoading, setIsLoading] = useState(true);
    const [threads, setThreads] = useState<ThreadListItem[]>([]);
    const [archivedThreads, setArchivedThreads] = useState<ThreadListItem[]>([]);

    // Load thread metadata
    useEffect(() => {
        if (threadsIsLoading) return;
        
        (async () => {
            setIsLoading(true);
            
            const regularThreads: ThreadListItem[] = await Promise.all(
                threadIds.map(async (id) => {
                    try {
                        const thread = await threadAdapter.fetch(id);
                        return {
                            id,
                            title: thread.title || 'Untitled',
                            status: thread.status,
                            isActive: id === activeThreadId,
                        };
                    } catch {
                        return {
                            id,
                            title: 'Untitled',
                            status: 'regular' as const,
                            isActive: id === activeThreadId,
                        };
                    }
                })
            );
            
            const archived: ThreadListItem[] = await Promise.all(
                archivedThreadIds.map(async (id) => {
                    try {
                        const thread = await threadAdapter.fetch(id);
                        return {
                            id,
                            title: thread.title || 'Untitled',
                            status: thread.status,
                            isActive: id === activeThreadId,
                        };
                    } catch {
                        return {
                            id,
                            title: 'Untitled',
                            status: 'archived' as const,
                            isActive: id === activeThreadId,
                        };
                    }
                })
            );
            
            setThreads(regularThreads);
            setArchivedThreads(archived);
            setIsLoading(false);
        })();
    }, [threadIds, archivedThreadIds, threadsIsLoading, threadAdapter, activeThreadId]);

    const switchToThread = useCallback((threadId: string) => {
        threadsStore.getState().setActiveThreadId(threadId);
    }, [threadsStore]);

    const switchToNewThread = useCallback(() => {
        threadsStore.getState().setActiveThreadId(null);
    }, [threadsStore]);

    const createThread = useCallback((): string => {
        const newId = generateId();
        
        // Save to localStorage
        saveThread(newId, {
            title: 'New Thread',
            status: 'regular',
            messages: [],
        });
        
        // Update thread list
        threadsStore.getState().setThreadIds(prev => [newId, ...prev]);
        
        // Switch to the new thread
        threadsStore.getState().setActiveThreadId(newId);
        
        return newId;
    }, [threadsStore]);

    const deleteThread = useCallback((threadId: string) => {
        // Remove from localStorage
        deleteStoredThread(threadId);
        
        // Update lists
        threadsStore.getState().setThreadIds(prev => prev.filter(id => id !== threadId));
        threadsStore.getState().setArchivedThreadIds(prev => prev.filter(id => id !== threadId));
        
        // If deleting active thread, switch to new thread
        if (threadsStore.getState().activeThreadId === threadId) {
            threadsStore.getState().setActiveThreadId(null);
        }
    }, [threadsStore]);

    const archiveThread = useCallback((threadId: string) => {
        // Update localStorage
        archiveStoredThread(threadId);
        
        // Move from regular to archived
        threadsStore.getState().setThreadIds(prev => prev.filter(id => id !== threadId));
        threadsStore.getState().setArchivedThreadIds(prev => [threadId, ...prev]);
    }, [threadsStore]);

    const unarchiveThread = useCallback((threadId: string) => {
        // Update localStorage
        unarchiveStoredThread(threadId);
        
        // Move from archived to regular
        threadsStore.getState().setArchivedThreadIds(prev => prev.filter(id => id !== threadId));
        threadsStore.getState().setThreadIds(prev => [threadId, ...prev]);
    }, [threadsStore]);

    const renameThread = useCallback((threadId: string, newTitle: string) => {
        // Update localStorage
        renameStoredThread(threadId, newTitle);
        
        // Update local state
        setThreads(prev => prev.map(t => 
            t.id === threadId ? { ...t, title: newTitle } : t
        ));
        setArchivedThreads(prev => prev.map(t => 
            t.id === threadId ? { ...t, title: newTitle } : t
        ));
    }, []);

    // Create store once
    const storeRef = useRef<StoreApi<ThreadListCtxType> | null>(null);
    if (storeRef.current === null) {
        storeRef.current = createStore<ThreadListCtxType>(() => ({
            isLoading,
            threads,
            archivedThreads,
            activeThreadId,
            switchToThread,
            switchToNewThread,
            createThread,
            deleteThread,
            archiveThread,
            unarchiveThread,
            renameThread,
        }));
    }

    // Sync state after render
    useLayoutEffect(() => {
        storeRef.current!.setState({
            isLoading,
            threads,
            archivedThreads,
            activeThreadId,
            switchToThread,
            switchToNewThread,
            createThread,
            deleteThread,
            archiveThread,
            unarchiveThread,
            renameThread,
        });
    });

    return (
        <ThreadListStoreCtx.Provider value={storeRef.current}>
            {children}
        </ThreadListStoreCtx.Provider>
    );
}