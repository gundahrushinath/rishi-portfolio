"use client";

import { Button } from "@/components/ui/button";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import {
  PERSONALIZATION_STORAGE_KEY,
  mergePersonalizationPrefs,
  type ThemePreference,
} from "@/lib/personalization";

export function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const handleToggle = () => {
    const currentTheme = resolvedTheme ?? "light";
    const nextTheme: ThemePreference = currentTheme === "dark" ? "light" : "dark";
    setTheme(nextTheme);

    if (typeof window === "undefined") return;
    try {
      const stored = window.localStorage.getItem(PERSONALIZATION_STORAGE_KEY);
      const prefs = mergePersonalizationPrefs(stored ? JSON.parse(stored) : null);
      window.localStorage.setItem(
        PERSONALIZATION_STORAGE_KEY,
        JSON.stringify({ ...prefs, theme: nextTheme })
      );
    } catch (error) {
      console.error("Failed to persist theme preference", error);
    }
  };

  return (
    <Button
      variant="ghost"
      type="button"
      size="icon"
      className="px-2"
      onClick={handleToggle}
    >
      <SunIcon className="h-[1.2rem] w-[1.2rem] text-neutral-800 dark:hidden dark:text-neutral-200" />
      <MoonIcon className="hidden h-[1.2rem] w-[1.2rem] text-neutral-800 dark:block dark:text-neutral-200" />
    </Button>
  );
}
