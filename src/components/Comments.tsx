import { useEffect, useState } from "react";
import Giscus, { type Theme } from "@giscus/react";
import { GISCUS } from "@/constants";

export default function Comments() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    // Get initial theme from localStorage or system preference
    const currentTheme = localStorage.getItem("theme");
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";
    const initialTheme = (currentTheme || systemTheme) as Theme;
    setTheme(initialTheme);

    // Listen for theme changes
    const handleThemeChange = () => {
      const newTheme = localStorage.getItem("theme") as Theme;
      if (newTheme) {
        setTheme(newTheme);
      }
    };

    // MutationObserver to watch for theme changes in the DOM
    const observer = new MutationObserver(() => {
      const htmlTheme = document.documentElement.getAttribute("data-theme");
      if (htmlTheme === "dark" || htmlTheme === "light") {
        setTheme(htmlTheme as Theme);
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    // Listen for storage events (theme changes in other tabs)
    window.addEventListener("storage", handleThemeChange);

    return () => {
      observer.disconnect();
      window.removeEventListener("storage", handleThemeChange);
    };
  }, []);

  return (
    <div className="mt-8">
      <Giscus
        repo={GISCUS.repo}
        repoId={GISCUS.repoId}
        category={GISCUS.category}
        categoryId={GISCUS.categoryId}
        mapping={GISCUS.mapping}
        reactionsEnabled={GISCUS.reactionsEnabled}
        emitMetadata={GISCUS.emitMetadata}
        inputPosition={GISCUS.inputPosition}
        theme={theme}
        lang={GISCUS.lang}
        loading={GISCUS.loading}
      />
    </div>
  );
}
