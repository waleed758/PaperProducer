import { useLanguage } from '../context/LanguageContext'

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage()
  const label = language === 'ur' ? 'English' : 'اردو'

  return (
    <button
      className="btn btn-ghost btn-sm language-toggle"
      type="button"
      onClick={toggleLanguage}
      aria-label={language === 'ur' ? 'Switch language to English' : 'زبان اردو میں تبدیل کریں'}
      lang={language === 'ur' ? 'en' : 'ur'}
    >
      {label}
    </button>
  )
}
