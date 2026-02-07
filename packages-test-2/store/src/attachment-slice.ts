import { StateCreator } from "zustand";
import { Attachment } from "./types";
import { AiChatStore } from "./store";

export type AttachmentState = Attachment | null;


export const createAttachmentSlice: StateCreator<
  AiChatStore,
  [],
  [],
  Pick<AiChatStore, 'attachment'>
> = (set, get) => ({
  attachment: {
    state: null,
    methods: {
      remove: async () => {
        const { attachment, adapters } = get();

        if (!attachment.state) {
          return;
        }

        await adapters.attachment.remove(attachment.state);

        set((state) => ({
          ...state,
          attachment: {
            ...state.attachment,
            state: null
          }
        }))
      }
    }
  },
})