'use client';

import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Composer } from "../../types/entities";
import { useAiContext } from "../ai-provider";
import { useThread } from "../thread/thread-root";

type ComposerMethods = {
    setText(text: string): void;
    setRole(role: Composer['role']): void;
    addAttachment(file: File): Promise<void>;
    clearAttachments(): Promise<void>;
    // attachment(selector: { index: number } | { id: string }): AttachmentMethods;
    reset(): Promise<void>;
    send(): void;
    cancel(): void;
    beginEdit(): void;
  
    /**
     * Start dictation to convert voice to text input.
     * Requires a DictationAdapter to be configured.
     */
    startDictation(): void;
  
    /**
     * Stop the current dictation session.
     */
    stopDictation(): void;
  };

type ComposerCtxType = Composer & ComposerMethods

const ComposerCtx = React.createContext<ComposerCtxType>({
    text: '',
    setText: () => undefined,
    role: 'user',
    attachments: [],
    isEditing: false,
    canCancel: false,
    attachmentAccept: '*',
    isEmpty: true,
    type: "thread",
    cancel: () => undefined,
    addAttachment: () => undefined,
});

export const useComposer = (): ComposerCtxType => {
    const ctx = useContext(ComposerCtx);
    if (!ctx) {
        throw new Error('ComposerCtxType context not found.');
    }
    return ctx;
};

export function ComposerPrimitiveRoot({ children, ...value }: { children: React.ReactNode }) {
    const { adapters, chatOptions } = useAiContext();
    const [text, setText] = useState<string>('')
    const [role, setRole] = useState<Composer['role']>('user')
    const [attachments, setAttachments] = useState<Composer['attachments']>([])
    const [isEditing, setIsEditing] = useState<Composer['isEditing']>(true)
    const [canCancel, setCanCancel] = useState<Composer['canCancel']>(false)
    const [attachmentAccept, setAttachmentAccept] = useState<Composer['attachmentAccept']>('*')
    const [type, setType] = useState<Composer['type']>('thread')

    const reset = useCallback(() => {
        setText('')
    }, [])
    const addAttachment = useCallback(() => {}, [])

    return <ComposerCtx.Provider value={{
        text,
        setText,
        role,
        setRole,
        attachments,
        isEditing,
        canCancel,
        attachmentAccept,
        isEmpty: text.length === 0,
        type,
        reset,
        addAttachment,
    }}>
        {children}
    </ComposerCtx.Provider>;
};
