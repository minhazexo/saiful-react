import { motion } from 'framer-motion';
import { useTranslation } from '../../context/LanguageContext';
import { getWhatsAppUrl } from '../../utils/whatsapp';
import Seo from '../../components/Seo';
import { MotionFadeUp } from '../../motion/MotionFadeUp';
import { staggerContainer, fadeUp } from '../../motion/presets';
import { assetPath } from '../../utils/assets';
import '../Service/ServicePage.css';
import Packages from '../../components/Packages/Packages';
import '../Service/ServicePage.responsive.css';

const SERVICE_ICONS = ['fast-content', 'online-presence', 'launch', 'grow'];
const SERVICE_KEYS = ['content', 'ads', 'video', 'reporting'];
const STAT_KEYS = ['brandPartners', 'avgRoas', 'avgRevenue', 'experience'];

function GrowthPage() {
  const t = useTranslation();

  return (
    <div className="page">
      <Seo title={t('growth.title')} description={t('growth.subtitle')} path="/growth" />

      <header className="growth-hero">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.span className="eyebrow" variants={fadeUp}>
            {t('growth.eyebrow')}
          </motion.span>
          <motion.h1 variants={fadeUp} dangerouslySetInnerHTML={{ __html: t('growth.title') }} />
          <motion.p variants={fadeUp}>{t('growth.subtitle')}</motion.p>
        </motion.div>
      </header>

      <section className="growth-services">
        <div className="wrap">
          <MotionFadeUp className="section-head">
            <span className="eyebrow-light">
              📦 {t('growth.services.eyebrow')}
            </span>
            <h2>{t('growth.services.title')}</h2>
            <p>{t('growth.services.subtitle')}</p>
          </MotionFadeUp>

          <div className="service-grid">
            {SERVICE_KEYS.map((key) => {
              const isPopular = key === 'ads';
              return (
                <motion.div
                  key={key}
                  className={`service-card${isPopular ? ' popular' : ''}`}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  {isPopular && <span className="popular-badge">★ Most Popular</span>}
                  <div className="card-icon"><img src={assetPath(`/images/icons/${SERVICE_ICONS[SERVICE_KEYS.indexOf(key)]}.svg`)} alt="" /></div>
                  <h3>{t(`growth.services.items.${key}.title`)}</h3>
                  <p className="desc">{t(`growth.services.items.${key}.desc`)}</p>
                  <ul className="check-list">
                    {(() => {
                      const features = t(`growth.services.items.${key}.features`);
                      if (!Array.isArray(features)) return null;
                      return features.map((f, j) => (
                        <li key={j}>
                          <span className="check-icon">✓</span>
                          {f}
                        </li>
                      ));
                    })()}
                  </ul>
                  <a href="#" className="card-cta" onClick={(e) => e.preventDefault()}>
                    {t('growth.services.cta')} →
                  </a>
                </motion.div>
              );
            })}
          </div>

          <MotionFadeUp className="text-center" amount={0.1}>
            <a href="#" className="pricing-pill" onClick={(e) => e.preventDefault()}>
              {t('growth.startingFrom')}
            </a>
          </MotionFadeUp>
        </div>
      </section>

      <section className="stats-section">
        <div className="stats-marquee">
          <div className="stats-marquee-track">
            {[...Array(2)].flatMap((_, dup) =>
              STAT_KEYS.map((key, i) => (
                <div key={`${dup}-${i}`} className="stat-card" aria-hidden={dup === 1}>
                  <div className="stat-num">{t(`growth.stats.${key}Num`)}<span>{t(`growth.stats.${key}Sym`)}</span></div>
                  <div className="stat-label">{t(`growth.stats.${key}`)}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="testimonials">
        <div className="wrap">
          <MotionFadeUp className="section-head">
            <span className="eyebrow-light">
              💬 {t('growth.testimonials.eyebrow')}
            </span>
            <h2>{t('growth.testimonials.title')}</h2>
            <p>{t('growth.testimonials.subtitle')}</p>
          </MotionFadeUp>

          <div className="testi-grid">
            {(() => {
              const items = t('growth.testimonials.items');
              if (!Array.isArray(items)) return null;
              return items.map((item, i) => (
                <motion.div
                  key={i}
                  className="testi-card"
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="testi-stars">{item.stars}</div>
                  <p className="testi-quote">{item.quote}</p>
                  <div className="testi-person">
                    <div className="testi-avatar">{item.name.charAt(0)}</div>
                    <div>
                      <div className="testi-name">{item.name}</div>
                      <div className="testi-role">{item.role}</div>
                    </div>
                  </div>
                </motion.div>
              ));
            })()}
          </div>
        </div>
      </section>

      <section className="cta-banner">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.h2 variants={fadeUp}>{t('growth.cta.title')}</motion.h2>
          <motion.p variants={fadeUp}>{t('growth.cta.subtitle')}</motion.p>
          <motion.div variants={fadeUp}>
            <a
              className="btn-white"
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => { e.preventDefault(); window.open(getWhatsAppUrl(t), '_blank'); }}
            >
              📅 {t('growth.cta.book')}
            </a>
          </motion.div>
        </motion.div>
      </section>

      <Packages />
    </div>
  );
}

export default GrowthPage;
