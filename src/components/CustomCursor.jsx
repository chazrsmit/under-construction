import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import "./custom-cursor.css";

export default function CustomCursor() {
  /* POINTER AND INDEPENDENT SPRING POSITION */
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 180, damping: 14, mass: 0.8 });
  const springY = useSpring(y, { stiffness: 180, damping: 14, mass: 0.8 });

  const [visible, setVisible] = useState(false);
  const [interactive, setInteractive] = useState(false);
  const [label, setLabel] = useState("");
  const [labelVisible, setLabelVisible] = useState(false);

  /* POINTER TRACKING */
  useEffect(() => {
    let inside = false;
    let frame;
    let previousTarget = null;
    let previousText = "";
    let previousInteractive = false;

    function update() {
      if (inside) {
        const target = document.elementFromPoint(x.get(), y.get());
        const category = target?.closest("[data-cursor]");
        const text = category?.getAttribute("data-cursor") || "";
        const link = Boolean(text || target?.closest("a, button, [data-link-cursor]"));

        if (text !== previousText || category !== previousTarget) {
          if (text) setLabel(text);
          setLabelVisible(Boolean(text));
          previousText = text;
          previousTarget = category;
        }
        if (link !== previousInteractive) {
          setInteractive(link);
          previousInteractive = link;
        }
      }
      frame = requestAnimationFrame(update);
    }

    function leave() {
      inside = false;
      previousTarget = null;
      previousText = "";
      previousInteractive = false;
      setVisible(false);
      setLabelVisible(false);
      setInteractive(false);
    }

    function move(event) {
      if (event.pointerType === "touch") return leave();
      x.set(event.clientX);
      y.set(event.clientY);
      if (!inside) {
        springX.jump(event.clientX);
        springY.jump(event.clientY);
        inside = true;
        setVisible(true);
      }
    }

    window.addEventListener("pointermove", move);
    window.addEventListener("blur", leave);
    document.documentElement.addEventListener("pointerleave", leave);
    frame = requestAnimationFrame(update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("blur", leave);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [x, y, springX, springY]);

  /* SEPARATE FIXED LAYERS: NO SUBTRACTION OF TRANSFORMS */
  return (
    <>
      <motion.div className="custom-cursor" style={{ x, y }} aria-hidden="true"
        initial={{ opacity: 0 }} animate={{ opacity: visible ? 1 : 0 }}>
        <div className="custom-cursor-square">
          <motion.div className="cursor-gradient cursor-gradient-grey"
            animate={{ opacity: interactive ? 0 : 1 }} transition={{ duration: 0.2 }} />
          <motion.div className="cursor-gradient cursor-gradient-black"
            animate={{ opacity: interactive ? 1 : 0 }} transition={{ duration: 0.2 }} />
        </div>
      </motion.div>
      <motion.div className="custom-cursor cursor-label-layer"
        style={{ x: springX, y: springY }} aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: visible && labelVisible ? 1 : 0 }}
        transition={{ duration: 0.18, ease: "easeOut" }}>
        <div className="custom-cursor-label">{label}</div>
      </motion.div>
    </>
  );
}
