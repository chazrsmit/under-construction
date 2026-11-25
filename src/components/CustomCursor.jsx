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

  /* --------------------------------
     MOUSE POSITION
  -------------------------------- */

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  /* --------------------------------
     SPRING CONFIGURATION
  -------------------------------- */

  const springX = useSpring(x, {
    stiffness: 180,
    damping: 14,
    mass: 0.8,
  });

  const springY = useSpring(y, {
    stiffness: 180,
    damping: 14,
    mass: 0.8,
  });

  const labelX = useTransform(
    [springX, x],
    ([smooth, raw]) => smooth - raw
  );

  const labelY = useTransform(
    [springY, y],
    ([smooth, raw]) => smooth - raw
  );

  /* --------------------------------
     CURSOR STATE
  -------------------------------- */

  const [visible, setVisible] = useState(false);
  const [cursorText, setCursorText] = useState("");
  const [cursorType, setCursorType] = useState("default");
  const [placement, setPlacement] = useState("bottom");

  const [mockup, setMockup] = useState("");
  const [mockupWidth, setMockupWidth] = useState(150);

  /* --------------------------------
     POINTER EVENTS
  -------------------------------- */

  useEffect(() => {

    function updateCursor(target) {
      if (!(target instanceof Element)) return;

      const category = target.closest("[data-cursor]");

      const mockupTarget = target.closest(
        "[data-mockup-cursor]"
      );

      const link = target.closest(
        "a, button, [data-link-cursor]"
      );

      if (category) {

        setCursorText(
          category.getAttribute("data-cursor") || ""
        );

        setPlacement(
          category.getAttribute("data-cursor-placement") ||
            "bottom"
        );

        setCursorType("category");

      } else if (mockupTarget) {

        setMockup(
          mockupTarget.getAttribute("data-mockup-cursor")
        );

        setMockupWidth(
          Number(
            mockupTarget.getAttribute("data-mockup-width")
          ) || 150
        );

        setCursorType("mockup");

      } else if (link) {

        setCursorType("link");

      } else {

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

    function handlePointerLeave() {
      setVisible(false);
      setCursorType("default");
    }

    window.addEventListener(
      "pointermove",
      handlePointerMove
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
    cursorType === "link" ||
    cursorType === "mockup";

  /* --------------------------------
     RENDER
  -------------------------------- */

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

        <motion.div
          className="cursor-gradient cursor-gradient-grey"
          animate={{
            opacity:
              cursorType === "link" ||
              cursorType === "mockup"
                ? 0
                : 1,
          }}
          transition={{ duration: 0.3 }}
        />

        <motion.div
          className="cursor-gradient cursor-gradient-black"
          animate={{
            opacity:
              cursorType === "link" ||
              cursorType === "mockup"
                ? 1
                : 0,
          }}
          transition={{ duration: 0.3 }}
        />

      </motion.div>

      {/* PROJECT MOCKUP */}

      <motion.div
        className="cursor-mockup-wrapper"
        style={{
          x: labelX,
          y: labelY,
        }}
      >
        <AnimatePresence>
          {cursorType === "mockup" && mockup && (
            <motion.img
              key={mockup}
              className="cursor-mockup"
              src={mockup}
              alt=""
              draggable={false}
              style={{
                width: mockupWidth,
              }}
              initial={{
                opacity: 0,
                scale: 0.92,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                scale: 0.92,
              }}
              transition={{
                duration: 0.2,
                ease: "easeOut",
              }}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* PROJECT CATEGORY LABEL */}

      <motion.div
        className={`cursor-label-wrapper cursor-label-${placement}`}
        style={{
          x: labelX,
          y: labelY,
        }}
      >
        <motion.div
          className="custom-cursor-label"
          initial={false}
          animate={{
            opacity:
              cursorType === "category" && cursorText
                ? 1
                : 0,
          }}
          transition={{
            duration: 0.15,
            ease: "easeOut",
          }}
        >
          {cursorText}
        </motion.div>
      </motion.div>

    </motion.div>
  );
}