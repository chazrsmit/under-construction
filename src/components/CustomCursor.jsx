
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

  const [flipX, setFlipX] = useState(false);
  const [flipY, setFlipY] = useState(false);

  useEffect(() => {
    function updateCursorText(target) {
      const element =
        target instanceof Element
          ? target.closest("[data-cursor]")
          : null;

      setCursorText(
        element?.getAttribute("data-cursor") || null
      );
    }

    function handlePointerMove(event) {
      if (event.pointerType === "touch") {
        setVisible(false);
        return;
      }

      x.set(event.clientX);
      y.set(event.clientY);

      setVisible(true);

      updateCursorText(event.target);

      // Keep the label inside the viewport.

      setFlipX(
        event.clientX > window.innerWidth - 250
      );

      setFlipY(
        event.clientY > window.innerHeight - 65
      );
    }

    function handlePointerOver(event) {
      updateCursorText(event.target);
    }

    function handlePointerLeave() {
      setVisible(false);
      setCursorText(null);
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

  return (
    <motion.div
      className="custom-cursor"
      style={{ x, y }}
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{
        opacity: visible ? 1 : 0,
      }}
      transition={{
        duration: 0.15,
      }}
    >
      {/* DEFAULT GRADIENT SQUARE */}

      <motion.div
        className="custom-cursor-square"
        initial={false}
        animate={{
          opacity: cursorText ? 0 : 1,
          scale: cursorText ? 0.5 : 1,
        }}
        transition={{
          duration: 0.15,
          ease: "easeOut",
        }}
      />

      {/* CONTEXTUAL CURSOR LABEL */}

      <div
        className={`cursor-label-wrapper
          ${flipX ? "cursor-flip-x" : ""}
          ${flipY ? "cursor-flip-y" : ""}
        `}
      >
        <AnimatePresence>
          {cursorText && (
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
                duration: 0.15,
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
