import { useState, FormEvent, memo } from 'react'
import { useTodos } from '../hooks/useTodos'
import styles from '../styles/TodoInput.module.css'

export const TodoInput = memo(function TodoInput() {
  const [description, setDescription] = useState('')
  const { dispatch } = useTodos()

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!description.trim()) {
      return
    }

    const newTodo = {
      id: crypto.randomUUID(),
      description: description.trim(),
      completed: false,
      createdAt: Date.now(),
    }

    dispatch({ type: 'ADD_TODO', todo: newTodo })
    setDescription('')
  }

  const remainingChars = 500 - description.length
  const showCounter = description.length > 0

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.inputWrapper}>
        <input
          type="text"
          className={styles.input}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What needs to be done?"
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
            {remainingChars}/500
          </span>
        )}
      </div>
      <button
        type="submit"
        className={styles.button}
        disabled={!description.trim()}
        aria-label="Add todo"
      >
        Add
      </button>
    </form>
  )
})
