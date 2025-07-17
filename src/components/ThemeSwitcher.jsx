import { useState } from "react";
import { Palette } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";

const ThemeSwitcher = () => {
  const { theme, setTheme } = useThemeStore();
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    "light",
    "dark",
    "cupcake",
    "bumblebee",
    "emerald",
    "corporate",
    "synthwave",
    "retro",
    "cyberpunk",
    "valentine",
    "halloween",
    "garden",
    "forest",
    "aqua",
    "lofi",
    "pastel",
    "fantasy",
    "wireframe",
    "black",
    "luxury",
    "dracula",
    "cmyk",
    "autumn",
    "business",
    "acid",
    "lemonade",
    "night",
    "coffee",
    "winter",
    "dim",
    "nord",
    "sunset",
  ];

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    setIsOpen(false);
  };

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Palette className="w-5 h-5" />
      </div>

      {isOpen && (
        <div
          className="dropdown-content z-[1000] mt-3 p-4 shadow-2xl bg-base-300 rounded-box border border-base-content/10"
          style={{
            position: "fixed",
            top: "4rem",
            right: "1rem",
            width: "300px",
            maxHeight: "calc(100vh - 6rem)",
            overflowY: "auto",
          }}
        >
          <div className="grid grid-cols-3 gap-2">
            {themes.map((themeName) => (
              <div
                key={themeName}
                className={`cursor-pointer rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                  theme === themeName
                    ? "border-primary shadow-lg"
                    : "border-transparent hover:border-base-content/20"
                }`}
                onClick={() => handleThemeChange(themeName)}
              >
                <div
                  data-theme={themeName}
                  className="bg-base-100 text-base-content rounded-md overflow-hidden"
                >
                  <div className="p-2">
                    <div className="text-xs font-bold text-center mb-1 capitalize">
                      {themeName}
                    </div>
                    <div className="flex gap-1 justify-center">
                      <div className="bg-primary w-2 h-2 rounded-full"></div>
                      <div className="bg-secondary w-2 h-2 rounded-full"></div>
                      <div className="bg-accent w-2 h-2 rounded-full"></div>
                      <div className="bg-neutral w-2 h-2 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[999]"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default ThemeSwitcher;
