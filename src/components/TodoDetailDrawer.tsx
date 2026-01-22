import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { Todo } from '../types/todo'
import { SubtaskList } from './SubtaskList'
import { useLanguage } from '../contexts/LanguageContext'
import styles from '../styles/TodoDetailDrawer.module.css'

interface TodoDetailDrawerProps {
  todo: Todo | null
  isOpen: boolean
  onClose: () => void
}

export function TodoDetailDrawer({ todo, isOpen, onClose }: TodoDetailDrawerProps) {
  const { t } = useLanguage()
  const drawerRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)

  // Focus management
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement
      drawerRef.current?.focus()
      document.body.style.overflow = 'hidden' // Prevent background scrolling
    } else {
      previousActiveElement.current?.focus()
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // ESC key handler
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  if (!todo) return null

  const drawerContent = (
    <div className={`${styles.overlay} ${isOpen ? styles.open : ''}`} onClick={onClose}>
      <div
        ref={drawerRef}
        className={`${styles.drawer} ${isOpen ? styles.open : ''}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        tabIndex={-1}
      >
        <div className={styles.header}>
          <h2 id="drawer-title" className={styles.title}>{todo.description}</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label={t('close')}
          >
            ✕
          </button>
        </div>

        <div className={styles.parentInfo}>
          {/* Parent todo metadata display */}
          {todo.priority && (
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>{t('priority')}:</span>
              <span className={styles.metaValue}>{t(todo.priority)}</span>
            </div>
          )}
          {todo.dueDate && (
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>{t('dueDate')}:</span>
              <span className={styles.metaValue}>
                {new Date(todo.dueDate).toLocaleDateString()}
              </span>
            </div>
          )}
          {todo.estimatedMinutes && (
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>{t('estimatedTime')}:</span>
              <span className={styles.metaValue}>{todo.estimatedMinutes}m</span>
            </div>
          )}
        </div>

        <div className={styles.content}>
          <SubtaskList todo={todo} />
        </div>
      </div>
    </div>
  )

  return createPortal(drawerContent, document.body)
}
