import { type Theme } from "@/components/theme-provider";

const storageKey = "ui-theme";

export const getThemeServerFn = async () => {
  // Client-side only - use localStorage
  if (typeof window !== "undefined") {
    return (localStorage.getItem(storageKey) || "dark") as Theme;
  }
  return "dark" as Theme;
};

export const setThemeServerFn = async (theme: Theme) => {
  // Client-side only - use localStorage
  if (typeof window !== "undefined") {
    localStorage.setItem(storageKey, theme);
  }
};