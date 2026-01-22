import { memo, useState } from 'react'
import type { Todo } from '../types/todo'
import { useTodos } from '../hooks/useTodos'
import { useConfetti } from '../hooks/useConfetti'
import { TodoDetailDrawer } from './TodoDetailDrawer'
import styles from '../styles/TodoItemWithMeta.module.css'

interface TodoItemWithMetaProps {
  todo: Todo
}

const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const isOverdue = (todo: Todo): boolean => {
  if (!todo.dueDate || todo.completed) return false
  return todo.dueDate < Date.now()
}

const getPriorityColor = (priority?: 'low' | 'medium' | 'high'): string => {
  switch (priority) {
    case 'high':
      return '#f44336'
    case 'medium':
      return '#ff9800'
    case 'low':
      return '#4caf50'
    default:
      return '#999'
  }
}

export const TodoItemWithMeta = memo(function TodoItemWithMeta({
  todo,
}: TodoItemWithMetaProps) {
  const { dispatch } = useTodos()
  const { trigger } = useConfetti()
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const handleToggle = () => {
    if (todo.completed) {
      dispatch({ type: 'ACTIVATE_TODO', id: todo.id })
    } else {
      trigger({ particleCount: 100, spread: 70 })
      dispatch({ type: 'COMPLETE_TODO', id: todo.id })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      handleToggle()
    }
    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault()
      dispatch({ type: 'DELETE_TODO', id: todo.id })
    }
  }

  const handleDelete = () => {
    dispatch({ type: 'DELETE_TODO', id: todo.id })
  }

  const handleItemClick = () => {
    setSelectedTodo(todo)
    setIsDrawerOpen(true)
  }

  const handleDrawerClose = () => {
    setIsDrawerOpen(false)
    setSelectedTodo(null)
  }

  const overdue = isOverdue(todo)

  // Calculate subtask progress
  const subtaskProgress = todo.subtasks && todo.subtasks.length > 0
    ? `${todo.subtasks.filter((st) => st.completed).length}/${todo.subtasks.length}`
    : null

  return (
    <>
      <li
        className={`${styles.item} ${todo.completed ? styles.completed : ''} ${overdue ? styles.overdue : ''}`}
        role="listitem"
        data-testid={`todo-${todo.id}`}
        onKeyDown={handleKeyDown}
      >
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
          className={styles.checkbox}
          aria-label={`Mark "${todo.description}" as ${todo.completed ? 'active' : 'complete'}`}
        />
        <div className={styles.content} onClick={handleItemClick} style={{ cursor: 'pointer' }}>
          <div className={styles.mainInfo}>
            <span className={styles.text}>{todo.description}</span>
            {todo.priority && (
              <span
                className={styles.priority}
                style={{ backgroundColor: getPriorityColor(todo.priority) }}
                aria-label={`Priority: ${todo.priority}`}
              >
                {todo.priority.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          {(todo.dueDate || todo.estimatedMinutes || subtaskProgress) && (
            <div className={styles.metadata}>
              {todo.dueDate && (
                <span
                  className={`${styles.metaTag} ${overdue ? styles.overdueTag : ''}`}
                  title={`Due: ${formatDate(todo.dueDate)}`}
                >
                  📅 {formatDate(todo.dueDate)}
                </span>
              )}
              {todo.estimatedMinutes && (
                <span className={styles.metaTag} title={`Estimated: ${todo.estimatedMinutes} minutes`}>
                  ⏱️ {todo.estimatedMinutes}m
                </span>
              )}
              {todo.actualMinutes && todo.actualMinutes > 0 && (
                <span className={styles.metaTag} title={`Actual time: ${todo.actualMinutes} minutes`}>
                  ⏰ {todo.actualMinutes}m
                </span>
              )}
              {subtaskProgress && (
                <span className={styles.metaTag} title="Subtask progress">
                  ✓ {subtaskProgress}
                </span>
              )}
            </div>
          )}
        </div>
        <button
          type="button"
          className={styles.deleteButton}
          onClick={handleDelete}
          aria-label={`Delete "${todo.description}"`}
          title="Delete todo"
        >
          🗑️
        </button>
      </li>

      <TodoDetailDrawer
        todo={selectedTodo}
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
      />
    </>
  )
})
