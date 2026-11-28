import { motion } from "framer-motion";
import { compositionProjects } from "./compositionData";
import "./project-index.css";

export default function ProjectIndex({
  activeProject,
  hoveredProject,
  onProjectHover,
  showContent,
  onProjectClick,
}) {
  const sortedProjects = [...compositionProjects].sort(
    (a, b) => a.name.localeCompare(b.name)
  );

  return (
    <motion.nav
      className={`project-index ${hoveredProject ? "has-highlight" : ""}`}
      aria-label="Project index"
      initial={{ opacity: 0 }}
      animate={{ opacity: showContent ? 1 : 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{ pointerEvents: showContent ? "auto" : "none" }}
    >
      {sortedProjects.map((project) => (
        <button
          type="button"
          key={project.id}
          className={`project-index-item ${activeProject === project.id || hoveredProject === project.id ? "is-active" : ""}`}
          aria-label={`View ${project.name}`}
          aria-current={activeProject === project.id ? "page" : undefined}
          tabIndex={showContent ? 0 : -1}
          onMouseEnter={() => onProjectHover?.(project.id)}
          onMouseLeave={() => onProjectHover?.(null)}
          onClick={() => activeProject !== project.id && onProjectClick(project)}
        >
          <span className="project-index-image">
            <img
              src={`${import.meta.env.BASE_URL}images/${project.indexImage || project.image}`}
              alt=""
              draggable={false}
            />
          </span>
          <span className="project-index-label">
            <span className="project-index-label-text">({project.number}) {project.name}</span>
          </span>
        </button>
      ))}
    </motion.nav>
  );
}
