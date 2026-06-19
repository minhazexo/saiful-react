/**
 * Build a WhatsApp direct-chat URL from the translated phone number.
 *
 * The number comes from `contact.info.whatsappValue` in the locale files
 * (e.g. "01866290587" or "+8801866290587"). Non-digits are stripped, a
 * leading zero is replaced with the Bangladesh country code (880), and
 * the result is formatted as `https://wa.me/<number>`.
 *
 * @param {Function} t - The `useTranslation()` / `t()` function
 * @returns {string} WhatsApp URL (e.g. "https://wa.me/8801866290587")
 */
export function getWhatsAppUrl(t) {
  const digits = t('contact.info.whatsappValue').replace(/\D/g, '');
  const cleaned = digits.replace(/^0+/, '');
  return `https://wa.me/880${cleaned}`;
}
