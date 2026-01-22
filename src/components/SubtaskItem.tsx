import { useState } from 'react'
import { useTodos } from '../hooks/useTodos'
import { useLanguage } from '../contexts/LanguageContext'
import type { Subtask } from '../types/todo'
import { SubtaskForm } from './SubtaskForm'
import styles from '../styles/SubtaskItem.module.css'

interface SubtaskItemProps {
  todoId: string
  subtask: Subtask
}

export function SubtaskItem({ todoId, subtask }: SubtaskItemProps) {
  const { dispatch } = useTodos()
  const { t } = useLanguage()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const handleToggle = () => {
    dispatch({
      type: 'TOGGLE_SUBTASK',
      todoId,
      subtaskId: subtask.id,
    })
  }

  const handleDelete = () => {
    if (confirm(t('deleteSubtask') + '?')) {
      dispatch({
        type: 'DELETE_SUBTASK',
        todoId,
        subtaskId: subtask.id,
      })
    }
  }

  const isOverdue = subtask.dueDate && !subtask.completed && subtask.dueDate < Date.now()
  const hasDetails = subtask.notes || (subtask.images && subtask.images.length > 0)

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high':
        return '#ef4444'
      case 'medium':
        return '#f59e0b'
      case 'low':
        return '#10b981'
      default:
        return '#9ca3af'
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <li
      className={`${styles.item} ${subtask.completed ? styles.completed : ''} ${isOverdue ? styles.overdue : ''}`}
    >
      {isEditing ? (
        <SubtaskForm
          todoId={todoId}
          subtask={subtask}
          onSubmit={(updates) => {
            dispatch({
              type: 'UPDATE_SUBTASK',
              todoId,
              subtaskId: subtask.id,
              updates,
            })
            setIsEditing(false)
          }}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <>
          <div className={styles.mainRow}>
            <input
              type="checkbox"
              checked={subtask.completed}
              onChange={handleToggle}
              className={styles.checkbox}
              aria-label={`Toggle "${subtask.description}" completion`}
            />

            <div className={styles.content} onClick={() => hasDetails && setIsExpanded(!isExpanded)}>
              <span className={styles.description}>{subtask.description}</span>

              <div className={styles.metadata}>
                {subtask.priority && (
                  <span
                    className={styles.priority}
                    style={{ backgroundColor: getPriorityColor(subtask.priority) }}
                    title={t(subtask.priority)}
                  >
                    {t(subtask.priority).charAt(0).toUpperCase()}
                  </span>
                )}
                {subtask.dueDate && (
                  <span
                    className={`${styles.dueDate} ${isOverdue ? styles.overdueDate : ''}`}
                    title={formatDate(subtask.dueDate)}
                  >
                    📅 {formatDate(subtask.dueDate)}
                  </span>
                )}
                {subtask.images && subtask.images.length > 0 && (
                  <span className={styles.imageCount}>📷 {subtask.images.length}</span>
                )}
              </div>
            </div>

            <div className={styles.actions}>
              {hasDetails && (
                <button
                  type="button"
                  className={styles.expandButton}
                  onClick={() => setIsExpanded(!isExpanded)}
                  aria-label={isExpanded ? 'Collapse' : 'Expand'}
                >
                  {isExpanded ? '▲' : '▼'}
                </button>
              )}
              <button
                type="button"
                className={styles.editButton}
                onClick={() => setIsEditing(true)}
                aria-label={t('editSubtask')}
                title={t('editSubtask')}
              >
                ✏️
              </button>
              <button
                type="button"
                className={styles.deleteButton}
                onClick={handleDelete}
                aria-label={t('deleteSubtask')}
                title={t('deleteSubtask')}
              >
                🗑️
              </button>
            </div>
          </div>

          {isExpanded && hasDetails && (
            <div className={styles.details}>
              {subtask.notes && (
                <div className={styles.notes}>
                  <h4>{t('subtaskNotes')}:</h4>
                  <p>{subtask.notes}</p>
                </div>
              )}

              {subtask.images && subtask.images.length > 0 && (
                <div className={styles.images}>
                  <h4>Images ({subtask.images.length}):</h4>
                  <div className={styles.imageGrid}>
                    {subtask.images.map((image) => (
                      <img
                        key={image.id}
                        src={image.data}
                        alt={image.name}
                        className={styles.image}
                        onClick={() => window.open(image.data, '_blank')}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </li>
  )
}
