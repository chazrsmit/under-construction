
import { useEffect, useState } from "react";
import { motion, useMotionValue } from "framer-motion";
import "./custom-cursor.css";

export default function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handlePointerMove = (event) => {
      if (event.pointerType === "touch") {
        setVisible(false);
        return;
      }

      x.set(event.clientX);
      y.set(event.clientY);

      setVisible(true);
    };

    const handlePointerLeave = () => {
      setVisible(false);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("blur", handlePointerLeave);

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

  return (
    <motion.div
      className="custom-cursor"
      style={{ x, y }}
      aria-hidden="true"
    >
      <motion.div
        className="custom-cursor-square"
        initial={{ opacity: 0 }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />
    </motion.div>
  );
}
