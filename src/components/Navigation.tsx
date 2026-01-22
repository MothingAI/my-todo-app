import { useLanguage } from '../contexts/LanguageContext'
import styles from '../styles/Navigation.module.css'

type ViewMode = 'list' | 'calendar' | 'statistics'

interface NavigationProps {
  currentView: ViewMode
  onViewChange: (view: ViewMode) => void
}

export function Navigation({ currentView, onViewChange }: NavigationProps) {
  const { t } = useLanguage()

  return (
    <nav className={styles.navigation} aria-label="View navigation">
      <button
        type="button"
        className={`${styles.navItem} ${currentView === 'list' ? styles.active : ''}`}
        onClick={() => onViewChange('list')}
        aria-label={t('navList')}
        aria-current={currentView === 'list' ? 'page' : undefined}
      >
        📝 {t('navList')}
      </button>
      <button
        type="button"
        className={`${styles.navItem} ${currentView === 'calendar' ? styles.active : ''}`}
        onClick={() => onViewChange('calendar')}
        aria-label={t('navCalendar')}
        aria-current={currentView === 'calendar' ? 'page' : undefined}
      >
        📅 {t('navCalendar')}
      </button>
      <button
        type="button"
        className={`${styles.navItem} ${currentView === 'statistics' ? styles.active : ''}`}
        onClick={() => onViewChange('statistics')}
        aria-label={t('navStats')}
        aria-current={currentView === 'statistics' ? 'page' : undefined}
      >
        📊 {t('navStats')}
      </button>
    </nav>
  )
}
