import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from '../../context/LanguageContext';
import { MotionFadeUp } from '../../motion/MotionFadeUp';
import { fadeUp, staggerContainer, buttonHover } from '../../motion/presets';
import './Packages.css';

const PACKAGE_KEYS = ['academy', 'setup', 'growth'];

function Packages() {
  const t = useTranslation();
  const navigate = useNavigate();

  return (
    <section className="section packages-section" id="packages">
      <div className="container">
        <MotionFadeUp className="section-head">
          <span className="eyebrow">
            <span aria-hidden="true">💼</span> {t('home.packages.eyebrow')}
          </span>
          <h2>{t('home.packages.title')}</h2>
          <p>{t('home.packages.subtitle')}</p>
        </MotionFadeUp>

        <div className="packages-grid">
          {PACKAGE_KEYS.map((key) => {
            const featured = key === 'setup';
            const featureKeys =
              key === 'academy'
                ? ['liveClasses', 'templates', 'community', 'aiTools', 'lifetime']
                : key === 'setup'
                  ? ['logo', 'brand', 'website', 'payment', 'social']
                  : ['content', 'ads', 'video', 'strategy', 'reporting'];
            return (
              <motion.div
                key={key}
                className={`package-card ${featured ? 'featured' : ''}`}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                {featured && (
                  <div className="package-badge">⭐ {t('home.packages.mostPopular')}</div>
                )}
                <div className="package-icon">
                  {key === 'academy' ? '🎓' : key === 'setup' ? '🚀' : '📈'}
                </div>
                <h3 className="package-name">{t(`home.packages.${key}.name`)}</h3>
                <div className="package-price">
                  {t(`home.packages.${key}.price`)}
                  <span>{t(`home.packages.${key}.period`)}</span>
                </div>
                <p className="package-desc">{t(`home.packages.${key}.desc`)}</p>
                <ul className="package-features">
                  {featureKeys.map((fKey) => (
                    <li key={fKey}>
                      <span className="check">✓</span>
                      {t(`home.packages.${key}.features.${fKey}`)}
                    </li>
                  ))}
                </ul>
                <button
                  className={`btn ${featured ? 'btn-primary' : 'btn-dark'} btn-block`}
                  onClick={() =>
                    navigate(
                      key === 'academy' ? '/academy' : key === 'setup' ? '/setup' : '/growth'
                    )
                  }
                >
                  {t(`home.packages.${key}.cta`)}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Packages;
