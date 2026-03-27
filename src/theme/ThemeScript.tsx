import { THEME_STORAGE_KEY } from "./colors";

const script = `
(function () {
  try {
    var stored = localStorage.getItem("${THEME_STORAGE_KEY}");
    var systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var mode = stored === "light" || stored === "dark" ? stored : (systemDark ? "dark" : "light");

    if (!stored) {
      localStorage.setItem("${THEME_STORAGE_KEY}", mode);
    }

    var root = document.documentElement;
    root.classList.toggle("dark", mode === "dark");
    root.style.colorScheme = mode;
  } catch (_) {
    // Keep rendering if storage is unavailable.
  }
})();
`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
