"use client";

import { FC } from "react";
import { useRuntime } from "@creatorem/ai-chat/runtime";
import type { RuntimeComponents } from "@creatorem/ai-chat/component-types";

export namespace ActionBarMorePrimitiveRoot {
  export type Props = React.ComponentPropsWithRef<RuntimeComponents['ActionBarRoot']>;
}

export const ActionBarMorePrimitiveRoot: FC<
  ActionBarMorePrimitiveRoot.Props
> = ({
  // __scopeActionBarMore,
  ...rest
}: ActionBarMorePrimitiveRoot.Props) => {
  const {components:{ActionBarRoot}} = useRuntime();
  // const scope = useDropdownMenuScope(__scopeActionBarMore);

  return <ActionBarRoot /* {...scope} */ {...rest} />;
};

ActionBarMorePrimitiveRoot.displayName = "ActionBarMorePrimitive.Root";
