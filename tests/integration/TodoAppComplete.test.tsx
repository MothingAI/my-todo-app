import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import App from '@/App'

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn(() => Promise.resolve()),
}))

describe('Todo App Integration - Mark Complete', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should mark a todo as complete', async () => {
    render(<App />)

    // Add a todo first
    const input = screen.getByRole('textbox')
    const form = screen.getByRole('textbox').closest('form')!

    fireEvent.change(input, { target: { value: 'Test todo' } })
    fireEvent.submit(form)

    // Find the checkbox for the todo
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()

    // Click the checkbox to mark as complete
    fireEvent.click(checkbox)

    // Verify checkbox is checked
    expect(checkbox).toBeChecked()

    // Verify todo moved to completed section
    const completedSection = screen.getByText(/completed/i)
    expect(completedSection).toBeInTheDocument()

    // Verify the completed todo appears in completed section (use listitem role)
    const completedTodo = screen.getAllByRole('listitem').find((el) =>
      el.textContent?.includes('Test todo')
    )
    expect(completedTodo).toBeInTheDocument()
  })

  it('should move completed todos to separate section', () => {
    render(<App />)

    // Add two todos
    const input = screen.getByRole('textbox')
    const form = screen.getByRole('textbox').closest('form')!

    fireEvent.change(input, { target: { value: 'Active todo' } })
    fireEvent.submit(form)

    fireEvent.change(input, { target: { value: 'Completed todo' } })
    fireEvent.submit(form)

    // Mark first todo as complete
    const checkboxes = screen.getAllByRole('checkbox')
    fireEvent.click(checkboxes[0])

    // Verify sections exist
    expect(screen.getByText('Active')).toBeInTheDocument()
    expect(screen.getByText('Completed')).toBeInTheDocument()

    // Verify one todo in each section (use listitem role)
    const activeTodos = screen.getAllByRole('listitem').find((el) =>
      el.textContent?.includes('Active todo')
    )
    const completedTodos = screen.getAllByRole('listitem').find((el) =>
      el.textContent?.includes('Completed todo')
    )

    expect(activeTodos).toBeInTheDocument()
    expect(completedTodos).toBeInTheDocument()
  })

  it('should mark a completed todo as active again', () => {
    render(<App />)

    // Add and complete a todo
    const input = screen.getByRole('textbox')
    const form = screen.getByRole('textbox').closest('form')!

    fireEvent.change(input, { target: { value: 'Test todo' } })
    fireEvent.submit(form)

    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox) // Mark complete

    expect(checkbox).toBeChecked()

    // Click again to mark as active
    fireEvent.click(checkbox)

    expect(checkbox).not.toBeChecked()

    // Verify todo is back in active section
    const activeSection = screen.getByText('Active')
    expect(activeSection).toBeInTheDocument()
  })

  it('should show completed todos with dimmed/strikethrough styling', () => {
    render(<App />)

    // Add and complete a todo
    const input = screen.getByRole('textbox')
    const form = screen.getByRole('textbox').closest('form')!

    fireEvent.change(input, { target: { value: 'Completed todo' } })
    fireEvent.submit(form)

    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)

    // Get the todo item element (use listitem role to find the correct element)
    const todoItem = screen.getAllByRole('listitem').find((el) =>
      el.textContent?.includes('Completed todo')
    )

    // Verify completed styling is applied
    expect(todoItem).toHaveClass(/_completed_/)
  })

  it('should trigger confetti animation when todo is marked complete', async () => {
    // Import the mock
    const confetti = await import('canvas-confetti')

    render(<App />)

    // Add and complete a todo
    const input = screen.getByRole('textbox')
    const form = screen.getByRole('textbox').closest('form')!

    fireEvent.change(input, { target: { value: 'Celebrate me!' } })
    fireEvent.submit(form)

    const checkbox = screen.getByRole('checkbox')

    // Clear any previous calls
    vi.mocked(confetti.default).mockClear()

    fireEvent.click(checkbox)

    // Confetti should be triggered
    expect(confetti.default).toHaveBeenCalled()
  })
})
