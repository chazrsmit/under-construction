
import { useEffect } from "react";

export default function AnimatedTitle() {
  useEffect(() => {
    const originalTitle = document.title;

    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    if (motionPreference.matches) return;

    let title =
      "Charlotte Smit ― in constant iteration ― ";

    document.title = title;

    const interval = setInterval(() => {
      title = title.slice(1) + title[0];

      document.title = title;
    }, 220);

    return () => {
      clearInterval(interval);

      document.title = originalTitle;
    };
  }, []);

  return null;
}
