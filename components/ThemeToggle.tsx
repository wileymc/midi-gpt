import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";
import { Icon } from "@tremor/react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="cursor-pointer ">
      <Icon
        icon={theme === "light" ? MoonIcon : SunIcon}
        color="teal"
        variant="solid"
        tooltip="Change Theme"
        size="sm"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      />
    </div>
  );
}
