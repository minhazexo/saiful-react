import { motion } from 'framer-motion';
import { useTranslation } from '../../context/LanguageContext';
import Seo from '../../components/Seo';
import Packages from '../../components/Packages/Packages';
import { staggerContainer, fadeUp } from '../../motion/presets';

function PricingPage() {
  const t = useTranslation();

  return (
    <div className="page">
      <Seo
        title={t('nav.pricing')}
        description={t('home.packages.subtitle')}
        path="/pricing"
      />
      <section className="page-hero">
        <div className="container">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.span className="eyebrow" aria-hidden="true" variants={fadeUp}>
              💼 {t('home.packages.eyebrow')}
            </motion.span>
            <motion.h1 variants={fadeUp}>{t('home.packages.title')}</motion.h1>
            <motion.p variants={fadeUp}>{t('home.packages.subtitle')}</motion.p>
          </motion.div>
        </div>
      </section>

      <Packages />
    </div>
  );
}

export default PricingPage;
