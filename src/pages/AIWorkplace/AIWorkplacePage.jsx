import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from '../../context/LanguageContext';
import Seo from '../../components/Seo';
import MobileCarousel from '../../components/MobileCarousel/MobileCarousel';
import { MotionFadeUp } from '../../motion/MotionFadeUp';
import { staggerContainer, fadeUp, buttonHover } from '../../motion/presets';
import './AIWorkplacePage.css';
import './AIWorkplacePage.responsive.css';

const AI_TOOLS = [
  { key: 'description', icon: '📝' },
  { key: 'fbAd', icon: '📢' },
  { key: 'headline', icon: '💡' },
  { key: 'productImage', icon: '🖼️' },
  { key: 'bgRemove', icon: '✂️' },
  { key: 'banner', icon: '🎨' },
  { key: 'productVideo', icon: '🎬' },
  { key: 'seo', icon: '🔍' },
  { key: 'email', icon: '✉️' },
  { key: 'whatsapp', icon: '💬' },
];

const WORKFLOW_KEYS = ['upload', 'process', 'generate', 'save', 'download'];
const WORKFLOW_ICONS = ['📤', '⚙️', '🤖', '💾', '📥'];

const CREDIT_PLANS = [
  {
    key: 'starter',
    credits: '500',
    price: '৳500',
    pricePerCredit: '৳1',
    popular: false,
  },
  {
    key: 'popular',
    credits: '2,000',
    price: '৳1,800',
    pricePerCredit: '৳0.90',
    popular: true,
  },
  {
    key: 'pro',
    credits: '5,000',
    price: '৳4,000',
    pricePerCredit: '৳0.80',
    popular: false,
  },
  {
    key: 'enterprise',
    credits: '15,000',
    price: '৳10,000',
    pricePerCredit: '৳0.67',
    popular: false,
  },
];

function AIWorkplacePage() {
  const t = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="page aiw-page">
      <Seo
        title={t('aiWorkplace.title')}
        description={t('aiWorkplace.subtitle')}
        path="/ai-workplace"
      />

      {/* ──────────────── HERO ──────────────── */}
      <section className="aiw-hero">
        <div className="aiw-hero-bg">
          <div className="aiw-hero-grid" />
          <div className="aiw-hero-glow" />
        </div>
        <div className="container">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="aiw-hero-content"
          >
            <motion.span className="aiw-eyebrow" variants={fadeUp}>
              <span aria-hidden="true">⚡</span> {t('aiWorkplace.eyebrow')}
            </motion.span>
            <motion.h1 variants={fadeUp} dangerouslySetInnerHTML={{ __html: t('aiWorkplace.heroTitle') }} />
            <motion.p variants={fadeUp}>{t('aiWorkplace.heroSubtitle')}</motion.p>
            <motion.div className="aiw-hero-actions" variants={fadeUp}>
              <motion.button
                className="btn btn-primary aiw-btn-primary"
                onClick={() => navigate('/contact')}
                variants={buttonHover}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
              >
                {t('aiWorkplace.heroCta')} →
              </motion.button>
              <motion.button
                className="btn btn-outline aiw-btn-outline"
                onClick={() => {
                  document.getElementById('aiw-tools')?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                  });
                }}
                variants={buttonHover}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
              >
                {t('aiWorkplace.heroCta2')}
              </motion.button>
            </motion.div>
          </motion.div>
        </div>

        {/* Stats row */}
        <div className="aiw-hero-stats">
          {['tools', 'credits', 'users', 'uptime'].map((s, i) => (
            <motion.div
              key={s}
              className="aiw-stat-item"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.08, duration: 0.5 }}
            >
              <div className="aiw-stat-num">{t(`aiWorkplace.stats.${s}.num`)}</div>
              <div className="aiw-stat-label">{t(`aiWorkplace.stats.${s}.label`)}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ──────────────── AI TOOLS ──────────────── */}
      <section className="section" id="aiw-tools">
        <div className="container">
          <MotionFadeUp className="section-head">
            <span className="eyebrow">
              <span aria-hidden="true">🛠️</span> {t('aiWorkplace.tools.eyebrow')}
            </span>
            <h2>{t('aiWorkplace.tools.title')}</h2>
            <p>{t('aiWorkplace.tools.subtitle')}</p>
          </MotionFadeUp>

          <MobileCarousel className="aiw-tools-grid">
            {AI_TOOLS.map((tool, i) => (
              <motion.div
                key={tool.key}
                className="aiw-tool-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="aiw-tool-icon" aria-hidden="true">
                  {tool.icon}
                </div>
                <h3>{t(`aiWorkplace.tools.items.${tool.key}.name`)}</h3>
                <p>{t(`aiWorkplace.tools.items.${tool.key}.desc`)}</p>
                <div className="aiw-tool-cost">
                  <span className="aiw-tool-badge">
                    {t(`aiWorkplace.tools.items.${tool.key}.cost`)} {t('aiWorkplace.credits')}
                  </span>
                </div>
              </motion.div>
            ))}
          </MobileCarousel>
        </div>
      </section>

      {/* ──────────────── WORKFLOW ──────────────── */}
      <section className="aiw-workflow-section">
        <div className="container">
          <MotionFadeUp className="section-head">
            <span className="eyebrow aiw-workflow-eyebrow">
              <span aria-hidden="true">⚙️</span> {t('aiWorkplace.workflow.eyebrow')}
            </span>
            <h2 className="aiw-light-heading">{t('aiWorkplace.workflow.title')}</h2>
            <p className="aiw-light-text">{t('aiWorkplace.workflow.subtitle')}</p>
          </MotionFadeUp>

          <div className="aiw-workflow-steps">
            {WORKFLOW_KEYS.map((key, i) => (
              <motion.div
                key={key}
                className="aiw-workflow-step"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="aiw-step-num">{i + 1}</div>
                <div className="aiw-step-icon" aria-hidden="true">
                  {WORKFLOW_ICONS[i]}
                </div>
                <h3>{t(`aiWorkplace.workflow.items.${key}.title`)}</h3>
                <p>{t(`aiWorkplace.workflow.items.${key}.desc`)}</p>
                {i < WORKFLOW_KEYS.length - 1 && (
                  <div className="aiw-step-connector" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────── CREDIT SYSTEM ──────────────── */}
      <section className="section">
        <div className="container">
          <MotionFadeUp className="section-head">
            <span className="eyebrow">
              <span aria-hidden="true">💳</span> {t('aiWorkplace.credits.eyebrow')}
            </span>
            <h2>{t('aiWorkplace.credits.title')}</h2>
            <p>{t('aiWorkplace.credits.subtitle')}</p>
          </MotionFadeUp>

          <div className="aiw-credit-grid">
            {CREDIT_PLANS.map((plan, i) => (
              <motion.div
                key={plan.key}
                className={`aiw-credit-card${plan.popular ? ' popular' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                {plan.popular && (
                  <span className="aiw-popular-badge">
                    ★ {t('aiWorkplace.credits.mostPopular')}
                  </span>
                )}
                <h3>{t(`aiWorkplace.credits.plans.${plan.key}.name`)}</h3>
                <div className="aiw-credit-price">
                  <span className="aiw-price">{plan.price}</span>
                  <span className="aiw-period">/ {t('aiWorkplace.credits.oneTime')}</span>
                </div>
                <div className="aiw-credit-amount">
                  <span className="aiw-credit-num">{plan.credits}</span>
                  <span className="aiw-credit-label">{t('aiWorkplace.creditsUnit')}</span>
                </div>
                <div className="aiw-credit-rate">
                  {t('aiWorkplace.credits.asLowAs')} <strong>{plan.pricePerCredit}</strong> / {t('aiWorkplace.creditsUnit').toLowerCase()}
                </div>
                <ul className="aiw-credit-perks">
                  {t(`aiWorkplace.credits.plans.${plan.key}.perks`).map((perk, j) => (
                    <li key={j}>
                      <span className="aiw-check-icon">✓</span> {perk}
                    </li>
                  ))}
                </ul>
                <button
                  className={`btn aiw-credit-cta ${plan.popular ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => navigate('/contact')}
                >
                  {t('aiWorkplace.credits.buyNow')}
                </button>
              </motion.div>
            ))}
          </div>

          <MotionFadeUp className="aiw-credit-note">
            <p>💡 {t('aiWorkplace.credits.note')}</p>
          </MotionFadeUp>
        </div>
      </section>

      {/* ──────────────── PROFIT MODEL ──────────────── */}
      <section className="aiw-profit-section">
        <div className="container">
          <MotionFadeUp className="section-head">
            <span className="eyebrow aiw-profit-eyebrow">
              <span aria-hidden="true">📊</span> {t('aiWorkplace.profit.eyebrow')}
            </span>
            <h2 className="aiw-light-heading">{t('aiWorkplace.profit.title')}</h2>
            <p className="aiw-light-text">{t('aiWorkplace.profit.subtitle')}</p>
          </MotionFadeUp>

          <div className="aiw-profit-grid">
            <motion.div
              className="aiw-profit-card aiw-profit-cost"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
            >
              <div className="aiw-profit-label">{t('aiWorkplace.profit.yourCost')}</div>
              <div className="aiw-profit-amount">৳3</div>
            </motion.div>
            <motion.div
              className="aiw-profit-arrow"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.2 }}
              aria-hidden="true"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </motion.div>
            <motion.div
              className="aiw-profit-card aiw-profit-price"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.1 }}
            >
              <div className="aiw-profit-label">{t('aiWorkplace.profit.custPrice')}</div>
              <div className="aiw-profit-amount">৳10</div>
            </motion.div>
            <motion.div
              className="aiw-profit-card aiw-profit-result"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.2 }}
            >
              <div className="aiw-profit-label">{t('aiWorkplace.profit.yourProfit')}</div>
              <div className="aiw-profit-amount aiw-profit-green">৳7</div>
              <div className="aiw-profit-sub">{t('aiWorkplace.profit.perTask')}</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ──────────────── FUTURE AGENT ──────────────── */}
      <section className="section">
        <div className="container">
          <MotionFadeUp className="section-head">
            <span className="eyebrow">
              <span aria-hidden="true">🤖</span> {t('aiWorkplace.agent.eyebrow')}
            </span>
            <h2>{t('aiWorkplace.agent.title')}</h2>
            <p>{t('aiWorkplace.agent.subtitle')}</p>
          </MotionFadeUp>

          <div className="aiw-agent-flow">
            <motion.div
              className="aiw-agent-start"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <div className="aiw-agent-start-icon" aria-hidden="true">📸</div>
              <p>{t('aiWorkplace.agent.start')}</p>
            </motion.div>

            <div className="aiw-agent-chain">
              {['understands', 'content', 'creative', 'publish'].map((step, i) => (
                <motion.div
                  key={step}
                  className="aiw-agent-step"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  <div className="aiw-agent-step-dot" />
                  <span>{t(`aiWorkplace.agent.steps.${step}`)}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────── CTA ──────────────── */}
      <section className="aiw-cta-section">
        <div className="container">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="aiw-cta-content"
          >
            <motion.h2 variants={fadeUp}>{t('aiWorkplace.cta.title')}</motion.h2>
            <motion.p variants={fadeUp}>{t('aiWorkplace.cta.subtitle')}</motion.p>
            <motion.div variants={fadeUp}>
              <motion.button
                className="btn btn-primary aiw-btn-cta"
                onClick={() => navigate('/contact')}
                variants={buttonHover}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
              >
                {t('aiWorkplace.cta.button')} →
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default AIWorkplacePage;
