'use client';

import { useChat } from '@ai-sdk/react';
import { FC, useState } from 'react';
import { AiProvider } from '@creatorem/ai-chat/primitives/ai-provider'
import { ThreadPrimitiveRoot } from '@creatorem/ai-chat/primitives/thread/thread-root'
import { ThreadPrimitiveViewport } from '@creatorem/ai-chat/primitives/thread/thread-viewport'
import { ThreadPrimitiveViewportFooter } from '@creatorem/ai-chat/primitives/thread/thread-viewport-footer'
import { ComposerPrimitiveRoot } from '@creatorem/ai-chat/primitives/composer/composer-root'
import { ComposerPrimitiveInput } from '@creatorem/ai-chat/primitives/composer/composer-input'
import { ComposerPrimitiveAttachmentDropzone } from '@creatorem/ai-chat/primitives/composer/composer-attachment-dropzone'
import { ComposerPrimitiveSend } from '@creatorem/ai-chat/primitives/composer/composer-send'
import { ComposerPrimitiveCancel} from '@creatorem/ai-chat/primitives/composer/composer-cancel'
import { ThreadPrimitiveIf } from '@creatorem/ai-chat/primitives/thread/thread-if'
import { Button } from '@/components/ui/button';
import { ArrowUpIcon, SquareIcon } from 'lucide-react';
import { TooltipIconButton } from '@/components/ai-chat/tooltip-icon-button';

export default function Chat() {

  return (
    <AiProvider>
      <Thread />
      {/* <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
        {messages.map(message => (
          <div key={message.id} className="whitespace-pre-wrap">
            {message.role === 'user' ? 'User: ' : 'AI: '}
            {message.parts.map((part, i) => {
              switch (part.type) {
                case 'text':
                  return <div key={`${message.id}-${i}`}>{part.text}</div>;
                case 'tool-weather':
                case 'tool-convertFahrenheitToCelsius':
                  return (
                    <pre key={`${message.id}-${i}`}>
                      {JSON.stringify(part, null, 2)}
                    </pre>
                  );
              }
            })}
          </div>
        ))}

        <form
          onSubmit={e => {
            e.preventDefault();
            sendMessage({ text: input });
            setInput('');
          }}
        >
          <input
            className="fixed dark:bg-zinc-900 bottom-0 w-full max-w-md p-2 mb-8 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"
            value={input}
            placeholder="Say something..."
            onChange={e => setInput(e.currentTarget.value)}
          />
        </form>
      </div> */}
    </AiProvider>
  );
}

const Thread: React.FC = () => {
  return (
    <ThreadPrimitiveRoot>
      <div
        className="aui-root aui-thread-root @container flex h-full flex-col bg-background"
        style={{
          ["--thread-max-width" as string]: "44rem",
        }}
      >
        <ThreadPrimitiveViewport
        turnAnchor="top"
        >
          <div
            className="aui-thread-viewport relative flex flex-1 flex-col overflow-x-auto overflow-y-scroll scroll-smooth px-4 pt-4"
          >

            {/* <AssistantIf condition={({ thread }) => thread.isEmpty}>
            <ThreadWelcome />
          </AssistantIf> */}

            {/* <ThreadPrimitive.Messages
              components={{
                UserMessage,
                EditComposer,
                AssistantMessage,
              }}
            /> */}

            <ThreadPrimitiveViewportFooter className="aui-thread-viewport-footer sticky bottom-0 mx-auto mt-auto flex w-full max-w-(--thread-max-width) flex-col gap-4 overflow-visible rounded-t-3xl bg-background pb-4 md:pb-6">
              {/* <ThreadScrollToBottom /> */}
              <Composer />
            </ThreadPrimitiveViewportFooter>
          </div>
        </ThreadPrimitiveViewport>

      </div>
    </ThreadPrimitiveRoot>
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
//       <AttachmentPrimitive.Root
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
//       </AttachmentPrimitive.Root>
//       <TooltipContent side="top">
//         <AttachmentPrimitive.Name />
//       </TooltipContent>
//     </Tooltip>
//   );
// };