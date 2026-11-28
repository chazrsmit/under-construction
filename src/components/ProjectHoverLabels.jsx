import { createPortal } from 'react-dom';
import { motion, useReducedMotion } from 'framer-motion';
import './project-hover-labels.css';

// 1 = regular grid; 2 = staggered grid.
const LABEL_COMPOSITION = 1;
const LABEL_DELAY = 0.06;
const LABEL_STAGGER = 0.035;
const LABEL_DURATION = 0.4;

// Coordinates are percentages of viewport width and height.
// Each entry: [x, y, content type].
const compositions = {
  1: [
    [4.4, 7.6, 'name'], [31.25, 7.6, 'name'], [60, 7.6, 'category'], [86.25, 7.6, 'name'],
    [4.4, 46.3, 'category'], [31.25, 46.3, 'name'], [60, 46.3, 'name'], [86.25, 46.3, 'category'],
    [4.4, 89.7, 'name'], [31.25, 89.7, 'category'], [60, 89.7, 'name'], [86.25, 89.7, 'name'],
  ],
  2: [
    [17, 7.2, 'name'], [45.1, 7.2, 'category'], [73.2, 7.2, 'name'],
    [2.35, 23.9, 'name'], [30.5, 23.9, 'name'], [58.6, 23.9, 'category'], [86.7, 23.9, 'name'],
    [-6.5, 44.6, 'name'], [21.65, 44.6, 'category'], [49.8, 44.6, 'name'], [77.9, 44.6, 'name'],
    [4.45, 67.9, 'name'], [32.6, 67.9, 'category'], [60.7, 67.9, 'name'], [88.8, 67.9, 'name'],
    [20.8, 90.1, 'category'], [48.9, 90.1, 'name'], [77, 90.1, 'name'],
  ],
};

export default function ProjectHoverLabels({ project }) {
  const reducedMotion = useReducedMotion();
  if (!project || typeof document === 'undefined') return null;
  const categories = (Array.isArray(project.categories)
    ? project.categories.join(', ')
    : project.categories || '').toLowerCase();
const name = `${project.number || ''} ${project.title || project.name || ''}`.trim();

  return createPortal(
    <div key={project.id} className="project-hover-labels" aria-hidden="true">
      {compositions[LABEL_COMPOSITION].map(([x, y, type], index) => (
        <motion.div
          key={index}
          className="project-hover-label"
          style={{ left: `${x}%`, top: `${y}%` }}
          initial={{ gridTemplateColumns: reducedMotion ? '1fr' : '0fr' }}
          animate={{ gridTemplateColumns: '1fr' }}
          transition={{ duration: reducedMotion ? 0 : LABEL_DURATION,
            delay: reducedMotion ? 0 : LABEL_DELAY + index * LABEL_STAGGER,
            ease: 'easeInOut' }}
        >
          <span><span>{name}</span></span>
        </motion.div>
      ))}
    </div>, document.body
  );
}
