"use client";

import { type FC, type PropsWithChildren } from "react";
// import { useAui, AuiProvider, Derived } from "@creatorem/ai-store";
import { useAiChat } from "@creatorem/ai-store";



export const ComposerAttachmentByIndexProvider: FC<
  PropsWithChildren<{
    index: number;
  }>
> = ({ index, children }) => {
  const aui = useAui({
    attachment: Derived({
      source: "composer",
      query: { type: "index", index },
      get: (aui) => aui.composer().attachment({ index }),
    }),
  });

  return <AuiProvider value={aui}>{children}</AuiProvider>;
};
