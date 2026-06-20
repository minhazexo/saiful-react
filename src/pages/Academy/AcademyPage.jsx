import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../context/LanguageContext';
import Seo from '../../components/Seo';
import { MotionFadeUp } from '../../motion/MotionFadeUp';
import { staggerContainer, fadeUp } from '../../motion/presets';
import './AcademyPage.css';
import './AcademyPage.responsive.css';

const MODULE_ICONS = ['📖', '🎨', '💻', '📣', '📱', '💰', '🤖', '📈'];
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

function AcademyPage() {
  const t = useTranslation();
  const [openFaq, setOpenFaq] = useState(null);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', city: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ d: '০২', h: '১৪', m: '৩৭' });

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const toBangla = useCallback((n) => {
    const bn = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(n).padStart(2, '0').split('').map((d) => bn[d]).join('');
  }, []);

  useEffect(() => {
    const target = new Date().getTime() + (2 * 24 * 60 * 60 * 1000) + (14 * 60 * 60 * 1000) + (37 * 60 * 1000);
    const tick = () => {
      const now = new Date().getTime();
      const diff = Math.max(0, target - now);
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft({ d: toBangla(d), h: toBangla(h), m: toBangla(m) });
    };
    tick();
    const interval = setInterval(tick, 30000);
    return () => clearInterval(interval);
  }, [toBangla]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="page">
      <Seo title={t('academy.title')} description={t('academy.subtitle')} path="/academy" />

      <section className="academy-hero">
        <div className="wrap">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.span className="eyebrow" variants={fadeUp}>
              {t('academy.eyebrow')}
            </motion.span>
            <motion.h1 variants={fadeUp} dangerouslySetInnerHTML={{ __html: t('academy.title') }} />
            <motion.p variants={fadeUp}>{t('academy.subtitle')}</motion.p>
            <motion.div className="hero-actions" variants={fadeUp}>
              <a href="#enroll" className="btn btn-primary">{t('academy.pricing.cta')}</a>
              <a href="#modules" className="btn btn-outline">{t('academy.modulesCta')}</a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="stat-strip">
        <MotionFadeUp>
          <div className="wrap stat-grid">
              {(() => {
                const items = t('academy.stats.items');
                if (!Array.isArray(items)) return null;
                return items.map((item, i) => (
                  <div key={i}>
                    <div className="num">{item.num}</div>
                    <div className="lbl">{item.label}</div>
                  </div>
                ));
              })()}
            </div>
          </MotionFadeUp>
      </div>

      <section className="section modules-section" id="modules">
        <div className="wrap">
          <MotionFadeUp className="section-head">
            <span className="eyebrow-light">{t('academy.modules.eyebrow')}</span>
            <h2>{t('academy.modules.title')}</h2>
            <p>{t('academy.modules.subtitle')}</p>
          </MotionFadeUp>

          <div className="module-grid">
            {MODULE_KEYS.map((key, i) => (
              <motion.div
                key={key}
                className="module-card"
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="module-top">
                  <div className="module-icon">{MODULE_ICONS[i]}</div>
                  <div className="module-num">0{i + 1}</div>
                </div>
                <h3>{t(`academy.modules.items.${key}.title`)}</h3>
                <p>{t(`academy.modules.items.${key}.desc`)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section pricing-section">
        <div className="wrap">
          <MotionFadeUp className="section-head">
            <span className="eyebrow-light">{t('academy.pricing.eyebrow')}</span>
            <h2>{t('academy.pricing.title')}</h2>
            <p>{t('academy.pricing.subtitle')}</p>
          </MotionFadeUp>

          <MotionFadeUp className="price-card" amount={0.15}>
            <div className="price-row">
              <span className="price-old">{t('academy.pricing.oldPrice')}</span>
              <span className="price-new">{t('academy.pricing.newPrice')}</span>
              <span className="price-badge">{t('academy.pricing.saveBadge')}</span>
            </div>
            <div className="price-sub">{t('academy.pricing.note')}</div>
            <ul className="price-feats">
              {(() => {
                const perks = t('academy.pricing.perks');
                if (!Array.isArray(perks)) return null;
                return perks.map((perk, i) => (
                  <li key={i}>
                    <span className="check">✓</span>
                    {perk}
                  </li>
                ));
              })()}
            </ul>
            <a href="#enroll" className="btn btn-primary btn-block">{t('academy.pricing.cta')}</a>
          </MotionFadeUp>
        </div>
      </section>

      <section className="section testimonials-section" id="testimonials">
        <div className="wrap">
          <MotionFadeUp className="section-head">
            <span className="eyebrow-light">{t('academy.testimonials.eyebrow')}</span>
            <h2>{t('academy.testimonials.title')}</h2>
            <p>{t('academy.testimonials.subtitle')}</p>
          </MotionFadeUp>

          <div className="t-grid">
            {(() => {
              const items = t('academy.testimonials.items');
              if (!Array.isArray(items)) return null;
              return items.map((item, i) => (
                <motion.div
                  key={i}
                  className="t-card"
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="t-stars">{item.stars}</div>
                  <p className="t-quote">{item.quote}</p>
                  <div className="t-person">
                    <div className="t-avatar">{item.name.slice(0, 2)}</div>
                    <div>
                      <div className="t-name">{item.name}</div>
                      <div className="t-role">{item.role}</div>
                    </div>
                  </div>
                </motion.div>
              ));
            })()}
          </div>
        </div>
      </section>

      <section className="section instructor-section" id="instructor">
        <div className="wrap">
          <MotionFadeUp className="section-head">
            <span className="eyebrow-light">{t('academy.instructor.eyebrow')}</span>
            <h2>{t('academy.instructor.title')}</h2>
          </MotionFadeUp>

          <div className="instr-card">
            <div className="instr-photo">{t('academy.instructor.name').slice(0, 2)}</div>
            <div>
              <div className="instr-name">{t('academy.instructor.name')}</div>
              <div className="instr-title">{t('academy.instructor.role')}</div>
              <p className="instr-bio">{t('academy.instructor.bio')}</p>
              <div className="instr-tags">
                {(() => {
                  const tags = t('academy.instructor.tags');
                  if (!Array.isArray(tags)) return null;
                  return tags.map((tag, i) => (
                    <span key={i} className="instr-tag">{tag}</span>
                  ));
                })()}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section faq-section" id="faq">
        <div className="wrap">
          <MotionFadeUp className="section-head">
            <span className="eyebrow-light">{t('academy.faq.eyebrow')}</span>
            <h2>{t('academy.faq.title')}</h2>
          </MotionFadeUp>

          <div className="faq-list">
            {(() => {
              const items = t('academy.faq.items');
              if (!Array.isArray(items)) return null;
              return items.map((item, i) => (
                <div key={i} className={`faq-item${openFaq === i ? ' open' : ''}`}>
                  <div className="faq-q" onClick={() => toggleFaq(i)}>
                    {item.q}
                    <span className="plus">+</span>
                  </div>
                  <div className="faq-a">
                    <div className="faq-a-inner">{item.a}</div>
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>
      </section>

      <section className="section enroll-section" id="enroll">
        <div className="wrap">
          <div className="enroll-grid">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <motion.span className="eyebrow" variants={fadeUp}>
                {t('academy.enroll.eyebrow')}
              </motion.span>
              <motion.h2 variants={fadeUp}>{t('academy.enroll.title')}</motion.h2>
              <motion.ul className="perk-list" variants={fadeUp}>
                {['lifetime', 'community', 'qa', 'templates'].map((key) => (
                  <li key={key}>
                    <span className="check">✓</span>
                    {t(`academy.enroll.perks.${key}`)}
                  </li>
                ))}
              </motion.ul>
              <motion.div className="urgency-box" variants={fadeUp}>
                <div className="u-label">{t('academy.enroll.urgency.label')}</div>
                <div className="u-timer">
                  <div className="u-unit">
                    <div className="u-num">{timeLeft.d}</div>
                    <div className="u-tag">{t('academy.enroll.urgency.days')}</div>
                  </div>
                  <div className="u-unit">
                    <div className="u-num">{timeLeft.h}</div>
                    <div className="u-tag">{t('academy.enroll.urgency.hours')}</div>
                  </div>
                  <div className="u-unit">
                    <div className="u-num">{timeLeft.m}</div>
                    <div className="u-tag">{t('academy.enroll.urgency.mins')}</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            <div className="form-card">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
              >
                {formSubmitted ? (
                  <motion.div
                    className="form-success"
                    style={{ display: 'block' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="ok-icon">✓</div>
                    <h4>{t('academy.enroll.success')}</h4>
                    <p>{t('academy.enroll.demoNote')}</p>
                  </motion.div>
                ) : (
                  <>
                    <motion.h3 variants={fadeUp}>{t('academy.enroll.formTitle')}</motion.h3>
                    <form id="enroll-form" onSubmit={handleSubmit}>
                      <motion.div className="field" variants={fadeUp}>
                        <label htmlFor="f-name">{t('academy.enroll.nameLabel')}</label>
                        <input id="f-name" name="name" type="text" placeholder={t('academy.enroll.namePlaceholder')} value={formData.name} onChange={handleChange} required />
                      </motion.div>
                      <motion.div className="field" variants={fadeUp}>
                        <label htmlFor="f-phone">{t('academy.enroll.phoneLabel')}</label>
                        <input id="f-phone" name="phone" type="tel" placeholder={t('academy.enroll.phonePlaceholder')} value={formData.phone} onChange={handleChange} required />
                      </motion.div>
                      <motion.div className="field" variants={fadeUp}>
                        <label htmlFor="f-email">{t('academy.enroll.emailLabel')}</label>
                        <input id="f-email" name="email" type="email" placeholder={t('academy.enroll.emailPlaceholder')} value={formData.email} onChange={handleChange} />
                      </motion.div>
                      <motion.div className="field" variants={fadeUp}>
                        <label htmlFor="f-city">{t('academy.enroll.cityLabel')}</label>
                        <input id="f-city" name="city" type="text" placeholder={t('academy.enroll.cityPlaceholder')} value={formData.city} onChange={handleChange} />
                      </motion.div>
                      <motion.button type="submit" className="btn btn-primary btn-block" variants={fadeUp}>
                        {t('academy.enroll.submit')}
                      </motion.button>
                    </form>
                  </>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AcademyPage;
