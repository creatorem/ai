"use client";

import type { FC } from "react";
import { useMessage } from "../message";
import { useRuntime } from "@creatorem/ai-chat/runtime";

const useBranchPickerNumber = () => {
  return useMessage(s => s.branchNumber);
};

export namespace BranchPickerPrimitiveNumber {
  export type Props = Record<string, never>;
}

export const BranchPickerPrimitiveNumber: FC<
  BranchPickerPrimitiveNumber.Props
> = () => {
    const { components: {Text} } = useRuntime();
  const branchNumber = useBranchPickerNumber();
  return <Text>{branchNumber}</Text>;
};

BranchPickerPrimitiveNumber.displayName = "BranchPickerPrimitive.Number";
