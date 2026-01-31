import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer>
      <p>&copy; 2025 Raja Rajeshwara Devastanam. {t('footer_rights')}.</p>
      <p>📍 {t('footer_address')}: Near Old Market, Hasaparthy, Warangal | 📞 {t('footer_phone')}: (555) 123-4567</p>
      <p>{t('footer_email')}: info@rajarajeshwara.com</p>
    </footer>
  );
}
