"use client";

import type { FC } from "react";
import { useMessage } from "../message/message-by-index-provider";

const useBranchPickerNumber = () => {
  return useMessage(s => s.branchNumber);
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
