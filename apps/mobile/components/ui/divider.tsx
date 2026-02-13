import { View, ViewProps } from "react-native";
import { cn } from "~/utils/cn";

export const Divider = ({ className, ...props }: ViewProps) => {
  return <View className={cn("h-px w-full bg-border", className)} {...props} />;
};
