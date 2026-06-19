import { useState } from 'react';
import { motion } from 'framer-motion';
import api, { IS_DEMO_MODE } from '../../api';
import { useTranslation } from '../../context/LanguageContext';
import Seo from '../../components/Seo';
import { fadeUp, fadeUpSmall, staggerContainer } from '../../motion/presets';
import { assetPath } from '../../utils/assets';
import '../../pages/Home/HomePage.css';
import './RoadmapPage.css';

function RoadmapPage() {
  const t = useTranslation();

  const [formData, setFormData] = useState({ name: '', email: '', whatsapp: '' });
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
      await api.post('/contact', { ...formData, source: 'lead-magnet' });
      setSubmitStatus('success');
      setFormData({ name: '', email: '', whatsapp: '' });
    } catch (err) {
      setSubmitStatus(IS_DEMO_MODE || err?.isDemoMode ? 'demo' : 'error');
    } finally { setIsSubmitting(false); }
  };

  return (
    <div className="page">
      <Seo title={t('nav.roadmap')} path="/roadmap" />
      <section className="lead-magnet">
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
                {t('home.leadMagnet.formTitle')}
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
                <motion.p className="lead-disclaimer" variants={fadeUpSmall}>
                  {t('home.leadMagnet.disclaimer')}
                </motion.p>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default RoadmapPage;
