import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from '../context/LanguageContext';
import Seo from '../components/Seo';
import { MotionFadeUp, MotionStaggerContainer, MotionStaggerItem } from '../motion/MotionFadeUp';
import { staggerContainer, fadeUp, buttonHover } from '../motion/presets';
import './ServicePage.css';

const SERVICE_ICONS = ['📝', '📣', '🎬', '📊'];
const SERVICE_KEYS = ['content', 'ads', 'video', 'reporting'];

function GrowthPage() {
  const t = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="page">
      <Seo title={t('growth.title')} description={t('growth.subtitle')} path="/growth" />
      <section className="page-hero">
        <div className="container">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.span className="eyebrow" variants={fadeUp}>
              <span aria-hidden="true">📈</span> {t('growth.eyebrow')}
            </motion.span>
            <motion.h1 variants={fadeUp}>{t('growth.title')}</motion.h1>
            <motion.p variants={fadeUp}>{t('growth.subtitle')}</motion.p>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <MotionFadeUp className="section-head">
            <span className="eyebrow">
              <span aria-hidden="true">💼</span> {t('growth.services.eyebrow')}
            </span>
            <h2>{t('growth.services.title')}</h2>
            <p>{t('growth.services.subtitle')}</p>
          </MotionFadeUp>

          <MotionStaggerContainer className="services-grid">
            {SERVICE_KEYS.map((key) => (
              <MotionStaggerItem
                key={key}
                className={`service-card ${key === 'ads' ? 'featured-service' : ''}`}
              >
                <div className="service-icon">{SERVICE_ICONS[SERVICE_KEYS.indexOf(key)]}</div>
                <h3>{t(`growth.services.items.${key}.title`)}</h3>
                <p>{t(`growth.services.items.${key}.desc`)}</p>
                <ul className="service-features">
                  {(() => {
                    const features = t(`growth.services.items.${key}.features`);
                    if (!Array.isArray(features)) return null;
                    return features.map((f, j) => (
                      <li key={j}>
                        <span className="check">✓</span>
                        {f}
                      </li>
                    ));
                  })()}
                </ul>
                <motion.button
                  className="btn btn-primary"
                  onClick={() => navigate('/contact')}
                  variants={buttonHover}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                >
                  {t('growth.services.cta')} →
                </motion.button>
              </MotionStaggerItem>
            ))}
          </MotionStaggerContainer>

          <MotionFadeUp className="text-center" amount={0.1}>
            <div
              style={{
                marginTop: 32,
                display: 'inline-block',
                background: 'var(--orange-light)',
                color: 'var(--orange)',
                padding: '12px 24px',
                borderRadius: 'var(--radius)',
                fontWeight: 700,
                fontSize: 18,
                border: '1px solid var(--orange-soft)',
              }}
            >
              {t('growth.startingFrom')}
            </div>
          </MotionFadeUp>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.h2 variants={fadeUp}>{t('growth.cta.title')}</motion.h2>
            <motion.p variants={fadeUp}>{t('growth.cta.subtitle')}</motion.p>
            <motion.div className="cta-actions" variants={fadeUp}>
              <motion.button
                className="btn btn-white"
                onClick={() => navigate('/contact')}
                variants={buttonHover}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
              >
                📅 {t('growth.cta.book')}
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default GrowthPage;
