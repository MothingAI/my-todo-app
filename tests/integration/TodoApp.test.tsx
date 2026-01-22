import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import '@testing-library/jest-dom'
import App from '@/App'

describe('Todo App Integration - Create Todo', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should create a todo when user submits valid input', () => {
    render(<App />)

    // Find the input and form
    const input = screen.getByRole('textbox') as HTMLInputElement
    const form = screen.getByRole('textbox').closest('form')!

    // Type a todo
    fireEvent.change(input, { target: { value: 'Buy groceries' } })
    expect(input.value).toBe('Buy groceries')

    // Submit the form
    fireEvent.submit(form)

    // Verify todo appears in the list (using listitem role to avoid select dropdown)
    const todoItem = screen.getAllByRole('listitem').find((el) =>
      el.textContent?.includes('Buy groceries')
    )
    expect(todoItem).toBeInTheDocument()

    // Verify input is cleared after submission
    expect(input.value).toBe('')
  })

  it('should show empty state message when no todos exist', () => {
    render(<App />)

    const emptyMessage = screen.getByText(/no todos yet/i)
    expect(emptyMessage).toBeInTheDocument()
  })

  it('should not create todo with empty description', () => {
    render(<App />)

    const input = screen.getByRole('textbox')
    const form = screen.getByRole('textbox').closest('form')!

    // Try to submit empty input
    fireEvent.change(input, { target: { value: '   ' } }) // Only whitespace
    fireEvent.submit(form)

    // Verify no todo was created (empty state still visible)
    const emptyMessage = screen.getByText(/no todos yet/i)
    expect(emptyMessage).toBeInTheDocument()
  })

  it('should add new todos to the top of the list', () => {
    render(<App />)

    const input = screen.getByRole('textbox')
    const form = screen.getByRole('textbox').closest('form')!

    // Add first todo
    fireEvent.change(input, { target: { value: 'First todo' } })
    fireEvent.submit(form)

    // Add second todo
    fireEvent.change(input, { target: { value: 'Second todo' } })
    fireEvent.submit(form)

    // Get all todo items (listitems, excluding select options)
    const todoItems = screen.getAllByRole('listitem')
    expect(todoItems).toHaveLength(2)

    // Verify newest todo is first
    expect(todoItems[0]).toHaveTextContent('Second todo')
    expect(todoItems[1]).toHaveTextContent('First todo')
  })

  it('should handle special characters and emojis in todo description', () => {
    render(<App />)

    const input = screen.getByRole('textbox')
    const form = screen.getByRole('textbox').closest('form')!

    const specialTodo = 'Buy milk 🥛 and eggs 🥚 (special @#$% characters)'

    fireEvent.change(input, { target: { value: specialTodo } })
    fireEvent.submit(form)

    // Verify the special characters are preserved
    const todoItem = screen.getAllByRole('listitem').find((el) =>
      el.textContent?.includes(specialTodo)
    )
    expect(todoItem).toBeInTheDocument()
  })
})
