// import { AssistantRuntime } from "../../../../assistant-react/src";
import {
  DefaultChatTransport,
  HttpChatTransportInitOptions,
  UIMessage,
} from "ai";
import { toToolsJSONSchema } from "@creatorem/stream";
import { AiChatStore } from "../../../store";

export class AssistantChatTransport<
  UI_MESSAGE extends UIMessage,
> extends DefaultChatTransport<UI_MESSAGE> {
  // private runtime: AssistantRuntime | undefined;
  private store: AiChatStore;
  constructor(initOptions?: HttpChatTransportInitOptions<UI_MESSAGE>) {
    super({
      ...initOptions,
      prepareSendMessagesRequest: async (options) => {
        // const context = this.store?.thread.getModelContext();
        // const context = this.store.thread.;
        const id =
          (await this.runtime?.threads.mainItem.initialize())?.remoteId ??
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

  setRuntime(runtime: AssistantRuntime) {
    this.runtime = runtime;
  }
}
