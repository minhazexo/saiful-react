import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api, { IS_DEMO_MODE } from '../api';
import { useTranslation } from '../context/LanguageContext';
import Seo from '../components/Seo';
import { staggerContainer, fadeUp, fadeUpSmall, buttonHover } from '../motion/presets';
import './ContactPage.css';

const SERVICE_KEYS = ['academy', 'setup', 'growth', 'ai', 'other'];

function ContactPage() {
  const t = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    service: '',
    message: '',
  });
  const [captcha, setCaptcha] = useState({ id: '', prompt: '' });
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitMessage, setSubmitMessage] = useState('');

  const fetchCaptcha = async () => {
    if (IS_DEMO_MODE) {
      setCaptcha({ id: '', prompt: '' });
      return;
    }
    try {
      const { data } = await api.get('/contact/captcha');
      setCaptcha({ id: data.id, prompt: data.prompt });
      setCaptchaAnswer('');
    } catch {
      setCaptcha({ id: '', prompt: '' });
    }
  };

  useEffect(() => {
    fetchCaptcha();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      await api.post('/contact', { ...formData, captchaId: captcha.id, captchaAnswer });
      setSubmitStatus('success');
      setSubmitMessage(t('contact.success'));
      setFormData({ name: '', email: '', whatsapp: '', service: '', message: '' });
      setCaptchaAnswer('');
      fetchCaptcha();
      setTimeout(() => setSubmitStatus(null), 5000);
    } catch (error) {
      const demo = IS_DEMO_MODE || error?.isDemoMode;
      setSubmitStatus(demo ? 'demo' : 'error');
      setSubmitMessage(demo ? t('demo.formMessage') : error.response?.data?.error || t('contact.error'));
      if (!demo) fetchCaptcha();
      setTimeout(() => setSubmitStatus(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <Seo title={t('contact.title')} description={t('contact.subtitle')} path="/contact" />
      <section className="contact-hero">
        <div className="container">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.h1 variants={fadeUp}>{t('contact.title')}</motion.h1>
            <motion.p variants={fadeUp}>{t('contact.subtitle')}</motion.p>
          </motion.div>
        </div>
      </section>

      <section className="contact-section">
        <div className="container">
          <div className="contact-grid">
            <motion.form
              className="contact-form"
              onSubmit={handleFormSubmit}
              noValidate
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              <motion.h2 variants={fadeUp}>{t('contact.formTitle')}</motion.h2>

              <motion.div className="form-group" variants={fadeUpSmall}>
                <label htmlFor="contact-name">{t('contact.nameLabel')}</label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  placeholder={t('contact.namePlaceholder')}
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </motion.div>

              <motion.div className="form-group" variants={fadeUpSmall}>
                <label htmlFor="contact-email">{t('contact.emailLabel')}</label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  placeholder={t('contact.emailPlaceholder')}
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </motion.div>

              <motion.div className="form-group" variants={fadeUpSmall}>
                <label htmlFor="contact-whatsapp">{t('contact.whatsappLabel')}</label>
                <input
                  id="contact-whatsapp"
                  type="tel"
                  name="whatsapp"
                  placeholder={t('contact.whatsappPlaceholder')}
                  value={formData.whatsapp}
                  onChange={handleInputChange}
                  required
                />
              </motion.div>

              <motion.div className="form-group" variants={fadeUpSmall}>
                <label htmlFor="contact-service">{t('contact.serviceLabel')}</label>
                <select
                  id="contact-service"
                  name="service"
                  value={formData.service}
                  onChange={handleInputChange}
                >
                  <option value="">{t('contact.servicePlaceholder')}</option>
                  {SERVICE_KEYS.map((key) => (
                    <option key={key} value={key}>
                      {t(`contact.services.${key}`)}
                    </option>
                  ))}
                </select>
              </motion.div>

              <motion.div className="form-group" variants={fadeUpSmall}>
                <label htmlFor="contact-message">{t('contact.messageLabel')}</label>
                <textarea
                  id="contact-message"
                  name="message"
                  placeholder={t('contact.messagePlaceholder')}
                  rows={5}
                  value={formData.message}
                  onChange={handleInputChange}
                />
              </motion.div>

              <motion.div className="form-group captcha-group" variants={fadeUpSmall}>
                <label htmlFor="contact-captcha">
                  {t('contact.captchaLabel', { prompt: captcha.prompt || '…' })}
                </label>
                <div className="captcha-row">
                  <input
                    id="contact-captcha"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    value={captchaAnswer}
                    onChange={(e) => setCaptchaAnswer(e.target.value)}
                    required={!IS_DEMO_MODE}
                    aria-describedby="captcha-help"
                  />
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={fetchCaptcha}
                    aria-label={t('contact.newCaptcha')}
                  >
                    ↻ {t('contact.captchaNew')}
                  </button>
                </div>
                <small id="captcha-help" className="captcha-help">
                  {t('contact.captchaHelp')}
                </small>
              </motion.div>

              <motion.button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
                variants={buttonHover}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
              >
                {isSubmitting ? `⏳ ${t('contact.submitting')}` : `📬 ${t('contact.submit')}`}
              </motion.button>

              {submitStatus === 'success' && (
                <motion.p
                  className="success-message"
                  role="status"
                  aria-live="polite"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  ✅ {submitMessage}
                </motion.p>
              )}
              {submitStatus === 'error' && (
                <motion.p
                  className="error-message"
                  role="alert"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  ❌ {submitMessage}
                </motion.p>
              )}
              {submitStatus === 'demo' && (
                <motion.p
                  className="error-message"
                  role="status"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  👀 {submitMessage}
                </motion.p>
              )}
            </motion.form>

            <motion.div
              className="contact-info"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
            >
              <motion.h2 variants={fadeUp}>{t('contact.info.title')}</motion.h2>
              <motion.div className="info-item" variants={fadeUpSmall}>
                <h3>📧 {t('contact.info.email')}</h3>
                <p>
                  <a href={`mailto:${t('contact.info.emailValue')}`}>
                    {t('contact.info.emailValue')}
                  </a>
                </p>
              </motion.div>
              <motion.div className="info-item" variants={fadeUpSmall}>
                <h3>📱 {t('contact.info.whatsapp')}</h3>
                <p>
                  <a href={`https://wa.me/8801XXXXXXXXX`} target="_blank" rel="noopener noreferrer">
                    {t('contact.info.whatsappValue')}
                  </a>
                </p>
              </motion.div>
              <motion.div className="info-item" variants={fadeUpSmall}>
                <h3>📍 {t('contact.info.location')}</h3>
                <p>{t('contact.info.locationValue')}</p>
              </motion.div>
              <motion.div className="info-item" variants={fadeUpSmall}>
                <h3>⏰ {t('contact.info.hours')}</h3>
                <p style={{ whiteSpace: 'pre-line' }}>{t('contact.info.hoursValue')}</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ContactPage;
