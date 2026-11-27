import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Navigate, useOutletContext, useParams } from "react-router-dom";
import { asset } from "./projects";
import lqip from "./lqip.json";
import "./project-details.css";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.7 } },
};

const item = {
  hidden: { opacity: 0, filter: "blur(12px)" },
  show: {
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: "easeOut" },
  },
};

const gradientColumn = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const splitParagraphs = (text) =>
  (text || "")
    .split("\n")
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

function BlurImage({ src, alt, priority }) {
  const placeholder = lqip[src];
  const imgRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [ratio, setRatio] = useState(
    placeholder ? `${placeholder.w} / ${placeholder.h}` : "3 / 2"
  );

  // covers images that are already cached before React attaches onLoad
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0) {
      setRatio(`${img.naturalWidth} / ${img.naturalHeight}`);
      setLoaded(true);
    }
  }, []);

  return (
    <div
      className={`blur-image ${loaded ? "is-loaded" : ""}`}
      style={{ aspectRatio: ratio }}
    >
      {placeholder && (
        <img
          className="blur-image__placeholder"
          src={placeholder.src}
          alt=""
          aria-hidden="true"
        />
      )}
      <img
        ref={imgRef}
        className="blur-image__full"
        src={asset(src)}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onError={(event) =>
          console.warn(`Image not found: ${event.currentTarget.src}`)
        }
        onLoad={(event) => {
          const { naturalWidth, naturalHeight } = event.currentTarget;
          setRatio(`${naturalWidth} / ${naturalHeight}`);
          setLoaded(true);
        }}
      />
    </div>
  );
}

function DesktopMedia({ project }) {
  const scrollRef = useRef(null);

  const media = project.media || [];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [project.id]);

  return (
    <div
      className="detail-right"
      ref={scrollRef}
    >
      <div className="detail-images">
        {media.map((element, index) => (
          <div
            className={`detail-media-slot ${
              index === 0
                ? "detail-media-slot--first"
                : ""
            }`}
            key={`${project.id}-${index}`}
          >
            <figure
              className="detail-media"
              style={{
                width: element.width || "100%",
                marginLeft:
                  element.right != null
                    ? "auto"
                    : element.left || "0",

                marginRight: element.right,
                marginTop: element.marginTop,
              }}
            >
              {element.type === "video" && (
                <video
                  src={asset(element.src)}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                />
              )}

              {element.type === "image" && (
                <img
                  src={asset(element.src)}
                  alt={
                    element.alt ||
                    `${project.title}, image ${index + 1}`
                  }
                  loading="lazy"
                  decoding="async"
                />
              )}

              {element.caption && (
                <figcaption className="detail-caption">
                  ({element.caption})
                </figcaption>
              )}
            </figure>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectMetadata({ project }) {
  const categories = (project.categories || "")
    .split(",")
    .map((category) => category.trim())
    .filter(Boolean);

  const technologies = (
    Array.isArray(project.technologies)
      ? project.technologies
      : (project.technologies || "").split(",")
  )
    .map((technology) => technology.trim())
    .filter(Boolean);

  return (
    <div className="detail-project-metadata">

      <div className="detail-categories">
        {project.id !== "litteria" && <span className="detail-status-label">ongoing</span>}
        {categories.map((category) => (
          <span
            className="detail-category-label"
            key={category}
          >
            {category}
          </span>
        ))}
      </div>

      {technologies.length > 0 && (
        <div className="detail-technologies">
          {/* <span className="detail-technologies-heading">
            technologies used
          </span> */}

          <div className="detail-technologies-list">
            {technologies.map((technology) => (
              <span
                className="detail-technology-label"
                key={technology}
              >
                {technology}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ProjectNavigation({
  project,
  projects,
  transitionTo,
}) {
  const sortedProjects = [...projects].sort(
    (a, b) => a.title.localeCompare(b.title)
  );

  const currentIndex = sortedProjects.findIndex(
    (p) => p.id === project.id
  );

  const total = sortedProjects.length;

  if (total < 2) return null;

  const previousProject =
    sortedProjects[
      (currentIndex - 1 + total) % total
    ];

  const nextProject =
    sortedProjects[
      (currentIndex + 1) % total
    ];

return (
  <nav
    className="detail-project-navigation"
    aria-label="Project navigation"
  >
    <button
      type="button"
      onClick={() =>
        transitionTo(`/project/${previousProject.id}`)
      }
    >
      ← {previousProject.title.toLowerCase()}
    </button>

    <span className="detail-navigation-index">
      {String(currentIndex + 1).padStart(2, "0")}
      {" / "}
      {String(total).padStart(2, "0")}
    </span>

    <button
      type="button"
      onClick={() =>
        transitionTo(`/project/${nextProject.id}`)
      }
    >
      {nextProject.title.toLowerCase()} →
    </button>
  </nav>
);
}

export default function ProjectDetails() {
  const { id } = useParams();
  const {
  isMobile,
  projects,
  transitionTo,
} = useOutletContext();

  const project = projects.find((p) => p.id === id);



  if (!project) {
    return <Navigate to="/" replace />;
  }

  const sections = [1, 2, 3, 4, 5]
    .map((n) => ({
      n,
      paragraphs: splitParagraphs(project[`description${n}`]),
      image: project[`show${n}`],
      caption: project[`caption${n}`],
    }))
    .filter((section) => section.paragraphs.length > 0 || section.image);

  const taglines = [project.tagline1, project.tagline2, project.tagline3].filter(Boolean);

  const renderFigure = (section, priority) => (
    <motion.figure className="detail-figure" variants={item} key={section.n}>
      <BlurImage
        src={section.image}
        alt={`${project.title}, screenshot ${section.n}`}
        priority={priority}
      />
      {section.caption && (
        <figcaption className="detail-caption">({section.caption})</figcaption>
      )}
    </motion.figure>
  );

  const header = (
    <>
      <motion.h1
  className="detail-title"
  variants={item}
>

    <span>{project.title}</span>

</motion.h1>

      {!isMobile && project.summary && (
        <motion.p className="detail-summary" variants={item}>
          ({project.number}) {project.summary}
        </motion.p>
      )}

      {isMobile ? (
  <motion.div
    className="detail-meta"
    variants={item}
  >
    <p>({project.technologies})</p>
  </motion.div>
) : (
  <ProjectMetadata project={project} />
)}

      {/* {taglines.length > 0 && (
        <motion.ul className="detail-taglines" variants={item}>
          {taglines.map((tagline) => (
            <li key={tagline}>{tagline}</li>
          ))}
        </motion.ul>
      )} */}

      {project.link && (
  <motion.a
    className="detail-preview-link"
    href={project.link}
    target="_blank"
    rel="noreferrer"
    variants={item}
  >
    (preview link)
  </motion.a>
)}
    </>
  );

  /* MOBILE: one scrolling page, each image followed by its text */
  if (isMobile) {
    return (
      <motion.div
        className="detail-page"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {header}

        <div className="detail-body">
          {sections.map((section, index) => (
            <section
              className={`detail-section ${index === 0 ? "detail-section--first" : ""}`}
              key={section.n}
            >
              {section.image && renderFigure(section, index === 0)}

              {section.paragraphs.length > 0 && (
                <motion.div className="detail-text" variants={item}>
                  {section.paragraphs.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </motion.div>
              )}
            </section>
          ))}
        </div>
      </motion.div>
    );
  }

  /* DESKTOP: fixed text on the left, scrolling images on the right */
/* DESKTOP */

const textSections = sections.filter(
  (section) => section.paragraphs.length > 0
);

return (
  <div
    className="detail-desktop"
    key={project.id}
  >
    {/* LEFT COLUMN */}

    <div className="detail-left">

      {/* <div className="detail-gradient-column">
        {[1, 2, 3, 4].map((square) => (
          <div
            className={`gradient-square square-${square}`}
            key={square}
          />
        ))}
      </div> */}

      {header}

      {/* DESCRIPTION */}

      <div className="detail-body">
        {textSections.map((section, index) => (
          <section className="detail-description-section" key={section.n}>
            <div className="detail-section-label">
              {index + 1}
            </div>
            <div className="detail-text">
              {section.paragraphs.map((paragraph, i) => <p key={i}>{paragraph}</p>)}
            </div>
          </section>
        ))}
      </div>

      {/* PREVIOUS / NEXT */}

      <ProjectNavigation
        project={project}
        projects={projects}
        transitionTo={transitionTo}
      />

    </div>

    {/* RIGHT COLUMN */}

    <DesktopMedia
      project={project}
      key={project.id}
    />
  </div>
);

}