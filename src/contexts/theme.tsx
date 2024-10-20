import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
/* --------------------------------------------------------------------------------------------- */
interface Theme {
  mode: string;
  toggleMode: () => void;
}
/* --------------------------------------------------------------------------------------------- */
const defaultTheme: Theme = {
  mode: "dark",
  toggleMode: () => {},
};
/* --------------------------------------------------------------------------------------------- */
export const ThemeContext = createContext<Theme>(defaultTheme);
/* --------------------------------------------------------------------------------------------- */
export default function ThemeContextBoundary({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<string>(defaultTheme.mode);

  useEffect(() => {
    const storedMode = localStorage.getItem("themeMode");
    setMode(storedMode || "light");
  }, []);

  function updateMode() {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    localStorage.setItem("themeMode", newMode);
  }

  function toggleMode() {
    // @ts-ignore
    if (!document.startViewTransition) {
      updateMode();
    } else {
      // @ts-ignore
      document.startViewTransition(updateMode);
    }
  }

  return <ThemeContext.Provider value={{ mode, toggleMode }}>{children}</ThemeContext.Provider>;
}
