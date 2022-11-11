"use client";

import { useTheme } from "src/contexts/next-themes";
import { useEffect, useState } from "react";
import { IconMoon } from "src/icons/Moon";
import { IconSun } from "src/icons/Sun";

type Props = {
  className?: string;
};

export function ThemeToggleButton({ className = "" }: Props) {
  const { resolvedTheme, setTheme } = useTheme();
  const [darkIcon, setDarkIcon] = useState(false);

  useEffect(() => {
    if (resolvedTheme === "light") {
      setDarkIcon(false);
    } else {
      setDarkIcon(true);
    }
  }, [resolvedTheme]);

  const toggleTheme = () => {
    if (resolvedTheme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  return (
    <button className={`${className}`} aria-label="Toggle theme" onClick={toggleTheme}>
      {darkIcon ? <IconMoon /> : <IconSun />}
    </button>
  );
}
