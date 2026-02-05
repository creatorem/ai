import type {
  Attachment,
  CompleteAttachment,
  PendingAttachment,
} from "./types/attachment-types";
import type { Unsubscribe } from "./types/index";
import type { AttachmentAdapter } from "./types/adapters/attachment-adapter";
import type { MessageRole, RunConfig } from "./types/assistant-types";
import type { DictationAdapter } from "./types/adapters/speech";
import type { StateCreator } from "zustand";
import type { FilterStore } from "./store";
import type { ComposerState } from "./types/entities";
import type { AttachmentMethods } from "./types/entities/attachment";
import type { DictationState } from "./runtime-cores";


type ComposerSlice = StateCreator<
  FilterStore,
  [],
  [],
  Pick<FilterStore, 'composer'>
>

const isAttachmentComplete = (a: Attachment): a is CompleteAttachment =>
  a.status.type === "complete";

class ComposerRuntime {
  private set: Parameters<ComposerSlice>[0]
  private get: Parameters<ComposerSlice>[1]

  private _state: ComposerState
  private _dictationSession: DictationAdapter.Session | undefined;
  private _dictationUnsubscribes: Unsubscribe[] = [];
  private _dictationBaseText = "";
  private _currentInterimText = "";
  private _dictationSessionIdCounter = 0;
  private _activeDictationSessionId: number | undefined;
  private _isCleaningDictation = false;

  constructor(...[set, get]: Parameters<ComposerSlice>) {
    this._state = {
      isEditing: false,
      isEmpty: true,
      text: "",
      attachmentAccept: "*",
      attachments: [],
      role: "user",
      runConfig: {},
      canCancel: false,
      type: 'thread',
      dictation: undefined,
    };

    this.set = set;
    this.get = get;
  }

  public get state(): ComposerState {
    return this._state;
  }

  private getAttachmentAdapter(): AttachmentAdapter | undefined {
    return this.get().adapters.attachment;
  }

  private getDictationAdapter(): DictationAdapter | undefined {
    return this.get().adapters.dictation;
  }

  private updateState(updates: Partial<ComposerState>) {
    const newState = { ...this._state, ...updates };
    newState.isEmpty = !newState.text.trim() && !newState.attachments.length;
    this._state = newState;

    this.set((store) => ({
      ...store,
      composer: {
        ...store.composer,
        state: this._state,
      }
    }));
  }

  public setText = (value: string): void => {
    if (this._state.text === value) return;

    // When dictation is active and the user manually edits the composer text,
    // treat the new text as the updated base so speech results are appended
    // instead of overwriting manual edits.
    if (this._state.dictation) {
      this._dictationBaseText = value;
      this._currentInterimText = "";
      const { status, inputDisabled } = this._state.dictation;
      this.updateState({
        text: value,
        dictation: inputDisabled ? { status, inputDisabled } : { status },
      });
    } else {
      this.updateState({ text: value });
    }
  }

  public setRole = (role: MessageRole): void => {
    if (this._state.role === role) return;
    this.updateState({ role });
  }

  public setRunConfig = (runConfig: RunConfig): void => {
    if (this._state.runConfig === runConfig) return;
    this.updateState({ runConfig });
  }

  public async addAttachment(file: File): Promise<void> {
    const adapter = this.getAttachmentAdapter();
    if (!adapter) throw new Error("Attachments are not supported");

    const upsertAttachment = (a: PendingAttachment) => {
      const currentAttachments = this._state.attachments;
      const idx = currentAttachments.findIndex(
        (attachment) => attachment.id === a.id,
      );

      let newAttachments: readonly Attachment[];
      if (idx !== -1) {
        newAttachments = [
          ...currentAttachments.slice(0, idx),
          a,
          ...currentAttachments.slice(idx + 1),
        ];
      } else {
        newAttachments = [...currentAttachments, a];
      }

      this.updateState({ attachments: newAttachments });
    };

    const promiseOrGenerator = adapter.add({ file });
    if (Symbol.asyncIterator in promiseOrGenerator) {
      for await (const r of promiseOrGenerator) {
        upsertAttachment(r);
      }
    } else {
      upsertAttachment(await promiseOrGenerator);
    }
  }

  public async clearAttachments(): Promise<void> {
    const adapter = this.getAttachmentAdapter();
    if (adapter) {
      await Promise.all(this._state.attachments.map((a) => adapter.remove(a)));
    }
    this.updateState({ attachments: [] });
  }

  public attachment = (selector: { index: number } | { id: string }): AttachmentMethods => {
    const findAttachment = (): Attachment | undefined => {
      if ('index' in selector) {
        return this._state.attachments[selector.index];
      }
      return this._state.attachments.find((a) => a.id === selector.id);
    };

    const attachment = findAttachment();
    if (!attachment) {
      throw new Error("Attachment not found");
    }

    return {
      getState: () => {
        const current = findAttachment();
        if (!current) throw new Error("Attachment not found");
        return current;
      },
      remove: async () => {
        const current = findAttachment();
        if (!current) throw new Error("Attachment not found");

        const adapter = this.getAttachmentAdapter();
        if (!adapter) throw new Error("Attachments are not supported");

        await adapter.remove(current);

        const newAttachments = this._state.attachments.filter(
          (a) => a.id !== current.id
        );
        this.updateState({ attachments: newAttachments });
      },
    };
  }

  public async reset(): Promise<void> {
    if (
      this._state.attachments.length === 0 &&
      this._state.text === "" &&
      this._state.role === "user" &&
      Object.keys(this._state.runConfig).length === 0
    ) {
      return;
    }

    const adapter = this.getAttachmentAdapter();
    if (adapter) {
      await Promise.all(this._state.attachments.map((a) => adapter.remove(a)));
    }

    this.updateState({
      text: "",
      attachments: [],
      role: "user",
      runConfig: {},
    });
  }

  public send = (): void => {
    if (this._dictationSession) {
      this._dictationSession.cancel();
      this._cleanupDictation();
    }

    const adapter = this.getAttachmentAdapter();
    const text = this._state.text;
    const role = this._state.role;
    const runConfig = this._state.runConfig;
    const attachments = this._state.attachments;

    // Clear text and attachments immediately
    this.updateState({
      text: "",
      attachments: [],
    });

    // Process attachments and send message asynchronously
    (async () => {
      const processedAttachments =
        adapter && attachments.length > 0
          ? await Promise.all(
              attachments.map(async (a) => {
                if (isAttachmentComplete(a)) return a;
                const result = await adapter.send(a);
                return result as CompleteAttachment;
              }),
            )
          : [];

      // Here you would typically dispatch to a thread runtime
      // For now, we just prepare the message structure
      const _message = {
        createdAt: new Date(),
        role,
        content: text ? [{ type: "text" as const, text }] : [],
        attachments: processedAttachments,
        runConfig,
        metadata: { custom: {} },
      };

      // TODO: Dispatch to thread runtime via handleSend
      // this.handleSend(message);
    })();
  }

  public cancel = (): void => {
    // TODO: Implement cancel logic via handleCancel
    // this.handleCancel();
  }

  public beginEdit = (): void => {
    if (this._state.isEditing) return;
    this.updateState({ isEditing: true });
  }

  private _isActiveSession(
    sessionId: number,
    session: DictationAdapter.Session,
  ): boolean {
    return (
      this._activeDictationSessionId === sessionId &&
      this._dictationSession === session
    );
  }

  public startDictation = (): void => {
    const adapter = this.getDictationAdapter();
    if (!adapter) {
      throw new Error("Dictation adapter not configured");
    }

    if (this._dictationSession) {
      for (const unsub of this._dictationUnsubscribes) {
        unsub();
      }
      this._dictationUnsubscribes = [];
      const oldSession = this._dictationSession;
      oldSession.stop().catch(() => {});
      this._dictationSession = undefined;
    }

    const inputDisabled = adapter.disableInputDuringDictation ?? false;

    this._dictationBaseText = this._state.text;
    this._currentInterimText = "";

    const session = adapter.listen();
    this._dictationSession = session;
    const sessionId = ++this._dictationSessionIdCounter;
    this._activeDictationSessionId = sessionId;

    this.updateState({
      dictation: { status: session.status, inputDisabled },
    });

    const unsubSpeech = session.onSpeech((result) => {
      if (!this._isActiveSession(sessionId, session)) return;
      const isFinal = result.isFinal !== false;

      const needsSeparator =
        this._dictationBaseText &&
        !this._dictationBaseText.endsWith(" ") &&
        result.transcript;
      const separator = needsSeparator ? " " : "";

      if (isFinal) {
        this._dictationBaseText =
          this._dictationBaseText + separator + result.transcript;
        this._currentInterimText = "";

        const currentDictation = this._state.dictation;
        if (currentDictation) {
          const { transcript: _, ...rest } = currentDictation;
          this.updateState({
            text: this._dictationBaseText,
            dictation: rest,
          });
        } else {
          this.updateState({ text: this._dictationBaseText });
        }
      } else {
        this._currentInterimText = separator + result.transcript;

        const currentDictation = this._state.dictation;
        if (currentDictation) {
          this.updateState({
            text: this._dictationBaseText + this._currentInterimText,
            dictation: {
              ...currentDictation,
              transcript: result.transcript,
            },
          });
        } else {
          this.updateState({
            text: this._dictationBaseText + this._currentInterimText,
          });
        }
      }
    });
    this._dictationUnsubscribes.push(unsubSpeech);

    const unsubStart = session.onSpeechStart(() => {
      if (!this._isActiveSession(sessionId, session)) return;

      const currentDictation = this._state.dictation;
      this.updateState({
        dictation: {
          status: { type: "running" },
          inputDisabled,
          ...(currentDictation?.transcript && {
            transcript: currentDictation.transcript,
          }),
        },
      });
    });
    this._dictationUnsubscribes.push(unsubStart);

    const unsubEnd = session.onSpeechEnd(() => {
      this._cleanupDictation({ sessionId });
    });
    this._dictationUnsubscribes.push(unsubEnd);

    const statusInterval = setInterval(() => {
      if (!this._isActiveSession(sessionId, session)) return;

      if (session.status.type === "ended") {
        this._cleanupDictation({ sessionId });
      }
    }, 100);
    this._dictationUnsubscribes.push(() => clearInterval(statusInterval));
  }

  public stopDictation = (): void => {
    if (!this._dictationSession) return;

    const session = this._dictationSession;
    const sessionId = this._activeDictationSessionId;
    session.stop().finally(() => {
      this._cleanupDictation({ sessionId });
    });
  }

  private _cleanupDictation(options?: { sessionId: number | undefined }): void {
    const isStaleSession =
      options?.sessionId !== undefined &&
      options.sessionId !== this._activeDictationSessionId;
    if (isStaleSession || this._isCleaningDictation) return;

    this._isCleaningDictation = true;
    try {
      for (const unsub of this._dictationUnsubscribes) {
        unsub();
      }
      this._dictationUnsubscribes = [];
      this._dictationSession = undefined;
      this._activeDictationSessionId = undefined;
      this._dictationBaseText = "";
      this._currentInterimText = "";

      this.updateState({ dictation: undefined });
    } finally {
      this._isCleaningDictation = false;
    }
  }


  public getSlice(): FilterStore['composer'] {
    return {
      state: this._state,
      methods: {
        setText: this.setText,
        setRole: this.setRole,
        setRunConfig: this.setRunConfig,
        addAttachment: this.addAttachment.bind(this),
        clearAttachments: this.clearAttachments.bind(this),
        attachment: this.attachment,
        reset: this.reset.bind(this),
        send: this.send,
        cancel: this.cancel,
        startDictation: this.startDictation,
        stopDictation: this.stopDictation,
        beginEdit: this.beginEdit,
      }
    }
  }
}


export const createComposerSlice: StateCreator<
  FilterStore,
  [],
  [],
  Pick<FilterStore, 'composer'>
> = (...a) => ({
  composer: new ComposerRuntime(...a).getSlice()
})
