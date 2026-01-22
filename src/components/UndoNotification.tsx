import { useTodos } from '../hooks/useTodos'
import { useLanguage } from '../contexts/LanguageContext'
import styles from '../styles/UndoNotification.module.css'

export function UndoNotification() {
  const { t } = useLanguage()
  const { undoNotification, dispatch } = useTodos()

  if (!undoNotification?.visible) {
    return null
  }

  const handleUndo = () => {
    dispatch({ type: 'UNDO_DELETE' })
  }

  const handleDismiss = () => {
    dispatch({ type: 'PERMANENTLY_DELETE' })
  }

  return (
    <div className={styles.notification} role="alert" aria-live="polite">
      <div className={styles.content}>
        <span className={styles.message}>
          {t('undoDeleted', { description: undoNotification.todo.description })}
        </span>
        <div className={styles.actions}>
          <button
            className={styles.undoButton}
            onClick={handleUndo}
            aria-label="Undo deletion"
          >
            {t('undoButton')}
          </button>
          <button
            className={styles.dismissButton}
            onClick={handleDismiss}
            aria-label="Dismiss notification"
          >
            {t('dismissButton')}
          </button>
        </div>
      </div>
    </div>
  )
}
