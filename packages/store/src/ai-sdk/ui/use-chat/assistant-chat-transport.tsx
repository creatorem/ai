import {
  DefaultChatTransport,
  HttpChatTransportInitOptions,
  UIMessage,
} from "ai";
import { toToolsJSONSchema } from "@creatorem/stream";
import { AiChatStore } from "../../../store";
// import type { AssistantRuntime } from "../../../runtime/types";

export class AssistantChatTransport<
  UI_MESSAGE extends UIMessage,
> extends DefaultChatTransport<UI_MESSAGE> {
  private store: AiChatStore | undefined;

  constructor(initOptions?: HttpChatTransportInitOptions<UI_MESSAGE>) {
    super({
      ...initOptions,
      prepareSendMessagesRequest: async (options) => {
        const context = this.store?.context;
        const id =
          (await this.store?.threadListItem.methods.initialize())?.remoteId ??
          options.id;

        const optionsEx = {
          ...options,
          body: {
            callSettings: context?.callSettings,
            system: context?.system,
            config: context?.config,
            tools: toToolsJSONSchema(context?.tools ?? {}),
            ...options?.body,
          },
        };
        const preparedRequest =
          await initOptions?.prepareSendMessagesRequest?.(optionsEx);

        return {
          ...preparedRequest,
          body: preparedRequest?.body ?? {
            ...optionsEx.body,
            id,
            messages: options.messages,
            trigger: options.trigger,
            messageId: options.messageId,
            metadata: options.requestMetadata,
          },
        };
      },
    });
  }

  setStore(store: AiChatStore) {
    this.store = store;
  }
}
