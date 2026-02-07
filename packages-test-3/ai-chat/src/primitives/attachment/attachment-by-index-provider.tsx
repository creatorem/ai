"use client";

import React, { useCallback, useContext, useMemo, useRef } from "react";
import type { Attachment } from "../../types/attachment-types";

// -- Attachments (array) context --

type AttachmentsCtxType = {
    attachments: readonly Attachment[];
    removeAttachment(index: number): void;
};

const AttachmentsCtx = React.createContext<AttachmentsCtxType | null>(null);

export const useAttachments = (): AttachmentsCtxType => {
    const ctx = useContext(AttachmentsCtx);
    if (!ctx) {
        throw new Error("useAttachments must be used within an AttachmentsProvider.");
    }
    return ctx;
};

export const AttachmentsProvider: React.FC<
    React.PropsWithChildren<{
        attachments: readonly Attachment[];
        removeAttachment: (index: number) => void;
    }>
> = ({ attachments, removeAttachment, children }) => {
    const contextValue = useMemo<AttachmentsCtxType>(
        () => ({ attachments, removeAttachment }),
        [attachments, removeAttachment],
    );

    return (
        <AttachmentsCtx.Provider value={contextValue}>
            {children}
        </AttachmentsCtx.Provider>
    );
};

// -- Attachment (single item) context --

type AttachmentMethods = {
    remove(): void;
};

type AttachmentCtxType = Attachment & AttachmentMethods;

const AttachmentCtx = React.createContext<AttachmentCtxType | null>(null);

export const useAttachment = (): AttachmentCtxType => {
    const ctx = useContext(AttachmentCtx);
    if (!ctx) {
        throw new Error("useAttachment must be used within an AttachmentByIndexProvider.");
    }
    return ctx;
};

export const AttachmentByIndexProvider: React.FC<
    React.PropsWithChildren<{ index: number }>
> = ({ index, children }) => {
    const { attachments, removeAttachment } = useAttachments();
    const attachment = attachments[index]!;

    const _indexRef = useRef(index);
    _indexRef.current = index;

    const remove = useCallback((): void => {
        removeAttachment(_indexRef.current);
    }, [removeAttachment]);

    const contextValue = useMemo<AttachmentCtxType>(
        () => ({ ...attachment, remove }),
        [attachment, remove],
    );

    return (
        <AttachmentCtx.Provider value={contextValue}>
            {children}
        </AttachmentCtx.Provider>
    );
};
