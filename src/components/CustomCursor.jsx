
import { useEffect, useState } from "react";

import {
  motion,
  AnimatePresence,
  useMotionValue,
} from "framer-motion";

import "./custom-cursor.css";

export default function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  const [visible, setVisible] = useState(false);
  const [cursorText, setCursorText] = useState(null);
  const [cursorType, setCursorType] = useState("default");
  const [placement, setPlacement] = useState("bottom");

  useEffect(() => {
    function updateCursor(target) {
      if (!(target instanceof Element)) return;

      const category = target.closest("[data-cursor]");
      const draggable = target.closest("[data-drag-cursor]");
      const link = target.closest("a, button, [data-link-cursor]");

      if (category) {
        setCursorText(category.getAttribute("data-cursor"));

        setPlacement(
          category.getAttribute("data-cursor-placement") ||
            "bottom"
        );

        setCursorType("category");
      } else if (draggable) {
        setCursorText(null);
        setCursorType("drag");
      } else if (link) {
        setCursorText(null);
        setCursorType("link");
      } else {
        setCursorText(null);
        setCursorType("default");
      }
    }

    function handlePointerMove(event) {
      if (event.pointerType === "touch") {
        setVisible(false);
        return;
      }

      x.set(event.clientX);
      y.set(event.clientY);

      setVisible(true);

      updateCursor(event.target);
    }

    function handlePointerOver(event) {
      updateCursor(event.target);
    }

    function handlePointerLeave() {
      setVisible(false);
      setCursorText(null);
      setCursorType("default");
    }

    window.addEventListener(
      "pointermove",
      handlePointerMove
    );

    window.addEventListener(
      "pointerover",
      handlePointerOver
    );

    window.addEventListener(
      "blur",
      handlePointerLeave
    );

    document.documentElement.addEventListener(
      "pointerleave",
      handlePointerLeave
    );

    return () => {
      window.removeEventListener(
        "pointermove",
        handlePointerMove
      );

      window.removeEventListener(
        "pointerover",
        handlePointerOver
      );

      window.removeEventListener(
        "blur",
        handlePointerLeave
      );

      document.documentElement.removeEventListener(
        "pointerleave",
        handlePointerLeave
      );
    };
  }, [x, y]);

  const showSquare =
    cursorType === "default" ||
    cursorType === "link";

  return (
    <motion.div
      className="custom-cursor"
      style={{ x, y }}
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{
        opacity: visible ? 1 : 0,
      }}
      transition={{ duration: 0.15 }}
    >
      {/* GRADIENT SQUARE */}

      <motion.div
        className="custom-cursor-square"
        initial={false}
        animate={{
          opacity: showSquare ? 1 : 0,
          scale: showSquare ? 1 : 0.5,
        }}
        transition={{
          duration: 0.2,
          ease: "easeInOut",
        }}
      >
        {/* GREY GRADIENT */}

        <motion.div
          className="cursor-gradient cursor-gradient-grey"
          animate={{
            opacity: cursorType === "link" ? 0 : 1,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* BLACK GRADIENT */}

        <motion.div
          className="cursor-gradient cursor-gradient-black"
          animate={{
            opacity: cursorType === "link" ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>

      {/* DRAG ICON */}

{/* DRAG CURSOR */}

<AnimatePresence>
  {cursorType === "drag" && (
    <motion.div
      className="custom-cursor-drag-text"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.25,
        ease: "easeInOut",
      }}
    >
      <span className="drag-gradient-square" />
      <span className="drag-label">drag</span>
    </motion.div>
  )}
</AnimatePresence>
      {/* PROJECT CATEGORY LABEL */}

      <div
        className={`cursor-label-wrapper cursor-label-${placement}`}
      >
        <AnimatePresence>
          {cursorType === "category" && cursorText && (
            <motion.div
              className="custom-cursor-label"
              key={cursorText}
              initial={{
                opacity: 0,
                scale: 0.95,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 0.95,
              }}
              transition={{
                duration: 0.2,
                ease: "easeOut",
              }}
            >
              {cursorText}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
