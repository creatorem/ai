"use client";

import { useMemo, type FC, type PropsWithChildren } from "react";
import { RequireAtLeastOne } from "../../utils/require-at-least-one";
import { useThread } from "./thread-root";

type ThreadIfFilters = {
  empty: boolean | undefined;
  running: boolean | undefined;
  disabled: boolean | undefined;
};

type UseThreadIfProps = RequireAtLeastOne<ThreadIfFilters>;

const useThreadIf = (props: UseThreadIfProps) => {
  const isRunning = useThread(s => s.isRunning);
  const isDisabled = useThread(s => s.isDisabled);
  const isEmpty = useThread(s => s.isEmpty);

  return useMemo(() => {
    if (props.empty === true && !isEmpty) return false;
    if (props.empty === false && isEmpty) return false;

    if (props.running === true && !isRunning) return false;
    if (props.running === false && isRunning) return false;
    if (props.disabled === true && !isDisabled) return false;
    if (props.disabled === false && isDisabled) return false;

    return true;
  }, [isRunning, isDisabled, isEmpty]);
};

export namespace ThreadPrimitiveIf {
  export type Props = PropsWithChildren<UseThreadIfProps>;
}

export const ThreadPrimitiveIf: FC<ThreadPrimitiveIf.Props> = ({
  children,
  ...query
}) => {
  const result = useThreadIf(query);
  return result ? children : null;
};

ThreadPrimitiveIf.displayName = "ThreadPrimitive.If";
