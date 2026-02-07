'use client';

import { useChat } from '@ai-sdk/react';
import { FC, useState } from 'react';
import { AiProvider } from '@creatorem/ai-chat/primitives/ai-provider'
import { ThreadPrimitiveRoot } from '@creatorem/ai-chat/primitives/thread/thread-root'
import { ThreadPrimitiveViewport } from '@creatorem/ai-chat/primitives/thread/thread-viewport'
import { ThreadPrimitiveViewportFooter } from '@creatorem/ai-chat/primitives/thread/thread-viewport-footer'
import { ThreadPrimitiveMessages } from '@creatorem/ai-chat/primitives/thread/thread-messages'
import { ThreadPrimitiveSuggestion } from '@creatorem/ai-chat/primitives/thread/thread-suggestion'
import { ThreadPrimitiveScrollToBottom } from '@creatorem/ai-chat/primitives/thread/thread-scroll-to-bottom'
import { ComposerPrimitiveRoot } from '@creatorem/ai-chat/primitives/composer/composer-root'
import { ComposerPrimitiveInput } from '@creatorem/ai-chat/primitives/composer/composer-input'
import { ComposerPrimitiveAttachmentDropzone } from '@creatorem/ai-chat/primitives/composer/composer-attachment-dropzone'
import { ComposerPrimitiveSend } from '@creatorem/ai-chat/primitives/composer/composer-send'
import { ComposerPrimitiveCancel } from '@creatorem/ai-chat/primitives/composer/composer-cancel'
import { ThreadPrimitiveIf } from '@creatorem/ai-chat/primitives/thread/thread-if'
import { MessagePrimitiveRoot } from '@creatorem/ai-chat/primitives/message/message-root'
import { MessagePrimitiveParts } from '@creatorem/ai-chat/primitives/message/message-parts'
import { MessagePrimitiveIf } from '@creatorem/ai-chat/primitives/message/message-if'
import { MessagePrimitiveError } from '@creatorem/ai-chat/primitives/message/message-error'
import { ErrorPrimitiveRoot } from '@creatorem/ai-chat/primitives/error/error-root'
import { ErrorPrimitiveMessage } from '@creatorem/ai-chat/primitives/error/error-message'
import * as ActionBarPrimitive from '@creatorem/ai-chat/primitives/action-bar/index'
import * as BranchPickerPrimitive from '@creatorem/ai-chat/primitives/branch-picker/index'
import * as ActionBarMorePrimitive from '@creatorem/ai-chat/primitives/action-bar-more/index'
import { Button } from '@/components/ui/button';
import { ArrowDownIcon, ArrowUpIcon, CheckIcon, ChevronLeftIcon, ChevronRightIcon, CopyIcon, DownloadIcon, MoreHorizontalIcon, PencilIcon, RefreshCwIcon, SquareIcon } from 'lucide-react';
import { TooltipIconButton } from '@/components/ai-chat/tooltip-icon-button';
import { cn } from '@/lib/utils';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { MarkdownText } from '@/components/creatorem-ai/markdown-text';
import { ToolFallback } from '@/components/creatorem-ai/tool-fallback';

export default function Chat() {

  return (
    <AiProvider>
      <SidebarProvider>
        <div className="flex h-dvh w-full pr-0.5">
          {/* <ThreadListSidebar /> */}
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink
                      href="https://www.assistant-ui.com/docs/getting-started"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Build Your Own ChatGPT UX
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Starter Template</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </header>
            <div className="flex-1 overflow-hidden">
              <Thread />
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </AiProvider>
  );
}

const Thread: React.FC = () => {
  return (
    <ThreadPrimitiveRoot>
      <div
        className="aui-root aui-thread-root @container flex h-full flex-col"
        style={{
          ["--thread-max-width" as string]: "44rem",
        }}
      >
        <ThreadPrimitiveViewport
          turnAnchor="top"
          className='aui-thread-viewport relative flex flex-1 flex-col overflow-x-auto overflow-y-scroll scroll-smooth px-4 pt-4'
        >

          <ThreadPrimitiveIf empty={true}>
            <ThreadWelcome />
          </ThreadPrimitiveIf>

          <ThreadPrimitiveMessages
            components={{
              UserMessage,
              EditComposer,
              AssistantMessage,
            }}
          />

          <ThreadPrimitiveViewportFooter className="aui-thread-viewport-footer sticky bottom-0 mx-auto mt-auto flex w-full max-w-(--thread-max-width) flex-col gap-4 overflow-visible rounded-t-3xl bg-background pb-4 md:pb-6">
            <ThreadScrollToBottom />
            <Composer />
          </ThreadPrimitiveViewportFooter>
        </ThreadPrimitiveViewport>

      </div>
    </ThreadPrimitiveRoot>
  );
};

const ThreadScrollToBottom: FC = () => {
  return (
    <ThreadPrimitiveScrollToBottom asChild>
      <TooltipIconButton
        tooltip="Scroll to bottom"
        variant="outline"
        className="aui-thread-scroll-to-bottom absolute -top-12 z-10 self-center rounded-full p-4 disabled:invisible dark:bg-background dark:hover:bg-accent"
      >
        <ArrowDownIcon />
      </TooltipIconButton>
    </ThreadPrimitiveScrollToBottom>
  );
};

const ThreadWelcome: FC = () => {
  return (
    <div className="aui-thread-welcome-root mx-auto my-auto flex w-full max-w-(--thread-max-width) grow flex-col">
      <div className="aui-thread-welcome-center flex w-full grow flex-col items-center justify-center">
        <div className="aui-thread-welcome-message flex size-full flex-col justify-center px-4">
          <h1 className="aui-thread-welcome-message-inner fade-in slide-in-from-bottom-1 animate-in font-semibold text-2xl duration-200">
            Hello there!
          </h1>
          <p className="aui-thread-welcome-message-inner fade-in slide-in-from-bottom-1 animate-in text-muted-foreground text-xl delay-75 duration-200">
            How can I help you today?
          </p>
        </div>
      </div>
      <ThreadSuggestions />
    </div>
  );
};

const SUGGESTIONS = [
  {
    title: "What's the weather",
    label: "in San Francisco?",
    prompt: "What's the weather in San Francisco?",
  },
  {
    title: "Explain React hooks",
    label: "like useState and useEffect",
    prompt: "Explain React hooks like useState and useEffect",
  },
] as const;

const ThreadSuggestions: FC = () => {
  return (
    <div className="aui-thread-welcome-suggestions grid w-full @md:grid-cols-2 gap-2 pb-4">
      {SUGGESTIONS.map((suggestion, index) => (
        <div
          key={suggestion.prompt}
          className="aui-thread-welcome-suggestion-display fade-in slide-in-from-bottom-2 @md:nth-[n+3]:block nth-[n+3]:hidden animate-in fill-mode-both duration-200"
          style={{ animationDelay: `${100 + index * 50}ms` }}
        >
          <ThreadPrimitiveSuggestion prompt={suggestion.prompt} send asChild>
            <Button
              variant="ghost"
              className="aui-thread-welcome-suggestion h-auto w-full @md:flex-col flex-wrap items-start justify-start gap-1 rounded-2xl border px-4 py-3 text-left text-sm transition-colors hover:bg-muted"
              aria-label={suggestion.prompt}
            >
              <span className="aui-thread-welcome-suggestion-text-1 font-medium">
                {suggestion.title}
              </span>
              <span className="aui-thread-welcome-suggestion-text-2 text-muted-foreground">
                {suggestion.label}
              </span>
            </Button>
          </ThreadPrimitiveSuggestion>
        </div>
      ))}
    </div>
  );
};

const Composer: React.FC = () => {
  return (
    <ComposerPrimitiveRoot>
      <div className="aui-composer-root relative flex w-full flex-col">
        <ComposerPrimitiveAttachmentDropzone className="aui-composer-attachment-dropzone flex w-full flex-col rounded-2xl border border-input bg-background px-1 pt-2 outline-none transition-shadow has-[textarea:focus-visible]:border-ring has-[textarea:focus-visible]:ring-2 has-[textarea:focus-visible]:ring-ring/20 data-[dragging=true]:border-ring data-[dragging=true]:border-dashed data-[dragging=true]:bg-accent/50">
          {/* <ComposerAttachments /> */}
          <ComposerPrimitiveInput
            placeholder="Send a message..."
            className="aui-composer-input mb-1 max-h-32 min-h-14 w-full resize-none bg-transparent px-4 pt-2 pb-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-0"
            rows={1}
            autoFocus
            aria-label="Message input"
          />
          <ComposerAction />
        </ComposerPrimitiveAttachmentDropzone>
      </div>
    </ComposerPrimitiveRoot>
  );
};

const ComposerAction: FC = () => {
  return (
    <div className="aui-composer-action-wrapper relative mx-2 mb-2 flex items-center justify-between">
      {/* <ComposerAddAttachment /> */}

      <ThreadPrimitiveIf running={false}>
        <ComposerPrimitiveSend asChild>
          <TooltipIconButton
            tooltip="Send message"
            side="bottom"
            type="submit"
            variant="default"
            size="icon"
            className="aui-composer-send size-8 rounded-full"
            aria-label="Send message"
          >
            <ArrowUpIcon className="aui-composer-send-icon size-4" />
          </TooltipIconButton>
        </ComposerPrimitiveSend>
      </ThreadPrimitiveIf>

      <ThreadPrimitiveIf running={true}>
        <ComposerPrimitiveCancel asChild>
          <Button
            type="button"
            variant="default"
            size="icon"
            className="aui-composer-cancel size-8 rounded-full"
            aria-label="Stop generating"
          >
            <SquareIcon className="aui-composer-cancel-icon size-3 fill-current" />
          </Button>
        </ComposerPrimitiveCancel>
      </ThreadPrimitiveIf>
    </div>
  );
};

// export const ComposerAttachments: FC = () => {
//   return (
//     <div className="aui-composer-attachments mb-2 flex w-full flex-row items-center gap-2 overflow-x-auto px-1.5 pt-0.5 pb-1 empty:hidden">
//       <ComposerPrimitive.Attachments
//         components={{ Attachment: AttachmentUI }}
//       />
//     </div>
//   );
// };


// const AttachmentUI: FC = () => {
//   const api = useAssistantApi();
//   const isComposer = api.attachment.source === "composer";

//   const isImage = useAssistantState(
//     ({ attachment }) => attachment.type === "image",
//   );
//   const typeLabel = useAssistantState(({ attachment }) => {
//     const type = attachment.type;
//     switch (type) {
//       case "image":
//         return "Image";
//       case "document":
//         return "Document";
//       case "file":
//         return "File";
//       default:
//         const _exhaustiveCheck: never = type;
//         throw new Error(`Unknown attachment type: ${_exhaustiveCheck}`);
//     }
//   });

//   return (
//     <Tooltip>
//       <AttachmentPrimitiveRoot
//         className={cn(
//           "aui-attachment-root relative",
//           isImage &&
//           "aui-attachment-root-composer only:[&>#attachment-tile]:size-24",
//         )}
//       >
//         <AttachmentPreviewDialog>
//           <TooltipTrigger asChild>

//             <div
//               className={cn(
//                 "aui-attachment-tile size-14 cursor-pointer overflow-hidden rounded-[14px] border bg-muted transition-opacity hover:opacity-75",
//                 isComposer &&
//                 "aui-attachment-tile-composer border-foreground/20",
//               )}
//               role="button"
//               id="attachment-tile"
//               aria-label={`${typeLabel} attachment`}
//             >
//               <AttachmentThumb />
//             </div>
//           </TooltipTrigger>
//         </AttachmentPreviewDialog>
//         {isComposer && <AttachmentRemove />}
//       </AttachmentPrimitiveRoot>
//       <TooltipContent side="top">
//         <AttachmentPrimitive.Name />
//       </TooltipContent>
//     </Tooltip>
//   );
// };

const MessageError: FC = () => {
  return (
    <MessagePrimitiveError>
      <ErrorPrimitiveRoot className="aui-message-error-root mt-2 rounded-md border border-destructive bg-destructive/10 p-3 text-destructive text-sm dark:bg-destructive/5 dark:text-red-200">
        <ErrorPrimitiveMessage className="aui-message-error-message line-clamp-2" />
      </ErrorPrimitiveRoot>
    </MessagePrimitiveError>
  );
};


const AssistantMessage: FC = () => {
  return (
    <MessagePrimitiveRoot
      className="aui-assistant-message-root fade-in slide-in-from-bottom-1 relative mx-auto w-full max-w-(--thread-max-width) animate-in py-3 duration-150"
      data-role="assistant"
    >
      <div className="aui-assistant-message-content wrap-break-word px-2 text-foreground leading-relaxed">
        <MessagePrimitiveParts
          components={{
            // Text: MarkdownText,
            // Reasoning,
            // ReasoningGroup,
            // tools: { Fallback: ToolFallback },
          }}
        />
        <MessageError />
      </div>

      <div className="aui-assistant-message-footer mt-1 ml-2 flex">
        <BranchPicker />
        <AssistantActionBar />
      </div>
    </MessagePrimitiveRoot>
  );
};

const AssistantActionBar: FC = () => {
  return (
    <ActionBarPrimitive.Root
      hideWhenRunning
      autohide="not-last"
      autohideFloat="single-branch"
      className="aui-assistant-action-bar-root col-start-3 row-start-2 -ml-1 flex gap-1 text-muted-foreground data-floating:absolute data-floating:rounded-md data-floating:border data-floating:bg-background data-floating:p-1 data-floating:shadow-sm"
    >
      <ActionBarPrimitive.Copy asChild>
        <TooltipIconButton tooltip="Copy">
          <MessagePrimitiveIf copied={true}>
            <CheckIcon />
          </MessagePrimitiveIf>
          <MessagePrimitiveIf copied={false}>
            <CopyIcon />
          </MessagePrimitiveIf>
        </TooltipIconButton>
      </ActionBarPrimitive.Copy>
      <ActionBarPrimitive.Reload asChild>
        <TooltipIconButton tooltip="Refresh">
          <RefreshCwIcon />
        </TooltipIconButton>
      </ActionBarPrimitive.Reload>
      <ActionBarMorePrimitive.Root>
        <ActionBarMorePrimitive.Trigger asChild>
          <TooltipIconButton
            tooltip="More"
            className="data-[state=open]:bg-accent"
          >
            <MoreHorizontalIcon />
          </TooltipIconButton>
        </ActionBarMorePrimitive.Trigger>
        <ActionBarMorePrimitive.Content
          side="bottom"
          align="start"
          className="aui-action-bar-more-content z-50 min-w-32 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
        >
          <ActionBarPrimitive.ExportMarkdown asChild>
            <ActionBarMorePrimitive.Item className="aui-action-bar-more-item flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
              <DownloadIcon className="size-4" />
              Export as Markdown
            </ActionBarMorePrimitive.Item>
          </ActionBarPrimitive.ExportMarkdown>
        </ActionBarMorePrimitive.Content>
      </ActionBarMorePrimitive.Root>
    </ActionBarPrimitive.Root>
  );
};

const UserMessage: FC = () => {
  return (
    <MessagePrimitiveRoot
      className="aui-user-message-root fade-in slide-in-from-bottom-1 mx-auto grid w-full max-w-(--thread-max-width) animate-in auto-rows-auto grid-cols-[minmax(72px,1fr)_auto] content-start gap-y-2 px-2 py-3 duration-150 [&:where(>*)]:col-start-2"
      data-role="user"
    >
      {/* <UserMessageAttachments /> */}

      <div className="aui-user-message-content-wrapper relative col-start-2 min-w-0">
        <div className="aui-user-message-content wrap-break-word rounded-2xl bg-muted px-4 py-2.5 text-foreground">
          <MessagePrimitiveParts />
        </div>
        <div className="aui-user-action-bar-wrapper absolute top-1/2 left-0 -translate-x-full -translate-y-1/2 pr-2">
          <UserActionBar />
        </div>
      </div>

      <BranchPicker className="aui-user-branch-picker col-span-full col-start-1 row-start-3 -mr-1 justify-end" />
    </MessagePrimitiveRoot>
  );
};

const UserActionBar: FC = () => {
  return (
    <ActionBarPrimitive.Root
      hideWhenRunning
      autohide="not-last"
      className="aui-user-action-bar-root flex flex-col items-end"
    >
      <ActionBarPrimitive.Edit asChild>
        <TooltipIconButton tooltip="Edit" className="aui-user-action-edit p-4">
          <PencilIcon />
        </TooltipIconButton>
      </ActionBarPrimitive.Edit>
    </ActionBarPrimitive.Root>
  );
};

const EditComposer: FC = () => {
  return (
    <MessagePrimitiveRoot className="aui-edit-composer-wrapper mx-auto flex w-full max-w-(--thread-max-width) flex-col px-2 py-3">
      <ComposerPrimitiveRoot>
        <div className="aui-edit-composer-root ml-auto flex w-full max-w-[85%] flex-col rounded-2xl bg-muted">
          <ComposerPrimitiveInput
            className="aui-edit-composer-input min-h-14 w-full resize-none bg-transparent p-4 text-foreground text-sm outline-none"
            autoFocus
          />
          <div className="aui-edit-composer-footer mx-3 mb-3 flex items-center gap-2 self-end">
            <ComposerPrimitiveCancel asChild>
              <Button variant="ghost" size="sm">
                Cancel
              </Button>
            </ComposerPrimitiveCancel>
            <ComposerPrimitiveSend asChild>
              <Button size="sm">Update</Button>
            </ComposerPrimitiveSend>
          </div>
        </div>
      </ComposerPrimitiveRoot>
    </MessagePrimitiveRoot >
  );
};

const BranchPicker: FC<BranchPickerPrimitive.Root.Props> = ({
  className,
  ...rest
}) => {
  return (
    <BranchPickerPrimitive.Root
      hideWhenSingleBranch
      className={cn(
        "aui-branch-picker-root mr-2 -ml-2 inline-flex items-center text-muted-foreground text-xs",
        className,
      )}
      {...rest}
    >
      <BranchPickerPrimitive.Previous asChild>
        <TooltipIconButton tooltip="Previous">
          <ChevronLeftIcon />
        </TooltipIconButton>
      </BranchPickerPrimitive.Previous>
      <span className="aui-branch-picker-state font-medium">
        <BranchPickerPrimitive.Number /> / <BranchPickerPrimitive.Count />
      </span>
      <BranchPickerPrimitive.Next asChild>
        <TooltipIconButton tooltip="Next">
          <ChevronRightIcon />
        </TooltipIconButton>
      </BranchPickerPrimitive.Next>
    </BranchPickerPrimitive.Root>
  );
};
