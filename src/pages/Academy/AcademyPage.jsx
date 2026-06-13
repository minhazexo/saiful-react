import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import api, { IS_DEMO_MODE } from '../../api';
import { useTranslation } from '../../context/LanguageContext';
import Seo from '../../components/Seo';
import { MotionFadeUp, MotionStaggerContainer, MotionStaggerItem } from '../../motion/MotionFadeUp';
import { staggerContainer, fadeUp, buttonHover } from '../../motion/presets';
import './AcademyPage.css';
import './AcademyPage.responsive.css';

const MODULE_ICONS = ['📚', '🎨', '💻', '✍️', '📱', '💰', '🤖', '📈'];
const MODULE_KEYS = [
  'foundations',
  'brand',
  'website',
  'content',
  'social',
  'ads',
  'ai',
  'scaling',
];
const PERK_KEYS = ['lifetime', 'community', 'qa', 'templates', 'certificate', 'guarantee'];
const STAGE_KEYS = ['beginner', 'idea', 'launched', 'scaling'];

function AcademyPage() {
  const t = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    stage: '',
    goals: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const timerRef = useRef(null);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/contact', {
        ...formData,
        source: 'academy-enrollment',
        service: 'academy',
      });
      setSubmitStatus('success');
      setFormData({ name: '', email: '', whatsapp: '', stage: '', goals: '' });
      timerRef.current = setTimeout(() => setSubmitStatus(null), 5000);
    } catch (err) {
      setSubmitStatus(IS_DEMO_MODE || err?.isDemoMode ? 'demo' : 'error');
      timerRef.current = setTimeout(() => setSubmitStatus(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page">
      <Seo title={t('academy.title')} description={t('academy.subtitle')} path="/academy" />
      <section className="page-hero">
        <div className="container">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.span className="eyebrow" variants={fadeUp}>
              <span aria-hidden="true">🎓</span> {t('academy.eyebrow')}
            </motion.span>
            <motion.h1 variants={fadeUp}>{t('academy.title')}</motion.h1>
            <motion.p variants={fadeUp}>{t('academy.subtitle')}</motion.p>
          </motion.div>
        </div>
      </section>

      <section className="section modules-section">
        <div className="container">
          <MotionFadeUp className="section-head">
            <span className="eyebrow">
              <span aria-hidden="true">📚</span> {t('academy.modules.eyebrow')}
            </span>
            <h2>{t('academy.modules.title')}</h2>
            <p>{t('academy.modules.subtitle')}</p>
          </MotionFadeUp>

          <MotionStaggerContainer className="modules-grid">
            {MODULE_KEYS.map((key, i) => (
              <MotionStaggerItem key={key} className="module-card">
                <div className="module-number">0{i + 1}</div>
                <div className="module-icon">{MODULE_ICONS[i]}</div>
                <h3>{t(`academy.modules.items.${key}.title`)}</h3>
                <p>{t(`academy.modules.items.${key}.desc`)}</p>
              </MotionStaggerItem>
            ))}
          </MotionStaggerContainer>
        </div>
      </section>

      <section className="section academy-pricing">
        <div className="container">
          <MotionFadeUp className="section-head">
            <span className="eyebrow">
              <span aria-hidden="true">💰</span> {t('academy.pricing.eyebrow')}
            </span>
            <h2>{t('academy.pricing.title')}</h2>
            <p>{t('academy.pricing.subtitle')}</p>
          </MotionFadeUp>

          <MotionFadeUp className="pricing-box" amount={0.15}>
            <div className="price">
              <span className="price-strike">{t('academy.pricing.strike')}</span>
              {t('academy.pricing.price')}
              <span className="price-tag">{t('academy.pricing.save')}</span>
            </div>
            <p className="text-muted" style={{ marginBottom: 24 }}>
              {t('academy.pricing.note')}
            </p>

            <MotionStaggerContainer as="ul" className="pricing-features" staggerDelay={0.05}>
              {PERK_KEYS.map((key) => (
                <MotionStaggerItem key={key} as="li">
                  <span className="check">✓</span>
                  {t(`academy.pricing.perks.${key}`)}
                </MotionStaggerItem>
              ))}
            </MotionStaggerContainer>

            <motion.a
              href="#enroll"
              className="btn btn-primary btn-block"
              variants={buttonHover}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
            >
              🎓 {t('academy.pricing.cta', { price: t('academy.pricing.price') })}
            </motion.a>
          </MotionFadeUp>
        </div>
      </section>

      <section className="section enrollment-section" id="enroll">
        <div className="container">
          <div className="enrollment-grid">
            <motion.div
              className="enrollment-content"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <motion.span
                className="eyebrow"
                style={{
                  background: 'rgba(255,122,0,0.2)',
                  color: 'var(--orange)',
                  borderColor: 'rgba(255,122,0,0.4)',
                }}
                variants={fadeUp}
              >
                📝 {t('academy.enroll.eyebrow')}
              </motion.span>
              <motion.h2 variants={fadeUp}>{t('academy.enroll.title')}</motion.h2>
              <motion.p variants={fadeUp}>{t('academy.enroll.subtitle')}</motion.p>

              <MotionStaggerContainer className="enrollment-perks" staggerDelay={0.06}>
                {PERK_KEYS.slice(0, 4).map((key) => (
                  <MotionStaggerItem key={key} className="enrollment-perk">
                    <span className="enrollment-perk-icon">✓</span>
                    <span>{t(`academy.enroll.perks.${key}`)}</span>
                  </MotionStaggerItem>
                ))}
              </MotionStaggerContainer>
            </motion.div>

            <motion.form
              className="enrollment-form"
              onSubmit={handleSubmit}
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              <motion.h3 variants={fadeUp}>{t('academy.enroll.formTitle')}</motion.h3>

              <motion.div className="form-group" variants={fadeUp}>
                <label>{t('academy.enroll.nameLabel')}</label>
                <input
                  type="text"
                  name="name"
                  placeholder={t('academy.enroll.namePlaceholder')}
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </motion.div>

              <motion.div className="form-group" variants={fadeUp}>
                <label>{t('academy.enroll.emailLabel')}</label>
                <input
                  type="email"
                  name="email"
                  placeholder={t('academy.enroll.emailPlaceholder')}
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </motion.div>

              <motion.div className="form-group" variants={fadeUp}>
                <label>{t('academy.enroll.whatsappLabel')}</label>
                <input
                  type="tel"
                  name="whatsapp"
                  placeholder={t('academy.enroll.whatsappPlaceholder')}
                  value={formData.whatsapp}
                  onChange={handleChange}
                  required
                />
              </motion.div>

              <motion.div className="form-group" variants={fadeUp}>
                <label>{t('academy.enroll.stageLabel')}</label>
                <select name="stage" value={formData.stage} onChange={handleChange} required>
                  <option value="">{t('academy.enroll.stagePlaceholder')}</option>
                  {STAGE_KEYS.map((key) => (
                    <option key={key} value={key}>
                      {t(`academy.enroll.stageOptions.${key}`)}
                    </option>
                  ))}
                </select>
              </motion.div>

              <motion.div className="form-group" variants={fadeUp}>
                <label>{t('academy.enroll.goalsLabel')}</label>
                <textarea
                  name="goals"
                  placeholder={t('academy.enroll.goalsPlaceholder')}
                  rows="3"
                  value={formData.goals}
                  onChange={handleChange}
                ></textarea>
              </motion.div>

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
                  ? `⏳ ${t('academy.enroll.submitting')}`
                  : `🎓 ${t('academy.enroll.submit')}`}
              </motion.button>

              {submitStatus === 'success' && (
                <motion.p
                  className="success-message"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  ✅ {t('academy.enroll.success')}
                </motion.p>
              )}
              {submitStatus === 'error' && (
                <motion.p
                  className="error-message"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  ❌ {t('academy.enroll.error')}
                </motion.p>
              )}
              {submitStatus === 'demo' && (
                <motion.p
                  className="error-message"
                  role="status"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  👀 {t('demo.formMessage')}
                </motion.p>
              )}
            </motion.form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AcademyPage;
