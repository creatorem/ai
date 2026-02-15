import React, { useCallback, useContext, useState } from "react";
import { View, Pressable } from "react-native";
import {
  ActionSheet,
  ActionSheetContent,
  ActionSheetTrigger,
  useActionSheet,
} from "./action-sheet";
import { Icon } from "./icon";
import { Text } from "./text";
import { cn } from "~/lib/cn";

type ActionSheetSelectContextType = {
  labels: Record<string, React.ReactNode>;
  value: string;
  setValue: (t: string) => void;
};

const ActionSheetSelectContext =
  React.createContext<ActionSheetSelectContextType>({
    labels: {} as Record<string, string>,
    value: "",
    setValue: () => {},
  });

const useActionSheetSelect = (): ActionSheetSelectContextType => {
  const ctx = useContext(ActionSheetSelectContext);
  if (!ctx) {
    throw new Error("action sheet context not found");
  }
  return ctx;
};

export const ActionSheetSelect = ({
  children,
  labels,
  value: controlledValue,
  onValueChange,
}: {
  children: React.ReactNode;
  labels: Record<string, React.ReactNode>;
  value?: string;
  onValueChange?: (t: string) => void;
}) => {
  const [localValue, setValue] = useState<string | null>(null);
  const value = controlledValue ?? localValue;

  const handleChange = useCallback(
    (value: string) => {
      onValueChange?.(value);
      setValue(value);
    },
    [onValueChange, value],
  );

  return (
    <ActionSheetSelectContext.Provider
      value={{ labels, value, setValue: handleChange }}
    >
      <ActionSheet>{children}</ActionSheet>
    </ActionSheetSelectContext.Provider>
  );
};

export const ActionSheetSelectTrigger: React.FC<
  React.ComponentPropsWithRef<typeof ActionSheetTrigger>
> = ({ children, className, onBlur, onFocus, ...props }) => {
  const { open } = useActionSheet();

  return (
    <ActionSheetTrigger
      className={cn(
        "min-h-12 flex-row items-center justify-between rounded-xl border px-3",
        open ? "border-black dark:border-white" : "border-input",
        className,
      )}
      {...props}
    >
      {children}
    </ActionSheetTrigger>
  );
};

interface ActionSheetSelectValueProps {
  className?: string;
  placeholder?: string;
}

export const ActionSheetSelectValue: React.FC<ActionSheetSelectValueProps> = ({
  className,
  placeholder,
}) => {
  const { value, labels } = useActionSheetSelect();
  const label = labels[value] ?? null;
  return typeof label === "string" || !label ? (
    <Text className={className}>{label ?? placeholder ?? "Select..."}</Text>
  ) : (
    label
  );
};

export const ActionSheetSelectContent: React.FC<
  React.ComponentPropsWithRef<typeof ActionSheetContent>
> = ({ children, ...props }) => {
  return (
    <ActionSheetContent {...props}>
      <View className={"flex p-4 pt-2 pb-8"}>{children}</View>
    </ActionSheetContent>
  );
};

interface ActionSheetSelectItemProps {
  className?: string;
  value: string;
  checkClassName?: string;
}

export const ActionSheetSelectItem: React.FC<ActionSheetSelectItemProps> = ({
  className,
  value,
  checkClassName,
  ...props
}) => {
  const { value: controlledValue, setValue, labels } = useActionSheetSelect();
  const label = labels[value] ?? "";
  const { setOpen } = useActionSheet();

  const handleChange = useCallback(() => {
    setValue(value);
    setOpen(false);
  }, [value, useActionSheet, setOpen]);

  return (
    <Pressable
      {...props}
      className={cn(
        "flex-row items-center gap-2 rounded-xl px-3 py-1.5 active:bg-accent",
        value === controlledValue ? "bg-accent" : "",
        className,
      )}
      onPress={handleChange}
    >
      <View className={"flex-row items-center gap-2"}>
        {typeof label === "string" ? (
          <Text className="flex-1">{label}</Text>
        ) : (
          label
        )}
        {value === controlledValue && (
          <Icon
            name="Check"
            className={cn("h-4 w-4", checkClassName)}
            size={20}
          />
        )}
      </View>
    </Pressable>
  );
};
