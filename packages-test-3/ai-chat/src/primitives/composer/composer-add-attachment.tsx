"use client";

import { useRuntime } from "@creatorem/ai-chat/runtime";
import type { RuntimeComponents } from "@creatorem/ai-chat/component-types";

export const ComposerPrimitiveAddAttachment = (props: React.ComponentProps<RuntimeComponents['ComposerPrimitiveAddAttachment']>) => {
  const {components: {ComposerPrimitiveAddAttachment}} = useRuntime();
  return <ComposerPrimitiveAddAttachment {...props} />;
}