import { useEffect, useRef } from "react";
import { compositionProjects } from "./compositionData";
import "./cursor-trail.css";

// export const trailSettings = {
//   imageSize: 10,
//   spacing: 24,
//   lifetime: 1300,
//   fadeDuration: 200,
//   maxImages: 40,
// };

export const trailSettings = {
  imageSize: 9,
  spacing: 45,
  lifetime: 600,
  fadeDuration: 350,
  maxImages: 8,
};

export default function CursorTrail({ enabled = true }) {
  const layer = useRef(null);
  useEffect(() => {
    if (!enabled) return;
    const node = layer.current;
    const media = matchMedia("(min-width: 768px) and (hover: hover) and (pointer: fine)");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const urls = compositionProjects.map(p => `${import.meta.env.BASE_URL}images/${p.indexImage || p.image}`);
    let last = null;
    let index = 0;
    const timers = new Map();
    function remove(img) {
      clearTimeout(timers.get(img));
      timers.delete(img);
      img.remove();
    }
    function clear() {
      for (const img of timers.keys()) remove(img);
      last = null;
    }
    function move(e) {
      if (!media.matches || reduced.matches || e.pointerType === "touch" || document.querySelector(".portfolio-screensaver") || e.target.closest?.("a, button, [data-cursor], [data-link-cursor], .composition-image-wrapper")) {
        last = null;
        return;
      }
      if (last && Math.hypot(e.clientX-last.x, e.clientY-last.y) < trailSettings.spacing) return;
      last = { x: e.clientX, y: e.clientY };
      const img = document.createElement("img");
      img.src = urls[index++ % urls.length];
      img.alt = "";
      img.style.left = `${last.x}px`;
      img.style.top = `${last.y}px`;
      img.style.width = img.style.height = `${trailSettings.imageSize}px`;
      img.style.setProperty("--hold", `${Math.max(0, trailSettings.lifetime-trailSettings.fadeDuration)}ms`);
      img.style.setProperty("--fade", `${trailSettings.fadeDuration}ms`);
      node.appendChild(img);
      timers.set(img, setTimeout(() => remove(img), trailSettings.lifetime + 50));
      while (timers.size > trailSettings.maxImages) remove(timers.keys().next().value);
    }
    window.addEventListener("pointermove", move);
    window.addEventListener("blur", clear);
    return () => { window.removeEventListener("pointermove", move); window.removeEventListener("blur", clear); clear(); };
  }, [enabled]);
  return <div ref={layer} className="cursor-trail" aria-hidden="true" />;
}
