import { memo } from 'react'
import type { Todo } from '../types/todo'
import { useTodos } from '../hooks/useTodos'
import { useConfetti } from '../hooks/useConfetti'
import styles from '../styles/TodoItem.module.css'

interface TodoItemProps {
  todo: Todo
}

export const TodoItem = memo(function TodoItem({ todo }: TodoItemProps) {
  const { dispatch } = useTodos()
  const { trigger } = useConfetti()

  const handleToggle = () => {
    if (todo.completed) {
      dispatch({ type: 'ACTIVATE_TODO', id: todo.id })
    } else {
      // Trigger confetti first, then update state
      trigger({ particleCount: 100, spread: 70 })
      dispatch({ type: 'COMPLETE_TODO', id: todo.id })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Space or Enter to toggle checkbox
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      handleToggle()
    }
    // Delete or Backspace to delete
    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault()
      dispatch({ type: 'DELETE_TODO', id: todo.id })
    }
  }

  const handleDelete = () => {
    dispatch({ type: 'DELETE_TODO', id: todo.id })
  }

  return (
    <li
      className={`${styles.item} ${todo.completed ? styles.completed : ''}`}
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
      <span className={styles.text}>{todo.description}</span>
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
  )
})
