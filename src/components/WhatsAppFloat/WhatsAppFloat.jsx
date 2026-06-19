import { motion } from 'framer-motion';
import { useTranslation } from '../../context/LanguageContext';
import { getWhatsAppUrl } from '../../utils/whatsapp';
import { assetPath } from '../../utils/assets';
import './WhatsAppFloat.css';

export default function WhatsAppFloat() {
  const t = useTranslation();

  const handleClick = () => {
    window.open(getWhatsAppUrl(t), '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.button
      className="whatsapp-float"
      onClick={handleClick}
      aria-label="Chat on WhatsApp"
      title="Chat on WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
        delay: 1.5,
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.92 }}
    >
      <img
        src={assetPath('/images/Whatsapp-Logo.png')}
        alt="Chat on WhatsApp"
        className="whatsapp-float-icon"
      />
    </motion.button>
  );
}
