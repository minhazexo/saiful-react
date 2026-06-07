import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import api from '../api';
import { useTranslation } from '../context/LanguageContext';
import Seo from '../components/Seo';
import { MotionStaggerContainer, MotionStaggerItem } from '../motion/MotionFadeUp';
import { staggerContainer, fadeUp } from '../motion/presets';
import './CaseStudiesPage.css';

const DEFAULT_CASES = [
  { title: 'Leathix', slug: 'leathix', icon: '👜', key: 'leathix' },
  { title: 'Future Connect', slug: 'future-connect', icon: '🎧', key: 'futureConnect' },
  { title: 'Fashion Nova BD', slug: 'fashion-nova-bd', icon: '👗', key: 'fashionNova' },
  { title: 'NaturalGlow BD', slug: 'naturalglow-bd', icon: '🌿', key: 'naturalGlow' },
  { title: 'TechZone BD', slug: 'techzone-bd', icon: '💻', key: 'techZone' },
  { title: 'Crafty Hands', slug: 'crafty-hands', icon: '🧶', key: 'craftyHands' },
];

function CaseStudiesPage() {
  const t = useTranslation();
  const [cases, setCases] = useState(DEFAULT_CASES);
  const [isLoading, setIsLoading] = useState(false);

  const aliveRef = useRef(true);
  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
    };
  }, []);

  useEffect(() => {
    const ctrl = new AbortController();
    const loadCases = async () => {
      try {
        setIsLoading(true);
        const { data } = await api.get('/cases', { signal: ctrl.signal });
        if (Array.isArray(data) && data.length > 0 && aliveRef.current) {
          setCases(data);
        }
      } catch (err) {
        if (err.name !== 'CanceledError' && err.code !== 'ERR_CANCELED') {
          // Silently fall back to defaults
        }
      } finally {
        if (aliveRef.current) setIsLoading(false);
      }
    };
    loadCases();
    return () => ctrl.abort();
  }, []);

  return (
    <div className="page">
      <Seo
        title={t('caseStudies.title')}
        description={t('caseStudies.subtitle')}
        path="/case-studies"
      />
      <section className="page-hero">
        <div className="container">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.span className="eyebrow" aria-hidden="true" variants={fadeUp}>
              📊 {t('caseStudies.eyebrow')}
            </motion.span>
            <motion.h1 variants={fadeUp}>{t('caseStudies.title')}</motion.h1>
            <motion.p variants={fadeUp}>{t('caseStudies.subtitle')}</motion.p>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {isLoading ? (
            <div className="blog-loading">{t('common.loadingCases')}</div>
          ) : (
            <MotionStaggerContainer className="cases-grid">
              {cases.map((c, i) => (
                <MotionStaggerItem key={c.slug || i} className="case-detail-card">
                  <div className="case-header">
                    <div className="case-header-icon" aria-hidden="true">
                      {c.icon || '📊'}
                    </div>
                    <div className="case-header-text">
                      <span className="case-category">
                        {c.category || t(`caseStudies.defaults.${c.key}.category`)}
                      </span>
                      <h3>{c.title}</h3>
                    </div>
                  </div>

                  <div className="case-block">
                    <div className="case-block-label">{t('caseStudies.challenge')}</div>
                    <p>{c.challenge || t(`caseStudies.defaults.${c.key}.challenge`)}</p>
                  </div>

                  <div className="case-block">
                    <div className="case-block-label">{t('caseStudies.solution')}</div>
                    <p>{c.solution || t(`caseStudies.defaults.${c.key}.solution`)}</p>
                  </div>

                  <div className="case-block">
                    <div className="case-block-label">{t('caseStudies.result')}</div>
                    <p>{c.result || t(`caseStudies.defaults.${c.key}.result`)}</p>
                  </div>

                  <div className="case-highlight-box">
                    <div className="case-highlight-label">{t('caseStudies.keyOutcome')}</div>
                    <div className="case-highlight-value">
                      {c.resultHighlight || t(`caseStudies.defaults.${c.key}.highlight`)}
                    </div>
                  </div>
                </MotionStaggerItem>
              ))}
            </MotionStaggerContainer>
          )}
        </div>
      </section>
    </div>
  );
}

export default CaseStudiesPage;
