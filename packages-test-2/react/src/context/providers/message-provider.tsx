"use client";

import { type FC, type PropsWithChildren } from "react";
import { useAui, AuiProvider } from "@creatorem/ai-assistant-store";
import {
  ThreadMessageClientProps,
  ThreadMessageClient,
} from "../../client/thread-message-client";

export const MessageProvider: FC<
  PropsWithChildren<ThreadMessageClientProps>
> = ({ children, ...props }) => {
  const aui = useAui({
    message: ThreadMessageClient(props),
  });

  return <AuiProvider value={aui}>{children}</AuiProvider>;
};
