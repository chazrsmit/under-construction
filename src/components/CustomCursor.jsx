import { useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import "./custom-cursor.css";

export default function CustomCursor() {
  /* MOUSE POSITION AND SPRING */
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 180, damping: 14, mass: 0.8 });
  const springY = useSpring(y, { stiffness: 180, damping: 14, mass: 0.8 });
  const labelX = useTransform([springX, x], ([smooth, raw]) => smooth - raw);
  const labelY = useTransform([springY, y], ([smooth, raw]) => smooth - raw);

  /* INDEPENDENT CURSOR STATES */
  const [visible, setVisible] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);
  const [cursorText, setCursorText] = useState("");
  const [placement, setPlacement] = useState("bottom");
  const [mockup, setMockup] = useState("");
  const [mockupWidth, setMockupWidth] = useState(150);

  /* POINTER EVENTS */
  useEffect(() => {
    let inside = false;
    function updateCursor(target) {
      const category = target?.closest?.("[data-cursor]");
      const mockupTarget = target?.closest?.("[data-mockup-cursor]");
      const link = target?.closest?.("a, button, [data-link-cursor]");
      const text = category?.getAttribute("data-cursor") || "";
      const image = mockupTarget?.getAttribute("data-mockup-cursor") || "";
      setCursorText(text);
      setPlacement(category?.getAttribute("data-cursor-placement") || "bottom");
      setMockup(image);
      setMockupWidth(Number(mockupTarget?.getAttribute("data-mockup-width")) || 150);
      setIsInteractive(Boolean(link || text || image));
    }

    function handlePointerMove(event) {
      if (event.pointerType === "touch") {
        handlePointerLeave();
        return;
      }
      if (!inside) {
        springX.jump(event.clientX);
        springY.jump(event.clientY);
      }
      inside = true;
      x.set(event.clientX);
      y.set(event.clientY);
      setVisible(true);
      updateCursor(event.target);
    }

    function handlePointerLeave() {
      inside = false;
      setVisible(false);
      setIsInteractive(false);
      setCursorText("");
      setMockup("");
    }

    // Refresh when a moving image or route changes the element under the mouse.
    const observer = new MutationObserver(() => {
      if (inside) updateCursor(document.elementFromPoint(x.get(), y.get()));
    });
    const home = document.querySelector(".home");
    if (home) observer.observe(home, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["data-cursor", "data-mockup-cursor", "data-link-cursor", "class"],
    });
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerover", handlePointerMove);
    window.addEventListener("blur", handlePointerLeave);
    document.documentElement.addEventListener("pointerleave", handlePointerLeave);
    return () => {
      observer.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerover", handlePointerMove);
      window.removeEventListener("blur", handlePointerLeave);
      document.documentElement.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [x, y, springX, springY]);

  /* RENDER */
  return (
    <motion.div className="custom-cursor" style={{ x, y }} aria-hidden="true"
      initial={{ opacity: 0 }} animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.15 }}>
      {/* GRADIENT SQUARE: ALWAYS VISIBLE WHILE POINTER IS INSIDE */}
      <div className="custom-cursor-square">
        <motion.div className="cursor-gradient cursor-gradient-grey"
          animate={{ opacity: isInteractive ? 0 : 1 }} transition={{ duration: 0.3 }} />
        <motion.div className="cursor-gradient cursor-gradient-black"
          animate={{ opacity: isInteractive ? 1 : 0 }} transition={{ duration: 0.3 }} />
      </div>

      {/* CATEGORY LABEL AND MOCKUP SHARE THE SAME SPRING */}
      <motion.div className={`cursor-preview cursor-preview-${placement}`}
        style={{ x: labelX, y: labelY }}>
        <AnimatePresence>
          {cursorText && (
            <motion.div key="category" className="custom-cursor-label"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.15, ease: "easeOut" }}>
              {cursorText}
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {mockup && (
            <motion.img key={mockup} className="cursor-mockup" src={mockup}
              alt="" draggable={false} style={{ width: mockupWidth }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.15, ease: "easeOut" }} />
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
