import { motion, useReducedMotion } from 'framer-motion';
import { fadeUp, inViewOnce, fadeUpSmall } from './presets';

/**
 * A drop-in motion wrapper that fades + slides its children up
 * when scrolled into view. Lightweight, no extra props required.
 */
export function MotionFadeUp({
  as: Component = 'div',
  className,
  children,
  amount = 0.2,
  delay = 0,
  ...rest
}) {
  const shouldReduceMotion = useReducedMotion();
  const MotionTag = motion[Component] || motion.div;

  if (shouldReduceMotion) {
    return (
      <Component className={className} {...rest}>
        {children}
      </Component>
    );
  }

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount, margin: '0px 0px -40px 0px' }}
      variants={fadeUp}
      transition={{ delay }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}

/**
 * Wraps a list/grid to fade-up each child in sequence as it scrolls into view.
 * Use MotionStaggerItem as the direct child.
 */
export function MotionStaggerContainer({
  as: Component = 'div',
  className,
  children,
  staggerDelay = 0.1,
  initialDelay = 0.1,
  amount = 0.15,
  ...rest
}) {
  const shouldReduceMotion = useReducedMotion();
  const MotionTag = motion[Component] || motion.div;

  if (shouldReduceMotion) {
    return (
      <Component className={className} {...rest}>
        {children}
      </Component>
    );
  }

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount, margin: '0px 0px -40px 0px' }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: staggerDelay, delayChildren: initialDelay },
        },
      }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}

/** Direct child of MotionStaggerContainer — fades up. */
export function MotionStaggerItem({ as: Component = 'div', className, children, ...rest }) {
  const MotionTag = motion[Component] || motion.div;
  return (
    <MotionTag className={className} variants={fadeUpSmall} {...rest}>
      {children}
    </MotionTag>
  );
}

/** Re-export viewport helper. */
export { inViewOnce };
