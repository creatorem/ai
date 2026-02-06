// import {
//   getExternalStoreMessages,
//   type ThreadMessage,
// } from "../../../assistant-react/src";
import type { UIMessage } from "ai";
import { ThreadMessage } from "../../types";
import { getExternalStoreMessages } from "../../../../assistant-react/src";

export const getVercelAIMessages = <UI_MESSAGE extends UIMessage = UIMessage>(
  message: ThreadMessage,
) => {
  return getExternalStoreMessages(message) as UI_MESSAGE[];
};
