"use client";

import { FC } from "react";
import { Button } from "@/components/ui/button";
import {
	ArrowDownIcon,
	ArrowUpIcon,
	BrainIcon,
	CheckIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	CopyIcon,
	DownloadIcon,
	GaugeIcon,
	ImageIcon,
	MoreHorizontalIcon,
	PencilIcon,
	RefreshCwIcon,
	SquareIcon,
} from "lucide-react";
import { TooltipIconButton } from "@/components/ai-chat/tooltip-icon-button";
import { cn } from "@/lib/utils";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
	ComposerAddAttachment,
	ComposerAttachments,
	UserMessageAttachments,
} from "./attachment";
import { Reasoning, ReasoningGroup } from "./reasoning";
import { ToolFallback } from "./tool-fallback";
import { MarkdownText } from "./markdown-text";
import { ThreadListSidebar } from "./threadlist-sidebar";
import { WeatherToolRegistration } from "./weather-tool-ui";

import { AiProvider, useAiContext, useAiContextStore } from "@creatorem/ai-react/ai-provider";
import * as ComposerPrimitive from "@creatorem/ai-react/primitives/composer";
import * as ErrorPrimitive from "@creatorem/ai-react/primitives/error";
import * as ActionBarPrimitive from "@creatorem/ai-react/primitives/action-bar";
import * as BranchPickerPrimitive from "@creatorem/ai-react/primitives/branch-picker";
import * as ThreadPrimitive from "@creatorem/ai-react/primitives/thread";
import * as MessagePrimitive from "@creatorem/ai-react/primitives/message";
import { AI_MODELS, DEFAULT_AI_MODEL } from "@/lib/ai-constants";
import { useCallback } from "react";
import { InputGroup } from "@/components/ui/input-group";

export default function Chat() {
	return (
		<AiProvider>
			<SidebarProvider>
				<div className="flex h-dvh w-full pr-0.5">
					<ThreadListSidebar />
					<SidebarInset>
						<header className="flex h-16 shrink-0 items-center gap-2 font-medium border-b px-4">
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
		<ThreadPrimitive.Root>
			<WeatherToolRegistration />
			<div
				className="aui-root aui-thread-root @container flex h-full flex-col"
				style={{
					["--thread-max-width" as string]: "44rem",
				}}
			>
				<ThreadPrimitive.Viewport turnAnchor="top">
					<ThreadPrimitive.ViewportScrollable className="aui-thread-viewport relative flex flex-1 flex-col overflow-x-auto overflow-y-scroll scroll-smooth px-4 pt-4">
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

						<ThreadPrimitive.ViewportFooter className="aui-thread-viewport-footer sticky bottom-0 mx-auto mt-auto flex w-full max-w-(--thread-max-width) flex-col gap-4 overflow-visible rounded-t-3xl bg-background pb-4 md:pb-6">
							<ThreadScrollToBottom />
							<Composer />
						</ThreadPrimitive.ViewportFooter>
					</ThreadPrimitive.ViewportScrollable>
				</ThreadPrimitive.Viewport>
			</div>
		</ThreadPrimitive.Root>
	);
};

const ThreadScrollToBottom: FC = () => {
	return (
		<ThreadPrimitive.ScrollToBottom asChild>
			<TooltipIconButton
				tooltip="Scroll to bottom"
				variant="outline"
				className="aui-thread-scroll-to-bottom absolute -top-12 z-10 self-center rounded-full p-4 disabled:invisible dark:bg-background dark:hover:bg-accent"
			>
				<ArrowDownIcon />
			</TooltipIconButton>
		</ThreadPrimitive.ScrollToBottom>
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
					<ThreadPrimitive.Suggestion prompt={suggestion.prompt} send asChild>
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
					</ThreadPrimitive.Suggestion>
				</div>
			))}
		</div>
	);
};

const Composer: React.FC = () => {
	return (
		<ComposerPrimitive.Root>
			<ComposerPrimitive.Form className="aui-composer-root relative flex w-full flex-col">
				<ComposerPrimitive.AttachmentDropzone className="aui-composer-attachment-dropzone flex w-full flex-col rounded-2xl border border-input bg-background px-1 pt-2 outline-none transition-shadow has-[textarea:focus-visible]:border-ring has-[textarea:focus-visible]:ring-2 has-[textarea:focus-visible]:ring-ring/20 data-[dragging=true]:border-ring data-[dragging=true]:border-dashed data-[dragging=true]:bg-accent/50">
					<ComposerAttachments />
					<ComposerPrimitive.Input
						placeholder="Send a message..."
						className="aui-composer-input mb-1 max-h-32 min-h-14 w-full resize-none bg-transparent px-4 pt-2 pb-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-0"
						rows={1}
						autoFocus
						aria-label="Message input"
					/>
					<ComposerAction />
				</ComposerPrimitive.AttachmentDropzone>
			</ComposerPrimitive.Form>
		</ComposerPrimitive.Root>
	);
};


const modelLabels: Record<(typeof AI_MODELS)[number], React.ReactNode> = {
	[DEFAULT_AI_MODEL]: (
		<>
			<div className="mb-1 flex items-center gap-2 font-medium">
				<span>Llama 3.3 70B (Versatile)</span>
				<GaugeIcon />
			</div>
			<span className="text-muted-foreground text-sm">
				Optimized for a wide range of natural language tasks.
			</span>
		</>
	),
	"meta-llama/llama-4-scout-17b-16e-instruct": (
		<>
			<div className="mb-1 flex items-center gap-2 font-medium">
				<span>Llama 4 Scout 17B 16E</span>
				<ImageIcon />
			</div>
			<span className="text-muted-foreground text-sm">
				Designed for high-capability agentic use.
			</span>
		</>
	),
	"openai/gpt-oss-120b": (
		<>
			<div className="mb-1 flex items-center gap-2 font-medium">
				<span>GPT OSS 120B</span>
				<BrainIcon />
			</div>
			<span className="text-muted-foreground text-sm">
				Competitive math/coding performance
			</span>
		</>
	),
	"qwen/qwen3-32b": (
		<>
			<div className="mb-1 flex items-center gap-2 font-medium">
				<span>Qwen 3 32B</span>
				<BrainIcon />
			</div>
			<span className="text-muted-foreground text-sm">
				Groundbreaking advancements in reasoning
			</span>
		</>
	),
};

const ModelSelector: React.FC = () => {
	const selectedModel = useAiContext((s) => s.selectedModel);
	const setSelectedModel = useAiContext((s) => s.setSelectedModel);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					className="text-muted-foreground cursor-pointer"
					size="sm"
				>
					{selectedModel ? selectedModel : "Select a model"}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				side="top"
				align="start"
				className="z-90 w-96 [--radius:0.95rem]"
			>
				<DropdownMenuLabel>Models</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{Object.entries(modelLabels).map(([model, label]) => (
					<DropdownMenuItem
						key={model}
						onSelect={() => setSelectedModel(model)}
						className="flex cursor-pointer items-center justify-between gap-2"
					>
						<div className="flex flex-col items-start">
							{label}
						</div>
						{selectedModel === model && (
							<CheckIcon className="text-primary size-4" />
						)}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

const ComposerAction: FC = () => {
	return (
		<div className="aui-composer-action-wrapper relative mx-2 mb-2 flex items-center justify-between">
			<div className="flex">
				<ComposerAddAttachment />
			</div>

			<div className="flex gap-2">
				<ModelSelector />

				<ThreadPrimitive.If running={false}>
					<ComposerPrimitive.Send asChild>
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
					</ComposerPrimitive.Send>
				</ThreadPrimitive.If>

				<ThreadPrimitive.If running={true}>
					<ComposerPrimitive.Cancel asChild>
						<Button
							type="button"
							variant="default"
							size="icon"
							className="aui-composer-cancel size-8 rounded-full"
							aria-label="Stop generating"
						>
							<SquareIcon className="aui-composer-cancel-icon size-3 fill-current" />
						</Button>
					</ComposerPrimitive.Cancel>
				</ThreadPrimitive.If>
			</div>
		</div>
	);
};

const MessageError: FC = () => {
	return (
		<MessagePrimitive.Error>
			<div className="mt-2 rounded-md border border-destructive bg-destructive/10 p-3 text-destructive text-sm dark:bg-destructive/5 dark:text-red-200">
				<ErrorPrimitive.Message className="aui-message-error-message line-clamp-2" />
			</div>
		</MessagePrimitive.Error>
	);
};

const AssistantMessage: FC = () => {
	return (
		<MessagePrimitive.Root
			className="aui-assistant-message-root fade-in slide-in-from-bottom-1 relative mx-auto w-full max-w-(--thread-max-width) animate-in py-3 duration-150"
			data-role="assistant"
		>
			<div className="aui-assistant-message-content wrap-break-word px-2 text-foreground leading-relaxed">
				<MessagePrimitive.Parts
					components={{
						Text: MarkdownText,
						Reasoning,
						ReasoningGroup,
						tools: { Fallback: ToolFallback },
					}}
				/>
				<MessageError />
			</div>

			<div className="aui-assistant-message-footer mt-1 ml-2 flex">
				<BranchPicker />
				<AssistantActionBar />
			</div>
		</MessagePrimitive.Root>
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
					<MessagePrimitive.If copied={true}>
						<CheckIcon />
					</MessagePrimitive.If>
					<MessagePrimitive.If copied={false}>
						<CopyIcon />
					</MessagePrimitive.If>
				</TooltipIconButton>
			</ActionBarPrimitive.Copy>
			<ActionBarPrimitive.Reload asChild>
				<TooltipIconButton tooltip="Refresh">
					<RefreshCwIcon />
				</TooltipIconButton>
			</ActionBarPrimitive.Reload>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<TooltipIconButton
						tooltip="More"
						className="data-[state=open]:bg-accent"
					>
						<MoreHorizontalIcon />
					</TooltipIconButton>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					side="bottom"
					align="start"
					className="aui-action-bar-more-content z-50 min-w-32 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
				>
					<ActionBarPrimitive.ExportMarkdown asChild>
						<DropdownMenuItem className="aui-action-bar-more-item flex cursor-pointer select-none items-center gap-2 font-medium rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
							<DownloadIcon className="size-4" />
							Export as Markdown
						</DropdownMenuItem>
					</ActionBarPrimitive.ExportMarkdown>
				</DropdownMenuContent>
			</DropdownMenu>
		</ActionBarPrimitive.Root>
	);
};

const UserMessage: FC = () => {
	return (
		<MessagePrimitive.Root
			className="aui-user-message-root fade-in slide-in-from-bottom-1 mx-auto grid w-full max-w-(--thread-max-width) animate-in auto-rows-auto grid-cols-[minmax(72px,1fr)_auto] content-start gap-y-2 px-2 py-3 duration-150 [&:where(>*)]:col-start-2"
			data-role="user"
		>
			<UserMessageAttachments />

			<div className="aui-user-message-content-wrapper relative col-start-2 min-w-0">
				<div className="aui-user-message-content wrap-break-word rounded-2xl bg-muted px-4 py-2.5 text-foreground">
					<MessagePrimitive.Parts />
				</div>
				<div className="aui-user-action-bar-wrapper absolute top-1/2 left-0 -translate-x-full -translate-y-1/2 pr-2">
					<UserActionBar />
				</div>
			</div>

			<BranchPicker className="aui-user-branch-picker col-span-full col-start-1 row-start-3 -mr-1 justify-end" />
		</MessagePrimitive.Root>
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
		<MessagePrimitive.Root className="aui-edit-composer-wrapper mx-auto flex w-full max-w-(--thread-max-width) flex-col px-2 py-3">
			<ComposerPrimitive.Form className="aui-edit-composer-root ml-auto flex w-full max-w-[85%] flex-col rounded-2xl bg-muted">
				<ComposerPrimitive.Input
					className="aui-edit-composer-input min-h-14 w-full resize-none bg-transparent p-4 text-foreground text-sm outline-none"
					autoFocus
				/>
				<div className="aui-edit-composer-footer mx-3 mb-3 flex items-center gap-2 font-medium self-end">
					<ActionBarPrimitive.CancelEditing asChild>
						<Button variant="ghost" size="sm">
							Cancel
						</Button>
					</ActionBarPrimitive.CancelEditing>
					<ComposerPrimitive.Send asChild>
						<Button size="sm">Update</Button>
					</ComposerPrimitive.Send>
				</div>
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
			<span className="aui-branch-picker-state flex items-center gap-1 font-medium">
				<BranchPickerPrimitive.Number /> <span>/</span>{" "}
				<BranchPickerPrimitive.Count />
			</span>
			<BranchPickerPrimitive.Next asChild>
				<TooltipIconButton tooltip="Next">
					<ChevronRightIcon />
				</TooltipIconButton>
			</BranchPickerPrimitive.Next>
		</BranchPickerPrimitive.Root>
	);
};
