import { useState, FormEvent } from 'react'
import { useTodos } from '../hooks/useTodos'
import { useLanguage } from '../contexts/LanguageContext'
import type { Subtask } from '../types/todo'
import { ImageUploader } from './ImageUploader'
import type { SubtaskImage } from '../types/todo'
import styles from '../styles/SubtaskForm.module.css'

interface SubtaskFormProps {
  todoId: string
  subtask?: Subtask // If provided, editing mode
  onSubmit: (subtask: Subtask | Partial<Subtask>) => void
  onCancel: () => void
}

export function SubtaskForm({ todoId, subtask, onSubmit, onCancel }: SubtaskFormProps) {
  const { dispatch } = useTodos()
  const { t } = useLanguage()
  const isEditing = !!subtask

  const [description, setDescription] = useState(subtask?.description || '')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(subtask?.priority || 'medium')
  const [dueDate, setDueDate] = useState(
    subtask?.dueDate ? new Date(subtask.dueDate).toISOString().split('T')[0] : ''
  )
  const [notes, setNotes] = useState(subtask?.notes || '')
  const [uploadedImages, setUploadedImages] = useState<SubtaskImage[]>(subtask?.images || [])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (isEditing) {
      // Editing mode
      onSubmit({
        description,
        priority,
        dueDate: dueDate ? new Date(dueDate).getTime() : undefined,
        notes,
        images: uploadedImages,
      })
    } else {
      // Creating mode
      const newSubtask: Subtask = {
        id: crypto.randomUUID(),
        description,
        completed: false,
        createdAt: Date.now(),
        priority,
        dueDate: dueDate ? new Date(dueDate).getTime() : undefined,
        notes,
        images: uploadedImages,
        _version: 3,
      }

      // Add images through reducer if any
      if (uploadedImages.length > 0) {
        dispatch({
          type: 'ADD_SUBTASK',
          todoId,
          subtask: newSubtask,
        })
      } else {
        dispatch({
          type: 'ADD_SUBTASK',
          todoId,
          subtask: newSubtask,
        })
      }

      onSubmit(newSubtask)
    }
  }

  const handleImagesChange = (images: SubtaskImage[]) => {
    setUploadedImages(images)
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.fieldGroup}>
        <label htmlFor="subtask-description" className={styles.label}>
          {t('subtaskDescription')} <span className={styles.required}>*</span>
        </label>
        <input
          id="subtask-description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t('subtaskDescription')}
          required
          className={styles.input}
          maxLength={500}
        />
      </div>

      <div className={styles.row}>
        <div className={styles.fieldGroup}>
          <label htmlFor="subtask-priority" className={styles.label}>
            {t('subtaskPriority')}
          </label>
          <select
            id="subtask-priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
            className={styles.select}
          >
            <option value="low">{t('low')}</option>
            <option value="medium">{t('medium')}</option>
            <option value="high">{t('high')}</option>
          </select>
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="subtask-dueDate" className={styles.label}>
            {t('subtaskDueDate')}
          </label>
          <input
            id="subtask-dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className={styles.dateInput}
          />
        </div>
      </div>

      <div className={styles.fieldGroup}>
        <label htmlFor="subtask-notes" className={styles.label}>
          {t('subtaskNotes')}
        </label>
        <textarea
          id="subtask-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={t('subtaskNotes')}
          className={styles.textarea}
          rows={3}
          maxLength={2000}
        />
      </div>

      {!isEditing && (
        <div className={styles.fieldGroup}>
          <label className={styles.label}>
            {t('uploadImage')}
          </label>
          <ImageUploader
            todoId={todoId}
            subtaskId=""
            images={uploadedImages}
            onImagesChange={handleImagesChange}
            maxImages={5}
          />
        </div>
      )}

      <div className={styles.actions}>
        <button type="submit" className={styles.submitButton}>
          {isEditing ? t('editSubtask') : t('addSubtask')}
        </button>
        <button type="button" onClick={onCancel} className={styles.cancelButton}>
          {t('cancel')}
        </button>
      </div>
    </form>
  )
}
