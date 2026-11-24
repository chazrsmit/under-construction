
import { useState, useEffect, useMemo } from "react";

import AnimatedTitle from "./AnimatedTitle";

import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

import {
  useNavigate,
  useOutlet,
} from "react-router-dom";

import { getProjects } from "./projects.js";

import DesktopComposition from "./DesktopComposition";
import CustomCursor from "./CustomCursor";

import {
  compositionProjects,
} from "./compositionData";

import "./home.css";
import "./site-nav.css";

/* --------------------------------
   PROJECTS
-------------------------------- */

const projects = compositionProjects;

/* --------------------------------
   MOBILE TILE SETTINGS
-------------------------------- */

const ROWS_OF_SIX_FROM_START = true;

const TILES_CLOSED = 3;
const TILES_OPEN = 6;

const MOBILE_TILE_SIZE = 21;

const MOBILE_TILE_IMAGES = [
  `${import.meta.env.BASE_URL}images/tile1.png`,
  `${import.meta.env.BASE_URL}images/tile2.png`,
];

/* --------------------------------
   MOBILE CLOSED COMPOSITION
-------------------------------- */

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

/* --------------------------------
   MOBILE OPEN COMPOSITION
-------------------------------- */

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

/* --------------------------------
   MOBILE BLOCK COMPONENT
-------------------------------- */

function MobileBlock({
  progress,
  scatter,
  children,
  ...motionProps
}) {
  const x = useTransform(
    progress,
    [0, 1],
    [0, scatter.dx]
  );

  const y = useTransform(
    progress,
    [0, 1],
    [0, scatter.dy]
  );

  return (
    <motion.div
      {...motionProps}
      style={{
        x,
        y,
        willChange: "transform",
      }}
    >
      {children}
    </motion.div>
  );
}

/* --------------------------------
   HOME
-------------------------------- */

export default function Home() {
  const [showContent, setShowContent] =
    useState(false);

  const [isMobile, setIsMobile] = useState(
    window.innerWidth < 768
  );

  const navigate = useNavigate();

  const projectsData = getProjects(isMobile);

  /* --------------------------------
     DETAILS ROUTING
  -------------------------------- */

  const outlet = useOutlet({
    isMobile,
    projects: projectsData,
  });

  const isDetail = Boolean(outlet);
  const isMobileDetail = isMobile && isDetail;

  const [projectsOpen, setProjectsOpen] =
    useState(isDetail);

  const [detailMounted, setDetailMounted] =
    useState(isDetail);

  /* --------------------------------
     DETAILS SCROLL
  -------------------------------- */

  const scrollY = useMotionValue(0);

  const smoothScroll = useSpring(scrollY, {
    stiffness: 120,
    damping: 26,
    mass: 0.4,
  });

  const progress = useTransform(
    smoothScroll,
    [0, 360],
    [0, 1]
  );

  const scatter = useMemo(
    () =>
      mobileImagePositions.map(() => ({
        dx:
          window.innerWidth *
          (1.3 + Math.random() * 0.7),

        dy:
          (Math.random() < 0.5 ? -1 : 1) *
          (40 + Math.random() * 140),
      })),
    []
  );

  /* --------------------------------
     EFFECTS
  -------------------------------- */

  useEffect(() => {
    if (isDetail) {
      setDetailMounted(true);
    }
  }, [isDetail]);

  useEffect(() => {
    if (!isDetail) {
      scrollY.set(0);
    }
  }, [isDetail, scrollY]);

  useEffect(() => {
    const checkSize = () =>
      setIsMobile(window.innerWidth < 768);

    checkSize();

    window.addEventListener("resize", checkSize);

    return () =>
      window.removeEventListener(
        "resize",
        checkSize
      );
  }, []);

  /* --------------------------------
     PRELOAD DESKTOP IMAGES
  -------------------------------- */

  useEffect(() => {
    const filenames = [
      "background-element.svg",
      ...compositionProjects.map(
        (project) => project.image
      ),
    ];

    filenames.forEach((filename) => {
      const image = new Image();

      image.src =
        `${import.meta.env.BASE_URL}images/${filename}`;

      image.decode().catch(() => {});
    });
  }, []);

  /* --------------------------------
     PROJECT NAVIGATION
  -------------------------------- */

  const handleProjectClick = (project) => {
    if (
      !projectsData.some(
        (p) => p.id === project.id
      )
    ) {
      return;
    }

    navigate(`/project/${project.id}`);
  };

  return (
    <main
      className={`home
        ${projectsOpen ? "projects-open" : ""}
        ${!isMobile && !isDetail ? "desktop-homepage" : ""}
      `}
    >
      {/* GLOBAL CUSTOM CURSOR */}

      <CustomCursor />
      {/* Animated HTML title */}
      <AnimatedTitle /> 

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
            ease: moveEase,
          },

          left: {
            duration: 1.2,
            delay: showContent ? 0 : 2,
            ease: moveEase,
          },

          x: {
            duration: 1.2,
            delay: showContent ? 0 : 2,
            ease: moveEase,
          },

          y: {
            duration: 1.2,
            delay: showContent ? 0 : 2,
            ease: moveEase,
          },

          fontSize: {
            duration: 1.2,
            delay: showContent ? 0 : 2,
            ease: moveEase,
          },
        }}
        onAnimationComplete={() =>
          setShowContent(true)
        }
      >
        <h1>Charlotte Smit</h1>
      </motion.div>

      {/* NAVIGATION */}

      <motion.nav
        className="site-nav"
        initial={{ opacity: 0 }}
        animate={{
          opacity: showContent ? 1 : 0,
        }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
        }}
      >
        <button type="button">about</button>

        <button type="button">contact</button>

        <button type="button">
          visual experiments
        </button>
      </motion.nav>

      {/* FIRST GRADIENT GROUP */}

      <motion.div
        className="gradient-squares gradient-squares-top"
        initial={{ opacity: 0 }}
        animate={{
          opacity: showContent ? 1 : 0,
          y: isMobileDetail ? -150 : 0,
        }}
        transition={{
          opacity: {
            duration: 0.8,
            ease: "easeOut",
          },

          y: {
            duration: 1,
            ease: moveEase,
          },
        }}
      >
        {[1, 2, 3, 4].map((square) => (
          <div
            className={`gradient-square square-${square}`}
            key={square}
          />
        ))}
      </motion.div>

      {/* SECOND GRADIENT GROUP */}

      <motion.div
        className="gradient-squares gradient-squares-bottom"
        initial={{ opacity: 0 }}
        animate={{
          opacity: showContent ? 1 : 0,
          y: isMobileDetail ? 120 : 0,
        }}
        transition={{
          opacity: {
            duration: 0.8,
            ease: "easeOut",
          },

          y: {
            duration: 1,
            ease: moveEase,
          },
        }}
      >
        {(isMobile
          ? [1, 2, 3, 4]
          : [4, 3, 2, 1]
        ).map((square) => (
          <div
            className={`gradient-square square-${square}`}
            key={square}
          />
        ))}
      </motion.div>

      {/* --------------------------------
          DESKTOP HOMEPAGE
      -------------------------------- */}

      {!isMobile && !isDetail && (
        <DesktopComposition
          showContent={
            showContent && !detailMounted
          }
          onProjectClick={handleProjectClick}
        />
      )}

      {/* --------------------------------
          MOBILE IMAGE COMPOSITION
      -------------------------------- */}

      {isMobile && (
        <motion.div
          className="mobile-image-composition"
          style={{
            zIndex:
              detailMounted || isDetail ? 30 : 2,
          }}
        >
          {mobileImagePositions.map(
            (closedPosition, index) => {
              const openPosition =
                mobileImagePositionsOpen[index];

              const position =
                projectsOpen && openPosition
                  ? openPosition
                  : closedPosition;

              const isVisible =
                showContent &&
                !(projectsOpen && !openPosition);

              const showExtraTiles =
                ROWS_OF_SIX_FROM_START ||
                projectsOpen;

              return (
                <MobileBlock
                  progress={progress}
                  scatter={scatter[index]}
                  className="mobile-image-block"
                  key={index}
                  initial={{
                    opacity: 0,

                    left:
                      `${closedPosition.x}%`,

                    top:
                      `${closedPosition.y}%`,
                  }}
                  animate={{
                    opacity: isVisible ? 1 : 0,

                    left: `${position.x}%`,

                    top: `${position.y}%`,
                  }}
                  transition={{
                    opacity: {
                      duration: 0.5,

                      delay:
                        showContent && !projectsOpen
                          ? index * 0.12
                          : 0,

                      ease: "easeOut",
                    },

                    left: {
                      duration: 1,
                      ease: moveEase,
                    },

                    top: {
                      duration: 1,
                      ease: moveEase,
                    },
                  }}
                >
                  {Array.from(
                    { length: TILES_OPEN },
                    (_, tileIndex) => {
                      const isExtra =
                        tileIndex >= TILES_CLOSED;

                      return (
                        <motion.div
                          className="image-tile"
                          key={tileIndex}
                          initial={false}
                          animate={
                            isExtra
                              ? {
                                  width:
                                    showExtraTiles
                                      ? MOBILE_TILE_SIZE
                                      : 0,

                                  opacity:
                                    showExtraTiles
                                      ? 1
                                      : 0,
                                }
                              : undefined
                          }
                          style={{
                            backgroundImage:
                              `url("${
                                MOBILE_TILE_IMAGES[
                                  tileIndex %
                                  MOBILE_TILE_IMAGES.length
                                ]
                              }")`,

                            backgroundSize: "cover",

                            backgroundPosition:
                              "center",

                            ...(isExtra
                              ? { transition: "none" }
                              : {}),
                          }}
                          transition={{
                            duration: 0.8,
                            ease: moveEase,

                            delay:
                              isExtra && projectsOpen
                                ? (
                                    tileIndex -
                                    TILES_CLOSED
                                  ) * 0.1
                                : 0,
                          }}
                        />
                      );
                    }
                  )}
                </MobileBlock>
              );
            }
          )}
        </motion.div>
      )}

      {/* MOBILE PROJECTS TRIGGER */}

      {isMobile && (
        <motion.div
          className="projects-link"
          style={{
            pointerEvents:
              isDetail ? "none" : "auto",
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity:
              showContent && !isDetail ? 1 : 0,

            left:
              projectsOpen ? "62%" : "50%",
          }}
          transition={{
            opacity: { duration: 0.8 },

            left: {
              duration: 1,
              ease: moveEase,
            },
          }}
          onClick={() =>
            setProjectsOpen((previous) => !previous)
          }
        >
          <motion.p
            className="projects-p"
            animate={{
              opacity: projectsOpen ? 0.2 : 1,
            }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
            }}
          >
            (<span>projects</span>)
          </motion.p>
        </motion.div>
      )}

      {/* MOBILE PROJECT LIST */}

      {isMobile && (
        <motion.div
          className="project-list"
          style={{
            pointerEvents:
              isDetail || !projectsOpen
                ? "none"
                : "auto",
          }}
          initial="closed"
          animate={
            projectsOpen && !isDetail
              ? "open"
              : "closed"
          }
          variants={{
            closed: {},

            open: {
              transition: {
                staggerChildren: 0.12,
                delayChildren: 0.2,
              },
            },
          }}
        >
          {projects.map((project) => (
            <motion.div
              className="project-item"
              key={project.id}
              variants={{
                closed: {
                  opacity: 0,
                  y: 8,
                  filter: "blur(10px)",
                },

                open: {
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                },
              }}
              transition={{
                duration: 0.9,
                ease: "easeOut",
              }}
              onClick={() =>
                handleProjectClick(project)
              }
            >
              {project.name.toLowerCase()}
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* BOTTOM LEFT TEXT */}

      <motion.div
        className="intro-link"
        initial={{ opacity: 0 }}
        animate={{
          opacity: showContent ? 1 : 0,
          y: isMobileDetail ? 90 : 0,
        }}
        transition={{
          opacity: {
            duration: 0.8,
            ease: "easeOut",
          },

          y: {
            duration: 1,
            ease: moveEase,
          },
        }}
      >
        {isMobile ? (
          <p>
            <span>(+)</span>{" "}
            hi, i'm a web designer and developer{" "}
            <span>(...)</span>
          </p>
        ) : (
          <p>website under construction</p>
        )}
      </motion.div>

      {/* BOTTOM RIGHT TEXT */}

      <motion.div
        className="construction"
        initial={{ opacity: 0 }}
        animate={{
          opacity: showContent ? 1 : 0,
        }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
        }}
      >
        <p>website under construction</p>
      </motion.div>

      {/* --------------------------------
          PROJECT DETAILS
      -------------------------------- */}

      <AnimatePresence
        onExitComplete={() =>
          setDetailMounted(false)
        }
      >
        {isDetail && (
          <motion.div
            key="details"
            className="details-layer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.4,
              ease: "easeOut",
            }}
            onScroll={(event) =>
              scrollY.set(
                event.currentTarget.scrollTop
              )
            }
          >
            {outlet}
          </motion.div>
        )}
      </AnimatePresence>

      {/* CLOSE BUTTON */}

      <AnimatePresence>
        {isDetail && (
          <motion.button
            key="close"
            type="button"
            className="detail-close"
            onClick={() => navigate("/")}
            initial={{
              opacity: 0,
              filter: "blur(8px)",
            }}
            animate={{
              opacity: 1,
              filter: "blur(0px)",

              transition: {
                duration: 0.8,
                delay: 0.7,
                ease: "easeOut",
              },
            }}
            exit={{
              opacity: 0,
              filter: "blur(8px)",

              transition: {
                duration: 0.3,
              },
            }}
          >
            close
          </motion.button>
        )}
      </AnimatePresence>
    </main>
  );
}
