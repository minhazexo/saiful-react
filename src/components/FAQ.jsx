import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from '../context/LanguageContext';
import { MotionFadeUp, MotionStaggerContainer, MotionStaggerItem } from '../motion/MotionFadeUp';
import './FAQ.css';

function FAQ({ items, title, subtitle, eyebrow }) {
  const t = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  const fallbackEyebrow = t('faq.eyebrow');
  const fallbackTitle = t('faq.title');
  const fallbackSubtitle = t('faq.subtitle');
  const resolvedEyebrow = eyebrow || fallbackEyebrow;
  const resolvedTitle = title || fallbackTitle;
  const resolvedSubtitle = subtitle !== undefined ? subtitle : fallbackSubtitle;

  const translated = [
    'experience',
    'setupTime',
    'payment',
    'consultation',
    'upgrade',
    'growth',
  ].map((key) => ({ q: t(`faq.items.${key}.q`), a: t(`faq.items.${key}.a`) }));

  const faqs = items || translated;
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  const panelTransition = shouldReduceMotion
    ? { duration: 0.1 }
    : { duration: 0.28, ease: [0.22, 1, 0.36, 1] };

  return (
    <section className="section faq">
      <div className="container">
        <MotionFadeUp className="section-head">
          <span className="eyebrow" aria-hidden="true">
            {resolvedEyebrow}
          </span>
          <h2>{resolvedTitle}</h2>
          {resolvedSubtitle && <p>{resolvedSubtitle}</p>}
        </MotionFadeUp>

        <MotionStaggerContainer className="faq-list">
          {faqs.map((item, i) => {
            const isOpen = openIndex === i;
            const panelId = `faq-panel-${i}`;
            const buttonId = `faq-button-${i}`;
            return (
              <MotionStaggerItem key={i} className={`faq-item ${isOpen ? 'open' : ''}`}>
                <button
                  id={buttonId}
                  className="faq-question"
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  type="button"
                >
                  <span>{item.q}</span>
                  <motion.span
                    className="faq-icon"
                    aria-hidden="true"
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ type: 'spring', stiffness: 360, damping: 22 }}
                  >
                    +
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      className="faq-answer"
                      role="region"
                      aria-labelledby={buttonId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={panelTransition}
                      style={{ overflow: 'hidden' }}
                    >
                      <div className="faq-answer-inner">{item.a}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </MotionStaggerItem>
            );
          })}
        </MotionStaggerContainer>
      </div>
    </section>
  );
}

export default FAQ;
