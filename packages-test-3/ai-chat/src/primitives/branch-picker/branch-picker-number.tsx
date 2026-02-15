"use client";

import type { FC } from "react";
import { useMessage } from "../message";
import { useRuntime } from "@creatorem/ai-chat/runtime";
import { RuntimeComponents } from "@creatorem/ai-chat/component-types";

const useBranchPickerNumber = () => {
  return useMessage((s) => s.branchNumber);
};

export namespace BranchPickerPrimitiveNumber {
  export type Props = React.ComponentPropsWithRef<RuntimeComponents["Text"]>;
}

export const BranchPickerPrimitiveNumber: FC<
  BranchPickerPrimitiveNumber.Props
> = (props) => {
  const {
    components: { Text },
  } = useRuntime();
  const branchNumber = useBranchPickerNumber();
  return <Text {...props}>{branchNumber}</Text>;
};

BranchPickerPrimitiveNumber.displayName = "BranchPickerPrimitive.Number";
