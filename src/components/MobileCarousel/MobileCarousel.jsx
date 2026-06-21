import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import './MobileCarousel.css';

const MOBILE_BREAKPOINT = 768;

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir < 0 ? 80 : -80, opacity: 0 }),
};

const slideVariantsReverse = {
  enter: (dir) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir < 0 ? -80 : 80, opacity: 0 }),
};

export default function MobileCarousel({
  className = '',
  children,
  showArrows = true,
  autoPlay = true,
  interval = 4000,
  staggerDelay = 0.1,
  inViewAmount = 0.15,
  forceCarousel = false,
  marquee = false,
  marqueeSpeed = 20,
  reverse = false,
}) {
  const shouldReduceMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);
  const inViewRef = useRef(true);
  const containerRef = useRef(null);

  const items = (Array.isArray(children) ? children : [children]).filter(Boolean);
  const total = items.length;

  const slides = useMemo(() => items.map((item) => [item]), [items]);
  const slideCount = slides.length;

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (slideCount <= 1 || !autoPlay) return;
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { inViewRef.current = entry.isIntersecting; },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [slideCount, autoPlay]);

  const next = useCallback(() => {
    setDir(1);
    setCurrent((p) => (p + 1) % slideCount);
  }, [slideCount]);

  const prev = useCallback(() => {
    setDir(-1);
    setCurrent((p) => (p - 1 + slideCount) % slideCount);
  }, [slideCount]);

  useEffect(() => {
    if (!autoPlay || slideCount <= 1 || (!isMobile && !forceCarousel) || isPaused || shouldReduceMotion) return;
    const tick = () => { if (inViewRef.current) next(); };
    timerRef.current = setInterval(tick, interval);
    return () => clearInterval(timerRef.current);
  }, [autoPlay, slideCount, isMobile, isPaused, interval, next, shouldReduceMotion]);

  /* --- Desktop: staggered grid (unless forceCarousel) --- */
  if ((!isMobile && !forceCarousel) || slideCount <= 1) {
    return (
      <motion.div
        className={className}
        ref={containerRef}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: inViewAmount, margin: '0px 0px -40px 0px' }}
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: staggerDelay, delayChildren: 0.1 },
          },
        }}
      >
        {children}
      </motion.div>
    );
  }

  /* --- Mobile: marquee (continuous scroll) --- */
  if (marquee && isMobile && !shouldReduceMotion) {
    const kids = Array.isArray(children) ? children : [children];
    return (
      <div className={`mobile-marquee-wrapper ${className}`} ref={containerRef}>
        <div
          className="mobile-marquee-track"
          style={{ animationDuration: `${marqueeSpeed}s` }}
          onMouseEnter={(e) => { e.currentTarget.style.animationPlayState = 'paused'; }}
          onMouseLeave={(e) => { e.currentTarget.style.animationPlayState = 'running'; }}
        >
          <div className="mobile-marquee-content">{kids}</div>
          <div className="mobile-marquee-content" aria-hidden="true">{kids}</div>
        </div>
      </div>
    );
  }

  /* --- Mobile: carousel --- */
  const transition = shouldReduceMotion
    ? { duration: 0 }
    : { type: 'spring', stiffness: 300, damping: 28, mass: 0.6 };

  return (
    <div className={`mobile-carousel-wrapper ${className}`} ref={containerRef}>
      <div
        className="mobile-carousel-inner"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="carousel-viewport">
          <AnimatePresence mode="wait" custom={reverse ? -dir : dir}>
            <motion.div
              key={current}
              className="carousel-slide"
              custom={reverse ? -dir : dir}
              variants={reverse ? slideVariantsReverse : slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={transition}
              drag={shouldReduceMotion ? false : 'x'}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.05}
              onDragEnd={(_, info) => {
                if (info.offset.x < -40) next();
                else if (info.offset.x > 40) prev();
              }}
            >
              {slides[current][0]}
            </motion.div>
          </AnimatePresence>
        </div>

        {showArrows && slideCount > 1 && (
          <>
            <button className="carousel-arrow carousel-arrow-prev" onClick={prev} aria-label="Previous">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M12 4l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button className="carousel-arrow carousel-arrow-next" onClick={next} aria-label="Next">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M8 4l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </>
        )}


      </div>
    </div>
  );
}
