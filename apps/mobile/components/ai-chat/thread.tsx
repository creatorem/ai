import { FC, type ReactNode } from "react";
import { View } from "react-native";

import { Icon, IconName } from "../ui/icon";
import { Text } from "../ui/text";
import { cn } from "~/utils/cn";
import {
  ActionSheet,
  ActionSheetContent,
  ActionSheetTrigger,
} from "../ui/action-sheet";
import { Button } from "../ui/button";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import * as ComposerPrimitive from "@creatorem/ai-react-native/primitives/composer";
import * as ErrorPrimitive from "@creatorem/ai-react-native/primitives/error";
import * as ActionBarPrimitive from "@creatorem/ai-react-native/primitives/action-bar";
import * as BranchPickerPrimitive from "@creatorem/ai-react-native/primitives/branch-picker";
import * as ThreadPrimitive from "@creatorem/ai-react-native/primitives/thread";
import * as MessagePrimitive from "@creatorem/ai-react-native/primitives/message";
import { ScrollView } from "react-native-gesture-handler";
import { ToolFallback } from "./tool-fallback";
import { MarkdownText } from "./markdown-text";
import { useCSSVariable } from "uniwind";
import { ComposerAddAttachment } from "./attachment";

export const Thread: React.FC = () => {
  return (
    <ThreadPrimitive.Root>
      <View className="flex-1">
        <ThreadPrimitive.Viewport turnAnchor="top">
          <ThreadPrimitive.ViewportScrollable
            className="relative flex flex-1 flex-col px-4 pt-4"
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <ThreadPrimitive.If empty={true}>
              <ThreadWelcome />
            </ThreadPrimitive.If>

            <ThreadPrimitive.Messages
              components={{
                UserMessage,
                EditComposer,
                AssistantMessage,
              }}
            />
            <View className="h-20" />
          </ThreadPrimitive.ViewportScrollable>

          <ThreadPrimitive.ViewportFooter className="absolute bottom-0 mx-auto flex w-full flex-col gap-4 overflow-visible px-6">
            <View className="rounded-t-4xl bg-background pb-6">
              <ThreadScrollToBottom />
              <Composer />
            </View>
          </ThreadPrimitive.ViewportFooter>
        </ThreadPrimitive.Viewport>
      </View>
    </ThreadPrimitive.Root>
  );
};

const ThreadScrollToBottom: FC = () => {
  return (
    <ThreadPrimitive.ScrollToBottom
      size="icon"
      className="absolute -top-12 z-10 mx-auto self-center rounded-full p-4 disabled:invisible dark:bg-background dark:hover:bg-accent"
      // className="-top-12 z-10 mx-auto self-center rounded-full p-4 disabled:invisible dark:bg-background dark:hover:bg-accent"
    >
      {/* <TooltipIconButton
        tooltip="Scroll to bottom"
        variant="outline"
        className="aui-thread-scroll-to-bottom absolute -top-12 z-10 self-center rounded-full p-4 disabled:invisible dark:bg-background dark:hover:bg-accent"
      > */}
      <Icon name="ArrowDown" />
      {/* </TooltipIconButton> */}
    </ThreadPrimitive.ScrollToBottom>
  );
};

const ThreadWelcome: FC = () => {
  return (
    <View className="flex w-full flex-1 flex-col justify-center gap-6 pb-24">
      <View className="flex w-full flex-col items-center justify-center">
        <View className="flex w-full flex-col justify-center px-4">
          <Text className="fade-in slide-in-from-bottom-1 animate-in font-semibold text-2xl duration-200">
            Hello there!
          </Text>
          <Text className="fade-in slide-in-from-bottom-1 animate-in text-muted-foreground text-xl delay-75 duration-200">
            How can I help you today?
          </Text>
        </View>
      </View>
      <View className="-mx-4">
        <ThreadSuggestions />
      </View>
    </View>
  );
};

const SUGGESTIONS: {
  title: string;
  label: string;
  prompt: string;
  icon: IconName;
}[] = [
  {
    title: "Short prompt",
    label: "like 100 words",
    prompt: "Summarize the second world war in 100 words",
    icon: "Bell",
  },
  {
    title: "What's the weather",
    label: "in San Francisco?",
    prompt: "What's the weather in San Francisco?",
    icon: "Bell",
  },
  {
    title: "Explain React hooks",
    label: "like useState and useEffect",
    prompt: "Explain React hooks like useState and useEffect",
    icon: "Code",
  },
];

const ThreadSuggestions: FC = () => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToAlignment="center"
      className="-mx-global px-global"
      contentContainerStyle={{ columnGap: 10, paddingHorizontal: 16 }}
    >
      {SUGGESTIONS.map((suggestion) => (
        <ThreadPrimitive.Suggestion
          prompt={suggestion.prompt}
          send
          key={suggestion.prompt}
          className={cn(
            "flex h-28 w-[270px] flex-row items-center rounded-3xl border border-border bg-secondary p-4",
          )}
        >
          <Icon
            name={suggestion.icon}
            size={20}
            className="h-14 w-14 rounded-2xl bg-background"
          />
          <View className="ml-4 flex-1">
            <Text className="font-semibold text-foreground text-lg">
              {suggestion.title}
            </Text>
            <Text className="text-muted-foreground text-xs">
              {suggestion.label}
            </Text>
          </View>
        </ThreadPrimitive.Suggestion>
      ))}
      <View className="h-px w-4" />
    </ScrollView>
  );
};

const Composer: React.FC = () => {
  return (
    <ComposerPrimitive.Root>
      <ComposerPrimitive.AttachmentDropzone className="flex-row items-end gap-2">
        {/* <ComposerAttachments /> */}
        <ComposerAction />
        <ComposerPrimitive.Input
          placeholder="Send a message..."
          // className="my-auto mb-1 flex min-h-10 w-full flex-1 resize-none flex-row items-center rounded-3xl border border-input bg-secondary p-0.5 px-4 pt-2 pb-3 text-sm outline-none transition-shadow placeholder:text-muted-foreground"
          className="my-auto flex max-h-40 min-h-12 w-full flex-1 flex-row items-center rounded-3xl bg-secondary px-3 py-2 text-base outline-none transition-shadow placeholder:text-muted-foreground"
          // rows={1}
          autoFocus
          aria-label="Message input"
        />
        <ComposerSubmit />
      </ComposerPrimitive.AttachmentDropzone>
    </ComposerPrimitive.Root>
  );
};

const ComposerAction: FC = () => {
  const textMutedForeground = useCSSVariable("--color-muted-foreground");
  const borderColor = useCSSVariable("--color-border");
  const backgroundColor = useCSSVariable("--color-background");

  return (
    <ActionSheet>
      <ActionSheetTrigger className="flex size-12 items-center justify-center rounded-full bg-secondary">
        <Icon name="Plus" color={textMutedForeground} />
      </ActionSheetTrigger>
      <ActionSheetContent
        containerStyle={{
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: borderColor,
          borderBottomWidth: 0,
          backgroundColor: backgroundColor,
        }}
      >
        <ComposerAddAttachment />
        {/* <View className="h-40 px-4">
          <ComposerAddAttachmentFile />
          <ComposerAddAttachmentImage />
        </View> */}
      </ActionSheetContent>
    </ActionSheet>
  );
};

const ComposerSubmit: FC = () => {
  return (
    <View className="absolute right-0 bottom-0 my-auto flex flex-row items-center justify-between pr-2 pb-2">
      <ThreadPrimitive.If running={false}>
        <ComposerPrimitive.Send
          type="submit"
          variant="default"
          size="icon"
          className="size-8 rounded-full"
          aria-label="Send message"
        >
          <Icon name="ArrowUp" size={20} />
        </ComposerPrimitive.Send>
      </ThreadPrimitive.If>

      <ThreadPrimitive.If running={true}>
        <ComposerPrimitive.Cancel
          type="button"
          variant="destructive"
          size="icon"
          className="size-8 rounded-full"
          aria-label="Stop generating"
        >
          <Icon name="Square" size={20} />
        </ComposerPrimitive.Cancel>
      </ThreadPrimitive.If>
    </View>
  );
};

const MessageError: FC = () => {
  return (
    <MessagePrimitive.Error>
      <View className="mt-2 rounded-md border border-destructive bg-destructive/10 p-3 text-destructive text-sm dark:bg-destructive/5 dark:text-red-200">
        <ErrorPrimitive.Message className="line-clamp-2" />
      </View>
    </MessagePrimitive.Error>
  );
};

const AssistantMessage: FC = () => {
  return (
    <MessagePrimitive.Root
      className="fade-in slide-in-from-bottom-1 relative mx-auto w-full max-w-(--thread-max-width) animate-in py-3 duration-150"
      data-role="assistant"
    >
      <View className="wrap-break-word px-2 text-foreground leading-relaxed">
        <MessagePrimitive.Parts
          components={{
            Text: MarkdownText,
            // Reasoning,
            // ReasoningGroup,
            tools: { Fallback: ToolFallback },
          }}
        />
        <MessageError />
      </View>

      <View className="mt-1 ml-2 flex flex-row">
        <BranchPicker />
        <AssistantActionBar />
      </View>
    </MessagePrimitive.Root>
  );
};

const AssistantActionBar: FC = () => {
  return (
    <ActionBarPrimitive.Root
      hideWhenRunning
      autohide="not-last"
      autohideFloat="single-branch"
      className="col-start-3 row-start-2 -ml-1 flex flex-row gap-1 text-muted-foreground data-floating:absolute data-floating:rounded-md data-floating:border data-floating:bg-background data-floating:p-1 data-floating:shadow-sm"
    >
      <StaggerFadeInItem index={0}>
        <ActionBarPrimitive.Copy size="sm-icon" variant="ghost">
          <MessagePrimitive.If copied={true}>
            <Icon name="Check" size={20} />
          </MessagePrimitive.If>
          <MessagePrimitive.If copied={false}>
            <Icon name="Copy" size={20} />
          </MessagePrimitive.If>
        </ActionBarPrimitive.Copy>
      </StaggerFadeInItem>
      <StaggerFadeInItem index={1}>
        <ActionBarPrimitive.Reload size="sm-icon" variant="ghost">
          <Icon name="RefreshCw" size={20} />
        </ActionBarPrimitive.Reload>
      </StaggerFadeInItem>
      <StaggerFadeInItem index={2}>
        <ActionSheet>
          <ActionSheetTrigger asChild>
            <Button
              size="sm-icon"
              variant="ghost"
              className="data-[state=open]:bg-accent"
            >
              <Icon name="MoreHorizontal" size={20} />
            </Button>
          </ActionSheetTrigger>
          <ActionSheetContent>
            <View className="px-4">
              <ActionBarPrimitive.ExportMarkdown variant="ghost">
                <Icon name="Download" size={20} />
                <Text>Download Markdown file</Text>
              </ActionBarPrimitive.ExportMarkdown>
            </View>
          </ActionSheetContent>
        </ActionSheet>
      </StaggerFadeInItem>
    </ActionBarPrimitive.Root>
  );
};

const STAGGER_MS = 30;

const StaggerFadeInItem = ({
  index,
  children,
}: {
  index: number;
  children: ReactNode;
}) => {
  return (
    <Animated.View
      entering={FadeIn.delay(index * STAGGER_MS).duration(220)}
      exiting={FadeOut.duration(120)}
    >
      {children}
    </Animated.View>
  );
};

const UserMessage: FC = () => {
  return (
    <MessagePrimitive.Root
      className="fade-in slide-in-from-bottom-1 mx-auto grid w-full max-w-(--thread-max-width) animate-in auto-rows-auto grid-cols-[minmax(72px,1fr)_auto] content-start gap-y-2 px-2 py-3 duration-150 [&:where(>*)]:col-start-2"
      data-role="user"
    >
      {/* <UserMessageAttachments /> */}

      <Animated.View
        entering={FadeIn.duration(320)}
        exiting={FadeOut.duration(220)}
        className="relative col-start-2 min-w-0 max-w-[85%] self-end"
      >
        <View className="rounded-2xl bg-muted px-4 py-2.5 text-foreground">
          <MessagePrimitive.Parts />
        </View>
        <View className="absolute top-1/2 left-0 -translate-x-full -translate-y-1/2 pr-2">
          <UserActionBar />
        </View>
      </Animated.View>

      <BranchPicker className="col-span-full col-start-1 row-start-3 -mr-1 justify-end" />
    </MessagePrimitive.Root>
  );
};

const UserActionBar: FC = () => {
  return (
    <ActionBarPrimitive.Root
      hideWhenRunning
      autohide="not-last"
      className="flex flex-col items-end"
    >
      <ActionBarPrimitive.Edit size="sm-icon" variant="ghost">
        <Icon name="Pencil" size={20} />
      </ActionBarPrimitive.Edit>
    </ActionBarPrimitive.Root>
  );
};

const EditComposer: FC = () => {
  return (
    <MessagePrimitive.Root className="mx-auto flex w-full max-w-(--thread-max-width) flex-col px-2 py-3">
      <ComposerPrimitive.Form className="ml-auto flex w-full max-w-[85%] flex-col rounded-2xl bg-muted">
        <ComposerPrimitive.Input
          className="min-h-12 w-full resize-none bg-transparent p-4 text-foreground text-sm outline-none"
          autoFocus
        />
        <View className="mx-3 mb-3 flex flex-row items-center gap-2 self-end">
          <ActionBarPrimitive.CancelEditing variant="ghost" size="sm">
            <Text>Cancel</Text>
          </ActionBarPrimitive.CancelEditing>
          <ComposerPrimitive.Send size="sm">
            <Text>Update</Text>
          </ComposerPrimitive.Send>
        </View>
      </ComposerPrimitive.Form>
    </MessagePrimitive.Root>
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
        "mr-2 -ml-2 inline-flex flex-row items-center text-muted-foreground text-xs",
        className,
      )}
      {...rest}
    >
      <BranchPickerPrimitive.Previous size="sm-icon" variant="ghost">
        <Icon name="ChevronLeft" size={20} />
      </BranchPickerPrimitive.Previous>
      <View className="flex flex-row items-center gap-1 font-medium">
        <BranchPickerPrimitive.Number />
        <Text>/</Text>
        <BranchPickerPrimitive.Count />
      </View>
      <BranchPickerPrimitive.Next size="sm-icon" variant="ghost">
        <Icon name="ChevronRight" size={20} />
      </BranchPickerPrimitive.Next>
    </BranchPickerPrimitive.Root>
  );
};
