import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./home.css";

export default function Home() {
  const [showContent, setShowContent] = useState(false);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(()=> {
    const checkSize = () => setIsMobile(window.innerWidth < 768)
    checkSize()

    window.addEventListener("resize", checkSize)
    return () => window.removeEventListener("resize", checkSize)
  }, [])

  return (
    <main className="home">

      {/* TITLE */}
      <motion.div
        className="site-title"
        initial={{
          opacity: 0,
          top: "50%",
          left: isMobile ? "18px" : "50%",
          x: isMobile? 0 : "-50%",
          y: "-50%",
          fontSize: isMobile ? "22px" : "28px",
  
        }}
        animate={{
          opacity: 1,
          top: "0px",
          left: "18px",
          x: 0,
          y: 0,
          fontSize: "16px",

        }}
        transition={{
          opacity: {
            duration: 0.8,
            ease: "easeOut",
          },
          top: {
            duration: 1.2,
            delay: 2,
            ease: [0.22, 1, 0.36, 1],
          },
          left: {
            duration: 1.2,
            delay: 2,
            ease: [0.22, 1, 0.36, 1],
          },
          x: {
            duration: 1.2,
            delay: 2,
            ease: [0.22, 1, 0.36, 1],
          },
          y: {
            duration: 1.2,
            delay: 2,
            ease: [0.22, 1, 0.36, 1],
          },
          fontSize: {
            duration: 1.2,
            delay: 2,
            ease: [0.22, 1, 0.36, 1],
          },

        }}
        onAnimationComplete={() => setShowContent(true)}
      >
        <h1>Charlotte Smit</h1>
      </motion.div>

      {/* FOUR GRADIENT SQUARES */}
        <motion.div
        className="gradient-squares"
        initial={{ opacity: 0 }}
        animate={{ opacity: showContent ? 1 : 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        >
        {[1, 2, 3, 4].map((square) => (
            <div className={`gradient-square square-${square}`} key={square} />
        ))}
        </motion.div>

        {/* DESKTOP IMAGE BLOCK: FOUR TILES */}
        <motion.div
        className="desktop-image-block"
        initial={{ opacity: 0 }}
        animate={{ opacity: showContent ? 1 : 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        >
        {[1, 2, 3, 4].map((tile) => (
            <div className={`image-tile tile-${tile}`} key={tile} />
        ))}
        </motion.div>

        {/* MOBILE IMAGE BLOCKS: 14 GROUPS OF THREE */}
        <motion.div
        className="mobile-image-composition"
        variants={{
            hidden: {},
            visible: {
            transition: {
                staggerChildren: 0.12,
                delayChildren: 0.2,
            },
            },
        }}
        initial="hidden"
        animate={showContent ? "visible" : "hidden"}
        >
        {[
            { x: 87, y: 20 },
            { x: 71, y: 23 },
            { x: 55, y: 26 },
            { x: 39, y: 29 },
            { x: 23, y: 33 },
            { x: 8, y: 37 },
            { x: -3, y: 43 },
            { x: 0, y: 51 },
            { x: 6, y: 57 },
            { x: 22, y: 60 },
            { x: 39, y: 63 },
            { x: 56, y: 66 },
            { x: 73, y: 69 },
            { x: 89, y: 70 },
        ].map((position, index) => (
            <motion.div
            className="mobile-image-block"
            key={index}
            style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
            }}
            variants={{
                hidden: { opacity: 0 },
                visible: {
                opacity: 1,
                transition: {
                    duration: 0.5,
                    ease: "easeOut",
                },
                },
            }}
            >
            {[1, 2, 3].map((tile) => (
                <div
                className={`image-tile tile-${tile}`}
                key={tile}
                />
            ))}
            </motion.div>
        ))}
        </motion.div>

      {/* PROJECTS */}
      <motion.div
        className="projects-link"
        initial={{ opacity: 0 }}
        animate={{ opacity: showContent ? 1 : 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <p>(projects)</p>
      </motion.div>

      {/* INTRODUCTION */}
      <motion.div
        className="intro-link"
        initial={{ opacity: 0 }}
        animate={{ opacity: showContent ? 1 : 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <p>hi, i'm a web designer and developer (...)</p>
      </motion.div>

      {/* CONSTRUCTION MESSAGE */}
      <motion.div
        className="construction"
        initial={{ opacity: 0 }}
        animate={{ opacity: showContent ? 1 : 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <p>website under construction</p>
      </motion.div>

    </main>
  );
}
