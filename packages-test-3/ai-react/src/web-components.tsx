import type { RuntimeComponents } from "@creatorem/ai-chat/component-type-check";
import ReactMarkdown from "react-markdown";
import { ThreadPrimitiveViewportSlack } from "./primitives/thread/thread-viewport-slack";
import { Primitive } from "@radix-ui/react-primitive";
import TextareaAutosize from "react-textarea-autosize";
import { ComposerPrimitiveAddAttachment } from "./primitives/composer/composer-add-attachment";
import React, { type ReactNode } from "react";

export const webComponents: RuntimeComponents = {
  Box: Primitive.div,
  // Form: Primitive.form,
  Text: Primitive.p,
  Button: Primitive.button,
  // ScrollArea: ({ children, className }: { children?: ReactNode; className?: string }) => (
  //   <div className={className} style={{ overflowY: "auto", height: "100%", display: "flex", flexDirection: "column" }}>
  //     {children}
  //   </div>
  // ),
  Input: ({ onChange: onChangeProp, ...props }: Omit<React.ComponentPropsWithoutRef<
    typeof TextareaAutosize
  >, 'onChange'> & {
    onChange?: (
      value: string,
      event: React.ChangeEvent<HTMLTextAreaElement>
    ) => void;
  }) => (
    <TextareaAutosize
      {...props}
      onChange={(e) => onChangeProp?.(e.target.value, e)}
    />
  ),

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
  
  // Layout
  Separator: "hr" as any,

  // Logic/Wrappers
  MessageSpacer: ThreadPrimitiveViewportSlack,
};
