"use client";

import type { FC } from "react";
import { useAiChat } from "@creatorem/ai-store";

const useBranchPickerNumber = () => {
  const branchNumber = useAiChat(({ message }) => message.branchNumber);
  return branchNumber;
};

export namespace BranchPickerPrimitiveNumber {
  export type Props = Record<string, never>;
}

export const BranchPickerPrimitiveNumber: FC<
  BranchPickerPrimitiveNumber.Props
> = () => {
  const branchNumber = useBranchPickerNumber();
  return <>{branchNumber}</>;
};

BranchPickerPrimitiveNumber.displayName = "BranchPickerPrimitive.Number";
