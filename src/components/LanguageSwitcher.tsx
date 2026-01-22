import { useLanguage } from '../contexts/LanguageContext'
import styles from '../styles/LanguageSwitcher.module.css'

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage()

  return (
    <div className={styles.switcher}>
      <label htmlFor="language-select" className={styles.label}>
        {t('languageSwitch')}:
      </label>
      <select
        id="language-select"
        className={styles.select}
        value={language}
        onChange={(e) => setLanguage(e.target.value as 'en' | 'zh')}
        aria-label={t('languageSwitch')}
      >
        <option value="en">{t('languageEn')}</option>
        <option value="zh">{t('languageZh')}</option>
      </select>
    </div>
  )
}
