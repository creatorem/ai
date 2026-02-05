"use client";

import type { FC, PropsWithChildren } from "react";
import { useAiChat } from "@creatorem/ai-store";
import type { RequireAtLeastOne } from "../../utils/require-at-least-one";

type ThreadIfFilters = {
  empty: boolean | undefined;
  running: boolean | undefined;
  disabled: boolean | undefined;
};

type UseThreadIfProps = RequireAtLeastOne<ThreadIfFilters>;

const useThreadIf = (props: UseThreadIfProps) => {
  return useAiChat(({ thread }) => {
    if (props.empty === true && !thread.isEmpty) return false;
    if (props.empty === false && thread.isEmpty) return false;

    if (props.running === true && !thread.isRunning) return false;
    if (props.running === false && thread.isRunning) return false;
    if (props.disabled === true && !thread.isDisabled) return false;
    if (props.disabled === false && thread.isDisabled) return false;

    return true;
  });
};

export namespace ThreadPrimitiveIf {
  export type Props = PropsWithChildren<UseThreadIfProps>;
}

/**
 * @deprecated Use `<AuiIf condition={({ thread }) => ...} />` instead.
 */
export const ThreadPrimitiveIf: FC<ThreadPrimitiveIf.Props> = ({
  children,
  ...query
}) => {
  const result = useThreadIf(query);
  return result ? children : null;
};

ThreadPrimitiveIf.displayName = "ThreadPrimitive.If";
