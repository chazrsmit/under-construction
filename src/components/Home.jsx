import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./home.css";

const projects = [
  { name: "agendive", description: "(app & website project)" },
  { name: "litteria", description: "(e-commerce website)" },
  { name: "oh word", description: "(web application)" },
  { name: "la coeh", description: "(website & identity)" },
  { name: "attuned", description: "(visual identity & website)" },
  { name: "napolinapoli", description: "(digital project)" },
];

// Closed state: the 14 blocks form the diagonal S-curve
const mobileImagePositions = [
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
  { x: 89, y: 72 },
];

// Projects open: all 14 blocks scattered (393 x 852 frame).
// Indices 0-8 match the screenshot, 9-13 fill the empty zones.
const mobileImagePositionsOpen = [
  { x: 29, y: 0 },
  { x: 58.5, y: 4.5 },
  { x: 87.5, y: 9.6 },
  { x: 97, y: 31.2 },
  { x: 66.7, y: 34.5 },
  { x: 49, y: 44.4 },
  { x: 73, y: 53.1 },
  { x: 75.6, y: 90.4 },
  { x: 87, y: 98 },
  { x: 56, y: 16 },
  { x: 33, y: 23 },
  { x: 70, y: 64 },
  { x: 30, y: 72 },
  { x: 60, y: 79 },
];

const moveEase = [0.22, 1, 0.36, 1];

export default function Home() {
  const [showContent, setShowContent] = useState(false);
  const [activeTile, setActiveTile] = useState(null);
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [hoveredProject, setHoveredProject] = useState(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const checkSize = () => setIsMobile(window.innerWidth < 768);

    checkSize();
    window.addEventListener("resize", checkSize);

    return () => window.removeEventListener("resize", checkSize);
  }, []);

  return (
    <main className={`home ${projectsOpen ? "projects-open" : ""}`}>

      {/* TITLE */}
      <motion.div
        className="site-title"
        initial={{
          opacity: 0,
          top: "50%",
          left: isMobile ? "18px" : "50%",
          x: isMobile ? 0 : "-50%",
          y: "-50%",
          fontSize: isMobile ? "22px" : "28px",
        }}
        animate={{
          opacity: 1,
          top: "20px",
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

      {/* FIRST GROUP OF GRADIENT SQUARES */}
      <motion.div
        layout
        className="gradient-squares gradient-squares-top"
        initial={{ opacity: 0 }}
        animate={{
          opacity: showContent ? 1 : 0,
          top: isMobile ? "105px" : "auto",
          bottom: isMobile ? "auto" : "20px",
          left: isMobile ? "14px" : "50%",
          x: isMobile ? 0 : "-50%",
          // flexDirection: isMobile && projectsOpen ? "column" : "row",
          // gap: isMobile && projectsOpen ? "12px" : "22px",
        }}
        transition={{
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1],
          layout: { duration: 0.8 },
        }}
      >
        {[1, 2, 3, 4].map((square) => (
          <motion.div
            layout
            className={`gradient-square square-${square}`}
            key={square}
          />
        ))}
      </motion.div>

      {/* SECOND GROUP OF GRADIENT SQUARES - MOBILE */}
      <motion.div
        className="gradient-squares gradient-squares-bottom"
        initial={{ opacity: 0 }}
        animate={{
          opacity: showContent && isMobile ? 1 : 0,
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {[1, 2, 3, 4].map((square) => (
          <div
            className={`gradient-square square-${square}`}
            key={square}
          />
        ))}
      </motion.div>

      {/* DESKTOP IMAGE BLOCK */}
      {/* TOP RIGHT  */}
      <motion.div
        className="desktop-image-block"
        initial={{ opacity: 0 }}
        animate={{ opacity: showContent ? 1 : 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {[1, 2, 3, 4].map((tile) => (
          <div
            className={`image-tile tile-${tile} ${
              !activeTile
                ? ""
                : activeTile === tile
                ? ""
                : "faded"
            }`}
            key={tile}
            onMouseEnter={() => setActiveTile(tile)}
            onMouseLeave={() => setActiveTile(null)}
          />
        ))}
      </motion.div>
      {/* BOTTOM LEFT */}
      <motion.div
        className="desktop-image-block2"
        initial={{ opacity: 0 }}
        animate={{ opacity: showContent ? 1 : 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {[1, 2, 3, 4].map((tile) => (
          <div
            className={`image-tile tile-${tile} ${
              !activeTile
                ? ""
                : activeTile === tile
                ? ""
                : "faded"
            }`}
            key={tile}
            onMouseEnter={() => setActiveTile(tile)}
            onMouseLeave={() => setActiveTile(null)}
          />
        ))}
      </motion.div>

      {/* MOBILE IMAGE COMPOSITION - 14 BLOCKS, REPOSITIONED WHEN PROJECTS OPEN */}
      <div className="mobile-image-composition">
        {mobileImagePositions.map((closedPosition, index) => {
          const position = projectsOpen
            ? mobileImagePositionsOpen[index]
            : closedPosition;
          const isVisible = showContent;

          return (
            <motion.div
              className="mobile-image-block"
              key={index}
              initial={{
                opacity: 0,
                left: `${closedPosition.x}%`,
                top: `${closedPosition.y}%`,
              }}
              animate={{
                opacity: isVisible ? 1 : 0,
                left: `${position.x}%`,
                top: `${position.y}%`,
              }}
              transition={{
                opacity: {
                  duration: 0.5,
                  delay: showContent && !projectsOpen ? index * 0.12 : 0,
                  ease: "easeOut",
                },
                left: { duration: 1, ease: moveEase },
                top: { duration: 1, ease: moveEase },
              }}
            >
              {[1, 2, 3].map((tile) => (
                <div
                  className={`image-tile tile-${tile}`}
                  key={tile}
                />
              ))}
            </motion.div>
          );
        })}
      </div>

      {/* PROJECTS TRIGGER */}
      <motion.div
        className="projects-link"
        initial={{ opacity: 0 }}
        animate={{
          opacity: showContent ? 1 : 0,
          left: projectsOpen && isMobile ? "62%" : "50%",
        }}
        transition={{
          opacity: { duration: 0.8 },
          left: { duration: 1, ease: [0.22, 1, 0.36, 1] },
        }}
        onClick={() => {
          setProjectsOpen((prev) => !prev);
          setHoveredProject(null);
        }}
      >
        <motion.p
          className="projects-p"
          animate={{ opacity: projectsOpen ? 0.2 : 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          (<span>projects</span>)
        </motion.p>
      </motion.div>

      {/* PROJECT LIST */}
      <motion.div
        className="project-list"
        initial="closed"
        animate={projectsOpen ? "open" : "closed"}
        variants={{
          closed: {},
          open: {
            transition: {
              staggerChildren: isMobile ? 0.12 : 0.14,
              delayChildren: 0.2,
            },
          },
        }}
      >
      {projects.map((project) => {
        const isFaded = hoveredProject !== null && hoveredProject !== project;

        return (
          <motion.div
            className="project-item"
            key={project.name}
            variants={{
              closed: { opacity: 0, y: 8 },
              open: { opacity: 1, y: 0 },
            }}
            transition={{
              duration: 0.6,
              ease: "easeOut",
            }}
            onMouseMove={(event) => {
              if (!isMobile) {
                setCursorPosition({
                  x: event.clientX,
                  y: event.clientY,
                });
              }
            }}
            onMouseEnter={() => {
              if (!isMobile) {
                setHoveredProject(project);
              }
            }}
            onMouseLeave={() => setHoveredProject(null)}
          >
            <motion.span
              animate={{ opacity: isFaded ? 0.2 : 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {project.name}
            </motion.span>
          </motion.div>
        );
      })}

      </motion.div>


      {/* CUSTOM CURSOR */}
      <AnimatePresence>
        {!isMobile && projectsOpen && hoveredProject && (
          <motion.div
            className="project-cursor"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              left: cursorPosition.x ,
              top: cursorPosition.y ,
            }}
            transition={{ opacity: { duration: 0.4, ease: "easeInOut" } }}
          >
            {hoveredProject.description}
          </motion.div>
        )}
      </AnimatePresence>


      {/* INTRODUCTION */}
      <motion.div
        className="intro-link"
        initial={{ opacity: 0 }}
        animate={{ opacity: showContent ? 1 : 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <p>
          <span>(+)</span> hi, i'm a web designer and developer <span>(...)</span>
        </p>
      </motion.div>

      {/* CONSTRUCTION MESSAGE */}
      <motion.div
        className="construction"
        initial={{ opacity: 0 }}
        animate={{ opacity: showContent ? 1 : 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <p>iteration 1.<span>?</span></p>
      </motion.div>

    </main>
  );
}