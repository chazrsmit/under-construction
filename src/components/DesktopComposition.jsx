import {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  Fragment,
} from "react";

import {
  motion,
  useMotionValue,
  useAnimationFrame,
} from "framer-motion";

import {
  compositionProjects,
  compositionSettings,
} from "./compositionData";

import "./desktop-composition.css";

const settings = compositionSettings;

const imagePath = (filename) =>
  `${import.meta.env.BASE_URL}images/${filename}`;

const clamp = (value, min, max) =>
  Math.min(Math.max(value, min), max);

/* --------------------------------
   INDIVIDUAL PROJECT IMAGE
-------------------------------- */

function ProjectImage({
  project,
  dimensions,
  isHovered,
  isAnimating,
  bringToFront,
  createTrailLayer,
  zIndex,
  setHoveredImage,
  onProjectClick,
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const initializedRef = useRef(false);
  const activeRef = useRef(false);

  const trailLayerRef = useRef(null);

  const shouldMove = isHovered || isAnimating;

  const lastStamp = useRef({
    x: 0,
    y: 0,
  });

  const direction = useRef(
    Math.random() * Math.PI * 2
  );

  const targetDirection = useRef(direction.current);
  const directionTimer = useRef(0);

  /* --------------------------------
     IMAGE DIMENSIONS
  -------------------------------- */

  const imageWidth = Math.round(
    dimensions.width * (settings.imageWidth / 100)
  );

  const imageHeight = Math.round(
    imageWidth / settings.imageAspectRatio
  );

  const maxX = Math.max(
    0,
    dimensions.width - imageWidth
  );

  const maxY = Math.max(
    0,
    dimensions.height - imageHeight
  );

  /* --------------------------------
     INITIAL POSITION
  -------------------------------- */

  useLayoutEffect(() => {
    if (!dimensions.width || !dimensions.height) return;

    if (!initializedRef.current) {
      const initialX = clamp(
        dimensions.width * (project.position.x / 100),
        0,
        maxX
      );

      const initialY = clamp(
        dimensions.height * (project.position.y / 100),
        0,
        maxY
      );

      x.set(Math.round(initialX));
      y.set(Math.round(initialY));

      initializedRef.current = true;

    } else {
      x.set(clamp(x.get(), 0, maxX));
      y.set(clamp(y.get(), 0, maxY));
    }

    lastStamp.current = {
      x: x.get(),
      y: y.get(),
    };

  }, [
    dimensions.width,
    dimensions.height,
    maxX,
    maxY,
  ]);

  /* --------------------------------
     CREATE IMAGE TRACE
  -------------------------------- */

  function stampAt(stampX, stampY) {
    const layer = trailLayerRef.current;

    if (!layer) return;

    const trace = document.createElement("img");

    trace.src = imagePath(project.image);
    trace.className = "composition-trace";
    trace.alt = "";
    trace.draggable = false;

    trace.style.left = `${Math.round(stampX)}px`;
    trace.style.top = `${Math.round(stampY)}px`;

    trace.style.width = `${imageWidth}px`;
    trace.style.height = `${imageHeight}px`;

    layer.appendChild(trace);
  }

  /* --------------------------------
     START TRAIL
  -------------------------------- */

  function startTrail() {
    const nextZIndex = bringToFront(project.id);

    trailLayerRef.current = createTrailLayer(
      project.id,
      nextZIndex - 1
    );

    lastStamp.current = {
      x: x.get(),
      y: y.get(),
    };

    stampAt(x.get(), y.get());
  }

  /* --------------------------------
     UPDATE TRAIL
  -------------------------------- */

  function updateTrail() {
    if (!initializedRef.current) return;
    if (!trailLayerRef.current) return;

    const currentX = x.get();
    const currentY = y.get();

    const previousX = lastStamp.current.x;
    const previousY = lastStamp.current.y;

    const dx = currentX - previousX;
    const dy = currentY - previousY;

    const distance = Math.hypot(dx, dy);

    const spacing = Math.max(
      1,
      settings.trailSpacing || 8
    );

    if (distance < spacing) return;

    const steps = Math.floor(distance / spacing);

    for (let i = 1; i <= steps; i++) {
      const ratio = (i * spacing) / distance;

      stampAt(
        previousX + dx * ratio,
        previousY + dy * ratio
      );
    }

    const lastRatio = (steps * spacing) / distance;

    lastStamp.current = {
      x: previousX + dx * lastRatio,
      y: previousY + dy * lastRatio,
    };
  }

  /* --------------------------------
     STOP TRAIL
  -------------------------------- */

  function stopTrail() {
    updateTrail();

    stampAt(x.get(), y.get());

    trailLayerRef.current = null;
  }

  /* --------------------------------
     IMAGE ANIMATION
  -------------------------------- */

  useEffect(() => {
    if (!initializedRef.current) return;

    if (shouldMove && !activeRef.current) {
      activeRef.current = true;

      startTrail();

    } else if (!shouldMove && activeRef.current) {
      activeRef.current = false;

      stopTrail();
    }

  }, [shouldMove]);

  /* --------------------------------
     AUTONOMOUS MOVEMENT
  -------------------------------- */

  useAnimationFrame((time, delta) => {
    if (!initializedRef.current) return;

    if (!shouldMove) return;

    const deltaTime = Math.min(delta / 1000, 0.05);

    directionTimer.current += delta;

    if (
      directionTimer.current >=
      settings.directionChangeInterval
    ) {
      targetDirection.current +=
        (Math.random() - 0.5) * Math.PI * 1.5;

      directionTimer.current = 0;
    }

    const difference = Math.atan2(
      Math.sin(
        targetDirection.current - direction.current
      ),
      Math.cos(
        targetDirection.current - direction.current
      )
    );

    direction.current +=
      difference *
      (
        1 -
        Math.exp(
          -settings.directionSmoothness * deltaTime
        )
      );

    const speed = settings.movementSpeed;

    let nextX =
      x.get() +
      Math.cos(direction.current) *
        speed *
        deltaTime;

    let nextY =
      y.get() +
      Math.sin(direction.current) *
        speed *
        deltaTime;

    if (nextX < 0 || nextX > maxX) {
      direction.current =
        Math.PI - direction.current;

      targetDirection.current = direction.current;
    }

    if (nextY < 0 || nextY > maxY) {
      direction.current = -direction.current;

      targetDirection.current = direction.current;
    }

    x.set(clamp(nextX, 0, maxX));
    y.set(clamp(nextY, 0, maxY));

    updateTrail();
  });

  /* --------------------------------
     IMAGE HOVER
  -------------------------------- */

  function handleImageEnter() {
    setHoveredImage(project.id);
  }

  function handleImageLeave() {
    setHoveredImage((previous) =>
      previous === project.id ? null : previous
    );
  }

  /* --------------------------------
     IMAGE CLICK
  -------------------------------- */

  function handleImageClick() {
    if (shouldMove) return;

    onProjectClick(project);
  }

  /* --------------------------------
     RENDER IMAGE
  -------------------------------- */

  return (
    <motion.div
      className="composition-image-wrapper"

      data-mockup-cursor={
        !shouldMove && project.mockup
          ? imagePath(project.mockup)
          : undefined
      }

      data-mockup-width={
        project.mockupWidth || 150
      }

      data-link-cursor={
        !shouldMove ? "" : undefined
      }

      onMouseEnter={handleImageEnter}
      onMouseLeave={handleImageLeave}

      onClick={handleImageClick}

      role="link"
      aria-label={`View ${project.name}`}
      aria-disabled={shouldMove}
      tabIndex={shouldMove ? -1 : 0}

      onKeyDown={(event) => {
        if (event.key === "Enter") {
          handleImageClick();
        }
      }}

      style={{
        x,
        y,
        width: imageWidth,
        height: imageHeight,
        zIndex,
      }}
    >

      <motion.img
        className="composition-image"
        src={imagePath(project.image)}
        alt={project.name}
        draggable={false}
        loading="eager"
        initial="rest"
        animate="rest"
        transition={{
          duration: 0.4,
          ease: [0.22, 1, 0.36, 1],
        }}
      />

      {/* Invisible hover target */}

      <motion.div
        className="composition-hover-target"
      />

    </motion.div>
  );
}

/* --------------------------------
   COMPOSITION CONTENT
-------------------------------- */

function CompositionContent({
  showContent,
  onProjectClick,
}) {
  const stageRef = useRef(null);

  const highestZIndex = useRef(
    Math.max(
      20,
      ...compositionProjects.map(
        (project) => Number(project.zIndex) || 2
      )
    )
  );

  /* --------------------------------
     HOVER STATES
  -------------------------------- */

  const [hoveredProject, setHoveredProject] =
    useState(null);

  const [hoveredImage, setHoveredImage] =
    useState(null);

  const highlightedProject =
    hoveredProject ?? hoveredImage;

  const [isAnimating, setIsAnimating] =
    useState(false);

  const [imageResetKey, setImageResetKey] =
    useState(0);

  /* --------------------------------
     DIMENSIONS AND Z-INDEX STATES
  -------------------------------- */

  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });

  const [zIndexes, setZIndexes] = useState(() =>
    Object.fromEntries(
      compositionProjects.map((project) => [
        project.id,
        Number(project.zIndex) || 2,
      ])
    )
  );

  /* --------------------------------
     PRELOAD MOCKUPS
  -------------------------------- */

  useEffect(() => {
    compositionProjects.forEach((project) => {
      if (!project.mockup) return;

      const image = new Image();

      image.src = imagePath(project.mockup);
    });
  }, []);

  /* --------------------------------
     VIEWPORT DIMENSIONS
  -------------------------------- */

  useLayoutEffect(() => {
    const stage = stageRef.current;

    if (!stage) return;

    function updateDimensions() {
      setDimensions({
        width: stage.clientWidth,
        height: stage.clientHeight,
      });
    }

    updateDimensions();

    const observer = new ResizeObserver(
      updateDimensions
    );

    observer.observe(stage);

    return () => observer.disconnect();

  }, []);

  /* --------------------------------
     STACKING ORDER
  -------------------------------- */

  function bringToFront(projectId) {
    highestZIndex.current += 2;

    const nextZIndex = highestZIndex.current;

    setZIndexes((previous) => ({
      ...previous,
      [projectId]: nextZIndex,
    }));

    return nextZIndex;
  }

  /* --------------------------------
     CREATE TRAIL LAYER
  -------------------------------- */

  function createTrailLayer(projectId, zIndex) {
    const layer = document.createElement("div");

    layer.className = "composition-trail-layer";
    layer.dataset.project = projectId;
    layer.style.zIndex = zIndex;

    stageRef.current
      .querySelector(".composition-trails")
      .appendChild(layer);

    return layer;
  }

  /* --------------------------------
     STATIC NUMBER DIMENSIONS
  -------------------------------- */

  const imageWidth = Math.round(
    dimensions.width * (settings.imageWidth / 100)
  );

  const imageHeight = Math.round(
    imageWidth / settings.imageAspectRatio
  );

  const projectRows = [
    compositionProjects.slice(0, 4),
    compositionProjects.slice(4),
  ];

  /* --------------------------------
     ANIMATION CONTROLS
  -------------------------------- */

  function toggleAnimation() {
    setIsAnimating((previous) => !previous);
  }

  function clearComposition() {
    setIsAnimating(false);
    setHoveredProject(null);
    setHoveredImage(null);

    highestZIndex.current = Math.max(
      20,
      ...compositionProjects.map(
        (project) => Number(project.zIndex) || 2
      )
    );

    setZIndexes(
      Object.fromEntries(
        compositionProjects.map((project) => [
          project.id,
          Number(project.zIndex) || 2,
        ])
      )
    );

    setImageResetKey((previous) => previous + 1);
  }

  /* --------------------------------
     RENDER
  -------------------------------- */

  return (
    <>

      <motion.div
        ref={stageRef}
        className="desktop-composition"

        initial={{ opacity: 0 }}

        animate={{
          opacity: showContent ? 1 : 0,
        }}

        transition={{
          duration: 0.8,
          ease: "easeOut",
        }}

        style={{
          visibility: showContent
            ? "visible"
            : "hidden",
        }}
      >

        {/* --------------------------------
            BACKGROUND
        -------------------------------- */}

        <img
          className="composition-background"
          src={imagePath("background-element.svg")}
          alt=""
          draggable={false}
        />

        {/* --------------------------------
            STATIC NUMBERS
        -------------------------------- */}

        <div
          className="composition-static-numbers"
          aria-hidden="true"
        >
          {dimensions.width > 0 &&
            compositionProjects.map((project) => {

              const initialX = clamp(
                dimensions.width *
                  (project.position.x / 100),
                0,
                Math.max(
                  0,
                  dimensions.width - imageWidth
                )
              );

              const initialY = clamp(
                dimensions.height *
                  (project.position.y / 100),
                0,
                Math.max(
                  0,
                  dimensions.height - imageHeight
                )
              );

              return (
                <div
                  key={project.id}
                  className="static-number-wrapper"

                  style={{
                    left: Math.round(initialX),
                    top: Math.round(initialY),
                    width: imageWidth,
                    height: imageHeight,
                  }}
                >

                  <span
                    className="composition-image-number"
                    style={project.numberPosition}
                  >
                    ({project.number})
                  </span>

                </div>
              );
            })}
        </div>

        {/* --------------------------------
            RESETTABLE COMPOSITION
        -------------------------------- */}

        <Fragment key={imageResetKey}>

          {/* PERSISTENT TRACES */}

          <div
            className="composition-trails"
            aria-hidden="true"
          />

          {/* PROJECT IMAGES */}

          <div className="composition-images">

            {dimensions.width > 0 &&
              compositionProjects.map((project) => (
                <ProjectImage
                  key={project.id}
                  project={project}
                  dimensions={dimensions}

                  isHovered={
                    hoveredProject === project.id
                  }

                  isAnimating={isAnimating}

                  bringToFront={bringToFront}
                  createTrailLayer={createTrailLayer}

                  zIndex={zIndexes[project.id]}

                  setHoveredImage={setHoveredImage}
                  onProjectClick={onProjectClick}
                />
              ))}

          </div>

        </Fragment>

      </motion.div>

      {/* --------------------------------
          PROJECT LIST
      -------------------------------- */}

      <motion.div
        className="desktop-project-list"

        initial={{ opacity: 0 }}

        animate={{
          opacity: showContent ? 1 : 0,
        }}

        transition={{
          duration: 0.8,
          ease: "easeOut",
        }}

        style={{
          pointerEvents: showContent
            ? "auto"
            : "none",
        }}
      >

        {projectRows.map((row, rowIndex) => (
          <div
            className={`desktop-project-row row-${rowIndex + 1}`}
            key={rowIndex}
          >

            {row.map((project) => {

              const isFaded =
                highlightedProject !== null &&
                highlightedProject !== project.id;

              return (
                <div
                  key={project.id}
                  className="desktop-project-item"

                  onMouseEnter={() =>
                    setHoveredProject(project.id)
                  }

                  onMouseLeave={() =>
                    setHoveredProject(null)
                  }
                >

                  <button
                    type="button"
                    className="desktop-project-button"

                    data-cursor={project.categories}

                    data-cursor-placement={
                      rowIndex === 0
                        ? "top"
                        : "bottom"
                    }

                    onClick={() =>
                      onProjectClick(project)
                    }

                    tabIndex={showContent ? 0 : -1}
                  >

                    <motion.span
                      className="project-button-content"

                      animate={{
                        opacity: isFaded ? 0.2 : 1,
                      }}

                      transition={{
                        duration: 0.45,
                        ease: "easeOut",
                      }}
                    >

                      <span className="project-list-number">
                        ({project.number})
                      </span>

                      <span className="project-list-name">
                        {project.name}
                      </span>

                    </motion.span>

                  </button>

                </div>
              );
            })}

          </div>
        ))}

      </motion.div>

      {/* --------------------------------
          ANIMATION CONTROLS
      -------------------------------- */}

      <motion.div
        className="composition-controls"

        initial={{ opacity: 0 }}

        animate={{
          opacity: showContent ? 1 : 0,
        }}

        transition={{
          duration: 0.8,
          ease: "easeOut",
        }}

        style={{
          pointerEvents: showContent
            ? "auto"
            : "none",
        }}
      >

        <button
          type="button"
          className="composition-control-button"
          onClick={toggleAnimation}
          tabIndex={showContent ? 0 : -1}
          aria-pressed={isAnimating}
        >
          {isAnimating
            ? "stop animation"
            : "start animation"}
        </button>

        <button
          type="button"
          className="composition-control-button"
          onClick={clearComposition}
          tabIndex={showContent ? 0 : -1}
        >
          clear
        </button>

      </motion.div>

    </>
  );
}

/* --------------------------------
   DESKTOP COMPOSITION
-------------------------------- */

export default function DesktopComposition({
  showContent,
  onProjectClick,
}) {
  return (
    <CompositionContent
      showContent={showContent}
      onProjectClick={onProjectClick}
    />
  );
}