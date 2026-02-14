'use client';

import { useChat } from "@ai-sdk/react";
import {
    DataUIPart,
    DefaultChatTransport,
    FileUIPart,
    generateId,
    getToolName,
    isToolUIPart,
    UIMessage,
} from "ai";
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createStore, useStore, type StoreApi } from 'zustand';
import { Thread, ThreadCapabilities } from '../../types/entities';
import { useAiContext, useThreads } from "../../ai-provider";
import { ComposerCtxType } from "../composer/composer-provider";
import { MessageRepository } from "../../utils/message-repository";
import { AttachmentsProvider } from "../attachment/attachment-by-index-provider";
import { ToolCallMessagePartComponent } from "../../types/message-part-component-types";
import { Unsubscribe } from "../../types/unsuscribe";
import { toToolsJSONSchema } from "../../stream/schema-utils";
import { Tool } from "../../stream/tool-types";

export type CustomUIDataTypes = {
    textDelta: string;
    imageDelta: string;
    sheetDelta: string;
    codeDelta: string;
    // suggestion: Suggestion;
    appendMessage: string;
    id: string;
    title: string;
    // kind: ArtifactKind;
    clear: null;
    finish: null;
    "chat-title": string;
};

export type ThreadMethods = {
};

export type ToolsState = {
    tools: Record<string, ToolCallMessagePartComponent[]>;
    registry: Record<string, Tool<any, any>>;
};

export type ToolsMethods = {
    setToolUI(
        toolName: string,
        render: ToolCallMessagePartComponent,
    ): Unsubscribe;
    registerTool(
        toolName: string,
        tool: Tool<any, any>,
    ): Unsubscribe;
};

export type ThreadCtxType = Thread & Omit<ReturnType<typeof useChat<Thread['messages'][0]>>, 'status' | 'setMessages' | 'sendMessage'> & {
    dataStream: DataUIPart<CustomUIDataTypes>[];
    setDataStream: React.Dispatch<
        React.SetStateAction<DataUIPart<CustomUIDataTypes>[]>
    >;
    // chatStatus: ReturnType<typeof useChat<Thread['messages'][0]>>['status']
    // composerText: string,
    // setComposerText: (v: string) => void,
    send: (o: { clearText?: boolean, prompt?: string, files?: FileList | FileUIPart[] }) => void,
    sendEdit: (messageId: string, text: string, files?: FileList | FileUIPart[]) => void,
    beginEdit: (messageId: string) => void;
    stopEdit: (messageId: string) => void;
    getBranches: (messageId: string) => string[];
    switchToBranch: (messageId: string) => void;
    /** The StoreApi of the first composer mounted within this thread. */
    composerStore: StoreApi<ComposerCtxType> | null,
    tools: ToolsState & { methods: ToolsMethods };
}

function stripClosingDelimiters(json: string) {
    return json.replace(/[}\]"]+$/, "");
}

const convertParts = (message: UIMessage): any[] => {
    if (!message.parts || message.parts.length === 0) return [];

    return message.parts
        .filter((p) => p.type !== "step-start")
        .map((part) => {
            const type = part.type;

            if (type === "text" || type === "reasoning") {
                return part;
            }

            if (isToolUIPart(part)) {
                const toolName = getToolName(part);
                const toolCallId = part.toolCallId;

                let args: Record<string, unknown> = {};
                let result: unknown;
                let isError = false;

                if (part.state === "input-streaming" || part.state === "input-available") {
                    args = (part.input as Record<string, unknown>) || {};
                } else if (part.state === "output-available") {
                    args = (part.input as Record<string, unknown>) || {};
                    result = part.output;
                } else if (part.state === "output-error") {
                    args = (part.input as Record<string, unknown>) || {};
                    isError = true;
                    result = { error: part.errorText };
                }

                let argsText = JSON.stringify(args);
                if (part.state === "input-streaming") {
                    argsText = stripClosingDelimiters(argsText);
                }

                return {
                    type: "tool-call",
                    toolName,
                    toolCallId,
                    argsText,
                    args,
                    result,
                    isError,
                    ...((part as any).artifact !== undefined ? { artifact: (part as any).artifact } : {}),
                };
            }

            if (type === "source-url") {
                return {
                    type: "source",
                    sourceType: "url",
                    id: part.sourceId,
                    url: part.url,
                    title: part.title || "",
                };
            }

            if (type === "source-document") {
                console.warn(`Source document part type ${type} is not yet supported`);
                return null;
            }

            if (type.startsWith("data-")) {
                const name = type.substring(5);
                return {
                    type: "data",
                    name,
                    data: (part as any).data,
                };
            }

            return part;
        })
        .filter(Boolean) as any[];
};

const convertMessages = (messages: UIMessage[]): UIMessage[] => {
    return messages.map((message) => ({
        ...message,
        parts: convertParts(message),
    })) as UIMessage[];
};

const ThreadStoreCtx = React.createContext<StoreApi<ThreadCtxType> | null>(null);

export function useThread(): ThreadCtxType;
export function useThread<T>(selector: (state: ThreadCtxType) => T): T;
export function useThread<T>(selector?: (state: ThreadCtxType) => T) {
    const store = React.useContext(ThreadStoreCtx);
    if (!store) throw new Error('This component must be used within ThreadCtx.Provider.');
    return useStore(store, selector as any);
}

export function useThreadStore(): StoreApi<ThreadCtxType> {
    const store = React.useContext(ThreadStoreCtx);
    if (!store) throw new Error('This component must be used within ThreadCtx.Provider.');
    return store;
}

const _noopRemoveAttachment = () => { };

export function ThreadPrimitiveRoot({ children, ...value }: { children: React.ReactNode }) {
    const eventHandler = useAiContext(s => s.eventHandler);
    const adapters = useAiContext(s => s.adapters);
    const chatOptions = useAiContext(s => s.chatOptions);
    const contextTools = useAiContext(s => s.tools);
    const toolkit = useAiContext(s => s.toolkit);
    const system = useAiContext(s => s.system);
    const callSettings = useAiContext(s => s.callSettings);
    const config = useAiContext(s => s.config);
    const activeThreadId = useThreads(s => s.activeThreadId);
    const [title, setTitle] = useState('New thread');
    const [status, setStatus] = useState<Thread['status']>('regular');
    const [isLoading, setIsLoading] = useState(true);
    const [isDisabled, setIsDisabled] = useState(false);
    const [editingComposers, setEditingComposers] = useState<string[]>([]);
    const [capabilities, setCapabilities] = useState<ThreadCapabilities>({
        // switchToBranch: false,
        // switchBranchDuringRun: false,
        // edit: false,
        // reload: false,
        // cancel: false,
        // unstable_copy: false,
        // speech: false,
        // dictation: false,
        // attachments: false,
        // feedback: false,
        switchToBranch: true,
        switchBranchDuringRun: true,
        edit: true,
        reload: true,
        cancel: true,
        unstable_copy: true,
        speech: true,
        dictation: true,
        attachments: true,
        feedback: true,
    })
    const [dataStream, setDataStream] = useState<DataUIPart<CustomUIDataTypes>[]>(
        []
    );

    const toolsRef = useRef<Record<string, Tool<any, any>>>({});
    const modelContextRef = useRef<{
        tools: Record<string, Tool<any, any>>;
        system?: string;
        callSettings?: unknown;
        config?: unknown;
    }>({ tools: {} });
    const addToolOutputRef = useRef<
        null | ((
            args: {
                tool: string;
                toolCallId: string;
                output?: unknown;
                state?: "output-available" | "output-error";
                errorText?: string;
            }
        ) => Promise<void>)
    >(null);

    const transportRef = useRef<DefaultChatTransport<Thread['messages'][0]> | null>(null);
    if (transportRef.current === null) {
        transportRef.current = new DefaultChatTransport({
            ...chatOptions?.transportOptions,
            prepareSendMessagesRequest: async (options) => {
                const context = modelContextRef.current;
                return {
                    ...options,
                    body: {
                        ...options.body,
                        id: options.id,
                        messages: options.messages,
                        trigger: options.trigger,
                        messageId: options.messageId,
                        metadata: options.requestMetadata,
                        ...(context.system ? { system: context.system } : {}),
                        ...(context.callSettings ? { callSettings: context.callSettings } : {}),
                        ...(context.config ? { config: context.config } : {}),
                        tools: toToolsJSONSchema(Object.values(toolsRef.current) as any) as any,
                    },
                };
            },
        });
    }

    const {
        id,
        messages,
        setMessages,
        status: chatStatus,
        sendMessage,
        stop,
        ...other
    } = useChat<Thread['messages'][0]>({
        generateId,
        transport: transportRef.current,
        ...chatOptions,
        onToolCall: async ({ toolCall }) => {
            chatOptions?.onToolCall?.({ toolCall })
            const tool = toolsRef.current?.[toolCall.toolName];
            if (!tool?.execute) return;
            try {
                const result = await tool.execute(toolCall.input as any, {
                    toolCallId: toolCall.toolCallId,
                    abortSignal: new AbortController().signal,
                    human: async () => {
                        throw new Error("Human input is not supported in this runtime");
                    },
                });
                await addToolOutputRef.current?.({
                    tool: toolCall.toolName as any,
                    toolCallId: toolCall.toolCallId,
                    output: result as any,
                });
            } catch (err) {
                await addToolOutputRef.current?.({
                    tool: toolCall.toolName as any,
                    toolCallId: toolCall.toolCallId,
                    state: "output-error",
                    errorText: err instanceof Error ? err.message : String(err),
                });
            }
        },
        onData: (dataPart) => {
            chatOptions?.onData?.(dataPart)
            setDataStream((ds) => (ds ? [...ds, dataPart] : []));
        },
        'onError': (error) => {
            chatOptions?.onError?.(error)
            console.log(error)
        },
        // id: activeThreadId || undefined,
    });

    const viewMessages = useMemo(
        () => convertMessages(messages as UIMessage[]),
        [messages],
    );

    const rawMessagesRef = useRef(messages);
    useLayoutEffect(() => {
        rawMessagesRef.current = messages;
    }, [messages]);

    const send = useCallback(({ clearText = true, prompt, files }: { clearText?: boolean, prompt?: string, files?: FileList | FileUIPart[] }) => {
        const text = storeRef.current!.getState().composerStore!.getState().text
        const finalPrompt = prompt ?? text
        if (!finalPrompt && (!files || (Array.isArray(files) ? files.length === 0 : files.length === 0))) {
            throw new Error('No prompt passed.')
        }
        sendMessage({ text: finalPrompt ?? '', files })
        if (clearText) {
            storeRef.current!.getState().composerStore!.getState()!.setText('')
        }
    }, [sendMessage])

    const sendEdit = useCallback((messageId: string, text: string, files?: FileList | FileUIPart[]): void => {
        const currentMessages = rawMessagesRef.current;
        const editIndex = currentMessages.findIndex(m => m.id === messageId);
        if (editIndex === -1) throw new Error('Message not found for edit');

        // Truncate to the parent (everything before the edited message).
        // The old message stays in the repository, creating a branch.
        const truncated = currentMessages.slice(0, editIndex);
        setMessages(truncated);

        // Send the new text — the SDK appends it after the truncated messages
        sendMessage({ text, files });

        // Close the edit composer
        setEditingComposers((prev) => prev.filter((id) => id !== messageId));
    }, [setMessages, sendMessage, setEditingComposers])

    const beginEdit = useCallback((messageId: string) => {
        setEditingComposers((prev) => [...prev, messageId])
    }, [setEditingComposers])

    const stopEdit = useCallback((messageId: string) => {
        setEditingComposers((prev) => prev.filter((id) => id !== messageId))
    }, [setEditingComposers])

    // --- Message branching repository ---
    type ThreadMessage = Thread['messages'][0];
    const repositoryRef = useRef(new MessageRepository<ThreadMessage>());

    // Sync repository with SDK messages (additive only — never delete,
    // so branches are preserved when the SDK temporarily removes messages
    // during regeneration or editing).
    useLayoutEffect(() => {
        const repo = repositoryRef.current;
        for (let i = 0; i < messages.length; i++) {
            const parentId = i > 0 ? messages[i - 1]!.id : null;
            repo.addOrUpdateMessage(parentId, messages[i]!);
        }
    }, [messages]);

    const getBranches = useCallback((messageId: string): string[] => {
        return repositoryRef.current.getBranches(messageId);
    }, []);

    const switchToBranchFn = useCallback((messageId: string): void => {
        repositoryRef.current.switchToBranch(messageId);
        setMessages(repositoryRef.current.getMessages() as ThreadMessage[]);
    }, [setMessages]);

    // console.log({ messages })

    useEffect(() => {
        let cancelled = false;
        const threadAdapter = adapters?.thread;

        (async function () {
            if (!activeThreadId) {
                repositoryRef.current.clear();
                setTitle('New thread');
                setStatus('regular');
                setMessages([]);
                setIsLoading(false);
                return;
            }

            if (threadAdapter) {
                try {
                    setIsLoading(true);
                    const thread = await threadAdapter.fetch(activeThreadId);
                    if (cancelled) return;
                    repositoryRef.current.clear();
                    setTitle(thread.title || 'New thread');
                    setStatus(thread.status);
                    setMessages(thread.messages);
                    setIsLoading(false);
                    eventHandler.trigger('thread.initialize', { 'threadId': id });
                } catch {
                    if (cancelled) return;
                    setIsLoading(false);
                }
                return;
            }

            setIsLoading(false);
        })();

        return () => {
            cancelled = true;
        };
    }, [adapters, activeThreadId, eventHandler, id, setMessages])

    const setActiveThreadId = useThreads(s => s.setActiveThreadId);
    const setThreadIds = useThreads(s => s.setThreadIds);

    // Persistence logic
    const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const prevActiveThreadIdRef = useRef(activeThreadId);

    useEffect(() => {
        const threadAdapter = adapters?.thread;
        
        if (!threadAdapter || !threadAdapter.save) return;

        const prevActiveThreadId = prevActiveThreadIdRef.current;
        const hasSwitchedThread = prevActiveThreadId !== activeThreadId;

        if (hasSwitchedThread) {
            prevActiveThreadIdRef.current = activeThreadId;
            return;
        }

        const save = async () => {
            if (activeThreadId) {
                // Update existing thread
                await threadAdapter.save(activeThreadId, {
                    title,
                    status,
                    messages: messages as any,
                });
            } else if (messages.length > 0) {
                // Create new thread directly
                const newId = generateId();
                
                let title = 'New Thread';
                if (threadAdapter.generateTitle) {
                    title = await threadAdapter.generateTitle(messages as any);
                } else {
                    const firstMessage = messages[0] as any;
                    const cleanContent = firstMessage?.content || (firstMessage?.parts && firstMessage.parts.length > 0 && typeof firstMessage.parts[0] === 'object' && 'text' in firstMessage.parts[0] ? (firstMessage.parts[0] as any).text : '') || '';
                    title = cleanContent ? cleanContent.slice(0, 30) : 'New Thread';
                }

                await threadAdapter.save(newId, {
                    title: title,
                    status: 'regular',
                    messages: messages as any,
                });
                
                // Update global state
                setThreadIds(prev => [newId, ...prev]);
                setActiveThreadId(newId);
                
                // We don't need to manually update title/status here as the effect above will run
                // when activeThreadId changes, but since we are the ones changing it and we just saved,
                // the fetch will return what we just saved.
            }
        };

        if (activeThreadId) {
            // Debounce updates for existing threads
            if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
            saveTimeoutRef.current = setTimeout(save, 1000);
        } else if (messages.length > 0) {
            // Immediate save for new threads
            save();
        }

        return () => {
            if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        };
    }, [messages, activeThreadId, adapters, title, status, setThreadIds, setActiveThreadId]);

    const isRunningRef = useRef(false);
    console.log( {chatStatus} )
    useEffect(() => {
        if (chatStatus === 'streaming') {
            isRunningRef.current = true;
            console.warn('thread.runStart')
            eventHandler.trigger('thread.runStart', { 'threadId': id })
        } else if (isRunningRef.current && chatStatus === 'ready') {
            isRunningRef.current = false;
            eventHandler.trigger('thread.runEnd', { 'threadId': id })
        }
    }, [eventHandler, id, chatStatus])

    const trytostop = useCallback(async () => {
        console.log( 'trytostop' )
        await stop()
    }, [stop])

    // Create store once
    const storeRef = useRef<StoreApi<ThreadCtxType> | null>(null);
    if (storeRef.current === null) {
        storeRef.current = createStore<ThreadCtxType>((set) => ({
            id,
            isEmpty: viewMessages.length === 0,
            isDisabled,
            isLoading,
            isRunning: chatStatus === 'streaming',
            title,
            status,
            messages: viewMessages as any,
            capabilities,
            editingComposers,
            chatStatus,
            dataStream,
            setDataStream,
            beginEdit,
            stopEdit,
            stop: trytostop,
            // composerText,
            // setComposerText,
            send,
            sendEdit,
            getBranches,
            switchToBranch: switchToBranchFn,
            composerStore: null,
            tools: {
                tools: {},
                registry: {},
                methods: {
                    setToolUI: (toolName, render) => {
                        set((prev) => ({
                            tools: {
                                ...prev.tools,
                                tools: {
                                    ...prev.tools.tools,
                                    [toolName]: [
                                        ...(prev.tools.tools[toolName] ?? []),
                                        render,
                                    ],
                                },
                            },
                        }));

                        return () => {
                            set((prev) => ({
                                tools: {
                                    ...prev.tools,
                                    tools: {
                                        ...prev.tools.tools,
                                        [toolName]:
                                            prev.tools.tools[toolName]?.filter(
                                                (r) => r !== render,
                                            ) ?? [],
                                    },
                                },
                            }));
                        };
                    },
                    registerTool: (toolName, tool) => {
                        set((prev) => {
                            const existing = prev.tools.registry[toolName];
                            if (existing && existing !== tool) {
                                throw new Error(
                                    `Tool "${toolName}" is already registered.`,
                                );
                            }
                            return {
                                tools: {
                                    ...prev.tools,
                                    registry: {
                                        ...prev.tools.registry,
                                        [toolName]: tool,
                                    },
                                },
                            };
                        });

                        return () => {
                            set((prev) => {
                                if (prev.tools.registry[toolName] !== tool) return prev;
                                const { [toolName]: _, ...rest } = prev.tools.registry;
                                return {
                                    tools: {
                                        ...prev.tools,
                                        registry: rest,
                                    },
                                };
                            });
                        };
                    },
                },
            },
            ...other
        }));
    }

    addToolOutputRef.current = other.addToolOutput as any;

    // Sync state after render (avoids "setState during render" warning)
    useLayoutEffect(() => {
        storeRef.current!.setState({
            id,
            isEmpty: viewMessages.length === 0,
            isDisabled,
            isLoading,
            isRunning: chatStatus === 'streaming',
            title,
            status,
            messages: viewMessages as any,
            capabilities,
            editingComposers,
            dataStream,
            setDataStream,
            beginEdit,
            stopEdit,
            stop: trytostop,
            // composerText,
            // setComposerText,
            send,
            sendEdit,
            getBranches,
            switchToBranch: switchToBranchFn,
            ...other
        });
    });

    useLayoutEffect(() => {
        toolsRef.current = storeRef.current!.getState().tools.registry;
        modelContextRef.current = {
            tools: toolsRef.current,
            system,
            callSettings,
            config,
        };
    }, []);

    useEffect(() => {
        if (!storeRef.current) return;
        const unsubscribe = storeRef.current.subscribe((state) => {
            toolsRef.current = state.tools.registry;
            modelContextRef.current = {
                tools: toolsRef.current,
                system,
                callSettings,
                config,
            };
        });
        return unsubscribe;
    }, [system, callSettings, config]);

    useEffect(() => {
        if (!storeRef.current) return;
        const unsubs: Unsubscribe[] = [];
        const toolkitEntries = Object.entries(toolkit ?? {});
        const toolkitNames = new Set(toolkitEntries.map(([name]) => name));

        for (const [toolName, toolDef] of toolkitEntries) {
            if (toolDef.render) {
                unsubs.push(
                    storeRef.current.getState().tools.methods.setToolUI(
                        toolName,
                        toolDef.render,
                    ),
                );
            }
            const { render, ...rest } = toolDef;
            unsubs.push(
                storeRef.current.getState().tools.methods.registerTool(
                    toolName,
                    rest,
                ),
            );
        }

        for (const [toolName, tool] of Object.entries(contextTools ?? {})) {
            if (toolkitNames.has(toolName)) continue;
            unsubs.push(
                storeRef.current.getState().tools.methods.registerTool(
                    toolName,
                    tool as any,
                ),
            );
        }

        return () => {
            unsubs.forEach((fn) => fn());
        };
    }, [toolkit, contextTools]);

    return <ThreadStoreCtx.Provider value={storeRef.current}>
        <AttachmentsProvider attachments={[]} removeAttachment={_noopRemoveAttachment}>
            {children}
        </AttachmentsProvider>
    </ThreadStoreCtx.Provider>;
};
