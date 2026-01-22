import { useState, FormEvent } from 'react'
import { useTodos } from '../hooks/useTodos'
import { useLanguage } from '../contexts/LanguageContext'
import type { Todo } from '../types/todo'
import styles from '../styles/TodoForm.module.css'

export function TodoForm() {
  const { t } = useLanguage()
  const [description, setDescription] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [dueDate, setDueDate] = useState('')
  const [estimatedMinutes, setEstimatedMinutes] = useState('')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')

  const { dispatch } = useTodos()

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!description.trim()) {
      return
    }

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      description: description.trim(),
      completed: false,
      createdAt: Date.now(),
      // Optional fields
      _version: 2,
      actualMinutes: 0,
      priority,
      tags: [],
    }

    // Add due date if provided
    if (dueDate) {
      newTodo.dueDate = new Date(dueDate).getTime()
    }

    // Add estimated time if provided
    if (estimatedMinutes) {
      const mins = parseInt(estimatedMinutes, 10)
      if (!isNaN(mins) && mins > 0) {
        newTodo.estimatedMinutes = mins
      }
    }

    dispatch({ type: 'ADD_TODO', todo: newTodo })

    // Reset form
    setDescription('')
    setDueDate('')
    setEstimatedMinutes('')
    setPriority('medium')
    setShowAdvanced(false)
  }

  const remainingChars = 500 - description.length
  const showCounter = description.length > 0

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.mainInput}>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            className={styles.input}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t('todoPlaceholder')}
            required
            maxLength={500}
            pattern=".*\S+.*"
            title="Please enter a todo description (1-500 characters)"
            aria-label="Todo description"
            aria-describedby={showCounter ? 'char-counter' : undefined}
          />
          {showCounter && (
            <span
              id="char-counter"
              className={`${styles.counter} ${remainingChars < 50 ? styles.counterWarning : ''}`}
              aria-live="polite"
            >
              {t('todoCharacterCount', { count: remainingChars })}
            </span>
          )}
        </div>
        <button
          type="submit"
          className={styles.addButton}
          disabled={!description.trim()}
          aria-label="Add todo"
        >
          {t('todoAdd')}
        </button>
        <button
          type="button"
          className={styles.advancedButton}
          onClick={() => setShowAdvanced(!showAdvanced)}
          aria-label={t('todoAdvanced')}
          aria-expanded={showAdvanced}
        >
          {showAdvanced ? '▲' : '▼'}
        </button>
      </div>

      {showAdvanced && (
        <div className={styles.advancedOptions}>
          <div className={styles.fieldGroup}>
            <label htmlFor="due-date" className={styles.label}>
              {t('todoDueDate')}
            </label>
            <input
              id="due-date"
              type="date"
              className={styles.dateInput}
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              aria-label="Due date"
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="estimated-time" className={styles.label}>
              {t('todoEstimatedTime')}
            </label>
            <input
              id="estimated-time"
              type="number"
              className={styles.numberInput}
              value={estimatedMinutes}
              onChange={(e) => setEstimatedMinutes(e.target.value)}
              min="1"
              max="480"
              placeholder="e.g., 30"
              aria-label="Estimated time in minutes"
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="priority" className={styles.label}>
              {t('todoPriority')}
            </label>
            <select
              id="priority"
              className={styles.selectInput}
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
              aria-label="Priority level"
            >
              <option value="low">{t('todoPriorityLow')}</option>
              <option value="medium">{t('todoPriorityMedium')}</option>
              <option value="high">{t('todoPriorityHigh')}</option>
            </select>
          </div>
        </div>
      )}
    </form>
  )
}
