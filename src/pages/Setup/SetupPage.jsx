import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from '../../context/LanguageContext';
import Seo from '../../components/Seo';
import { MotionFadeUp, MotionStaggerContainer, MotionStaggerItem } from '../../motion/MotionFadeUp';
import { staggerContainer, fadeUp, buttonHover } from '../../motion/presets';
import '../Service/ServicePage.css';

const SERVICE_ICONS = ['🎨', '💻', '💳', '📱'];
const SERVICE_KEYS = ['brand', 'website', 'payment', 'social'];
const PROCESS_KEYS = ['discovery', 'proposal', 'build', 'launch'];

function SetupPage() {
  const t = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="page">
      <Seo title={t('setup.title')} description={t('setup.subtitle')} path="/setup" />
      <section className="page-hero">
        <div className="container">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.span className="eyebrow" variants={fadeUp}>
              <span aria-hidden="true">🏗️</span> {t('setup.eyebrow')}
            </motion.span>
            <motion.h1 variants={fadeUp}>{t('setup.title')}</motion.h1>
            <motion.p variants={fadeUp}>{t('setup.subtitle')}</motion.p>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <MotionFadeUp className="section-head">
            <span className="eyebrow">
              <span aria-hidden="true">🛠️</span> {t('setup.services.eyebrow')}
            </span>
            <h2>{t('setup.services.title')}</h2>
            <p>{t('setup.services.subtitle')}</p>
          </MotionFadeUp>

          <MotionStaggerContainer className="services-grid">
            {SERVICE_KEYS.map((key, i) => {
              const features = t(`setup.services.items.${key}.features`);
              const featureList = Array.isArray(features) ? features : [];
              return (
                <MotionStaggerItem key={key} className="service-card">
                  <div className="service-icon">{SERVICE_ICONS[i]}</div>
                  <h3>{t(`setup.services.items.${key}.title`)}</h3>
                  <p>{t(`setup.services.items.${key}.desc`)}</p>
                  <ul className="service-features">
                    {featureList.map((f, j) => (
                      <li key={j}>
                        <span className="check">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <motion.button
                    className="btn btn-primary"
                    onClick={() => navigate('/contact')}
                    variants={buttonHover}
                    initial="rest"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    {t('setup.services.cta')} →
                  </motion.button>
                </MotionStaggerItem>
              );
            })}
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
              {t('setup.startingFrom')}
            </div>
          </MotionFadeUp>
        </div>
      </section>

      <section className="section process-section">
        <div className="container">
          <MotionFadeUp className="section-head">
            <span className="eyebrow">
              <span aria-hidden="true">🔄</span> {t('setup.process.eyebrow')}
            </span>
            <h2>{t('setup.process.title')}</h2>
            <p>{t('setup.process.subtitle')}</p>
          </MotionFadeUp>

          <MotionStaggerContainer className="process-grid">
            {PROCESS_KEYS.map((key, i) => (
              <MotionStaggerItem key={key} className="process-step">
                <div className="process-step-number">{i + 1}</div>
                <h3>{t(`setup.process.items.${key}.title`)}</h3>
                <p>{t(`setup.process.items.${key}.desc`)}</p>
              </MotionStaggerItem>
            ))}
          </MotionStaggerContainer>
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
            <motion.h2 variants={fadeUp}>{t('setup.cta.title')}</motion.h2>
            <motion.p variants={fadeUp}>{t('setup.cta.subtitle')}</motion.p>
            <motion.div className="cta-actions" variants={fadeUp}>
              <motion.button
                className="btn btn-white"
                onClick={() => navigate('/contact')}
                variants={buttonHover}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
              >
                📅 {t('setup.cta.book')}
              </motion.button>
              <motion.button
                className="btn btn-dark"
                onClick={() => navigate('/academy')}
                variants={buttonHover}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
              >
                🎓 {t('setup.cta.academy')}
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default SetupPage;
