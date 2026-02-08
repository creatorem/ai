'use client';

import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { createStore, useStore, type StoreApi } from 'zustand';
import { Composer } from "../../types/entities";
import type { Attachment, CompleteAttachment, PendingAttachment } from "../../types/attachment-types";
import type { DictationAdapter, DictationState } from "../../types/adapters";
import type { Unsubscribe } from "../../types/unsuscribe";
import { useAiContext } from "../ai-provider";
import { useThreadStore } from "../thread/thread-root";

type ComposerMethods = {
    setText(text: string): void;
    setRole(role: Composer['role']): void;
    addAttachment(file: File): Promise<void>;
    removeAttachment(index: number): Promise<void>;
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

const ComposerStoreCtx = React.createContext<StoreApi<ComposerCtxType> | null>(null);

// Fallback store for optional usage (avoids conditional hook calls)
const _FALLBACK_STORE = createStore<ComposerCtxType>(() => ({} as ComposerCtxType));

export function useComposer(): ComposerCtxType;
export function useComposer<T>(selector: (state: ComposerCtxType) => T): T;
export function useComposer(options: { optional: true }): ComposerCtxType | null;
export function useComposer<T>(
    selectorOrOptions?: ((state: ComposerCtxType) => T) | { optional?: boolean }
) {
    const store = React.useContext(ComposerStoreCtx);

    const isSelector = typeof selectorOrOptions === 'function';
    const isOptional = !isSelector && typeof selectorOrOptions === 'object' && selectorOrOptions?.optional;

    if (!store && !isOptional) {
        throw new Error('This component must be used within ComposerCtx.Provider.');
    }

    // Always call useStore exactly once (hooks rules) — use fallback when store is null
    const value = useStore(
        store ?? _FALLBACK_STORE,
        isSelector ? (selectorOrOptions as (state: ComposerCtxType) => T) : undefined as any
    );

    // For optional: return null when no store
    if (!store && isOptional) return null;

    return value;
}

export function useComposerStore(): StoreApi<ComposerCtxType> {
    const store = React.useContext(ComposerStoreCtx);
    if (!store) throw new Error('This component must be used within ComposerCtx.Provider.');
    return store;
}

const _isAttachmentComplete = (a: Attachment): a is CompleteAttachment =>
    a.status.type === "complete";

export function ComposerProvider({ children }: { children: React.ReactNode }) {
    const adapters = useAiContext(s => s.adapters);
    const threadStore = useThreadStore();

    // Core state
    const [text, setTextState] = useState<string>('');
    const [role, setRoleState] = useState<Composer['role']>('user');
    const [attachments, setAttachments] = useState<Composer['attachments']>([]);
    const [isEditing, setIsEditing] = useState<Composer['isEditing']>(true);
    const [canCancel, setCanCancel] = useState<Composer['canCancel']>(false);
    const [attachmentAccept, setAttachmentAccept] = useState<Composer['attachmentAccept']>('*');
    const [type, setType] = useState<Composer['type']>('thread');
    const [dictation, setDictation] = useState<DictationState | undefined>(undefined);

    // Dictation internal refs (mutable state that doesn't trigger re-renders)
    const _dictationSessionRef = useRef<DictationAdapter.Session | undefined>(undefined);
    const _dictationUnsubscribesRef = useRef<Unsubscribe[]>([]);
    const _dictationBaseTextRef = useRef<string>('');
    const _currentInterimTextRef = useRef<string>('');
    const _dictationSessionIdCounterRef = useRef<number>(0);
    const _activeDictationSessionIdRef = useRef<number | undefined>(undefined);
    const _isCleaningDictationRef = useRef<boolean>(false);

    // Refs for latest values (avoids stale closures in callbacks)
    const _textRef = useRef(text);
    _textRef.current = text;
    const _roleRef = useRef(role);
    _roleRef.current = role;
    const _attachmentsRef = useRef(attachments);
    _attachmentsRef.current = attachments;
    const _dictationRef = useRef(dictation);
    _dictationRef.current = dictation;
    const _adaptersRef = useRef(adapters);
    _adaptersRef.current = adapters;

    // Helper: check if a dictation session is still the active one
    const _isActiveSession = useCallback((sessionId: number, session: DictationAdapter.Session): boolean => {
        return (
            _activeDictationSessionIdRef.current === sessionId &&
            _dictationSessionRef.current === session
        );
    }, []);

    // Helper: clean up dictation session and reset related state
    const _cleanupDictation = useCallback((options?: { sessionId: number | undefined }) => {
        const isStaleSession =
            options?.sessionId !== undefined &&
            options.sessionId !== _activeDictationSessionIdRef.current;
        if (isStaleSession || _isCleaningDictationRef.current) return;

        _isCleaningDictationRef.current = true;
        try {
            for (const unsub of _dictationUnsubscribesRef.current) {
                unsub();
            }
            _dictationUnsubscribesRef.current = [];
            _dictationSessionRef.current = undefined;
            _activeDictationSessionIdRef.current = undefined;
            _dictationBaseTextRef.current = '';
            _currentInterimTextRef.current = '';
            setDictation(undefined);
        } finally {
            _isCleaningDictationRef.current = false;
        }
    }, []);

    const setText = useCallback((value: string): void => {
        if (_textRef.current === value) return;

        // When dictation is active and the user manually edits the composer text,
        // treat the new text as the updated base so speech results are appended
        // instead of overwriting manual edits.
        if (_dictationRef.current) {
            _dictationBaseTextRef.current = value;
            _currentInterimTextRef.current = '';
            const { status, inputDisabled } = _dictationRef.current;
            setTextState(value);
            setDictation(inputDisabled ? { status, inputDisabled } : { status });
        } else {
            setTextState(value);
        }
    }, []);

    const setRole = useCallback((newRole: Composer['role']): void => {
        if (_roleRef.current === newRole) return;
        setRoleState(newRole);
    }, []);

    const addAttachment = useCallback(async (file: File): Promise<void> => {
        const adapter = _adaptersRef.current?.attachment;
        if (!adapter) throw new Error("Attachments are not supported");

        const upsertAttachment = (a: PendingAttachment) => {
            setAttachments(prev => {
                const idx = prev.findIndex(attachment => attachment.id === a.id);
                if (idx !== -1) {
                    return [...prev.slice(0, idx), a, ...prev.slice(idx + 1)];
                }
                return [...prev, a];
            });
        };

        const promiseOrGenerator = adapter.add({ file });
        if (Symbol.asyncIterator in promiseOrGenerator) {
            for await (const r of promiseOrGenerator) {
                upsertAttachment(r);
            }
        } else {
            upsertAttachment(await promiseOrGenerator);
        }
    }, []);

    const removeAttachment = useCallback(async (index: number): Promise<void> => {
        const attachment = _attachmentsRef.current[index];
        if (!attachment) return;

        const adapter = _adaptersRef.current?.attachment;
        if (adapter) {
            await adapter.remove(attachment);
        }
        setAttachments(prev => prev.filter(a => a.id !== attachment.id));
    }, []);

    const clearAttachments = useCallback(async (): Promise<void> => {
        const adapter = _adaptersRef.current?.attachment;
        if (adapter) {
            await Promise.all(_attachmentsRef.current.map(a => adapter.remove(a)));
        }
        setAttachments([]);
    }, []);

    const reset = useCallback(async (): Promise<void> => {
        if (
            _attachmentsRef.current.length === 0 &&
            _textRef.current === '' &&
            _roleRef.current === 'user'
        ) {
            return;
        }

        const adapter = _adaptersRef.current?.attachment;
        if (adapter) {
            await Promise.all(_attachmentsRef.current.map(a => adapter.remove(a)));
        }

        setTextState('');
        setAttachments([]);
        setRoleState('user');
    }, []);

    const send = useCallback((): void => {
        console.log('send')
        if (_dictationSessionRef.current) {
            _dictationSessionRef.current.cancel();
            _cleanupDictation();
        }

        // const currentText = _textRef.current;
        // console.log('currentText')
        // console.log(currentText)
        const currentRole = _roleRef.current;
        const currentAttachments = _attachmentsRef.current;
        const adapter = _adaptersRef.current?.attachment;

        // Clear text and attachments immediately
        setTextState('');
        setAttachments([]);

        // Process attachments and send message asynchronously
        (async () => {
            const processedAttachments =
                adapter && currentAttachments.length > 0
                    ? await Promise.all(
                        currentAttachments.map(async (a) => {
                            if (_isAttachmentComplete(a)) return a;
                            const result = await adapter.send(a);
                            return result as CompleteAttachment;
                        }),
                    )
                    : [];

            threadStore.getState().send({});
        })();
    }, [_cleanupDictation]);

    const cancel = useCallback((): void => {
        threadStore.getState().stop();
    }, [threadStore]);

    const beginEdit = useCallback((): void => {
        if (isEditing) return;
        setIsEditing(true);
    }, [isEditing]);

    const startDictation = useCallback((): void => {
        const adapter = _adaptersRef.current?.dictation;
        if (!adapter) {
            throw new Error("Dictation adapter not configured");
        }

        // Clean up existing session if any
        if (_dictationSessionRef.current) {
            for (const unsub of _dictationUnsubscribesRef.current) {
                unsub();
            }
            _dictationUnsubscribesRef.current = [];
            const oldSession = _dictationSessionRef.current;
            oldSession.stop().catch(() => { });
            _dictationSessionRef.current = undefined;
        }

        const inputDisabled = adapter.disableInputDuringDictation ?? false;

        _dictationBaseTextRef.current = _textRef.current;
        _currentInterimTextRef.current = '';

        const session = adapter.listen();
        _dictationSessionRef.current = session;
        const sessionId = ++_dictationSessionIdCounterRef.current;
        _activeDictationSessionIdRef.current = sessionId;

        setDictation({ status: session.status, inputDisabled });

        // Subscribe to speech results
        const unsubSpeech = session.onSpeech((result) => {
            if (!_isActiveSession(sessionId, session)) return;
            const isFinal = result.isFinal !== false;

            const needsSeparator =
                _dictationBaseTextRef.current &&
                !_dictationBaseTextRef.current.endsWith(' ') &&
                result.transcript;
            const separator = needsSeparator ? ' ' : '';

            if (isFinal) {
                _dictationBaseTextRef.current =
                    _dictationBaseTextRef.current + separator + result.transcript;
                _currentInterimTextRef.current = '';

                setTextState(_dictationBaseTextRef.current);
                setDictation(prev => {
                    if (prev) {
                        const { transcript: _, ...rest } = prev;
                        return rest;
                    }
                    return prev;
                });
            } else {
                _currentInterimTextRef.current = separator + result.transcript;

                setTextState(_dictationBaseTextRef.current + _currentInterimTextRef.current);
                setDictation(prev => {
                    if (prev) {
                        return { ...prev, transcript: result.transcript };
                    }
                    return prev;
                });
            }
        });
        _dictationUnsubscribesRef.current.push(unsubSpeech);

        // Subscribe to speech start
        const unsubStart = session.onSpeechStart(() => {
            if (!_isActiveSession(sessionId, session)) return;

            setDictation(prev => ({
                status: { type: 'running' as const },
                inputDisabled,
                ...(prev?.transcript && { transcript: prev.transcript }),
            }));
        });
        _dictationUnsubscribesRef.current.push(unsubStart);

        // Subscribe to speech end
        const unsubEnd = session.onSpeechEnd(() => {
            _cleanupDictation({ sessionId });
        });
        _dictationUnsubscribesRef.current.push(unsubEnd);

        // Poll for status changes
        const statusInterval = setInterval(() => {
            if (!_isActiveSession(sessionId, session)) return;

            if (session.status.type === 'ended') {
                _cleanupDictation({ sessionId });
            }
        }, 100);
        _dictationUnsubscribesRef.current.push(() => clearInterval(statusInterval));
    }, [_isActiveSession, _cleanupDictation]);

    const stopDictation = useCallback((): void => {
        if (!_dictationSessionRef.current) return;

        const session = _dictationSessionRef.current;
        const sessionId = _activeDictationSessionIdRef.current;
        session.stop().finally(() => {
            _cleanupDictation({ sessionId });
        });
    }, [_cleanupDictation]);

    // Create store once
    const storeRef = useRef<StoreApi<ComposerCtxType> | null>(null);
    if (storeRef.current === null) {
        storeRef.current = createStore<ComposerCtxType>(() => ({
            text,
            role,
            attachments,
            isEditing,
            canCancel,
            attachmentAccept,
            isEmpty: !text.trim() && !attachments.length,
            type,
            dictation,
            setText,
            setRole,
            addAttachment,
            removeAttachment,
            clearAttachments,
            reset,
            send,
            cancel,
            beginEdit,
            startDictation,
            stopDictation,
        }));
    }

    // Sync state after render (avoids "setState during render" warning)
    useLayoutEffect(() => {
        storeRef.current!.setState({
            text,
            role,
            attachments,
            isEditing,
            canCancel,
            attachmentAccept,
            isEmpty: !text.trim() && !attachments.length,
            type,
            dictation,
            setText,
            setRole,
            addAttachment,
            removeAttachment,
            clearAttachments,
            reset,
            send,
            cancel,
            beginEdit,
            startDictation,
            stopDictation,
        });
    });

    return <ComposerStoreCtx.Provider value={storeRef.current}>
        {children}
    </ComposerStoreCtx.Provider>;
};
