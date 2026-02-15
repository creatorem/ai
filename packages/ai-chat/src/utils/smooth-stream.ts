"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type {
  MessagePartStatus,
  ToolCallMessagePartStatus,
} from "../types/assistant-types";

const SMOOTH_RUNNING_STATUS: MessagePartStatus = Object.freeze({
  type: "running",
});

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const isWordBoundaryChar = (char: string) =>
  char === "\n" ||
  char === "\r" ||
  char === "\t" ||
  char === " " ||
  /[.,!?;:)\]}>"'`]/.test(char);

const findSafeBoundary = (
  text: string,
  targetLength: number,
  lookBehind: number,
) => {
  if (targetLength >= text.length) return text.length;

  const minIndex = Math.max(0, targetLength - lookBehind);
  for (let i = targetLength; i > minIndex; i--) {
    if (isWordBoundaryChar(text[i - 1] ?? "")) return i;
  }

  return targetLength;
};

export type SmoothStreamOptions = {
  enabled?: boolean;
  minCharsPerSecond?: number;
  maxCharsPerSecond?: number;
  boundaryLookBehind?: number;
  chunkByWord?: boolean;
};

type SmoothableTextState = {
  text: string;
  status: MessagePartStatus | ToolCallMessagePartStatus;
};

const DEFAULT_OPTIONS: Required<SmoothStreamOptions> = {
  enabled: true,
  minCharsPerSecond: 32,
  maxCharsPerSecond: 420,
  boundaryLookBehind: 20,
  chunkByWord: true,
};

const resolveOptions = (
  options: boolean | SmoothStreamOptions | undefined,
): Required<SmoothStreamOptions> => {
  if (typeof options === "boolean") {
    return {
      ...DEFAULT_OPTIONS,
      enabled: options,
    };
  }

  return {
    ...DEFAULT_OPTIONS,
    ...options,
  };
};

export const useSmoothStream = <T extends SmoothableTextState>(
  state: T,
  options?: boolean | SmoothStreamOptions,
): T => {
  const resolved = resolveOptions(
    typeof options === "boolean"
      ? options
      : {
          enabled: options?.enabled,
          minCharsPerSecond: options?.minCharsPerSecond,
          maxCharsPerSecond: options?.maxCharsPerSecond,
          boundaryLookBehind: options?.boundaryLookBehind,
          chunkByWord: options?.chunkByWord,
        },
  );
  const enabled = resolved.enabled;
  const minCharsPerSecond = resolved.minCharsPerSecond;
  const maxCharsPerSecond = resolved.maxCharsPerSecond;
  const boundaryLookBehind = resolved.boundaryLookBehind;
  const chunkByWord = resolved.chunkByWord;
  const [displayedText, setDisplayedText] = useState(state.text);

  const displayedTextRef = useRef(displayedText);
  const targetTextRef = useRef(state.text);
  const frameRef = useRef<number | null>(null);
  const lastFrameTsRef = useRef<number | null>(null);

  useEffect(() => {
    displayedTextRef.current = displayedText;
  }, [displayedText]);

  useEffect(() => {
    if (!enabled) {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      lastFrameTsRef.current = null;
      targetTextRef.current = state.text;
      displayedTextRef.current = state.text;
      return;
    }

    if (
      state.text.length < displayedTextRef.current.length ||
      !state.text.startsWith(displayedTextRef.current)
    ) {
      targetTextRef.current = state.text;
      setDisplayedText((prev) => {
        if (prev === state.text) return prev;
        displayedTextRef.current = state.text;
        return state.text;
      });
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      lastFrameTsRef.current = null;
      return;
    }

    targetTextRef.current = state.text;
    if (displayedTextRef.current === state.text || frameRef.current !== null) {
      return;
    }

    const tick = (timestamp: number) => {
      if (lastFrameTsRef.current === null) {
        lastFrameTsRef.current = timestamp;
      }

      const deltaMs = Math.max(1, timestamp - lastFrameTsRef.current);
      const current = displayedTextRef.current;
      const target = targetTextRef.current;
      const remaining = target.length - current.length;

      if (remaining <= 0) {
        frameRef.current = null;
        lastFrameTsRef.current = null;
        return;
      }

      const dynamicCps = clamp(
        minCharsPerSecond + remaining * 1.6,
        minCharsPerSecond,
        maxCharsPerSecond,
      );
      const rawCharsToAdd = Math.max(
        1,
        Math.floor((dynamicCps * deltaMs) / 1000),
      );
      const rawNextLength = Math.min(
        target.length,
        current.length + rawCharsToAdd,
      );

      const nextLength = chunkByWord
        ? findSafeBoundary(target, rawNextLength, boundaryLookBehind)
        : rawNextLength;

      const safeNextLength =
        nextLength <= current.length ? rawNextLength : nextLength;
      const nextText = target.slice(0, safeNextLength);

      if (nextText !== displayedTextRef.current) {
        displayedTextRef.current = nextText;
        setDisplayedText((prev) => (prev === nextText ? prev : nextText));
      }
      lastFrameTsRef.current = timestamp;

      if (nextText.length >= target.length) {
        frameRef.current = null;
        lastFrameTsRef.current = null;
        return;
      }

      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      lastFrameTsRef.current = null;
    };
  }, [
    enabled,
    minCharsPerSecond,
    maxCharsPerSecond,
    boundaryLookBehind,
    chunkByWord,
    state.text,
  ]);

  return useMemo(() => {
    if (!enabled) return state;
    if (displayedText === state.text) return state;

    return {
      ...state,
      text: displayedText,
      status: SMOOTH_RUNNING_STATUS,
    };
  }, [enabled, displayedText, state]);
};
