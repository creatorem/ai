import { forwardRef, ComponentProps } from "react";
import { useRuntime } from "@creatorem/ai-chat/runtime";
import type { RuntimeComponents } from "@creatorem/ai-chat/component-types";
import { composeEventHandlers } from "./compose-event-handlers";

type ActionButtonCallback<TProps> = (
  props: TProps,
) => ComponentProps<RuntimeComponents["Button"]>["onClick"] | null;

export type ActionButtonProps<THook> = ComponentProps<
  RuntimeComponents["Button"]
> &
  (THook extends (props: infer TProps) => unknown ? TProps : never);

export type ActionButtonElement = RuntimeComponents["Button"];

export const createActionButton = <TProps,>(
  displayName: string,
  useActionButton: ActionButtonCallback<TProps>,
  forwardProps: (keyof NonNullable<TProps>)[] = [],
) => {
  const ActionButton = forwardRef<
    ActionButtonElement,
    ComponentProps<RuntimeComponents["Button"]> & TProps
  >((props, forwardedRef) => {
    const {
      components: { Button },
    } = useRuntime();
    const forwardedProps = {} as TProps;
    const primitiveProps = {} as ComponentProps<RuntimeComponents["Button"]>;

    (Object.keys(props) as Array<keyof typeof props>).forEach((key) => {
      if (forwardProps.includes(key as keyof TProps)) {
        (forwardedProps as any)[key] = props[key];
      } else {
        (primitiveProps as any)[key] = props[key];
      }
    });

    const callback = useActionButton(forwardedProps as TProps) ?? undefined;

    return (
      <Button
        type="button"
        {...primitiveProps}
        ref={forwardedRef}
        disabled={primitiveProps.disabled || !callback}
        onClick={composeEventHandlers(primitiveProps.onClick, callback)}
      />
    );
  });

  ActionButton.displayName = displayName;

  return ActionButton;
};
