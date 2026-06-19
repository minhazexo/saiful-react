/**
 * Reusable Motion / Framer Motion variants and presets.
 *
 * Centralised so the rest of the app can use semantic animation names
 * (e.g. `variants={fadeUp}`) and stay consistent.
 *
 * Respect `useReducedMotion()` at the call site if accessibility matters.
 */

const EASE = [0.22, 1, 0.36, 1]; // smooth "ease-out-quart"
const SPRING_GENTLE = { type: 'spring', stiffness: 220, damping: 24, mass: 0.8 };
const SPRING_SNAPPY = { type: 'spring', stiffness: 380, damping: 28 };

/* ============== ENTRANCE VARIANTS ============== */

export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE },
  },
};

export const fadeUpSmall = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE },
  },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: EASE } },
};

export const slideInLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE } },
};

export const slideInRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE } },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: EASE } },
};

/* ============== STAGGER CONTAINERS ============== */

/** Standard stagger for hero/section content (fast children). */
export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

/** Slower stagger for grids (cards). */
export const staggerGrid = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

/* ============== HOVER / TAP PRESETS ============== */

export const liftHover = {
  rest: { y: 0, boxShadow: '0 2px 8px rgba(15, 23, 42, 0.06)' },
  hover: {
    y: -6,
    boxShadow: '0 20px 60px rgba(15, 23, 42, 0.12)',
    transition: SPRING_GENTLE,
  },
  tap: { y: -2, transition: { duration: 0.1 } },
};

export const cardHover = {
  rest: { y: 0, scale: 1 },
  hover: { y: -4, scale: 1.01, transition: SPRING_GENTLE },
  tap: { scale: 0.99, transition: { duration: 0.1 } },
};

export const buttonHover = {
  rest: { scale: 1 },
  hover: { scale: 1.03, transition: { duration: 0.18, ease: EASE } },
  tap: { scale: 0.97, transition: { duration: 0.1 } },
};

export const iconPopHover = {
  rest: { scale: 1, rotate: 0 },
  hover: { scale: 1.15, rotate: -6, transition: SPRING_SNAPPY },
};

/* ============== PAGE TRANSITION ============== */

export const pageTransition = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.25, ease: EASE } },
};

/* ============== HELPERS ============== */

/** Standard viewport config — fires once when 20% of element is in view. */
export const inViewOnce = { once: true, amount: 0.2, margin: '0px 0px -60px 0px' };

/** Looser viewport for tall sections. */
export const inViewLoose = { once: true, amount: 0.1 };
