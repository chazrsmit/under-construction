import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NavigationOverlay from "./NavigationOverlay";
import "./site-nav.css";

const contactLinks = [
  {
    label: "hello@charlottesmit.com",
    href: "mailto:hello@charlottesmit.com",
  },
  {
    label: "instagram.com/char__smit",
    href: "https://instagram.com/char__smit",
  },
  {
    label: "github.com/chazrsmit",
    href: "https://github.com/chazrsmit",
  },
];

const contactContainerVariants = {
  hidden: {
    transition: {
      staggerChildren: 0.1,
      staggerDirection: -1,
    },
  },

  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.05,
    },
  },
};

const contactLinkVariants = {
  hidden: {
    opacity: 0,
    y: -8,
    filter: "blur(5px)",

    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },

  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",

    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function SiteNavigation({showContent}) {
  const [activeOverlay, setActiveOverlay] = useState(null);

  const [contactOpen, setContactOpen] = useState(false);

  function openOverlay(section) {
    setContactOpen(false);
    setActiveOverlay(section);
  }

  function toggleContact() {
    setContactOpen((previous) => !previous);
  }

  return (
    <>
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
  style={{
    pointerEvents: showContent ? "auto" : "none",
    visibility: showContent ? "visible" : "hidden",
  }}
  inert={!showContent}
>

        {/* ABOUT */}

        <div className="site-nav-item">
          <button
            type="button"
            onClick={() => openOverlay("about")}
          >
            about
          </button>
        </div>

        {/* CONTACT */}

        <div className="site-nav-item contact-nav-item">

          <button
            type="button"
            onClick={toggleContact}
            aria-expanded={contactOpen}
          >
            contact
          </button>

          <AnimatePresence>
            {contactOpen && (
              <motion.div
                className="contact-links"
                variants={contactContainerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                {contactLinks.map((link) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    className="contact-link"
                    variants={contactLinkVariants}
                    target={
                      link.href.startsWith("mailto:")
                        ? undefined
                        : "_blank"
                    }
                    rel="noopener noreferrer"
                  >
                    {link.label}
                  </motion.a>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* VISUAL EXPERIMENTS */}

        <div className="site-nav-item">
          <button
            type="button"
            onClick={() =>
              openOverlay("visual-experiments")
            }
          >
            visual experiments
          </button>
        </div>

      </motion.nav>

      {/* FULLSCREEN OVERLAYS */}

      <AnimatePresence>
        {activeOverlay && (
          <NavigationOverlay
            key={activeOverlay}
            section={activeOverlay}
            onClose={() => setActiveOverlay(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}