// ─── Page Transitions ────────────────────────────────────────────────────────

export const pageVariants = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -8 },
};

export const pageTransition = {
  duration: 0.28,
  ease: "easeOut",
};

export const adminPageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit:    { opacity: 0 },
};

export const adminPageTransition = {
  duration: 0.18,
};

// ─── Stagger Containers ───────────────────────────────────────────────────────

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

export const staggerFast = {
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.02,
    },
  },
};

// ─── Stagger Items ────────────────────────────────────────────────────────────

export const fadeUpItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export const fadeInItem = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.35 } },
};

// ─── Scroll-triggered (whileInView) ──────────────────────────────────────────

export const scrollFadeUp = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, ease: "easeOut" },
};

export const scrollFadeIn = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5 },
};

export const scrollSlideLeft = {
  initial: { opacity: 0, x: -32 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, ease: "easeOut" },
};

export const scrollSlideRight = {
  initial: { opacity: 0, x: 32 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, ease: "easeOut" },
};

// ─── Micro-interactions ───────────────────────────────────────────────────────

export const cardHover = {
  whileHover: { y: -4, transition: { duration: 0.2, ease: "easeOut" } },
  whileTap:   { scale: 0.98 },
};

export const buttonTap = {
  whileTap: { scale: 0.96 },
};

export const modalOverlay = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit:    { opacity: 0 },
  transition: { duration: 0.2 },
};

export const modalContent = {
  initial: { opacity: 0, scale: 0.96, y: 12 },
  animate: { opacity: 1, scale: 1,    y: 0  },
  exit:    { opacity: 0, scale: 0.96, y: 12 },
  transition: { duration: 0.22, ease: "easeOut" },
};

export const drawerSlideIn = {
  initial:    { opacity: 0, x: "100%" },
  animate:    { opacity: 1, x: 0 },
  exit:       { opacity: 0, x: "100%" },
  transition: { duration: 0.28, ease: [0.32, 0.72, 0, 1] },
};
