"use client";

import {
  ComponentRef,
  ElementType,
  FC,
  forwardRef,
  ForwardRefExoticComponent,
  RefAttributes,
  useMemo,
  type ComponentPropsWithoutRef,
  type ComponentType,
} from "react";
import { View } from "react-native";
import {  useMessagePartText } from "@creatorem/ai-chat/primitives/message-part";
import { useSmoothStream } from "@creatorem/ai-chat/utils";
import { Markdown } from "../renderer/Markdown";
import type { CodeHeaderProps, RenderersMap } from "../renderer/types";

type MarkdownTextPrimitiveElement = ComponentRef<typeof View>;
type PrimitiveDivProps = ComponentPropsWithoutRef<typeof View>;

export type MarkdownTextPrimitiveProps = {
  textColor: string;
  textSecondaryColor: string;
  className?: string | undefined;
  containerProps?: Omit<PrimitiveDivProps, "children" | "asChild"> | undefined;
  containerComponent?: ElementType | undefined;
  renderers?: Partial<RenderersMap> | undefined;
  componentsByLanguage?:
    | Record<
        string,
        {
          CodeHeader?: ComponentType<CodeHeaderProps> | undefined;
        }
      >
    | undefined;
  smooth?: boolean | undefined;
  preprocess?: (text: string) => string;
};

const MarkdownTextInner: FC<MarkdownTextPrimitiveProps> = ({
  componentsByLanguage,
  smooth = true,
  textColor,
  textSecondaryColor,
  preprocess,
  renderers,
  ...rest
}) => {
  const messagePartText = useMessagePartText();

  const processedMessagePart = useMemo(() => {
    if (!preprocess) return messagePartText;

    return {
      ...messagePartText,
      text: preprocess(messagePartText.text),
    };
  }, [messagePartText, preprocess]);

  const { text } = useSmoothStream(processedMessagePart, smooth);

  const colors = useMemo(
    () => ({ textColor, textSecondaryColor }),
    [textColor, textSecondaryColor],
  );

  return (
    <Markdown content={text} colors={colors} renderers={renderers} />
  );
};

const MarkdownTextPrimitiveImpl: ForwardRefExoticComponent<MarkdownTextPrimitiveProps> &
  RefAttributes<MarkdownTextPrimitiveElement> = forwardRef<
  MarkdownTextPrimitiveElement,
  MarkdownTextPrimitiveProps
>(
  (
    {
      className,
      containerProps,
      containerComponent: Container = View,
      ...rest
    },
    forwardedRef,
  ) => {
    return (
      <Container
        {...containerProps}
        className={className}
        ref={forwardedRef}
      >
        <MarkdownTextInner {...rest} />
      </Container>
    ) 
  },
);

MarkdownTextPrimitiveImpl.displayName = "MarkdownTextPrimitive";

export const MarkdownTextPrimitive = MarkdownTextPrimitiveImpl;
