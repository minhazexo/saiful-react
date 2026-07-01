import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../../context/LanguageContext';
import FAQ from '../../components/FAQ/FAQ';
import Seo from '../../components/Seo';
import MobileCarousel from '../../components/MobileCarousel/MobileCarousel';
import { MotionFadeUp, MotionStaggerContainer, MotionStaggerItem } from '../../motion/MotionFadeUp';
import { fadeUp, fadeUpSmall, staggerContainer, buttonHover } from '../../motion/presets';
import { assetPath } from '../../utils/assets';
import { getWhatsAppUrl } from '../../utils/whatsapp';
import './HomePage.css';

const STAT_NUMBERS = [
  { num: '১৫+', key: 'designProjects' },
  { num: '১৫০+', key: 'industriesServed' },
  { num: '৩০+', key: 'yearsExperience' },
  { num: '৭.২X', key: 'consultations' },
  { num: '১০+', key: 'businessesLaunched' },
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

// Problems → Solutions comparison (6 rows, matches the design)
const PROBLEM_KEYS = ['noBrand', 'noWebsite', 'noContent', 'noMarketing', 'noGrowth', 'noProcess'];
const SOLUTION_KEYS = ['training', 'brand', 'website', 'content', 'marketing', 'growth'];

const FRAMEWORK_KEYS = ['idea', 'learn', 'setup', 'launch', 'grow', 'scale'];
const FRAMEWORK_ICONS = ['idea', 'learn', 'setup', 'launch', 'grow', 'scale'];
const WORKFLOW_KEYS = ['research', 'create', 'produce', 'distribute', 'optimize'];
const TESTIMONIAL_KEYS = ['rahim', 'farida', 'nusrat', 'kamal'];

// Client results (rendered as case-study style cards)
const CLIENT_RESULT_KEYS = ['leathix', 'evoLeather', 'shopHouse'];
const CLIENT_RESULT_ICONS = ['👜', '👞', '🛍️'];

const HERO_DESKTOP_IMAGES = [
  { file: 'Founder-1.png', dir: 'pdf/All Imge Comprase Website' },
  { file: 'Founder-2.png', dir: 'pdf/All Imge Comprase Website' },
];
const HERO_MOBILE_IMAGES = [
  { file: 'Founder-1.png', dir: 'pdf/All Imge Comprase Website' },
  { file: 'Founder-2.png', dir: 'pdf/All Imge Comprase Website' },
];
const HERO_CARDS = [
  { localeKey: 'home.heroCardGirl', avatar: { file: 'Founder-1.png', dir: 'pdf/All Imge Comprase Website' } },
  { localeKey: 'home.heroCardBoy', avatar: { file: 'Founder-2.png', dir: 'pdf/All Imge Comprase Website' } },
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
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="container">
          <div className="stats-marquee">
            <div className="stats-marquee-track">
            {(isMobile ? [...STAT_NUMBERS, ...STAT_NUMBERS] : STAT_NUMBERS).map((s, i) => (
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
        </div>
      </section>

      <section className="client-logos-section">
        <div className="client-logos-bar">
          <div className="client-logo-item">
            <img src={assetPath('/pdf/Brand Logos/Evo Leather.png')} alt="EVO Leather" />
          </div>
          <div className="client-logo-item">
            <img src={assetPath('/pdf/Brand Logos/Leathix.png')} alt="Leathix" />
          </div>
          <div className="client-logo-item">
            <img src={assetPath('/pdf/Brand Logos/DK Gadget.png')} alt="DK Gadget" />
          </div>
          <div className="client-logo-item">
            <img src={assetPath('/pdf/Brand Logos/Shavershop.png')} alt="Shavershop" />
          </div>
          <div className="client-logo-item">
            <img src={assetPath('/pdf/Brand Logos/SSB Leather.png')} alt="SSB Leather" />
          </div>
          <div className="client-logo-item">
            <img src={assetPath('/pdf/Brand Logos/Shop House Logo.png')} alt="Shop House" />
          </div>
        </div>
      </section>

      {/* ===== PROBLEMS → SOLUTIONS ===== */}
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
            <p className="problems-eyebrow">{t('home.problems.eyebrow')}</p>
            <h2 className="problems-heading">
              {(t('home.problems.title').split('—')[0] || t('home.problems.title'))}
            </h2>
            <p className="problems-heading-green">{t('home.problems.title').split('—')[1] || ''}</p>
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
                <div className="hero-card-icon before">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
                    <polyline points="17 18 23 18 23 12" />
                  </svg>
                </div>
                <span className="hc-title-bn">{t('home.problems.beforeTitle')}</span>
              </motion.div>

              <motion.div
                className="hero-card hero-card-after"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5 }}
              >
                <div className="hero-card-icon after">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                    <polyline points="17 6 23 6 23 12" />
                  </svg>
                </div>
                <span className="hc-title-bn">{t('home.problems.afterTitle')}</span>
              </motion.div>
            </div>

            {/* ── Comparison Rows (Desktop) ── */}
            <div className="comparison-rows comparison-rows-desktop">
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

            {/* ── Mobile Only: Problems Section ── */}
            <div className="comparison-rows comparison-rows-mobile-problems">
              <div className="mobile-card-wrapper">
                <div className="mobile-before-badge">{t('home.problems.beforeLabel')}</div>
                <div className="mobile-hero-card mobile-hero-card-before">
                  <span className="hc-title-bn">{t('home.problems.beforeTitle')}</span>
                  <div className="hero-card-icon before">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
                      <polyline points="17 18 23 18 23 12" />
                    </svg>
                  </div>
                  <div className="mobile-card-rows">
                    {PROBLEM_KEYS.map((problemKey, i) => (
                      <motion.div
                        className="comparison-row problem-row"
                        key={`problem-${problemKey}`}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.35, delay: i * 0.07 }}
                      >
                        <div className="problem-side">
                          <div className="problem-icon-circle">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                              <path d="M6 6l12 12M18 6L6 18" />
                            </svg>
                          </div>
                          <div className="problem-text-group">
                            <strong>{t(`home.problems.items.${problemKey}`)}</strong>
                          </div>
                        </div>
                        <div className="row-chevron">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Mobile Only: Solutions Section ── */}
            <div className="comparison-rows comparison-rows-mobile-solutions">
              <div className="mobile-card-wrapper">
                <div className="mobile-after-badge">{t('home.problems.afterLabel')}</div>
                <div className="mobile-hero-card mobile-hero-card-after">
                  <span className="hc-title-bn">{t('home.problems.afterTitle')}</span>
                  <div className="hero-card-icon after">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                      <polyline points="17 6 23 6 23 12" />
                    </svg>
                  </div>
                  <div className="mobile-card-rows">
                    {PROBLEM_KEYS.map((problemKey, i) => {
                      const solutionKey = SOLUTION_KEYS[i];
                      return (
                        <motion.div
                          className="comparison-row solution-row"
                          key={`solution-${solutionKey}`}
                          initial={{ opacity: 0, y: 16 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.35, delay: i * 0.07 }}
                        >
                          <div className="solution-side">
                            <div className="solution-icon-circle">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M5 12l4.5 4.5L19 7" />
                              </svg>
                            </div>
                            <div className="solution-text-group">
                              <strong>{t(`home.problems.solutions.${solutionKey}.title`)}</strong>
                            </div>
                          </div>
                          <div className="row-chevron">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="6 9 12 15 18 9" />
                            </svg>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
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
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.25 }}
          >
            <span aria-hidden="true">📢</span> {t('home.problems.bottom.cta')}
          </motion.button>
        </div>
      </section>

      {/* ===== CHOOSE YOUR CATEGORY ===== */}
      <section className="section start-here">
        <div className="container">
          <MotionFadeUp className="section-head">
            <span className="eyebrow eyebrow-plain">{t('home.startHere.eyebrow')}</span>
            <h2>{t('home.startHere.title')}</h2>
            {t('home.startHere.subtitle') && <p>{t('home.startHere.subtitle')}</p>}
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

      {/* ===== TRUST BAR ===== */}
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

      {/* ===== FRAMEWORK / FULL JOURNEY ===== */}
      <section className="framework-section">
        <div className="container">
          <MotionFadeUp className="section-head">
            <span className="eyebrow eyebrow-plain">{t('home.framework.eyebrow')}</span>
            <h2>{t('home.framework.title')}</h2>
            {t('home.framework.subtitle') && <p>{t('home.framework.subtitle')}</p>}
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

      {/* ===== 5-STEP PROCESS (dark) ===== */}
      <section className="section process-section">
        <div className="container">
          <MotionFadeUp className="section-head">
            <span className="eyebrow eyebrow-plain on-dark">{t('home.ai.workflowSubtitle')}</span>
            <h2>{t('home.ai.workflowTitle')}</h2>
          </MotionFadeUp>

          <MobileCarousel className="workflow-steps">
            {WORKFLOW_KEYS.map((key, i) => (
              <motion.div key={key} className="workflow-step" initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
                <div className="workflow-num">{i + 1}</div>
                <h4>{t(`home.ai.workflow.${key}.title`)}</h4>
                <p>{t(`home.ai.workflow.${key}.desc`)}</p>
              </motion.div>
            ))}
          </MobileCarousel>

          <div className="text-center" style={{ marginTop: 44 }}>
            <motion.button
              className="problems-cta-btn"
              onClick={() => navigate('/contact')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span aria-hidden="true">📢</span> {t('home.problems.bottom.cta')}
            </motion.button>
          </div>
        </div>
      </section>

      {/* ===== FOUNDER ===== */}
      <section className="section founder-section">
        <div className="container">
          <MotionFadeUp className="section-head">
            <h2>{t('home.founder.title')}</h2>
          </MotionFadeUp>

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
                <li dangerouslySetInnerHTML={{ __html: t('home.founder.stats.exp') }} />
                <li dangerouslySetInnerHTML={{ __html: t('home.founder.stats.brands') }} />
                <li dangerouslySetInnerHTML={{ __html: t('home.founder.stats.entrepreneurs') }} />
                <li dangerouslySetInnerHTML={{ __html: t('home.founder.stats.businesses') }} />
                <li>{t('home.founder.specialty')}</li>
              </ul>

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

      {/* ===== CLIENT RESULTS (case-study cards) ===== */}
      <section className="section cases-section client-results-section">
        <div className="container">
          <MotionFadeUp className="section-head">
            <h2>{t('home.clientResults.title')}</h2>
            {t('home.clientResults.subtitle') && <p>{t('home.clientResults.subtitle')}</p>}
          </MotionFadeUp>

          <MobileCarousel className="grid grid-3">
            {CLIENT_RESULT_KEYS.map((key, i) => (
              <motion.div key={key} className="case-card" initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
                <div className="case-header">
                  <div className="case-header-icon" aria-hidden="true">
                    {CLIENT_RESULT_ICONS[i]}
                  </div>
                  <h3>{t(`home.clientResults.cards.${key}.title`)}</h3>
                </div>
                <div className="case-body">
                  <div className="case-block">
                    <div className="case-block-label">{t('home.clientResults.challenge')}</div>
                    <p>{t(`home.clientResults.cards.${key}.challenge`)}</p>
                  </div>
                  <div className="case-block">
                    <div className="case-block-label">{t('home.clientResults.whatWeDid')}</div>
                    <ul className="case-checklist">
                      {t(`home.clientResults.cards.${key}.whatWeDid`, { returnObjects: true }) && (
                        t(`home.clientResults.cards.${key}.whatWeDid`, { returnObjects: true }).map((item, ci) => (
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
                  <div className="case-result-label">{t('home.clientResults.keyResult')}</div>
                  <div className="case-result-value">{t(`home.clientResults.cards.${key}.stat`)}</div>
                </div>
              </motion.div>
            ))}
          </MobileCarousel>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="section testimonials-section">
        <div className="container">
          <MotionFadeUp className="section-head">
            <span className="eyebrow eyebrow-plain">{t('home.testimonials.eyebrow')}</span>
            <h2>{t('home.testimonials.title')}</h2>
            {t('home.testimonials.subtitle') && <p>{t('home.testimonials.subtitle')}</p>}
          </MotionFadeUp>

          <div className="testimonial-marquee">
            <div className="testimonial-marquee-track">
              {[...Array(2)].flatMap((_, copy) =>
                TESTIMONIAL_KEYS.map((key) => (
                  <div key={`${copy}-${key}`} className="testimonial-card">
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

      {/* ===== FINAL CTA ===== */}
      <section className="final-cta">
        <div className="container">
          <motion.div
            className="final-cta-box"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div className="final-cta-eyebrow" variants={fadeUpSmall}>
              {t('home.finalCta.eyebrow')}
            </motion.div>
            <motion.h2 variants={fadeUp}>{t('home.finalCta.title')}</motion.h2>
            <motion.ul className="final-cta-perks" variants={fadeUpSmall}>
              {t('home.finalCta.perks', { returnObjects: true }) &&
                t('home.finalCta.perks', { returnObjects: true }).map((perk, i) => (
                  <li key={i}>
                    <span aria-hidden="true">📌</span> {perk}
                  </li>
                ))}
            </motion.ul>
            <motion.div className="final-cta-actions" variants={fadeUpSmall}>
              <motion.button
                className="btn btn-white"
                onClick={() => navigate('/contact')}
                variants={buttonHover}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
              >
                {t('home.finalCta.book')}
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}

export default HomePage;
