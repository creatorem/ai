"use client";

import { memo, useState } from "react";
import { Link } from "expo-router";
import {
  type CodeHeaderProps,
  type RenderersMap,
  MarkdownTextPrimitive,
} from "@creatorem/ai-react-native/markdown";
import Clipboard from "@react-native-clipboard/clipboard";
import { Text } from "../ui/text";
import { View } from "react-native";
import { Button } from "../ui/button";
import { Icon } from "../ui/icon";
import { cn } from "~/utils/cn";
import { useCSSVariable } from "uniwind";

const MarkdownTextImpl = () => {
  const textColor = useCSSVariable("--color-foreground");
  const textSecondaryColor = useCSSVariable("--color-secondary");

  return (
    <MarkdownTextPrimitive
      textColor={textColor}
      textSecondaryColor={textSecondaryColor}
      className="aui-md"
      renderers={defaultComponents as unknown as Partial<RenderersMap>}
    />
  );
};

export const MarkdownText = memo(MarkdownTextImpl);

const useCopyToClipboard = ({
  copiedDuration = 3000,
}: {
  copiedDuration?: number;
} = {}) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const copyToClipboard = (value: string) => {
    if (!value) return;

    Clipboard.setString(value);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), copiedDuration);
  };

  return { isCopied, copyToClipboard };
};

const defaultComponents = {
  h1: ({ children }) => (
    <Text
      className={cn(
        "mb-8 scroll-m-20 font-extrabold text-4xl tracking-tight last:mb-0",
      )}
    >
      {children}
    </Text>
  ),
  h2: ({ children }) => (
    <Text
      className={cn(
        "mt-8 mb-4 scroll-m-20 font-semibold text-3xl tracking-tight first:mt-0 last:mb-0",
      )}
    >
      {children}
    </Text>
  ),
  h3: ({ children }) => (
    <Text
      className={cn(
        "mt-6 mb-4 scroll-m-20 font-semibold text-2xl tracking-tight first:mt-0 last:mb-0",
      )}
    >
      {children}
    </Text>
  ),
  h4: ({ children }) => (
    <Text
      className={cn(
        "mt-6 mb-4 scroll-m-20 font-semibold text-xl tracking-tight first:mt-0 last:mb-0",
      )}
    >
      {children}
    </Text>
  ),
  h5: ({ children }) => (
    <Text className={cn("my-4 font-semibold text-lg first:mt-0 last:mb-0")}>
      {children}
    </Text>
  ),
  h6: ({ children }) => <Text>{children}</Text>,
  p: ({ children }) => (
    <Text className={cn("mt-5 mb-5 leading-7 first:mt-0 last:mb-0")}>
      {children}
    </Text>
  ),
  a: ({ children, href }) => (
    <Link
      href={href}
      className={cn("font-medium text-primary underline underline-offset-4")}
    >
      {children}
    </Link>
  ),
  blockquote: ({ children }) => (
    <Text className={cn("border-l-2 pl-6 italic")}>{children}</Text>
  ),
  ul: ({ children }) => (
    <Text className={cn("my-5 ml-6 list-disc [&>li]:mt-2")}>{children}</Text>
  ),
  ol: ({ children }) => (
    <Text className={cn("my-5 ml-6 list-decimal [&>li]:mt-2")}>{children}</Text>
  ),
  hr: () => <View className={cn("my-5 border-b")} />,
  table: ({ children }) => (
    <View
      className={cn(
        "my-5 w-full border-separate border-spacing-0 overflow-y-auto",
      )}
    >
      {children}
    </View>
  ),
  th: ({ children }) => (
    <View
      className={cn(
        "bg-muted px-4 py-2 text-left font-bold first:rounded-tl-lg last:rounded-tr-lg",
      )}
    >
      {children}
    </View>
  ),
  td: ({ children }) => (
    <Text className={cn("border-b border-l px-4 py-2 text-left last:border-r")}>
      {children}
    </Text>
  ),
  tr: ({ children }) => (
    <View className={cn("m-0 border-b p-0 first:border-t")}>{children}</View>
  ),
  pre: ({ children }) => (
    <View
      className={cn(
        "overflow-x-auto rounded-t-none! rounded-b-lg bg-black p-4 text-white",
      )}
    >
      {children}
    </View>
  ),
  code: ({ children, node }) => {
    const isCodeBlock = (node as any)?.__parent?.tagName === "pre";
    return (
      <Text
        className={cn(!isCodeBlock && "rounded border bg-muted font-semibold")}
      >
        {children}
      </Text>
    );
  },
  CodeHeader: ({ language, code }: CodeHeaderProps) => {
    const { isCopied, copyToClipboard } = useCopyToClipboard();
    const onCopy = () => {
      if (!code || isCopied) return;
      copyToClipboard(code);
    };

    return (
      <View className="mt-4 flex flex-row items-center justify-between gap-4 rounded-t-lg bg-muted-foreground/15 px-2 py-1 font-semibold text-foreground text-sm dark:bg-muted-foreground/20">
        <Text className="pl-2 lowercase">{language}</Text>
        <Button onPress={onCopy} size="sm-icon" variant="ghost">
          {!isCopied && <Icon name="Copy" size={20} />}
          {isCopied && <Icon name="Check" size={20} />}
        </Button>
      </View>
    );
  },
};
