import { useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import "./page-transition.css";

const transitionEase = [0.76, 0, 0.24, 1];

export function usePageTransition(navigate, isMobile) {
  const [phase, setPhase] = useState("idle");

  const destinationRef = useRef(null);
  const busyRef = useRef(false);

  const transitionTo = useCallback(
    (destination) => {
      if (isMobile) {
        navigate(destination);
        return;
      }

      if (busyRef.current) return;

      busyRef.current = true;
      destinationRef.current = destination;

      setPhase("cover");
    },
    [navigate, isMobile]
  );

  function handleCovered() {
    if (phase !== "cover") return;

    navigate(destinationRef.current);

    setPhase("reveal");
  }

  function handleRevealed() {
    busyRef.current = false;
    destinationRef.current = null;

    setPhase("idle");
  }

  return {
    phase,
    transitionTo,
    handleCovered,
    handleRevealed,
  };
}

export default function PageTransition({
  phase,
  onCovered,
  onRevealed,
}) {
  if (phase === "idle") return null;

  return createPortal(
    <motion.div
      className="page-transition"
      aria-hidden="true"
      initial={{ y: "100%" }}
      animate={{
        y: phase === "cover" ? "0%" : "-100%",
      }}
      transition={{
        duration: phase === "cover" ? 0.8 : 0.95,

        delay: phase === "reveal" ? 0.15 : 0,

        ease: transitionEase,
      }}
      onAnimationComplete={() => {
        if (phase === "cover") {
          onCovered();
        } else if (phase === "reveal") {
          onRevealed();
        }
      }}
    />,
    document.body
  );
}