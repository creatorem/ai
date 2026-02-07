import type { UIMessage } from "ai";
import { ThreadMessage } from "../../types";
import { getExternalStoreMessages } from "../../utils/get-external-store-message";

export const getVercelAIMessages = <UI_MESSAGE extends UIMessage = UIMessage>(
  message: ThreadMessage,
) => {
  return getExternalStoreMessages(message) as UI_MESSAGE[];
};
