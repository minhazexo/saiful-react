
import { motion } from 'framer-motion';
import { useTranslation } from '../../context/LanguageContext';
import { getWhatsAppUrl } from '../../utils/whatsapp';
import Seo from '../../components/Seo';
import MobileCarousel from '../../components/MobileCarousel/MobileCarousel';
import { MotionFadeUp } from '../../motion/MotionFadeUp';
import { staggerContainer, fadeUp, slideInLeft, buttonHover } from '../../motion/presets';
import { assetPath } from '../../utils/assets';
import './AboutPage.css';
import './AboutPage.responsive.css';

const VALUE_ICONS = ['scale', 'learn', 'launch', 'learn', 'idea', 'grow'];
const VALUE_KEYS = ['results', 'honest', 'innovation', 'learning', 'bangladesh', 'empowerment'];
const TIMELINE_KEYS = ['2014', '2017', '2019', '2022', '2024', '2026'];

function AboutPage() {
  const t = useTranslation();

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
                <img src={assetPath('/images/founder-3.png')} alt="Saiful Islam" loading="lazy" />
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

          <MobileCarousel className="values-grid">
            {VALUE_KEYS.map((key, i) => (
              <motion.div key={key} className="value-card" initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
                <div className="value-icon" aria-hidden="true">
                  <img src={assetPath(`/images/icons/${VALUE_ICONS[i]}.svg`)} alt="" />
                </div>
                <h3>{t(`about.values.items.${key}.title`)}</h3>
                <p>{t(`about.values.items.${key}.desc`)}</p>
              </motion.div>
            ))}
          </MobileCarousel>
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

          <MobileCarousel className="timeline">
            {TIMELINE_KEYS.map((key) => (
              <motion.div key={key} className="timeline-item" initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
                <div className="timeline-dot"></div>
                <span className="timeline-year">{key}</span>
                <h3>{t(`about.timeline.items.${key}.title`)}</h3>
                <p>{t(`about.timeline.items.${key}.desc`)}</p>
              </motion.div>
            ))}
          </MobileCarousel>
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
                onClick={() => window.open(getWhatsAppUrl(t), '_blank')}
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
