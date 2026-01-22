import { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import type { Todo } from '../types/todo'
import { SubtaskItem } from './SubtaskItem'
import { SubtaskForm } from './SubtaskForm'
import styles from '../styles/SubtaskList.module.css'

interface SubtaskListProps {
  todo: Todo
}

export function SubtaskList({ todo }: SubtaskListProps) {
  const { t } = useLanguage()
  const [showForm, setShowForm] = useState(false)

  const subtasks = todo.subtasks || []
  const completedCount = subtasks.filter((st) => st.completed).length
  const totalCount = subtasks.length

  const handleAddSubtask = () => {
    setShowForm(false)
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>{t('subtasks')}</h3>
        {totalCount > 0 && (
          <span className={styles.progress}>
            {completedCount} / {totalCount}
          </span>
        )}
      </div>

      {/* Progress bar */}
      {totalCount > 0 && (
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${(completedCount / totalCount) * 100}%` }}
          />
        </div>
      )}

      <ul className={styles.list}>
        {subtasks.map((subtask) => (
          <SubtaskItem key={subtask.id} todoId={todo.id} subtask={subtask} />
        ))}
      </ul>

      {totalCount === 0 && (
        <p className={styles.emptyState}>{t('noSubtasks')}</p>
      )}

      {!showForm ? (
        <button
          type="button"
          className={styles.addButton}
          onClick={() => setShowForm(true)}
        >
          + {t('addSubtask')}
        </button>
      ) : (
        <SubtaskForm todoId={todo.id} onSubmit={handleAddSubtask} onCancel={() => setShowForm(false)} />
      )}
    </div>
  )
}
