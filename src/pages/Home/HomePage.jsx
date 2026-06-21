import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api, { IS_DEMO_MODE } from '../../api';
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
  { num: '৪০+', key: 'businessesLaunched' },
  { num: '২৭০+', key: 'students' },
  { num: '৮০+', key: 'liveTraining' },
  { num: '৩২+', key: 'successfulEntrepreneurs' },
  { num: '৯৫%', key: 'satisfaction' },
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
  'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
];

const STAGE_IMAGES_ICONS = [
  '/images/Academy 1.png',
  '/images/Growth 2.png',
  '/images/Setup 3.png',
];
const PROBLEM_KEYS = ['noBrand', 'noWebsite', 'noContent', 'noMarketing', 'noGrowth'];
const SOLUTION_KEYS = ['brand', 'website', 'content', 'marketing', 'growth'];
const FRAMEWORK_KEYS = ['idea', 'learn', 'setup', 'launch', 'grow', 'scale'];
const FRAMEWORK_ICONS = ['💡', '👥', '⚙️', '🚀', '📈', '🏆'];
const PACKAGE_KEYS = ['academy', 'setup', 'growth'];
const AI_TOOL_KEYS = ['canva', 'chatgpt', 'gemini', 'capcut'];
const WORKFLOW_KEYS = ['research', 'create', 'produce', 'distribute', 'optimize'];
const TESTIMONIAL_KEYS = ['rahim', 'farida', 'nusrat', 'kamal', 'sultana', 'hasan'];
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
const CLIENT_RESULT_KEYS = ['higherSales', 'betterBranding', 'onlinePresence', 'fasterContent'];
const CLIENT_RESULT_ICONS = {
  higherSales: '📈',
  betterBranding: '🎨',
  onlinePresence: '🌐',
  fasterContent: '⚡',
};
function HomePage() {
  const t = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: '', email: '', whatsapp: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [openFramework, setOpenFramework] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/contact', { ...formData, source: 'lead-magnet' });
      setSubmitStatus('success');
      setFormData({ name: '', email: '', whatsapp: '' });
    } catch (err) {
      setSubmitStatus(IS_DEMO_MODE || err?.isDemoMode ? 'demo' : 'error');
    } finally { setIsSubmitting(false); }
  };

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
              <motion.p className="hero-subtitle-line" variants={fadeUpSmall}>
                {t('home.heroTitleSub')}
              </motion.p>
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
            </motion.div>

            <motion.div
              className="hero-visual"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <div className="hero-visual-inner">
                <motion.div className="hero-photo-wrap" variants={fadeUp}>
                  <img
                    src={assetPath('/images/Entreprenure-cutout.png')}
                    alt="Saiful Islam - Founder"
                  />
                </motion.div>

                <motion.div
                  className="hero-notif-card"
                  variants={fadeUpSmall}
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 5, ease: 'easeInOut', repeat: Infinity }}
                >
                  <div className="hero-notif-head">
                    <span className="hero-notif-avatar">
                      <img src={assetPath('/images/Entreprenure.jpg.jpeg')} alt="" />
                    </span>
                    <span className="hero-notif-name">{t('home.heroCard.name')}</span>
                    <span className="hero-notif-check" aria-hidden="true">
                      <svg viewBox="0 0 20 20"><path d="M4 10l4 4 8-8"/></svg>
                    </span>
                  </div>
                  <p className="hero-notif-quote">"{t('home.heroCard.quote')}"</p>
                  <div className="hero-notif-stats">
                    <div className="hero-notif-stat">
                      <strong>{t('home.heroCard.stat1')}</strong>
                      <span>{t('home.heroCard.stat1Label')}</span>
                    </div>
                    <div className="hero-notif-stat">
                      <strong>{t('home.heroCard.stat2')}</strong>
                      <span>{t('home.heroCard.stat2Label')}</span>
                    </div>
                  </div>
                </motion.div>
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
        <div className="stats-marquee">
          <div className="stats-marquee-track">
            {[...Array(2)].flatMap((_, dup) =>
              STAT_NUMBERS.map((s, i) => (
                <div key={`${dup}-${i}`} className="stat-card" aria-hidden={dup === 1}>
                  <div className="stat-num">{s.num}</div>
                  <div className="stat-label">{t(`home.stats.${s.key}`)}</div>
                </div>
              ))
            )}
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
                  <div className="framework-step" style={{ background: color }}>
                    {FRAMEWORK_ICONS[i]}
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
                    <div className="framework-acc-icon" style={{ backgroundColor: color }}>
                      {FRAMEWORK_ICONS[i]}
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
                  <h3>{t(`home.startHere.stages.${key}.title`)}</h3>
                  <p>{t(`home.startHere.stages.${key}.desc`)}</p>
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

          <MotionFadeUp className="trust-bar">
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
          </MotionFadeUp>
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
                <div className="hero-photo">
                  <img
                    src={assetPath('/images/before.png')}
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
                <div className="hero-photo">
                  <img
                    src={assetPath('/images/after.png')}
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

                    {/* Arrow */}
                    <div className="row-arrow" aria-hidden="true">→</div>

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
                      <div className="solution-benefit">
                        <span className="benefit-sub">{t(`home.problems.comparison.${i}.benefitSubBn`)}</span>
                        <span className="benefit-text">{t(`home.problems.comparison.${i}.benefitBn`)}</span>
                      </div>
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
                <div className="trust-avatar" style={{ background: 'linear-gradient(135deg,#22c55e,#16a34a)' }} />
                <div className="trust-avatar" style={{ background: 'linear-gradient(135deg,#3b82f6,#2563eb)' }} />
                <div className="trust-avatar" style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)' }} />
                <div className="trust-avatar" style={{ background: 'linear-gradient(135deg,#8b5cf6,#7c3aed)' }} />
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
                <div className="result-icon">{CLIENT_RESULT_ICONS[key]}</div>
                <h3>{t(`home.clientResults.cards.${key}.title`)}</h3>
                <p>{t(`home.clientResults.cards.${key}.desc`)}</p>
                <span className="result-stat">{t(`home.clientResults.cards.${key}.stat`)}</span>
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

          <MobileCarousel className="ai-grid">
            {AI_TOOL_KEYS.map((key, i) => (
              <motion.div key={key} className="ai-card" initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
                <div className="ai-icon">
                  <img src={assetPath(`/images/${['canva.webp', 'chatgpt.png', 'gemini.jpg', 'capcut.webp'][i]}`)} alt={t(`home.ai.tools.${key}.name`)} />
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
                  <div className="case-header-text">
                    <span className="case-category">{t(`caseStudies.defaults.${key}.category`)}</span>
                    <h3>{CASE_TITLES[i]}</h3>
                  </div>
                </div>
                <div className="case-block">
                  <div className="case-block-label">{t('home.cases.challenge')}</div>
                  <p>{t(`caseStudies.defaults.${key}.challenge`)}</p>
                </div>
                <div className="case-block">
                  <div className="case-block-label">{t('home.cases.solution')}</div>
                  <p>{t(`caseStudies.defaults.${key}.solution`)}</p>
                </div>
                <div className="case-block">
                  <div className="case-block-label">{t('home.cases.result')}</div>
                  <p>{t(`caseStudies.defaults.${key}.result`)}</p>
                </div>
                <div className="case-highlight-box">
                  <div className="case-highlight-label">{t('caseStudies.keyOutcome')}</div>
                  <div className="case-highlight-value">{t(`caseStudies.defaults.${key}.highlight`)}</div>
                </div>
                  <span className="case-cta-link">
                    {t('home.cases.viewProject')} →
                  </span>
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
                src={assetPath('/images/gpt-image-1.5-high-fidelity_a_Create_a_professiona.png')}
                alt="Saiful Islam"
                loading="lazy"
              />
              <div className="founder-exp-badge">
                <strong>10+</strong>
                <span>{t('home.founder.yearsExp')}</span>
              </div>
            </motion.div>

            <motion.div className="founder-content" variants={fadeUp}>
              <span className="eyebrow">
                <span aria-hidden="true">👋</span> {t('home.founder.eyebrow')}
              </span>
              <h2>{t('home.founderName')}</h2>
              <p className="founder-role">{t('home.founder.role')}</p>
              <p className="founder-bio">{t('home.founder.bio')}</p>

              <div className="founder-stats">
                <div>
                  <div className="founder-stat-num">5,000+</div>
                  <div className="founder-stat-label">{t('home.founder.stats.projects')}</div>
                </div>
                <div>
                  <div className="founder-stat-num">20+</div>
                  <div className="founder-stat-label">{t('home.founder.stats.industries')}</div>
                </div>
                <div>
                  <div className="founder-stat-num">2,000+</div>
                  <div className="founder-stat-label">{t('home.founder.stats.founders')}</div>
                </div>
              </div>

              <motion.button
                className="btn btn-primary"
                onClick={() => navigate('/contact')}
                variants={buttonHover}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
              >
                📞 {t('home.founder.bookCall')}
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
              poster={assetPath('/images/gpt-image-1.5-high-fidelity_a_Create_a_professiona.png')}
              controls
              preload="metadata"
              playsInline
            >
              <source src={assetPath('/videos/founder-intro.mp4')} type="video/mp4" />
            </video>
          </MotionFadeUp>
        </div>
      </section>

      <section className="section lead-magnet">
        <div className="lead-glow lead-glow-1" />
        <div className="lead-glow lead-glow-2" />
        <div className="container">
          <div className="lead-grid">
            <motion.div
              className="lead-content"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <motion.div className="lead-badge" variants={fadeUpSmall}>
                🔥 {t('home.leadMagnet.badge')}
              </motion.div>
              <motion.h2 className="lead-heading" variants={fadeUp}>
                {t('home.leadMagnet.title')}
              </motion.h2>
              <motion.div className="lead-cover-wrap" variants={fadeUp}>
                <motion.img
                  src={assetPath('/for-cover/e-book-cover.png')}
                  alt="E-Book Cover"
                  className="lead-cover-img"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 5, ease: 'easeInOut', repeat: Infinity }}
                />
              </motion.div>
            </motion.div>

            <motion.div
              className="lead-form-card"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <motion.h3 className="lead-form-title" variants={fadeUpSmall}>
                {t('home.leadMagnet.formTitle')} 📦
              </motion.h3>
              <form onSubmit={handleFormSubmit}>
                <motion.div className="lead-form-group" variants={fadeUpSmall}>
                  <input
                    type="text"
                    name="name"
                    placeholder={t('home.leadMagnet.namePlaceholder')}
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </motion.div>
                <motion.div className="lead-form-group" variants={fadeUpSmall}>
                  <input
                    type="email"
                    name="email"
                    placeholder={t('home.leadMagnet.emailPlaceholder')}
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </motion.div>
                <motion.div className="lead-form-group" variants={fadeUpSmall}>
                  <input
                    type="tel"
                    name="whatsapp"
                    placeholder={t('home.leadMagnet.whatsappPlaceholder')}
                    value={formData.whatsapp}
                    onChange={handleInputChange}
                    required
                  />
                </motion.div>
                <motion.button
                  type="submit"
                  className="lead-cta-btn"
                  disabled={isSubmitting}
                  variants={fadeUpSmall}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isSubmitting ? `⏳ ${t('home.leadMagnet.submitting')}` : `⬇ ${t('home.leadMagnet.submit')}`}
                </motion.button>
                {submitStatus === 'success' && <p className="lead-success">✅ {t('home.leadMagnet.success')}</p>}
                {submitStatus === 'error' && <p className="lead-error">❌ {t('home.leadMagnet.error')}</p>}
                {submitStatus === 'demo' && <p className="lead-error" role="status">👀 {t('demo.formMessage')}</p>}

              </form>
            </motion.div>
          </div>
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
