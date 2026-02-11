
import { useEffect } from "react";

export const useEscapeKeydown = (
  onEscape: (event: KeyboardEvent) => void,
) => {
  useEffect(() => {
    if (typeof window === "undefined" || !window.addEventListener) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onEscape(event);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onEscape]);
};
