"use client";

import React, { useCallback } from "react";
import {
  TextInput,
  type NativeSyntheticEvent,
  type TextInputContentSizeChangeEventData,
  View,
  type TextInputProps,
} from "react-native";
import { cn } from "~/utils/cn";
import { Icon } from "./icon";
import { Button } from "./button";
import {
  ActionSheet,
  ActionSheetClose,
  ActionSheetContent,
  ActionSheetTrigger,
} from "./action-sheet";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useCSSVariable } from "uniwind";

export type AutoResizeTextareaProps = Omit<
  TextInputProps,
  "onChange" | "multiline"
> & {
  onChange?: (value: string, e?: unknown) => void;
  headerContent?: React.ReactNode;
};

export const AutoResizeTextarea = React.forwardRef<
  TextInput,
  AutoResizeTextareaProps
>(
  (
    {
      onChange,
      onChangeText,
      onContentSizeChange,
      headerContent,
      className,
      ...restProps
    },
    ref,
  ) => {
    const [displayExpand, setDisplayExpand] = React.useState<boolean>(false);
    const textMutedForeground = useCSSVariable("--color-muted-foreground");

    const handleContentSizeChange = useCallback(
      (e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
        onContentSizeChange?.(e);
        setDisplayExpand(e.nativeEvent.contentSize.height > 110);
      },
      [onContentSizeChange],
    );

    const handleChangeText = useCallback(
      (value: string) => {
        onChangeText?.(value);
        onChange?.(value);
      },
      [onChange, onChangeText],
    );

    return (
      <ActionSheet>
        <TextInput
          {...restProps}
          ref={ref}
          multiline
          className={cn("text-foreground", className)}
          onChangeText={handleChangeText}
          onContentSizeChange={handleContentSizeChange}
        />
        {displayExpand ? (
          <Animated.View
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
            className="absolute top-2 right-2 z-20"
          >
            <ActionSheetTrigger asChild>
              <Button size="sm-icon" variant="ghost" className="bg-secondary">
                <Icon name="Expand" size={20} color={textMutedForeground} />
              </Button>
            </ActionSheetTrigger>
          </Animated.View>
        ) : null}
        <ActionSheetContent
          containerStyle={{
            flex: 0.9,
          }}
          useBottomSafeAreaPadding
          gestureEnabled
          CustomHeaderComponent={null}
        >
          <ActionSheetClose asChild>
            <Button
              size="sm-icon"
              variant="ghost"
              className="absolute top-4 right-4 z-20"
            >
              <Icon name="Shrink" size={20} />
            </Button>
          </ActionSheetClose>

          {headerContent}

          <TextInput
            {...restProps}
            ref={ref}
            multiline
            className={cn("h-full p-4 pt-12 text-base text-foreground")}
            onChangeText={handleChangeText}
          />
        </ActionSheetContent>
      </ActionSheet>
    );
  },
);

AutoResizeTextarea.displayName = "AutoResizeTextarea";
