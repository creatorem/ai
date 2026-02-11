import type { RuntimeComponents } from "@creatorem/ai-chat/component-types";
import ReactMarkdown from "react-markdown";
// import { ThreadPrimitiveViewportSlack } from "./primitives/thread/thread-viewport-slack";
// import { ThreadPrimitiveViewportSlack } from "./primitives/thread";
import { ThreadPrimitiveViewportSlack } from "../../ai-chat/src/primitives/thread/thread-viewport-slack";
import { Primitive } from "@radix-ui/react-primitive";
import TextareaAutosize from "react-textarea-autosize";
import { ComposerPrimitiveAddAttachment } from "./primitives/composer/composer-add-attachment";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { type ReactNode } from "react";

export const webComponents = {
  Box: Primitive.div,
  Text: Primitive.p,
  Button: Primitive.button,
  ScrollArea: ({ children, className }: { children?: ReactNode; className?: string }) => (
    <div className={className} style={{ overflowY: "auto", height: "100%", display: "flex", flexDirection: "column" }}>
      {children}
    </div>
  ),
  Input: Primitive.input,
  Textarea: TextareaAutosize,

  // Action bar
  ActionBarRoot: DropdownMenuPrimitive.Root,
  ActionBarPortal: DropdownMenuPrimitive.Portal,
  ActionBarContent: DropdownMenuPrimitive.Content,
  ActionBarItem: DropdownMenuPrimitive.Item,
  ActionBarSeparator: DropdownMenuPrimitive.Separator,
  ActionBarTrigger: DropdownMenuPrimitive.Trigger,

  // Thread list item more
  ThreadListItemMoreRoot: DropdownMenuPrimitive.Root,
  ThreadListItemMorePortal: DropdownMenuPrimitive.Portal,
  ThreadListItemMoreContent: DropdownMenuPrimitive.Content,
  ThreadListItemMoreItem: DropdownMenuPrimitive.Item,
  ThreadListItemMoreSeparator: DropdownMenuPrimitive.Separator,
  ThreadListItemMoreTrigger: DropdownMenuPrimitive.Trigger,
  
  // Content component
  Markdown: ({ content, className }: { content: string; className?: string }) => (
    <div className={className}>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  ),
  CodeBlock: ({ value, className }: { value: string; className?: string }) => (
    <div className={className}>
      <pre><code>{value}</code></pre>
    </div>
  ),
  Pre: "pre" as any,

  // Media components
  Image: Primitive.img,
  Avatar: ({ src, className }: { src?: string; className?: string }) => <img src={src} alt="avatar" className={className} />,

  ComposerPrimitiveAddAttachment,
  // Attachment
  Attachment: () => null,

  // Layout
  Separator: "hr" as any,

  // Logic/Wrappers
  MessageSpacer: ThreadPrimitiveViewportSlack,
} satisfies RuntimeComponents;
