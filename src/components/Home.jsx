import { useState, useEffect, useMemo } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useNavigate, useOutlet } from "react-router-dom";
import { getProjects } from "./projects.js";
import "./home.css";
import "./site-nav.css";

const projects = [
  { id: "agendive", name: "agendive", description: "(app & website project)" },
  { id: "litteria", name: "litteria", description: "(e-commerce website)" },
  { id: "oh-word", name: "oh word", description: "(web application)" },
  { id: "la-coeh", name: "la coeh", description: "(website & identity)" },
  { id: "attuned", name: "attuned", description: "(visual identity & website)" },
  { id: "napolinapoli", name: "napolinapoli", description: "(digital project)" },
];

// Mobile tiles per row.
// false = option 1: rows of 3 on load, tiles 4-6 grow in when projects open.
// true  = option 2: rows of 6 from the start, they only re-arrange.
const ROWS_OF_SIX_FROM_START = true;

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

// Closed state: staircase shape. x < 0 lets a block bleed off the left edge.
// Blocks 9-13 wait off-screen on the right and slide in when projects open.
const mobileImagePositions = [
  { x: 85.2, y: 19 },
  { x: 51.1, y: 20.4 },
  { x: 18.3, y: 24.2 },
  { x: -8.4, y: 33.3 },
  { x: -23.2, y: 47.2 },
  { x: -17.6, y: 61.7 },
  { x: 8.7, y: 71.5 },
  { x: 39.4, y: 77.9 },
  { x: 72.3, y: 81.6 },
  { x: 120.4, y: 86 },
  { x: 120.4, y: 92.6 },
  { x: 120.4, y: 100.2 },
  { x: 120.4, y: 110.2 },
  { x: 120.4, y: 113.2 },
];

// Projects open: one position per block (393 x 852 frame).
// x: 120.4 or y > 100 parks a block off-screen.
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

// Follows the details page scroll: slides to the right with its own up/down drift
function MobileBlock({ progress, scatter, children, ...motionProps }) {
  const x = useTransform(progress, [0, 1], [0, scatter.dx]);
  const y = useTransform(progress, [0, 1], [0, scatter.dy]);

  return (
    <motion.div {...motionProps} style={{ x, y, willChange: "transform" }}>
      {children}
    </motion.div>
  );
}

export default function Home() {
  const [showContent, setShowContent] = useState(false);
  const [activeTile, setActiveTile] = useState(null);
  const [hoveredProject, setHoveredProject] = useState(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const navigate = useNavigate();
  const projectsData = getProjects(isMobile);

  // the child route (project details) renders through this outlet
  const outlet = useOutlet({ isMobile, projects: projectsData });
  const isDetail = Boolean(outlet);
  const isMobileDetail = isMobile && isDetail;

  // landing directly on a project page keeps the tiles in their "projects open" layout
  const [projectsOpen, setProjectsOpen] = useState(isDetail);

  // mobile: the tiles follow the scroll of the details page and slide out to the right
  const scrollY = useMotionValue(0);
  const smoothScroll = useSpring(scrollY, { stiffness: 120, damping: 26, mass: 0.4 });
  const progress = useTransform(smoothScroll, [0, 360], [0, 1]);

  // random but stable: how far right each block goes and how much it drifts up or down
  const scatter = useMemo(
    () =>
      mobileImagePositions.map(() => ({
        dx: window.innerWidth * (1.3 + Math.random() * 0.7),
        dy: (Math.random() < 0.5 ? -1 : 1) * (40 + Math.random() * 140),
      })),
    []
  );

  // keeps the tiles above the details until the details have finished fading out
  const [detailMounted, setDetailMounted] = useState(isDetail);

  useEffect(() => {
    if (isDetail) setDetailMounted(true);
  }, [isDetail]);

  useEffect(() => {
    if (!isDetail) scrollY.set(0);
  }, [isDetail, scrollY]);

  const handleProjectClick = (project) => {
    if (!projectsData.some((p) => p.id === project.id)) return;
    setHoveredProject(null);
    navigate(`/project/${project.id}`);
  };

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
          y: isMobileDetail ? -100 : 0,
          fontSize: "16px",
        }}
        transition={{
          opacity: {
            duration: 0.8,
            ease: "easeOut",
          },
          top: {
            duration: 1.2,
            delay: showContent ? 0 : 2,
            ease: [0.22, 1, 0.36, 1],
          },
          left: {
            duration: 1.2,
            delay: showContent ? 0 : 2,
            ease: [0.22, 1, 0.36, 1],
          },
          x: {
            duration: 1.2,
            delay: showContent ? 0 : 2,
            ease: [0.22, 1, 0.36, 1],
          },
          y: {
            duration: 1.2,
            delay: showContent ? 0 : 2,
            ease: [0.22, 1, 0.36, 1],
          },
          fontSize: {
            duration: 1.2,
            delay: showContent ? 0 : 2,
            ease: [0.22, 1, 0.36, 1],
          },
        }}
        onAnimationComplete={() => setShowContent(true)}
      >
        <h1>Charlotte Smit</h1>
      </motion.div>

      {/* ABOUT / CONTACT - desktop only */}
      <motion.nav
        className="site-nav"
        initial={{ opacity: 0 }}
        animate={{ opacity: showContent ? 1 : 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <button type="button">about</button>
        <button type="button">contact</button>
      </motion.nav>

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
          y: isMobileDetail ? -150 : 0,
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
          y: isMobileDetail ? 120 : 0,
        }}
        transition={{
          opacity: { duration: 0.8, ease: "easeOut" },
          y: { duration: 1, ease: moveEase },
        }}
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
      <motion.div
        className="mobile-image-composition"
        style={{
          zIndex: detailMounted || isDetail ? 30 : 2,
        }}
      >
        {mobileImagePositions.map((closedPosition, index) => {
          const openPosition = mobileImagePositionsOpen[index];
          const position =
            projectsOpen && openPosition ? openPosition : closedPosition;
          const isVisible = showContent && !(projectsOpen && !openPosition);
          const showExtraTiles = ROWS_OF_SIX_FROM_START || projectsOpen;

          return (
            <MobileBlock
              progress={progress}
              scatter={scatter[index]}
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
            </MobileBlock>
          );
        })}
      </motion.div>

      {/* PROJECTS TRIGGER */}
      <motion.div
        className="projects-link"
        style={{ pointerEvents: isDetail ? "none" : "auto" }}
        initial={{ opacity: 0 }}
        animate={{
          opacity: showContent && !isDetail ? 1 : 0,
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
        style={{ pointerEvents: isDetail ? "none" : "auto" }}
        initial="closed"
        animate={projectsOpen && !isDetail ? "open" : "closed"}
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
              closed: { opacity: 0, y: 8, filter: "blur(10px)" },
              open: { opacity: 1, y: 0, filter: "blur(0px)" },
            }}
            transition={{
              duration: 0.9,
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
            onClick={() => handleProjectClick(project)}
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
        animate={{
          opacity: showContent ? 1 : 0,
          y: isMobileDetail ? 90 : 0,
        }}
        transition={{
          opacity: { duration: 0.8, ease: "easeOut" },
          y: { duration: 1, ease: moveEase },
        }}
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

      {/* PROJECT DETAILS (child route) */}
      <AnimatePresence onExitComplete={() => setDetailMounted(false)}>
        {isDetail && (
          <motion.div
            key="details"
            className="details-layer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            onScroll={(event) => scrollY.set(event.currentTarget.scrollTop)}
          >
            {outlet}
          </motion.div>
        )}
      </AnimatePresence>

      {/* CLOSE BUTTON - highest z-index, above the tiles */}
      <AnimatePresence>
        {isDetail && (
          <motion.button
            key="close"
            type="button"
            className="detail-close"
            onClick={() => navigate("/")}
            initial={{ opacity: 0, filter: "blur(8px)" }}
            animate={{
              opacity: 1,
              filter: "blur(0px)",
              transition: { duration: 0.8, delay: 0.7, ease: "easeOut" },
            }}
            exit={{
              opacity: 0,
              filter: "blur(8px)",
              transition: { duration: 0.3 },
            }}
          >
            close
          </motion.button>
        )}
      </AnimatePresence>

    </main>
  );
}