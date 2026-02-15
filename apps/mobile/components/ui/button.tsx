import { cva, type VariantProps } from "class-variance-authority";
import { Href, router } from "expo-router";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  PressableProps,
} from "react-native";
import { cn } from "~/lib/cn";
import { TextClassContext } from "./text";
import * as Slot from "@rn-primitives/slot";
import { useCSSVariable } from "uniwind";

const buttonVariants = cva(
  cn(
    "group shrink-0 flex-row items-center justify-center gap-2 rounded-lg shadow-none active:bg-muted",
    Platform.select({
      web: "whitespace-nowrap outline-none transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
    }),
  ),
  {
    variants: {
      variant: {
        default: cn(
          "bg-primary shadow-black/5 shadow-sm active:bg-primary/90",
          Platform.select({ web: "hover:bg-primary/90" }),
        ),
        destructive: cn(
          "bg-destructive shadow-black/5 shadow-sm active:bg-destructive/90 dark:bg-destructive/60",
          Platform.select({
            web: "hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
          }),
        ),
        destructive_outline: cn(
          "border border-destructive bg-background shadow-black/5 shadow-sm active:bg-destructive/10",
          Platform.select({
            web: "hover:bg-destructive/10",
          }),
        ),
        outline: cn(
          "border border-border bg-background shadow-black/5 shadow-sm active:bg-accent dark:border-input dark:bg-muted/30 dark:active:bg-input/50",
          Platform.select({
            web: "hover:bg-accent dark:hover:bg-input/50",
          }),
        ),
        secondary: cn(
          "bg-secondary shadow-black/5 shadow-sm active:bg-secondary/80",
          Platform.select({ web: "hover:bg-secondary/80" }),
        ),
        destructive_ghost: cn("bg-destructive/10 active:bg-destructive/20"),
        ghost: cn(
          "active:bg-accent dark:active:bg-accent/50",
          Platform.select({ web: "hover:bg-accent dark:hover:bg-accent/50" }),
        ),
        link: "",
      },
      size: {
        default: cn(
          "h-10 px-4 py-2",
          Platform.select({ web: "has-[>svg]:px-3" }),
        ),
        sm: cn(
          "h-8 gap-1.5 rounded-md px-3",
          Platform.select({ web: "has-[>svg]:px-2.5" }),
        ),
        "sm-icon": cn(
          "h-8 w-8 gap-1.5 rounded-md",
          Platform.select({ web: "has-[>svg]:px-2.5" }),
        ),
        lg: cn(
          "h-11 rounded-md px-6 sm:h-10",
          Platform.select({ web: "has-[>svg]:px-4" }),
        ),
        icon: "h-10 w-10 sm:h-9 sm:w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const buttonTextVariants = cva(
  cn(
    "font-medium text-foreground text-md",
    Platform.select({ web: "pointer-events-none transition-colors" }),
  ),
  {
    variants: {
      variant: {
        default: "text-primary-foreground",
        destructive: "text-white",
        outline: cn(
          "group-active:text-accent-foreground",
          Platform.select({ web: "group-hover:text-accent-foreground" }),
        ),
        secondary: "text-secondary-foreground",
        ghost: "group-active:text-accent-foreground",
        link: cn(
          "text-primary group-active:underline",
          Platform.select({
            web: "underline-offset-4 hover:underline group-hover:underline",
          }),
        ),
        destructive_ghost: "text-destructive",
        destructive_outline: "text-destructive",
      },
      size: {
        default: "",
        sm: "",
        "sm-icon": "",
        lg: "",
        icon: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonProps = React.ComponentProps<typeof Pressable> &
  React.RefAttributes<typeof Pressable> &
  VariantProps<typeof buttonVariants> & {
    href?: Href;
    loading?: boolean;
    style?: PressableProps["style"];
    children?: React.ReactNode;
    asChild?: boolean;
  };

function Button({
  className,
  variant,
  size,
  href,
  loading = false,
  onPress,
  style,
  children,
  asChild = false,
  ...props
}: ButtonProps) {
  const foregroundColor = useCSSVariable("--color-foreground");

  const Component = asChild ? Slot.Pressable : Pressable;

  return (
    <TextClassContext.Provider value={buttonTextVariants({ variant, size })}>
      <Component
        className={cn(
          buttonVariants({ variant, size }),
          props.disabled && [
            "opacity-50",
            variant === "default" ? "bg-muted-foreground/50" : "",
          ],
          className,
        )}
        role="button"
        onPress={(e) => {
          if (href) {
            router.push(href);
          }
          onPress?.(e);
        }}
        {...props}
      >
        {loading && <ActivityIndicator color={foregroundColor} />}
        {children}
      </Component>
    </TextClassContext.Provider>
  );
}

export { Button, buttonTextVariants, buttonVariants };
export type { ButtonProps };
