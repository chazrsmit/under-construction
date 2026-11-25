
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { visualExperiments } from "./visualExperiments";
import "./navigation-overlay.css";

const ease = [0.22, 1, 0.36, 1];

/* --------------------------------
   CONTENT ANIMATION
-------------------------------- */

const containerVariants = {
  hidden: {},

  visible: {
    transition: {
      delayChildren: 0.65,
      staggerChildren: 0.2,
    },
  },

  exit: {
    transition: {
      staggerChildren: 0.08,
      staggerDirection: -1,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 100,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 1.1,
      ease,
    },
  },

  exit: {
    opacity: 0,
    y: 100,

    transition: {
      duration: 0.45,
      ease: "easeInOut",
    },
  },
};

/* --------------------------------
   OVERLAY
-------------------------------- */

export default function NavigationOverlay({
  section,
  onClose,
}) {
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [onClose]);

  return createPortal(
    <motion.div
      className="navigation-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={
        section === "about"
          ? "About me"
          : "Visual experiments"
      }
      initial="hidden"
      animate="visible"
      exit="exit"
    >

      {/* BLURRED BACKGROUND */}

      <motion.div
        className="navigation-overlay-backdrop"
        variants={{
          hidden: {
            opacity: 0,
          },

          visible: {
            opacity: 1,

            transition: {
              duration: 0.6,
              ease: "easeInOut",
            },
          },

          exit: {
            opacity: 0,

            transition: {
              delay: 0.65,
              duration: 0.6,
              ease: "easeInOut",
            },
          },
        }}
      />

      {/* STATIC PANEL */}

      <div className="navigation-overlay-panel">

{/* CLOSE BUTTON */}

<motion.div
  className="navigation-overlay-close"
  variants={{
    hidden: {
      opacity: 0,
    },

    visible: {
      opacity: 1,
      transition: {
        delay: 0.65,
        duration: 0.5,
      },
    },

    exit: {
      opacity: 0,
      transition: {
        duration: 0.3,
      },
    },
  }}
>
  <motion.button
    type="button"
    data-link-cursor
    onClick={onClose}
    initial={{ opacity: 1 }}
    animate={{ opacity: 1 }}
    whileHover={{ opacity: 0.2 }}
    transition={{
      duration: 0.3,
      ease: "easeInOut",
    }}
  >
    close
  </motion.button>
</motion.div>

        {/* SCROLLABLE CONTENT */}

        <div className="navigation-overlay-scroll">

          {section === "about" && (
            <AboutContent />
          )}

          {section === "visual-experiments" && (
            <VisualExperimentsContent />
          )}

        </div>

      </div>

    </motion.div>,

    document.body
  );
}

/* --------------------------------
   ABOUT CONTENT
-------------------------------- */

function AboutContent() {
  return (
    <motion.div
      className="about-content"
      variants={containerVariants}
    >

      <motion.h2
        className="about-heading"
        variants={itemVariants}
      >
        about me
      </motion.h2>

      <motion.p
        className="about-paragraph about-paragraph-left"
        variants={itemVariants}
      >
        I'm a Brussels-based web designer and developer
        with a background in cultural communications.
        My practice brings together visual design,
        front-end development and creative coding.
      </motion.p>

      <motion.p
        className="about-paragraph about-paragraph-right"
        variants={itemVariants}
      >
        I'm interested in the possibilities of the web
        as a space for experimentation, interaction and
        storytelling, exploring the relationship between
        typography, movement, images and digital
        experiences.
      </motion.p>

    </motion.div>
  );
}

/* --------------------------------
   VISUAL EXPERIMENTS
-------------------------------- */

function VisualExperimentsContent() {
  const baseUrl = import.meta.env.BASE_URL;

  return (
    <motion.div
      className="visual-experiments-content"
      variants={containerVariants}
    >

      {/* <motion.h2
        className="visual-experiments-heading"
        variants={itemVariants}
      >
        visual experiments
      </motion.h2> */}

      {visualExperiments.map((experiment) => (
        <motion.figure
          key={experiment.id}
          className="visual-experiment"
          variants={itemVariants}
          style={{
            width: experiment.width,
            marginLeft: experiment.left,
            marginTop: experiment.marginTop,
          }}
        >

          {experiment.type === "image" && (
            <img
              src={
                baseUrl +
                "images/" +
                experiment.src
              }
              alt={experiment.alt || ""}
              loading="lazy"
            />
          )}

          {experiment.type === "video" && (
            <video
              src={
                baseUrl +
                "videos/" +
                experiment.src
              }
              muted
              loop
              playsInline
              controls
              preload="none"
            />
          )}

          {/* {experiment.caption && (
            <figcaption>
              {experiment.caption}
            </figcaption>
          )} */}

        </motion.figure>
      ))}

    </motion.div>
  );
}
