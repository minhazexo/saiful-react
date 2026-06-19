import { motion, useReducedMotion } from 'framer-motion';
import { fadeUp, inViewOnce, fadeUpSmall } from './presets';

const MotionDiv = motion.div;
const MotionSpan = motion.span;

const TagDiv = 'div';
const TagSpan = 'span';

export function MotionFadeUp({
  as: asProp = 'div',
  className,
  children,
  amount = 0.2,
  delay = 0,
  ...rest
}) {
  const shouldReduceMotion = useReducedMotion();
  const as = asProp === 'span' ? 'span' : 'div';

  if (shouldReduceMotion) {
    const Tag = as === 'span' ? TagSpan : TagDiv;
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    );
  }

  const MotionTag = as === 'span' ? MotionSpan : MotionDiv;
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

export function MotionStaggerContainer({
  as: asProp = 'div',
  className,
  children,
  staggerDelay = 0.1,
  initialDelay = 0.1,
  amount = 0.15,
  ...rest
}) {
  const shouldReduceMotion = useReducedMotion();
  const as = asProp === 'span' ? 'span' : 'div';

  if (shouldReduceMotion) {
    const Tag = as === 'span' ? TagSpan : TagDiv;
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    );
  }

  const MotionTag = as === 'span' ? MotionSpan : MotionDiv;
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

export function MotionStaggerItem({ as: asProp = 'div', className, children, ...rest }) {
  const as = asProp === 'span' ? 'span' : 'div';
  const MotionTag = as === 'span' ? MotionSpan : MotionDiv;

  return (
    <MotionTag className={className} variants={fadeUpSmall} {...rest}>
      {children}
    </MotionTag>
  );
}

export { inViewOnce };

