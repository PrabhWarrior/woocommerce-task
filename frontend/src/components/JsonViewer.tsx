import JsonView from "@uiw/react-json-view";
import { nordTheme } from "@uiw/react-json-view/nord";
import { githubLightTheme } from "@uiw/react-json-view/githubLight";
import { useEffect, useState } from "react";

const JsonViewer = ({ jsonData }: { jsonData: any }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const theme = document.documentElement.getAttribute("data-theme");
      setIsDark(theme === "night" || theme === "dark" || theme === "nord");
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    
    const initialTheme = document.documentElement.getAttribute("data-theme");
    setIsDark(
      initialTheme === "night" ||
        initialTheme === "dark" ||
        initialTheme === "nord"
    );

    return () => observer.disconnect();
  }, []);

  return (
    <JsonView value={jsonData} style={isDark ? nordTheme : githubLightTheme} />
  );
};

export default JsonViewer;
