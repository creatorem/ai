import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
} from "react";
import { Appearance } from "react-native";
import { Uniwind, useUniwind } from "uniwind";

type Var =
  | "color-background"
  | "color-foreground"
  | "color-card"
  | "color-card-foreground"
  | "color-popover"
  | "color-popover-foreground"
  | "color-primary"
  | "color-primary-foreground"
  | "color-secondary"
  | "color-secondary-foreground"
  | "color-muted"
  | "color-muted-foreground"
  | "color-accent"
  | "color-accent-foreground"
  | "color-destructive"
  | "color-border"
  | "color-input"
  | "color-ring"
  | "color-chart-1"
  | "color-chart-2"
  | "color-chart-3"
  | "color-chart-4"
  | "color-chart-5"
  | "color-sidebar"
  | "color-sidebar-foreground"
  | "color-sidebar-primary"
  | "color-sidebar-primary-foreground"
  | "color-sidebar-accent"
  | "color-sidebar-accent-foreground"
  | "color-sidebar-border"
  | "color-sidebar-ring"
  | "color-surface"
  | "color-surface-foreground"
  | "color-selection"
  | "color-selection-foreground"
  | "color-opposite";

export type ThemeVariable = `--${Var}`;

type RNTheme = Record<`--${Var}`, string>;

const lightTheme: RNTheme = {
  "--color-background": "white",
  "--color-foreground": "rgba(10, 10, 10, 1)",
  "--color-card": "rgba(240, 240, 240, 1)",
  "--color-card-foreground": "rgba(10, 10, 10, 1)",
  "--color-popover": "white",
  "--color-popover-foreground": "rgba(10, 10, 10, 1)",
  "--color-primary": "#e98a0e",
  "--color-primary-foreground": "rgba(250, 250, 250, 1)",
  "--color-secondary": "#F5F5F5",
  "--color-secondary-foreground": "rgba(23, 23, 23, 1)",
  "--color-muted": "rgba(245, 245, 245, 1)",
  "--color-muted-foreground": "rgba(115,115,115, 1)",
  "--color-accent": "rgba(245, 245, 245, 1)",
  "--color-accent-foreground": "rgba(23, 23, 23, 1)",
  "--color-destructive": "rgb(231, 0, 11)",
  "--color-border": "rgba(229,229,229, 1)",
  "--color-input": "rgba(229,229,229, 1)",
  "--color-ring": "rgba(161,161,161, 1)",
  "--color-chart-1": "var(--color-blue-300)",
  "--color-chart-2": "var(--color-blue-500)",
  "--color-chart-3": "var(--color-blue-600)",
  "--color-chart-4": "var(--color-blue-700)",
  "--color-chart-5": "var(--color-blue-800)",
  "--color-sidebar": "rgba(250, 250, 250, 1)",
  "--color-sidebar-foreground": "rgba(10, 10, 10, 1)",
  "--color-sidebar-primary": "rgba(23, 23, 23, 1)",
  "--color-sidebar-primary-foreground": "rgba(250, 250, 250, 1)",
  "--color-sidebar-accent": "rgba(245, 245, 245, 1)",
  "--color-sidebar-accent-foreground": "rgba(23, 23, 23, 1)",
  "--color-sidebar-border": "rgba(229,229,229, 1)",
  "--color-sidebar-ring": "rgba(161,161,161, 1)",
  "--color-surface": "rgba(248, 248, 248, 1)",
  "--color-surface-foreground": "var(--foreground)",
  "--color-selection": "rgba(10, 10, 10, 1)",
  "--color-selection-foreground": "white",
  "--color-opposite": "rgba(0, 0, 0, 1)",
};

const darkTheme: RNTheme = {
  "--color-background": "#171717",
  "--color-foreground": "rgba(250, 250, 250, 1)",
  "--color-card": "rgb(33, 33, 33)",
  "--color-card-foreground": "rgba(250, 250, 250, 1)",
  "--color-popover": "rgba(22,22,22, 1)",
  "--color-popover-foreground": "rgba(250, 250, 250, 1)",
  "--color-primary": "#e98a0e",
  "--color-primary-foreground": "rgba(23, 23, 23, 1)",
  "--color-secondary": "#262626",
  "--color-secondary-foreground": "rgba(250, 250, 250, 1)",
  "--color-muted": "rgba(38,38,38, 1)",
  "--color-muted-foreground": "rgba(161,161,161, 1)",
  "--color-accent": "rgba(255, 255, 255, 0.1)",
  "--color-accent-foreground": "rgba(250, 250, 250, 1)",
  "--color-destructive": "rgb(255, 100, 103)",
  "--color-border": "rgba(38,38,38, 1)",
  "--color-input": "rgba(255, 255, 255, 0.15)",
  "--color-ring": "rgba(115,115,115, 1)",
  "--color-chart-1": "var(--color-blue-300)",
  "--color-chart-2": "var(--color-blue-500)",
  "--color-chart-3": "var(--color-blue-600)",
  "--color-chart-4": "var(--color-blue-700)",
  "--color-chart-5": "var(--color-blue-800)",
  "--color-sidebar": "rgba(23, 23, 23, 1)",
  "--color-sidebar-foreground": "rgba(250, 250, 250, 1)",
  "--color-sidebar-primary": "rgb(20, 71, 230)",
  "--color-sidebar-primary-foreground": "rgba(250, 250, 250, 1)",
  "--color-sidebar-accent": "rgba(22,22,22, 1)",
  "--color-sidebar-accent-foreground": "rgba(250, 250, 250, 1)",
  "--color-sidebar-border": "rgba(38,38,38, 1)",
  "--color-sidebar-ring": "rgb(82, 82, 82)",
  "--color-surface": "rgba(22,22,22, 1)",
  "--color-surface-foreground": "rgba(161,161,161, 1)",
  "--color-selection": "rgba(229,229,229, 1)",
  "--color-selection-foreground": "rgba(23, 23, 23, 1)",
  "--color-opposite": "white",
};

type ThemeContextType = {
  darkTheme: RNTheme;
  lightTheme: RNTheme;
  isDark: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { theme, hasAdaptiveThemes } = useUniwind();
  const activeTheme = hasAdaptiveThemes ? "system" : theme;
  const isDark = activeTheme === "dark";

  const toggleTheme = useCallback(() => {
    const next = isDark ? "light" : "dark";
    Appearance.setColorScheme(next);
    Uniwind.setTheme(next);
  }, [isDark]);

  useEffect(() => {
    Appearance.setColorScheme("dark");
    Uniwind.setTheme("dark");
  }, []);

  return (
    <ThemeContext.Provider
      value={{ isDark, toggleTheme, darkTheme, lightTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const useThemeColors = () => {
  const { isDark, darkTheme, lightTheme } = useTheme();

  const theme = isDark ? darkTheme : lightTheme;

  return {
    ...theme,
    isDark,
  };
};

export default ThemeContext;
