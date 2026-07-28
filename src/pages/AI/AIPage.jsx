import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from '../../context/LanguageContext';
import Seo from '../../components/Seo';
import MobileCarousel from '../../components/MobileCarousel/MobileCarousel';
import { MotionFadeUp } from '../../motion/MotionFadeUp';
import { staggerContainer, fadeUp, buttonHover } from '../../motion/presets';
import { assetPath } from '../../utils/assets';
import './AIPage.css';
import Packages from '../../components/Packages/Packages';
import './AIPage.responsive.css';

const TOOL_ICONS = ['canva', 'chatgpt', 'gemini', 'capcut'];
const TOOL_KEYS = ['canva', 'chatgpt', 'gemini', 'capcut'];
const WORKFLOW_KEYS = ['idea', 'design', 'copy', 'video', 'analyze'];
const WORKFLOW_ICONS = ['research', 'branding', 'fast-content', 'launch', 'grow'];
const OUTCOMES = [
  { metric: '10x', key: 'output' },
  { metric: '60%', key: 'cpa' },
  { metric: '24/7', key: 'autopilot' },
  { metric: '৳0', key: 'cost' },
];

function AIPage() {
  const t = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="page ai-page">
      <Seo title={t('ai.title')} description={t('ai.subtitle')} path="/ai" />
      <section className="page-hero">
        <div className="container">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.span className="eyebrow" variants={fadeUp}>
              <span aria-hidden="true">🤖</span> {t('ai.eyebrow')}
            </motion.span>
            <motion.h1 variants={fadeUp}>{t('ai.title')}</motion.h1>
            <motion.p variants={fadeUp}>{t('ai.subtitle')}</motion.p>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <MotionFadeUp className="section-head">
            <span className="eyebrow">
              <span aria-hidden="true">🛠️</span> {t('ai.tools.eyebrow')}
            </span>
            <h2>{t('ai.tools.title')}</h2>
            <p>{t('ai.tools.subtitle')}</p>
          </MotionFadeUp>

          <MobileCarousel className="ai-tools-grid">
            {TOOL_KEYS.map((key, i) => (
              <motion.div key={key} className="ai-tool-card" initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
                <div className="ai-tool-icon"><img src={assetPath(`/images/icons/${TOOL_ICONS[i]}.svg`)} alt="" /></div>
                <h3>{key.charAt(0).toUpperCase() + key.slice(1)}</h3>
                <div className="ai-tool-role">{t(`ai.tools.items.${key}.role`)}</div>
                <p>{t(`ai.tools.items.${key}.desc`)}</p>
                <ul className="ai-tool-benefits">
                  {(() => {
                    const benefits = t(`ai.tools.items.${key}.benefits`);
                    if (!Array.isArray(benefits)) return null;
                    return benefits.map((b, j) => (
                      <li key={j}>
                        <span className="check">✓</span>
                        {b}
                      </li>
                    ));
                  })()}
                </ul>
              </motion.div>
            ))}
          </MobileCarousel>
        </div>
      </section>

      <section className="section workflow-section">
        <div className="container">
          <MotionFadeUp className="section-head">
            <span className="eyebrow">
              <span aria-hidden="true">⚙️</span> {t('ai.workflow.eyebrow')}
            </span>
            <h2>{t('ai.workflow.title')}</h2>
            <p>{t('ai.workflow.subtitle')}</p>
          </MotionFadeUp>

          <MobileCarousel className="ai-workflow">
            {WORKFLOW_KEYS.map((key, i) => (
              <motion.div key={key} className="ai-workflow-step" initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
                <div className="ai-workflow-day">{i + 1}</div>
                <div className="ai-workflow-icon"><img src={assetPath(`/images/icons/${WORKFLOW_ICONS[i]}.svg`)} alt="" /></div>
                <h3>{t(`ai.workflow.items.${key}.title`)}</h3>
                <p>{t(`ai.workflow.items.${key}.desc`)}</p>
              </motion.div>
            ))}
          </MobileCarousel>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <MobileCarousel className="grid grid-4">
            {OUTCOMES.map((o) => (
              <motion.div key={o.key} style={{ textAlign: 'center' }} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(40px, 5vw, 56px)',
                    fontWeight: 900,
                    color: 'var(--orange)',
                    lineHeight: 1,
                    marginBottom: 8,
                  }}
                >
                  {o.metric}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>
                  {t(`ai.outcomes.${o.key}`)}
                </div>
              </motion.div>
            ))}
          </MobileCarousel>
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
            <motion.h2 variants={fadeUp}>{t('ai.cta.title')}</motion.h2>
            <motion.p variants={fadeUp}>{t('ai.cta.subtitle')}</motion.p>
            <motion.div className="cta-actions" variants={fadeUp}>
              <motion.button
                className="btn btn-white"
                onClick={() => navigate('/contact')}
                variants={buttonHover}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
              >
                {t('ai.cta.button')} →
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Packages />
    </div>
  );
}

export default AIPage;
