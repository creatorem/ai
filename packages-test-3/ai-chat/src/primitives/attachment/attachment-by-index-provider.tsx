"use client";

import React, { useCallback, useRef } from "react";
import { createStore, useStore, type StoreApi } from 'zustand';
import type { Attachment } from "../../types/attachment-types";

// -- Attachments (array) context --

type AttachmentsCtxType = {
    attachments: readonly Attachment[];
    removeAttachment(index: number): void;
};

const AttachmentsStoreCtx = React.createContext<StoreApi<AttachmentsCtxType> | null>(null);

export function useAttachments(): AttachmentsCtxType;
export function useAttachments<T>(selector: (state: AttachmentsCtxType) => T): T;
export function useAttachments<T>(selector?: (state: AttachmentsCtxType) => T) {
    const store = React.useContext(AttachmentsStoreCtx);
    if (!store) throw new Error('useAttachments must be used within an AttachmentsProvider.');
    return useStore(store, selector as any);
}

export function useAttachmentsStore(): StoreApi<AttachmentsCtxType> {
    const store = React.useContext(AttachmentsStoreCtx);
    if (!store) throw new Error('useAttachments must be used within an AttachmentsProvider.');
    return store;
}

export const AttachmentsProvider: React.FC<
    React.PropsWithChildren<{
        attachments: readonly Attachment[];
        removeAttachment: (index: number) => void;
    }>
> = ({ attachments, removeAttachment, children }) => {
    const storeRef = useRef<StoreApi<AttachmentsCtxType> | null>(null);
    if (storeRef.current === null) {
        storeRef.current = createStore<AttachmentsCtxType>(() => ({
            attachments,
            removeAttachment,
        }));
    }

    storeRef.current.setState({ attachments, removeAttachment });

    return (
        <AttachmentsStoreCtx.Provider value={storeRef.current}>
            {children}
        </AttachmentsStoreCtx.Provider>
    );
};

// -- Attachment (single item) context --

type AttachmentMethods = {
    remove(): void;
};

type AttachmentCtxType = Attachment & AttachmentMethods;

const AttachmentStoreCtx = React.createContext<StoreApi<AttachmentCtxType> | null>(null);

export function useAttachment(): AttachmentCtxType;
export function useAttachment<T>(selector: (state: AttachmentCtxType) => T): T;
export function useAttachment<T>(selector?: (state: AttachmentCtxType) => T) {
    const store = React.useContext(AttachmentStoreCtx);
    if (!store) throw new Error('useAttachment must be used within an AttachmentByIndexProvider.');
    return useStore(store, selector as any);
}

export function useAttachmentStore(): StoreApi<AttachmentCtxType> {
    const store = React.useContext(AttachmentStoreCtx);
    if (!store) throw new Error('useAttachment must be used within an AttachmentByIndexProvider.');
    return store;
}

export const AttachmentByIndexProvider: React.FC<
    React.PropsWithChildren<{ index: number }>
> = ({ index, children }) => {
    const attachments = useAttachments(s => s.attachments);
    const removeAttachment = useAttachments(s => s.removeAttachment);
    const attachment = attachments[index]!;

    const _indexRef = useRef(index);
    _indexRef.current = index;

    const remove = useCallback((): void => {
        removeAttachment(_indexRef.current);
    }, [removeAttachment]);

    const storeRef = useRef<StoreApi<AttachmentCtxType> | null>(null);
    if (storeRef.current === null) {
        storeRef.current = createStore<AttachmentCtxType>(() => ({
            ...attachment,
            remove,
        }));
    }

    storeRef.current.setState({ ...attachment, remove });

    return (
        <AttachmentStoreCtx.Provider value={storeRef.current}>
            {children}
        </AttachmentStoreCtx.Provider>
    );
};
