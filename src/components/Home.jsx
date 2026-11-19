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

// Mobile tiles per row.
// false = option 1: rows of 3 on load, tiles 4-6 grow in when projects open.
// true  = option 2: rows of 6 from the start, they only re-arrange.
const ROWS_OF_SIX_FROM_START = false;

const TILES_CLOSED = 3;
const TILES_OPEN = 6;

// Must match `.mobile-image-block .image-tile` width/height in home.css
const MOBILE_TILE_SIZE = 21;

// Tiles alternate: tile1, tile2, tile1, tile2, ...
// BASE_URL already ends with a slash (e.g. "/repo-name/" on GitHub Pages)
const MOBILE_TILE_IMAGES = [
  `${import.meta.env.BASE_URL}images/tile1.png`,
  `${import.meta.env.BASE_URL}images/tile2.png`,
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

// Projects open: 11 blocks, positions taken from the project page screenshot (393 x 852 frame).
// The remaining blocks (index 11+) fade out while the list is open.
const mobileImagePositionsOpen = [
  { x: 40.8, y: 0 },
  { x: 70.6, y: 7.2 },
  { x: 86, y: 25 },
  { x: 56.5, y: 30 },
  { x: 40.7, y: 40.4 },
  { x: 120.4, y: 48.2 },
  { x: 60.3, y: 54.5 },
  { x: 87.8, y: 61.9 },
  { x: 92.9, y: 82.5 },
  { x: 62.6, y: 86 },
  { x: 36.9, y: 92.6 },
   { x: 120.4, y: 100.2 },
    { x: 120.4, y: 110.2 },
     { x: 120.4, y: 113.2 },
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
          const openPosition = mobileImagePositionsOpen[index];
          const position =
            projectsOpen && openPosition ? openPosition : closedPosition;
          const isVisible = showContent && !(projectsOpen && !openPosition);
          const showExtraTiles = ROWS_OF_SIX_FROM_START || projectsOpen;

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
              {Array.from({ length: TILES_OPEN }, (_, tileIndex) => {
                const isExtra = tileIndex >= TILES_CLOSED;

                return (
                  <motion.div
                    className="image-tile"
                    key={tileIndex}
                    initial={false}
                    animate={
                      isExtra
                        ? {
                            width: showExtraTiles ? MOBILE_TILE_SIZE : 0,
                            opacity: showExtraTiles ? 1 : 0,
                          }
                        : undefined
                    }
                    style={{
                      backgroundImage: `url("${
                        MOBILE_TILE_IMAGES[tileIndex % MOBILE_TILE_IMAGES.length]
                      }")`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      // framer drives opacity on the extra tiles, so skip the CSS opacity transition
                      ...(isExtra ? { transition: "none" } : {}),
                    }}
                    transition={{
                      duration: 0.8,
                      ease: moveEase,
                      delay:
                        isExtra && projectsOpen
                          ? (tileIndex - TILES_CLOSED) * 0.1
                          : 0,
                    }}
                  />
                );
              })}
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