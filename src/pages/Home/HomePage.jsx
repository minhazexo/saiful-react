import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api, { IS_DEMO_MODE } from '../../api';
import { useTranslation } from '../../context/LanguageContext';
import FAQ from '../../components/FAQ';
import Seo from '../../components/Seo';
import { MotionFadeUp, MotionStaggerContainer, MotionStaggerItem } from '../../motion/MotionFadeUp';
import { fadeUp, fadeUpSmall, staggerContainer, staggerGrid, buttonHover } from '../../motion/presets';
import { assetPath } from '../../utils/assets';
import './HomePage.css';

const STAT_NUMBERS = [
  { num: '5000', suffix: '+', key: 'designProjects' },
  { num: '20', suffix: '+', key: 'industriesServed' },
  { num: '10', suffix: '+', key: 'yearsExperience' },
  { num: '100', suffix: '+', key: 'consultations' },
];

const STAGE_KEYS = ['academy', 'setup', 'growth'];
const STAGE_ICONS_PDF = ['🎓', '🛠️', '🚀'];
const PROBLEM_KEYS = ['noBrand', 'noWebsite', 'noContent', 'noMarketing', 'noGrowth'];
const SOLUTION_KEYS = ['brand', 'website', 'content', 'marketing'];
const FRAMEWORK_KEYS = ['idea', 'learn', 'setup', 'launch', 'grow', 'scale'];
const FRAMEWORK_ICONS = ['💡', '👥', '⚙️', '🚀', '📈', '🏆'];
const PACKAGE_KEYS = ['academy', 'setup', 'growth'];
const AI_TOOL_KEYS = ['canva', 'chatgpt', 'gemini', 'capcut'];
const WORKFLOW_KEYS = ['research', 'create', 'produce', 'distribute', 'optimize'];
const TESTIMONIAL_KEYS = ['rahim', 'farida', 'nusrat'];
const CASE_KEYS = [
  'leathix',
  'futureConnect',
  'fashionNova',
  'naturalGlow',
  'techZone',
  'craftyHands',
];

const CASE_ICONS = ['👜', '🎧', '👗', '🌿', '💻', '🧶'];
const CASE_GRADIENTS = [
  'linear-gradient(135deg,#FFE7CC,#fff)',
  'linear-gradient(135deg,#DBEAFE,#fff)',
  'linear-gradient(135deg,#FCE7F3,#fff)',
  'linear-gradient(135deg,#D1FAE5,#fff)',
  'linear-gradient(135deg,#E0E7FF,#fff)',
  'linear-gradient(135deg,#FEF3C7,#fff)',
];

function HomePage() {
  const t = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/contact', {
        ...formData,
        source: 'lead-magnet',
      });
      setSubmitStatus('success');
      setFormData({ name: '', email: '', whatsapp: '' });
      setTimeout(() => setSubmitStatus(null), 5000);
    } catch (err) {
      setSubmitStatus(IS_DEMO_MODE || err?.isDemoMode ? 'demo' : 'error');
      setTimeout(() => setSubmitStatus(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
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
                <span className="pulse-dot"></span>
                <span>{t('home.eyebrow')}</span>
              </motion.div>
              <motion.h1 className="hero-title" variants={fadeUp}>
                <span className="hero-title-navy">
                  Launch, Build &amp;<br />Grow Your
                </span>
                <span className="hero-title-orange">
                  E-commerce<br />Business
                </span>
              </motion.h1>
              <motion.p className="hero-description" variants={fadeUpSmall}>
                {t('home.heroSubtitle')}
              </motion.p>
              <motion.div className="hero-actions" variants={fadeUpSmall}>
                <motion.button
                  className="hero-btn hero-btn-primary"
                  onClick={() => navigate('/contact')}
                  variants={buttonHover}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                >
                  <span>📅</span> {t('home.bookFreeConsultation')}
                </motion.button>
                <motion.button
                  className="hero-btn hero-btn-secondary"
                  onClick={() => navigate('/academy')}
                  variants={buttonHover}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                >
                  <span>🎓</span> {t('home.joinAcademy')}
                </motion.button>
              </motion.div>

              <motion.div className="hero-social-proof" variants={fadeUpSmall}>
                <div className="hero-avatars">
                  <div className="hero-avatar" style={{ background: '#FF7A00' }}>S</div>
                  <div className="hero-avatar" style={{ background: '#2563EB' }}>R</div>
                  <div className="hero-avatar" style={{ background: '#10B981' }}>N</div>
                  <div className="hero-avatar" style={{ background: '#F59E0B' }}>T</div>
                </div>
                <div>
                  <div className="hero-stars">★★★★★</div>
                  <div className="hero-proof-text">
                    {t('home.trustedBy')} <strong>{t('home.trustedByCount')}</strong>{' '}
                    {t('home.trustedBySuffix')}
                  </div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              className="hero-visual"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {/* Portrait */}
              <motion.div className="hero-portrait" variants={fadeUp}>
                <img src={assetPath('/images/My-Design.png')} alt="Saiful Islam - Founder" />
              </motion.div>

              {/* Service Card */}
              <motion.div className="service-card" variants={fadeUp}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, ease: 'easeInOut', repeat: Infinity }}
              >
                <div className="service-card-header">
                  <h3>{t('home.heroServiceCardTitle')}</h3>
                </div>
                <div className="service-card-list">
                  <div className="service-card-item">
                    <div className="service-card-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF8A00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                    </div>
                    <span>{t('home.heroServices.brand')}</span>
                  </div>
                  <div className="service-card-item">
                    <div className="service-card-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF8A00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    </div>
                    <span>{t('home.heroServices.social')}</span>
                  </div>
                  <div className="service-card-item">
                    <div className="service-card-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF8A00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                    </div>
                    <span>{t('home.heroServices.website')}</span>
                  </div>
                  <div className="service-card-item">
                    <div className="service-card-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF8A00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                    </div>
                    <span>{t('home.heroServices.ai')}</span>
                  </div>
                  <div className="service-card-item">
                    <div className="service-card-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF8A00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                    </div>
                    <span>{t('home.heroServices.growth')}</span>
                  </div>
                </div>
              </motion.div>

              {/* Glassmorphism Profile Card */}
              <motion.div className="glass-card" variants={fadeUp}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 7, ease: 'easeInOut', repeat: Infinity, delay: 1 }}
              >
                <div className="glass-card-avatar">
                  <div className="glass-card-avatar-inner">SI</div>
                </div>
                <div className="glass-card-info">
                  <div className="glass-card-name">{t('home.heroProfileTitle')}</div>
                  <div className="glass-card-role">{t('home.heroProfileRole')}</div>
                  <div className="glass-card-exp">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF8A00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    {t('home.heroProfileExp')}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="trust-section">
        <div className="container">
          <motion.div
            className="trust-grid"
            variants={staggerGrid}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {STAT_NUMBERS.map((s, i) => (
              <motion.div key={i} className="trust-item" variants={fadeUpSmall}>
                <div className="trust-num">
                  {s.num}
                  <span>{s.suffix}</span>
                </div>
                <div className="trust-label">{t(`home.stats.${s.key}`)}</div>
              </motion.div>
            ))}
          </motion.div>
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

          <MotionStaggerContainer className="grid grid-3">
            {STAGE_KEYS.map((key, i) => (
              <MotionStaggerItem key={key} className="stage-card">
                <div className="stage-number">
                  {t('home.startHere.step')} {i + 1}
                </div>
                <div className="stage-icon">
                  {STAGE_ICONS_PDF[i]}
                </div>
                <h3>{t(`home.startHere.stages.${key}.title`)}</h3>
                <p>{t(`home.startHere.stages.${key}.desc`)}</p>
                <button
                  className="btn btn-outline"
                  onClick={() => navigate(`/${key === 'academy' ? 'academy' : key}`)}
                >
                  {t(`home.startHere.stages.${key}.cta`)} →
                </button>
              </MotionStaggerItem>
            ))}
          </MotionStaggerContainer>
        </div>
      </section>

      <section className="section problems-section">
        <div className="container">
          <MotionFadeUp className="section-head">
            <span className="eyebrow">
              <span aria-hidden="true">😩</span> {t('home.problems.eyebrow')}
            </span>
            <h2>{t('home.problems.title')}</h2>
            <p>{t('home.problems.subtitle')}</p>
          </MotionFadeUp>

          <motion.div
            className="problems-grid"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div className="problems-col" variants={fadeUp}>
              <h3 className="problems-title problems-bad">❌ {t('home.problems.holdingBack')}</h3>
              <ul className="problems-list">
                {PROBLEM_KEYS.map((key) => (
                  <li key={key}>
                    <span className="problem-icon">❌</span>
                    <span>{t(`home.problems.items.${key}`)}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div className="problems-col problems-good-col" variants={fadeUp}>
              <h3 className="problems-title problems-good">✅ {t('home.problems.howWeHelp')}</h3>
              <ul className="problems-list">
                {SOLUTION_KEYS.map((key) => (
                  <li key={key}>
                    <span className="problem-icon">✅</span>
                    <span>
                      <strong>{t(`home.problems.solutions.${key}.title`)}</strong>
                      <br />
                      <small className="solution-desc">{t(`home.problems.solutions.${key}.desc`)}</small>
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="framework-section">
        <div className="container">
          <MotionFadeUp className="section-head">
            <span className="eyebrow light">🧭 {t('home.framework.eyebrow')}</span>
            <h2 style={{ color: '#fff' }}>{t('home.framework.title')}</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)' }}>{t('home.framework.subtitle')}</p>
          </MotionFadeUp>

          <MotionStaggerContainer className="framework-grid">
            {FRAMEWORK_KEYS.map((key, i) => {
              const colors = ['var(--orange)', 'var(--blue)', '#10b981', 'var(--orange)', 'var(--blue)', '#10b981'];
              const color = colors[i];
              return (
                <MotionStaggerItem
                  key={key}
                  className="framework-card"
                  style={{ borderColor: color }}
                >
                  <div className="framework-step" style={{ background: color }}>
                    {FRAMEWORK_ICONS[i]}
                  </div>
                  <h3>{t(`home.framework.${key}.title`)}</h3>
                  <p>{t(`home.framework.${key}.desc`)}</p>
                </MotionStaggerItem>
              );
            })}
          </MotionStaggerContainer>
        </div>
      </section>

      <section className="section packages-section">
        <div className="container">
          <MotionFadeUp className="section-head">
            <span className="eyebrow">
              <span aria-hidden="true">💼</span> {t('home.packages.eyebrow')}
            </span>
            <h2>{t('home.packages.title')}</h2>
            <p>{t('home.packages.subtitle')}</p>
          </MotionFadeUp>

          <MotionStaggerContainer className="grid grid-3">
            {PACKAGE_KEYS.map((key) => {
              const featured = key === 'setup';
              const featureKeys =
                key === 'academy'
                  ? ['liveClasses', 'templates', 'community', 'aiTools', 'lifetime']
                  : key === 'setup'
                    ? ['logo', 'brand', 'website', 'payment', 'social']
                    : ['content', 'ads', 'video', 'strategy', 'reporting'];
              return (
                <MotionStaggerItem
                  key={key}
                  className={`package-card ${featured ? 'featured' : ''}`}
                  style={featured ? { transformOrigin: 'center top' } : undefined}
                >
                  {featured && (
                    <div className="package-badge">⭐ {t('home.packages.mostPopular')}</div>
                  )}
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
                </MotionStaggerItem>
              );
            })}
          </MotionStaggerContainer>
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
                📅 {t('home.founder.bookCall')}
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="ai-section">
        <div className="container">
          <MotionFadeUp className="section-head">
            <span className="eyebrow light">🤖 {t('home.ai.eyebrow')}</span>
            <h2 style={{ color: '#fff' }}>{t('home.ai.title')}</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)' }}>{t('home.ai.subtitle')}</p>
          </MotionFadeUp>

          <MotionStaggerContainer className="ai-grid">
            {AI_TOOL_KEYS.map((key, i) => (
              <MotionStaggerItem key={key} className="ai-card">
                <div className="ai-icon">{['🎨', '✍️', '🔍', '🎬'][i]}</div>
                <h3>{t(`home.ai.tools.${key}.name`)}</h3>
                <div className="ai-role">{t(`home.ai.tools.${key}.role`)}</div>
                <p>{t(`home.ai.tools.${key}.desc`)}</p>
              </MotionStaggerItem>
            ))}
          </MotionStaggerContainer>

          <MotionFadeUp className="workflow" delay={0.1}>
            <h3 className="workflow-title">⚙️ {t('home.ai.workflowTitle')}</h3>
            <MotionStaggerContainer className="workflow-steps">
              {WORKFLOW_KEYS.map((key, i) => (
                <MotionStaggerItem key={key} className="workflow-step">
                  <div className="workflow-num">{i + 1}</div>
                  <h4>{t(`home.ai.workflow.${key}.title`)}</h4>
                  <p>{t(`home.ai.workflow.${key}.desc`)}</p>
                </MotionStaggerItem>
              ))}
            </MotionStaggerContainer>
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

          <MotionStaggerContainer className="grid grid-3">
            {CASE_KEYS.map((key, i) => (
              <MotionStaggerItem key={key} className="case-card">
                <div className="case-header">
                  <div className="case-icon-wrap" style={{ background: CASE_GRADIENTS[i] }}>
                    <span className="case-icon" aria-hidden="true">
                      {CASE_ICONS[i]}
                    </span>
                  </div>
                  <span className="case-category">{t(`caseStudies.defaults.${key}.category`)}</span>
                </div>
                <h3 className="case-title">{t(`caseStudies.defaults.${key}.title`)}</h3>
                <div className="case-section">
                  <span className="case-section-label">{t('home.cases.challenge')}</span>
                  <p className="case-section-text">{t(`caseStudies.defaults.${key}.challenge`)}</p>
                </div>
                <div className="case-section">
                  <span className="case-section-label">{t('home.cases.solution')}</span>
                  <p className="case-section-text">{t(`caseStudies.defaults.${key}.solution`)}</p>
                </div>
                <div className="case-result">
                  <span className="case-result-label">{t('home.cases.result')}</span>
                  <div className="case-result-highlight">
                    {t(`caseStudies.defaults.${key}.highlight`)}
                  </div>
                </div>
              </MotionStaggerItem>
            ))}
          </MotionStaggerContainer>

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

          <MotionStaggerContainer className="grid grid-3">
            {TESTIMONIAL_KEYS.map((key) => (
              <MotionStaggerItem key={key} className="testimonial-card">
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
              </MotionStaggerItem>
            ))}
          </MotionStaggerContainer>
        </div>
      </section>

      <section className="section lead-magnet">
        <div className="container">
          <div className="lead-grid">
            <motion.div
              className="lead-content"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <motion.div className="badge" variants={fadeUpSmall}>
                🎁 {t('home.leadMagnet.badge')}
              </motion.div>
              <motion.h2 variants={fadeUp}>{t('home.leadMagnet.title')}</motion.h2>
              <motion.p variants={fadeUpSmall}>{t('home.leadMagnet.subtitle')}</motion.p>
              <div className="lead-perks">
                {['checklist', 'research', 'branding', 'ai', 'facebook'].map((key) => (
                  <motion.div key={key} className="lead-perk" variants={fadeUpSmall}>
                    <div className="lead-perk-icon">✅</div>
                    <div>{t(`home.leadMagnet.perks.${key}`)}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <form className="lead-form" onSubmit={handleFormSubmit}>
                <motion.h3 variants={fadeUpSmall}>{t('home.leadMagnet.formTitle')} 📋</motion.h3>
                <motion.p variants={fadeUpSmall}>{t('home.leadMagnet.formSubtitle')}</motion.p>

                <div className="form-group">
                  <label>{t('home.leadMagnet.nameLabel')}</label>
                  <input
                    type="text"
                    name="name"
                    placeholder={t('home.leadMagnet.namePlaceholder')}
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>{t('home.leadMagnet.emailLabel')}</label>
                  <input
                    type="email"
                    name="email"
                    placeholder={t('home.leadMagnet.emailPlaceholder')}
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>{t('home.leadMagnet.whatsappLabel')}</label>
                  <input
                    type="tel"
                    name="whatsapp"
                    placeholder={t('home.leadMagnet.whatsappPlaceholder')}
                    value={formData.whatsapp}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <motion.button
                  type="submit"
                  className="btn btn-primary btn-block"
                  disabled={isSubmitting}
                  variants={buttonHover}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                >
                  {isSubmitting
                    ? `⏳ ${t('home.leadMagnet.submitting')}`
                    : `📥 ${t('home.leadMagnet.submit')}`}
                </motion.button>

                {submitStatus === 'success' && (
                  <p className="success-message">✅ {t('home.leadMagnet.success')}</p>
                )}
                {submitStatus === 'error' && (
                  <p className="error-message">❌ {t('home.leadMagnet.error')}</p>
                )}
                {submitStatus === 'demo' && (
                  <p className="error-message" role="status">👀 {t('demo.formMessage')}</p>
                )}

                <motion.p className="form-disclaimer" variants={fadeUpSmall}>
                  {t('home.leadMagnet.disclaimer')}
                </motion.p>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      <FAQ />

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
