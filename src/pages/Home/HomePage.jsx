import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../context/LanguageContext';
import FAQ from '../../components/FAQ/FAQ';
import Packages from '../../components/Packages/Packages';
import Seo from '../../components/Seo';
import MobileCarousel from '../../components/MobileCarousel/MobileCarousel';
import { MotionFadeUp, MotionStaggerContainer, MotionStaggerItem } from '../../motion/MotionFadeUp';
import { fadeUp, fadeUpSmall, staggerContainer, buttonHover } from '../../motion/presets';
import { assetPath } from '../../utils/assets';
import { getWhatsAppUrl } from '../../utils/whatsapp';
import './HomePage.css';

const STAT_NUMBERS = [
  { num: '৪৫+', key: 'designProjects' },
  { num: '১৫০+', key: 'industriesServed' },
  { num: '৭০+', key: 'yearsExperience' },
  { num: '৭.২X', key: 'consultations' },
  { num: '১০+', key: 'businessesLaunched' },
];

const HERO_FEATURES = [
  {
    key: 'branding',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>
    ),
  },
  {
    key: 'website',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
    ),
  },
  {
    key: 'metaAds',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>
    ),
  },
  {
    key: 'content',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="6 4 20 12 6 20 6 4"/></svg>
    ),
  },
  {
    key: 'growth',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
    ),
  },
];

const STAGE_KEYS = ['academy', 'setup', 'growth'];

const STAGE_IMAGES = [
  assetPath('/pdf/Website Icons & Images/Website Icons/Learner.jpg'),
  assetPath('/pdf/Website Icons & Images/Website Icons/Business-Setup.jpg'),
  assetPath('/pdf/Website Icons & Images/Website Icons/Order.jpg'),
];

const STAGE_IMAGES_ICONS = [
  '/images/icons/learn.svg',
  '/images/icons/setup.svg',
  '/images/icons/grow.svg',
];
const PROBLEM_KEYS = ['noBrand', 'noWebsite', 'noContent', 'noMarketing', 'noGrowth', 'noProcess', 'noSales'];
const SOLUTION_KEYS = ['brand', 'website', 'content', 'marketing', 'growth', 'process', 'sales'];
const FRAMEWORK_KEYS = ['idea', 'learn', 'setup', 'launch', 'grow', 'scale'];
const FRAMEWORK_ICONS = ['idea', 'learn', 'setup', 'launch', 'grow', 'scale'];
const AI_TOOL_KEYS = ['canva', 'chatgpt', 'gemini', 'capcut'];
const WORKFLOW_KEYS = ['research', 'create', 'produce', 'distribute', 'optimize'];
const TESTIMONIAL_KEYS = ['rahim', 'farida', 'nusrat', 'kamal'];
const CASE_KEYS = [
  'leathix',
  'futureConnect',
  'fashionNova',
  'naturalGlow',
  'techZone',
  'craftyHands',
];

const CASE_ICONS = ['👜', '🎧', '👗', '🌿', '💻', '🧶'];
const CASE_TITLES = ['Leathix', 'Future Connect', 'Fashion Nova BD', 'NaturalGlow BD', 'TechZone BD', 'Crafty Hands'];
const CLIENT_RESULT_KEYS = ['leathix', 'evoLeather', 'shopHouse'];
const CLIENT_RESULT_ICONS = {
  leathix: 'grow',
  evoLeather: 'branding',
  shopHouse: 'online-presence',
};
const HERO_DESKTOP_IMAGES = [
  { file: 'Founder-1.png', dir: 'pdf/All Imge Comprase Website' },
  { file: 'Founder-2.png', dir: 'pdf/All Imge Comprase Website' },
  { file: 'Founder-3.png', dir: 'pdf/All Imge Comprase Website' },
  { file: 'My-pic.jpg', dir: 'pdf/All Imge Comprase Website' },
];
const HERO_MOBILE_IMAGES = [
  { file: 'hero-mobile-1.jpeg', dir: 'images' },
  { file: 'hero-mobile-2.jpeg', dir: 'images' },
  { file: 'hero vis mob.jpeg', dir: 'pdf' },
  { file: 'girl.jpeg', dir: 'pdf' },
];
const HERO_CARDS = [
  { localeKey: 'home.heroCardGirl', avatar: { file: 'Founder-1.png', dir: 'pdf/All Imge Comprase Website' } },
  { localeKey: 'home.heroCardBoy', avatar: { file: 'Founder-2.png', dir: 'pdf/All Imge Comprase Website' } },
  { localeKey: 'home.heroCard3', avatar: { file: 'Founder-3.png', dir: 'pdf/All Imge Comprase Website' } },
  { localeKey: 'home.heroCard4', avatar: { file: 'My-pic.jpg', dir: 'pdf/All Imge Comprase Website' } },
];
const MOBILE_BREAKPOINT = 768;

function HomePage() {
  const t = useTranslation();
  const navigate = useNavigate();

  const [openFramework, setOpenFramework] = useState(null);
  const [heroImgIndex, setHeroImgIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroImgIndex((prev) => prev + 1);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-page">
      <Seo title="" description={t('seo.defaultDescription')} path="/" />

      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-grid">
            <motion.div
              className="hero-content"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.div className="hero-badge" variants={fadeUpSmall}>
                <span className="hero-badge-check" aria-hidden="true">
                  <svg viewBox="0 0 20 20"><path d="M4 10l4 4 8-8"/></svg>
                </span>
                <span>{t('home.eyebrow')}</span>
              </motion.div>
              <motion.h1 className="hero-title" variants={fadeUp}>
                {t('home.heroTitle')}
              </motion.h1>
              <motion.p className="hero-description" variants={fadeUpSmall}>
                {(() => {
                  const parts = t('home.heroSubtitle').split('—');
                  if (parts.length < 2) return t('home.heroSubtitle');
                  return (
                    <>
                      <strong>{parts[0].trim()}</strong>
                      {' — '}
                      {parts.slice(1).join('—').trim()}
                    </>
                  );
                })()}
              </motion.p>
              <motion.div className="hero-actions" variants={fadeUpSmall}>
                <motion.button
                  className="hero-btn hero-btn-dark"
                  onClick={() => window.open(getWhatsAppUrl(t), '_blank')}
                  variants={buttonHover}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                >
                  <span aria-hidden="true">📞</span> {t('home.heroBtnPrimary')}
                </motion.button>
                <motion.button
                  className="hero-btn hero-btn-green"
                  onClick={() => navigate('/case-studies')}
                  variants={buttonHover}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                >
                  {t('home.heroBtnSecondary')}
                </motion.button>
              </motion.div>
              <motion.div
                className="hero-subtitle-line"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <span className="hero-subtitle-check" aria-hidden="true">
                  <svg viewBox="0 0 20 20" fill="none"><path d="M4 10l4 4 8-8" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
                <span className="hero-subtitle-text">{t('home.heroTitleSub')}</span>
              </motion.div>
            </motion.div>

            <motion.div
              className="hero-visual"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <div className="hero-visual-inner">
                <motion.div className="hero-photo-wrap" variants={fadeUp}>
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={(isMobile ? HERO_MOBILE_IMAGES : HERO_DESKTOP_IMAGES)[heroImgIndex % (isMobile ? HERO_MOBILE_IMAGES : HERO_DESKTOP_IMAGES).length].file}
                      src={assetPath(`/${(isMobile ? HERO_MOBILE_IMAGES : HERO_DESKTOP_IMAGES)[heroImgIndex % (isMobile ? HERO_MOBILE_IMAGES : HERO_DESKTOP_IMAGES).length].dir}/${(isMobile ? HERO_MOBILE_IMAGES : HERO_DESKTOP_IMAGES)[heroImgIndex % (isMobile ? HERO_MOBILE_IMAGES : HERO_DESKTOP_IMAGES).length].file}`)}
                      alt="Saiful Islam - Founder"
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </AnimatePresence>
                </motion.div>

                {!isMobile && (
                <motion.div
                  className="hero-notif-card"
                  variants={fadeUpSmall}
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 5, ease: 'easeInOut', repeat: Infinity }}
                >
                  <div className="hero-notif-head">
                    <span className="hero-notif-avatar">
                      <AnimatePresence mode="wait">
                        <motion.img
                          key={HERO_CARDS[heroImgIndex % HERO_CARDS.length].avatar.file}
                          src={assetPath(`/${HERO_CARDS[heroImgIndex % HERO_CARDS.length].avatar.dir}/${HERO_CARDS[heroImgIndex % HERO_CARDS.length].avatar.file}`)}
                          alt=""
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </AnimatePresence>
                    </span>
                    <span className="hero-notif-name">{t(`${HERO_CARDS[heroImgIndex % HERO_CARDS.length].localeKey}.name`)}</span>
                    <span className="hero-notif-check" aria-hidden="true">
                      <svg viewBox="0 0 20 20"><path d="M4 10l4 4 8-8"/></svg>
                    </span>
                  </div>
                  <p className="hero-notif-quote">"{t(`${HERO_CARDS[heroImgIndex % HERO_CARDS.length].localeKey}.quote`)}"</p>
                  <div className="hero-notif-stats">
                    <div className="hero-notif-stat">
                      <strong>{t(`${HERO_CARDS[heroImgIndex % HERO_CARDS.length].localeKey}.stat1`)}</strong>
                      <span>{t(`${HERO_CARDS[heroImgIndex % HERO_CARDS.length].localeKey}.stat1Label`)}</span>
                    </div>
                    <div className="hero-notif-stat">
                      <strong>{t(`${HERO_CARDS[heroImgIndex % HERO_CARDS.length].localeKey}.stat2`)}</strong>
                      <span>{t(`${HERO_CARDS[heroImgIndex % HERO_CARDS.length].localeKey}.stat2Label`)}</span>
                    </div>
                  </div>
                </motion.div>
                )}
              </div>
            </motion.div>
          </div>

          <motion.div
            className="hero-features"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {HERO_FEATURES.map((f) => (
              <div className="hero-feature" key={f.key}>
                <span className="hero-feature-icon" aria-hidden="true">{f.icon}</span>
                <span className="hero-feature-label">{t(`home.heroFeatures.${f.key}`)}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="stats-section">
        <div className="container">
          <div className="stats-marquee-track">
            {STAT_NUMBERS.map((s, i) => (
              <div key={i} className="stat-card">
                <div className="stat-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                </div>
                <div>
                  <div className="stat-num">{s.num}</div>
                  <div className="stat-label">{t(`home.stats.${s.key}`)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="client-logos-section">
        <div className="client-logos-bar">
          <div className="client-logo-item">
            <span className="client-logo-text">EVO</span>
            <span className="client-logo-sub">LEATHER</span>
          </div>
          <div className="client-logo-item">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
            <span className="client-logo-text">LEATHIX</span>
          </div>
          <div className="client-logo-item">
            <span className="client-logo-icon">⚡</span>
            <span className="client-logo-text">GADGET</span>
          </div>
          <div className="client-logo-item">
            <span className="client-logo-text">Shavershop</span>
          </div>
          <div className="client-logo-item">
            <span className="client-logo-text">SSB</span>
            <span className="client-logo-sub">Leather</span>
          </div>
        </div>
      </section>

      <section className="framework-section">
        <div className="container">
          <MotionFadeUp className="section-head">
            <span className="eyebrow">🧭 {t('home.framework.eyebrow')}</span>
            <h2>{t('home.framework.title')}</h2>
            <p>{t('home.framework.subtitle')}</p>
          </MotionFadeUp>

          <MotionStaggerContainer className="framework-grid">
            {FRAMEWORK_KEYS.map((key, i) => {
              const colors = ['var(--orange)', 'var(--blue)', '#10b981', 'var(--orange)', 'var(--blue)', '#10b981'];
              const color = colors[i];
              return (
                <MotionStaggerItem
                  key={key}
                  className="framework-card"
                  style={{ '--phase-color': color }}
                >
                  <div className="framework-step">
                    <img src={assetPath(`/images/icons/${FRAMEWORK_ICONS[i]}.svg`)} alt="" />
                  </div>
                  <div className="framework-phase-badge">
                    <span className="framework-phase-number">Phase {i + 1}</span>
                  </div>
                  <h3>{t(`home.framework.${key}.title`)}</h3>
                  <p>{t(`home.framework.${key}.desc`)}</p>
                </MotionStaggerItem>
              );
            })}
          </MotionStaggerContainer>

          <div className="framework-accordion">
            {FRAMEWORK_KEYS.map((key, i) => {
              const colors = ['var(--orange)', 'var(--blue)', '#10b981', 'var(--orange)', 'var(--blue)', '#10b981'];
              const color = colors[i];
              const isOpen = openFramework === i;
              return (
                <motion.div
                  key={key}
                  className={`framework-acc-item ${isOpen ? 'open' : ''}`}
                  style={{ '--phase-color': color }}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.06 }}
                >
                  <button
                    className="framework-acc-header"
                    onClick={() => setOpenFramework(isOpen ? null : i)}
                    type="button"
                  >
                    <div className="framework-acc-icon">
                      <img src={assetPath(`/images/icons/${FRAMEWORK_ICONS[i]}.svg`)} alt="" />
                    </div>
                    <div className="framework-acc-title">
                      {t(`home.framework.${key}.title`)}
                    </div>
                    <span className="framework-acc-arrow">▼</span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        className="framework-acc-body"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        style={{ overflow: 'hidden' }}
                      >
                        {t(`home.framework.${key}.desc`)}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section start-here">
        <div className="container">
          <MotionFadeUp className="section-head">
            <span className="eyebrow">
              <span aria-hidden="true">🚀</span> {t('home.startHere.eyebrow')}
            </span>
            <h2>{t('home.startHere.title')}</h2>
            <p>{t('home.startHere.subtitle')}</p>
          </MotionFadeUp>

          <div className="journey-cards">
            {STAGE_KEYS.map((key, i) => (
              <motion.div key={key} className="journey-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
                <div className="journey-card-image">
                  <img src={STAGE_IMAGES[i]} alt={t(`home.startHere.stages.${key}.title`)} loading="lazy" />
                  <div className="journey-card-icon-circle">
                    <img src={assetPath(STAGE_IMAGES_ICONS[i])} alt={t(`home.startHere.stages.${key}.title`)} />
                  </div>
                </div>
                <div className="journey-card-content">
                  <span className="journey-pill">{t(`home.startHere.stages.${key}.heading`)}</span>
                  <h3>{t(`home.startHere.stages.${key}.title`)}</h3>
                  <p>{t(`home.startHere.stages.${key}.desc`)}</p>
                  {t(`home.startHere.stages.${key}.features`, { returnObjects: true }) && (
                    <ul className="journey-features">
                      {t(`home.startHere.stages.${key}.features`, { returnObjects: true }).map((f, fi) => (
                        <li key={fi}>
                          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10l4 4 8-8"/></svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                  <button
                    className="btn btn-journey"
                    onClick={() => navigate(`/${key === 'academy' ? 'academy' : key}`)}
                  >
                    {t(`home.startHere.stages.${key}.cta`)} →
                  </button>
                </div>
              </motion.div>
            ))}
           </div>
        </div>
      </section>

      <section className="section problems-section">
        <div className="container">
          {/* ── Header ── */}
          <motion.div
            className="problems-header"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
          >
            <span className="problems-badge">{t('home.problems.eyebrow')}</span>
            <h2 className="problems-heading">
              {(t('home.problems.title').split('—')[0] || t('home.problems.title'))}—<br />
              <span className="problems-heading-green">{t('home.problems.title').split('—')[1] || ''}</span>
            </h2>
            <p className="problems-subtitle">{t('home.problems.subtitle')}</p>
          </motion.div>

          {/* ── Comparison Grid ── */}
          <div className="comparison-grid">
            {/* ── Hero Cards (BEFORE / AFTER side by side) ── */}
            <div className="comparison-heroes">
              <motion.div
                className="hero-card hero-card-before"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5 }}
              >
                <div className="hero-card-header before">
                  <span className="hc-label">{t('home.problems.beforeLabel')}</span>
                  <span className="hc-title-en">{t('home.problems.beforeTitle')}</span>
                </div>
                <div className="hero-photo">
                  <img
                    src={assetPath('/images/before-new.png')}
                    alt={t('home.problems.beforeTitle')}
                    loading="lazy"
                  />
                </div>
              </motion.div>

              <motion.div
                className="hero-card hero-card-after"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5 }}
              >
                <div className="hero-card-header after">
                  <span className="hc-label">{t('home.problems.afterLabel')}</span>
                  <span className="hc-title-en">{t('home.problems.afterTitle')}</span>
                </div>
                <div className="hero-photo">
                  <img
                    src={assetPath('/images/after-new.png')}
                    alt={t('home.problems.afterTitle')}
                    loading="lazy"
                  />
                </div>
              </motion.div>
            </div>

            {/* ── Comparison Rows ── */}
            <div className="comparison-rows">
              {PROBLEM_KEYS.map((problemKey, i) => {
                const solutionKey = SOLUTION_KEYS[i];
                return (
                  <motion.div
                    className="comparison-row"
                    key={problemKey}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: i * 0.07 }}
                  >
                    {/* Problem Side */}
                    <div className="problem-side">
                      <div className="problem-icon-circle">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                          <path d="M6 6l12 12M18 6L6 18" />
                        </svg>
                      </div>
                      <div className="problem-text-group">
                        <strong>{t(`home.problems.items.${problemKey}`)}</strong>
                        <small>{t(`home.problems.comparison.${i}.problemSubBn`)}</small>
                      </div>
                    </div>

                    {/* Solution Side */}
                    <div className="solution-side">
                      <div className="solution-icon-circle">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M5 12l4.5 4.5L19 7" />
                        </svg>
                      </div>
                      <div className="solution-text-group">
                        <strong>{t(`home.problems.solutions.${solutionKey}.title`)}</strong>
                        <small>{t(`home.problems.solutions.${solutionKey}.desc`)}</small>
                      </div>
                    </div>

                    {/* Benefit Badge */}
                    <div className="solution-benefit">
                      <span className="benefit-text">{t(`home.problems.comparison.${i}.resultBn`)}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* ── Trust Strip ── */}
          <motion.div
            className="trust-strip"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <div className="trust-left">
              <span className="trust-target">🎯</span>
              <span className="problems-trust-label">{t('home.problems.bottom.text')}</span>
            </div>
            <div className="trust-center">
              <div className="trust-avatars">
                <div className="trust-avatar"><img src={assetPath('/pdf/All Imge Comprase Website/745.png')} alt="" /></div>
                <div className="trust-avatar"><img src={assetPath('/pdf/All Imge Comprase Website/7845.png')} alt="" /></div>
                <div className="trust-avatar"><img src={assetPath('/pdf/All Imge Comprase Website/9987.png')} alt="" /></div>
                <div className="trust-avatar"><img src={assetPath('/pdf/All Imge Comprase Website/987154.png')} alt="" /></div>
              </div>
              <div className="trust-rating">
                <span className="trust-stars">★★★★★</span>
                <span className="trust-count">{t('home.problems.bottom.trust')}</span>
              </div>
            </div>
          </motion.div>

          {/* ── CTA Button ── */}
          <motion.button
            className="problems-cta-btn"
            onClick={() => navigate('/contact')}
            whileHover={{ scale: 1.02, boxShadow: '0 16px 40px rgba(22,163,74,0.35)' }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.25 }}
          >
            🚀 {t('home.problems.bottom.cta')}
          </motion.button>
        </div>
      </section>

      <MotionFadeUp className="trust-bar-section">
        <div className="container">
          <div className="trust-bar">
            <div className="trust-bar-item">
              <div className="trust-bar-icon-circle">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
              </div>
              <div className="trust-bar-text">
                <strong>{t('home.startHere.trust.reliable.title')}</strong>
                <span>{t('home.startHere.trust.reliable.desc')}</span>
              </div>
            </div>
            <div className="trust-bar-item">
              <div className="trust-bar-icon-circle">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 21a8 8 0 0 0-16 0"/><circle cx="10" cy="8" r="5"/><path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"/></svg>
              </div>
              <div className="trust-bar-text">
                <strong>{t('home.startHere.trust.expert.title')}</strong>
                <span>{t('home.startHere.trust.expert.desc')}</span>
              </div>
            </div>
            <div className="trust-bar-item">
              <div className="trust-bar-icon-circle">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
              </div>
              <div className="trust-bar-text">
                <strong>{t('home.startHere.trust.results.title')}</strong>
                <span>{t('home.startHere.trust.results.desc')}</span>
              </div>
            </div>
          </div>
        </div>
      </MotionFadeUp>

      {/* ===== CLIENT RESULTS SECTION ===== */}
      <section className="client-results-section">
        <div className="container">
          <MotionFadeUp className="section-head">
            <span className="eyebrow">
              📊 {t('home.clientResults.eyebrow')}
            </span>
            <h2>{t('home.clientResults.title')}</h2>
            <p>{t('home.clientResults.subtitle')}</p>
          </MotionFadeUp>

          <div className="client-results-grid">
            {CLIENT_RESULT_KEYS.map((key) => (
              <motion.div
                key={key}
                className="client-result-card"
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="result-icon"><img src={assetPath(`/images/icons/${CLIENT_RESULT_ICONS[key]}.svg`)} alt="" /></div>
                <h3>{t(`home.clientResults.cards.${key}.title`)}</h3>
                <p>{t(`home.clientResults.cards.${key}.desc`)}</p>
                <div className="result-stat-box">
                  <span className="result-stat-label">{t('home.clientResults.keyResult')}</span>
                  <span className="result-stat">{t(`home.clientResults.cards.${key}.stat`)}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="ai-section">
        <div className="container">
          <MotionFadeUp className="section-head">
            <span className="eyebrow">🤖 {t('home.ai.eyebrow')}</span>
            <h2>{t('home.ai.title')}</h2>
            <p>{t('home.ai.subtitle')}</p>
          </MotionFadeUp>

          <MobileCarousel className="ai-grid" interval={3000} reverse>
            {AI_TOOL_KEYS.map((key, i) => (
              <motion.div key={key} className="ai-card" initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
                <div className="ai-icon">
                  <img src={assetPath(`/pdf/Website Icons & Images/Website Icons/${['Canva_Logo_0.svg', 'ChatGPT_Logo_0.svg', 'google-gemini-seeklogo.svg', 'Capcut Logo.svg'][i]}`)} alt={t(`home.ai.tools.${key}.name`)} />
                </div>
                <h3>{t(`home.ai.tools.${key}.name`)}</h3>
                <div className="ai-role">{t(`home.ai.tools.${key}.role`)}</div>
                <p>{t(`home.ai.tools.${key}.desc`)}</p>
              </motion.div>
            ))}
          </MobileCarousel>

          <MotionFadeUp className="workflow" delay={0.1}>
            <h3 className="workflow-title">⚙️ {t('home.ai.workflowTitle')}</h3>
            <MobileCarousel className="workflow-steps">
              {WORKFLOW_KEYS.map((key, i) => (
                <motion.div key={key} className="workflow-step" initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
                  <div className="workflow-num">{i + 1}</div>
                  <h4>{t(`home.ai.workflow.${key}.title`)}</h4>
                  <p>{t(`home.ai.workflow.${key}.desc`)}</p>
                </motion.div>
              ))}
            </MobileCarousel>
          </MotionFadeUp>
        </div>
      </section>

      <section className="section cases-section">
        <div className="container">
          <MotionFadeUp className="section-head">
            <span className="eyebrow">
              <span aria-hidden="true">📊</span> {t('home.cases.eyebrow')}
            </span>
            <h2>{t('home.cases.title')}</h2>
            <p>{t('home.cases.subtitle')}</p>
          </MotionFadeUp>

          <MobileCarousel className="grid grid-3">
            {CASE_KEYS.slice(0, 3).map((key, i) => (
              <motion.div key={key} className="case-card" initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
                <div className="case-header">
                  <div className="case-header-icon" aria-hidden="true">
                    {CASE_ICONS[i]}
                  </div>
                  <h3>{CASE_TITLES[i]}</h3>
                </div>
                <div className="case-body">
                  <div className="case-block">
                    <div className="case-block-label">{t('home.cases.challenge')}</div>
                    <p>{t(`caseStudies.defaults.${key}.challenge`)}</p>
                  </div>
                  <div className="case-block">
                    <div className="case-block-label">{t('home.cases.whatWeDid')}</div>
                    <ul className="case-checklist">
                      {t(`caseStudies.defaults.${key}.whatWeDid`, { returnObjects: true }) && (
                        t(`caseStudies.defaults.${key}.whatWeDid`, { returnObjects: true }).map((item, ci) => (
                          <li key={ci}>
                            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10l4 4 8-8"/></svg>
                            {item}
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                </div>
                <div className="case-result-box">
                  <div className="case-result-label">{t('home.cases.keyResult')}</div>
                  <div className="case-result-value">{t(`caseStudies.defaults.${key}.highlight`)}</div>
                </div>
              </motion.div>
            ))}
          </MobileCarousel>

          <div className="text-center" style={{ marginTop: 40 }}>
            <motion.button
              className="btn btn-dark"
              onClick={() => navigate('/case-studies')}
              variants={buttonHover}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
            >
              {t('home.cases.seeAll')} →
            </motion.button>
          </div>
        </div>
      </section>

      <section className="section testimonials-section">
        <div className="container">
          <MotionFadeUp className="section-head">
            <span className="eyebrow">
              <span aria-hidden="true">💬</span> {t('home.testimonials.eyebrow')}
            </span>
            <h2>{t('home.testimonials.title')}</h2>
            <p>{t('home.testimonials.subtitle')}</p>
          </MotionFadeUp>

          <div className="testimonial-marquee">
            <div className="testimonial-marquee-track">
              {[...Array(2)].flatMap(() =>
                TESTIMONIAL_KEYS.map((key) => (
                  <div key={key} className="testimonial-card">
                    <div className="testimonial-stars">{'★'.repeat(5)}</div>
                    <p className="testimonial-text">"{t(`home.testimonials.items.${key}.text`)}"</p>
                    <div className="testimonial-author">
                      <div className="testimonial-avatar">
                        {t(`home.testimonials.items.${key}.name`)
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)}
                      </div>
                      <div>
                        <div className="testimonial-name">
                          {t(`home.testimonials.items.${key}.name`)}
                        </div>
                        <div className="testimonial-role">
                          {t(`home.testimonials.items.${key}.role`)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      <FAQ />

      <Packages />

      <section className="section founder-section">
        <div className="container">
          <motion.div
            className="founder-grid"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
          >
            <motion.div className="founder-image-wrap" variants={fadeUp}>
              <img
                className="founder-image"
                src={assetPath('/images/Saiful Islam.png')}
                alt="Saiful Islam"
                loading="lazy"
              />
              <div className="founder-exp-badge">
                <strong>১০+</strong>
                <span>{t('home.founder.yearsExp')}</span>
              </div>
            </motion.div>

            <motion.div className="founder-content" variants={fadeUp}>
              <h2>{t('home.founderName')}</h2>
              <p className="founder-role">{t('home.founder.role')}</p>

              <ul className="founder-stats-list">
                <li>{t('home.founder.stats.exp')}</li>
                <li>{t('home.founder.stats.brands')}</li>
                <li>{t('home.founder.stats.entrepreneurs')}</li>
                <li>{t('home.founder.stats.businesses')}</li>
              </ul>

              <p className="founder-specialty">{t('home.founder.specialty')}</p>

              <motion.button
                className="btn btn-dark"
                onClick={() => navigate('/contact')}
                variants={buttonHover}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
              >
                {t('home.founder.bookCall')}
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== FOUNDER INTRO VIDEO SECTION ===== */}
      <section className="founder-intro-section">
        <div className="container">
          <MotionFadeUp className="section-head">
            <span className="eyebrow">
              <span aria-hidden="true">🎬</span> {t('home.founderIntro.eyebrow')}
            </span>
            <h2>{t('home.founderIntro.title')}</h2>
            <p>{t('home.founderIntro.subtitle')}</p>
          </MotionFadeUp>

          <MotionFadeUp className="founder-video-wrapper">
            <video
              className="founder-video"
              poster={assetPath('/images/Saiful Islam.png')}
              controls
              preload="metadata"
              playsInline
            >
              <source src={assetPath('/videos/founder-intro.mp4')} type="video/mp4" />
            </video>
          </MotionFadeUp>
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
            <motion.div className="badge" variants={fadeUpSmall}>
              🚀 {t('home.finalCta.badge')}
            </motion.div>
            <motion.h2 variants={fadeUp}>{t('home.finalCta.title')}</motion.h2>
            <motion.p variants={fadeUpSmall}>{t('home.finalCta.subtitle')}</motion.p>
            <motion.div className="final-cta-actions" variants={fadeUpSmall}>
              <motion.button
                className="btn btn-white"
                onClick={() => navigate('/contact')}
                variants={buttonHover}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
              >
                📅 {t('home.finalCta.book')}
              </motion.button>
              <motion.button
                className="btn btn-dark"
                onClick={() => navigate('/academy')}
                variants={buttonHover}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
              >
                🎓 {t('home.finalCta.join')}
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}

export default HomePage;
