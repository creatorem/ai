"use client";

import React, { useCallback, useEffect, useRef } from "react";
import {
  TextInput,
  type NativeSyntheticEvent,
  type TextInputContentSizeChangeEventData,
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
  //   minRows?: number;
  //   maxRows?: number;
  //   rowHeight?: number;
  //   onHeightChange?: (height: number) => void;
  //   cacheMeasurements?: boolean;
  //   height?: number;
};

export const AutoResizeTextarea = React.forwardRef<
  TextInput,
  AutoResizeTextareaProps
>(
  (
    { onChange, onChangeText, onContentSizeChange, className, ...restProps },
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

    // const fadeAnim = useRef(new Animated.Value(0)).current;

    // useEffect(() => {
    //     if(displayExpand) {
    //         Animated.timing(fadeAnim, {
    //           toValue: 1,
    //           duration: 300,
    //           useNativeDriver: true,
    //         }).start();
    //     } else {
    //         Animated.timing(fadeAnim, {
    //           toValue: 0,
    //           duration: 300,
    //           useNativeDriver: true,
    //         }).start();
    //     }
    // }, [displayExpand]);

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
            className="absolute top-2 right-2"
          >
            <ActionSheetTrigger asChild>
              <Button size="sm-icon" variant="ghost">
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
              className="absolute top-4 right-4 z-10"
            >
              <Icon name="Shrink" size={20} />
            </Button>
          </ActionSheetClose>

          <TextInput
            {...restProps}
            ref={ref}
            multiline
            className={cn("h-full p-4 pt-12 text-base text-foreground")}
            onChangeText={handleChangeText}
          ></TextInput>
        </ActionSheetContent>
      </ActionSheet>
    );
  },
);

AutoResizeTextarea.displayName = "AutoResizeTextarea";
