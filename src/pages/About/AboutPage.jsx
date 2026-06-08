import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from '../../context/LanguageContext';
import Seo from '../../components/Seo';
import { MotionFadeUp, MotionStaggerContainer, MotionStaggerItem } from '../../motion/MotionFadeUp';
import { staggerContainer, fadeUp, slideInLeft, buttonHover } from '../../motion/presets';
import './AboutPage.css';

const VALUE_ICONS = ['🎯', '🤝', '🚀', '📚', '🌍', '💡'];
const VALUE_KEYS = ['results', 'honest', 'innovation', 'learning', 'bangladesh', 'empowerment'];
const TIMELINE_KEYS = ['2014', '2017', '2019', '2022', '2024', '2026'];

function AboutPage() {
  const t = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="page">
      <Seo title={t('about.title')} description={t('about.subtitle')} path="/about" />
      <section className="page-hero">
        <div className="container">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.span className="eyebrow" variants={fadeUp}>
              <span aria-hidden="true">👋</span> {t('about.eyebrow')}
            </motion.span>
            <motion.h1 variants={fadeUp}>{t('about.title')}</motion.h1>
            <motion.p variants={fadeUp}>{t('about.subtitle')}</motion.p>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="about-story">
            <motion.div
              className="about-image-wrap"
              variants={slideInLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="about-image-card">
                <img src={`${import.meta.env.BASE_URL}images/gpt-image-1.5-high-fidelity_a_Create_a_professiona.png`} alt="Saiful Studios" />
              </div>
              <div className="about-image-stat">
                <strong>10+</strong>
                <span>{t('about.yearsBuilding')}</span>
              </div>
            </motion.div>

            <MotionFadeUp className="about-story-content" amount={0.3}>
              <span className="eyebrow">
                <span aria-hidden="true">📖</span> {t('about.storyEyebrow')}
              </span>
              <h2>{t('about.storyTitle')}</h2>
              <p>{t('about.storyP1')}</p>
              <p>{t('about.storyP2')}</p>
              <p>{t('about.storyP3')}</p>
            </MotionFadeUp>
          </div>
        </div>
      </section>

      <section className="section values-section">
        <div className="container">
          <MotionFadeUp className="section-head">
            <span className="eyebrow">
              <span aria-hidden="true">💎</span> {t('about.values.eyebrow')}
            </span>
            <h2>{t('about.values.title')}</h2>
            <p>{t('about.values.subtitle')}</p>
          </MotionFadeUp>

          <MotionStaggerContainer className="values-grid">
            {VALUE_KEYS.map((key, i) => (
              <MotionStaggerItem key={key} className="value-card">
                <div className="value-icon" aria-hidden="true">
                  {VALUE_ICONS[i]}
                </div>
                <h3>{t(`about.values.items.${key}.title`)}</h3>
                <p>{t(`about.values.items.${key}.desc`)}</p>
              </MotionStaggerItem>
            ))}
          </MotionStaggerContainer>
        </div>
      </section>

      <section className="section timeline-section">
        <div className="container">
          <MotionFadeUp className="section-head">
            <span className="eyebrow">
              <span aria-hidden="true">⏳</span> {t('about.timeline.eyebrow')}
            </span>
            <h2>{t('about.timeline.title')}</h2>
            <p>{t('about.timeline.subtitle')}</p>
          </MotionFadeUp>

          <MotionStaggerContainer className="timeline">
            {TIMELINE_KEYS.map((key) => (
              <MotionStaggerItem key={key} className="timeline-item">
                <div className="timeline-dot"></div>
                <span className="timeline-year">{key}</span>
                <h3>{t(`about.timeline.items.${key}.title`)}</h3>
                <p>{t(`about.timeline.items.${key}.desc`)}</p>
              </MotionStaggerItem>
            ))}
          </MotionStaggerContainer>
        </div>
      </section>

      <section className="final-cta">
        <div className="container">
          <motion.div
            className="final-cta-box"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.h2 variants={fadeUp}>{t('about.finalCta.title')}</motion.h2>
            <motion.p variants={fadeUp}>{t('about.finalCta.subtitle')}</motion.p>
            <motion.div className="final-cta-actions" variants={fadeUp}>
              <motion.button
                className="btn btn-white"
                onClick={() => navigate('/contact')}
                variants={buttonHover}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
              >
                📅 {t('about.finalCta.book')}
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
