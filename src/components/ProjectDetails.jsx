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

export default function ProjectDetails() {
  const { id } = useParams();
  const { isMobile, projects } = useOutletContext();

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
      <motion.h1 className="detail-title" variants={item}>
        <img src={asset(project.titleImg)} alt={project.title} />
      </motion.h1>

      <motion.p className="detail-summary" variants={item}>
        {project.summary.trim()}
      </motion.p>

      <motion.div className="detail-meta" variants={item}>
        {/* <p>({project.subtitle})</p> */}
        <p>({project.technologies})</p>
      </motion.div>

      {/* {taglines.length > 0 && (
        <motion.ul className="detail-taglines" variants={item}>
          {taglines.map((tagline) => (
            <li key={tagline}>{tagline}</li>
          ))}
        </motion.ul>
      )} */}

      <motion.a
        className="detail-preview-link"
        href={project.link}
        target="_blank"
        rel="noreferrer"
        variants={item}
      >
        (preview link)
      </motion.a>
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
  const textSections = sections.filter((section) => section.paragraphs.length > 0);
  const imageSections = sections.filter((section) => section.image);

  return (
    <>
      <motion.div
        className="detail-left"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div className="detail-gradient-column" variants={gradientColumn}>
          {[1, 2, 3, 4].map((square) => (
            <motion.div
              className={`gradient-square square-${square}`}
              variants={item}
              key={square}
            />
          ))}
        </motion.div>

        {header}

        <div className="detail-body">
          {textSections.map((section, index) => (
            <motion.div
              className={`detail-text ${index === 0 ? "detail-text--first" : ""}`}
              variants={item}
              key={section.n}
            >
              {section.paragraphs.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="detail-right"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <div className="detail-images">
          {imageSections.map((section, index) => renderFigure(section, index === 0))}
        </div>
      </motion.div>
    </>
  );
}