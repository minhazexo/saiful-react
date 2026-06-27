import { motion } from 'framer-motion';
import { useTranslation } from '../../context/LanguageContext';
import Seo from '../../components/Seo';
import { MotionFadeUp } from '../../motion/MotionFadeUp';
import { staggerContainer, fadeUp } from '../../motion/presets';
import './SetupPage.css';
import Packages from '../../components/Packages/Packages';
import './SetupPage.responsive.css';

const SERVICE_KEYS = ['brand', 'website', 'payment', 'social'];
const PROCESS_KEYS = ['discovery', 'proposal', 'build', 'launch'];

function SetupPage() {
  const t = useTranslation();

  return (
    <div className="page">
      <Seo title={t('setup.title')} description={t('setup.subtitle')} path="/setup" />

      <section className="lp-hero">
        <svg className="lp-hero-path" viewBox="0 0 1180 420" preserveAspectRatio="none">
<path d="M -50 380 C 250 380, 350 120, 650 140 C 880 155, 950 40, 1230 30"
              fill="none" stroke="#000" strokeWidth="1.5" strokeDasharray="4 7" opacity="0.15"/>
          <circle r="5" fill="#000">
            <animateMotion dur="9s" repeatCount="indefinite"
              path="M -50 380 C 250 380, 350 120, 650 140 C 880 155, 950 40, 1230 30"/>
          </circle>
        </svg>
        <motion.div className="wrap lp-hero-inner"
          variants={staggerContainer} initial="hidden" animate="visible">
          <motion.span className="lp-badge" variants={fadeUp}>
            <span className="lp-dot"></span>
            <span className="lp-tag">{t('setup.tag')}</span>
          </motion.span>
          <motion.h1 className="lp-hero-title" variants={fadeUp}
            dangerouslySetInnerHTML={{ __html: t('setup.title') }} />
          <motion.p className="lp-hero-sub" variants={fadeUp}>{t('setup.subtitle')}</motion.p>
          <motion.div className="lp-hero-cta" variants={fadeUp}>
            <a href="#cta" className="lp-btn lp-btn-solid lp-btn-lg">{t('setup.heroCta')}</a>
            <a href="#services" className="lp-btn lp-btn-ghost lp-btn-lg">{t('setup.heroCta2')}</a>
          </motion.div>
          <motion.div className="lp-hero-stats" variants={fadeUp}>
            {(() => {
              const items = t('setup.stats');
              if (!Array.isArray(items)) return null;
              return items.map((item, i) => (
                <div className="lp-stat" key={i}>
                  <b>{item.num}</b>
                  <span>{item.label}</span>
                </div>
              ));
            })()}
          </motion.div>
        </motion.div>
      </section>

      <section className="lp-services" id="services">
        <div className="wrap">
          <MotionFadeUp className="lp-section-head">
            <span className="lp-tag">{t('setup.services.eyebrow')}</span>
            <h2>{t('setup.services.title')}</h2>
            <p>{t('setup.services.subtitle')}</p>
          </MotionFadeUp>
          <div className="lp-grid-4">
            {SERVICE_KEYS.map((key) => {
              const features = t(`setup.services.items.${key}.features`);
              const featureList = Array.isArray(features) ? features : [];
              return (
                <motion.div key={key} className="lp-svc-card"
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
                  <div className="lp-svc-num">{t(`setup.services.items.${key}.num`)}</div>
                  <h3>{t(`setup.services.items.${key}.title`)}</h3>
                  <p>{t(`setup.services.items.${key}.desc`)}</p>
                  <ul className="lp-svc-list">
                    {featureList.map((f, j) => (
                      <li key={j}>{f}</li>
                    ))}
                  </ul>
                  <a href="#cta" className="lp-svc-cta">
                    {t('setup.services.cta')} <span className="lp-arrow">→</span>
                  </a>
                </motion.div>
              );
            })}
          </div>
          <MotionFadeUp>
            <span className="lp-price-pill">{t('setup.services.pricePill')}</span>
          </MotionFadeUp>
        </div>
      </section>

      <section className="lp-process" id="process">
        <div className="wrap">
          <MotionFadeUp className="lp-section-head">
            <span className="lp-tag">{t('setup.process.eyebrow')}</span>
            <h2>{t('setup.process.title')}</h2>
            <p>{t('setup.process.subtitle')}</p>
          </MotionFadeUp>
          <div className="lp-timeline">
            {PROCESS_KEYS.map((key) => (
              <motion.div key={key} className="lp-step"
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
                <div className="lp-step-num">{t(`setup.process.items.${key}.num`)}</div>
                <h4>{t(`setup.process.items.${key}.title`)}</h4>
                <p>{t(`setup.process.items.${key}.desc`)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-trust" id="trust">
        <div className="wrap">
          <MotionFadeUp className="lp-section-head">
            <span className="lp-tag">{t('setup.testimonials.eyebrow')}</span>
            <h2>{t('setup.testimonials.title')}</h2>
          </MotionFadeUp>
          <div className="lp-trust-grid">
            {(() => {
              const items = t('setup.testimonials.items');
              if (!Array.isArray(items)) return null;
              return items.map((item, i) => (
                <motion.div key={i} className="lp-quote-card"
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }}>
                  <p className="lp-q">{item.quote}</p>
                  <div className="lp-who">
                    <div className="lp-avatar"></div>
                    <div>
                      <b>{item.name}</b>
                      <span>{item.role}</span>
                    </div>
                  </div>
                </motion.div>
              ));
            })()}
          </div>
        </div>
      </section>

      <section className="lp-cta-band" id="cta">
        <div className="wrap">
          <motion.div variants={staggerContainer}
            initial="hidden" whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}>
            <motion.h2 variants={fadeUp}>{t('setup.cta.title')}</motion.h2>
            <motion.p variants={fadeUp}>{t('setup.cta.subtitle')}</motion.p>
            <motion.div className="lp-cta-row" variants={fadeUp}>
              <a href="#cta" className="lp-btn lp-btn-dark lp-btn-lg">{t('setup.cta.book')}</a>
              <a href="#services" className="lp-btn lp-btn-outline-dark lp-btn-lg">{t('setup.cta.view')}</a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Packages />
    </div>
  );
}

export default SetupPage;
