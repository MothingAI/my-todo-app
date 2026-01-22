import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import App from '@/App'

describe('Todo App Integration - Delete with Undo', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should show undo notification when deleting a todo', () => {
    render(<App />)

    // Add a todo first
    const input = screen.getByRole('textbox')
    const form = screen.getByRole('textbox').closest('form')!

    fireEvent.change(input, { target: { value: 'Todo to delete' } })
    fireEvent.submit(form)

    // Find and click delete button
    const deleteButton = screen.getByLabelText(/delete.*todo to delete/i)
    fireEvent.click(deleteButton)

    // Verify todo is removed from list
    expect(screen.queryAllByRole('listitem').find((el) =>
      el.textContent?.includes('Todo to delete')
    )).toBeUndefined()

    // Verify undo notification appears
    expect(screen.getByText(/undo/i)).toBeInTheDocument()
  })

  it('should restore todo when clicking undo', () => {
    render(<App />)

    // Add a todo
    const input = screen.getByRole('textbox')
    const form = screen.getByRole('textbox').closest('form')!

    fireEvent.change(input, { target: { value: 'Restore me' } })
    fireEvent.submit(form)

    // Delete it
    const deleteButton = screen.getByLabelText(/delete.*restore me/i)
    fireEvent.click(deleteButton)

    // Click undo
    const undoButton = screen.getByText(/undo/i)
    fireEvent.click(undoButton)

    // Verify todo is restored
    expect(screen.getAllByRole('listitem').find((el) =>
      el.textContent?.includes('Restore me')
    )).toBeInTheDocument()
  })

  it('should permanently delete after 5 seconds', async () => {
    render(<App />)

    // Add a todo
    const input = screen.getByRole('textbox')
    const form = screen.getByRole('textbox').closest('form')!

    fireEvent.change(input, { target: { value: 'Temporary todo' } })
    fireEvent.submit(form)

    // Delete it
    const deleteButton = screen.getByLabelText(/delete.*temporary todo/i)
    fireEvent.click(deleteButton)

    // Wait for 5 seconds + a bit more for state updates
    // Using vi.useRealTimers() approach with waitFor
    await waitFor(
      () => {
        expect(screen.queryByText(/undo/i)).not.toBeInTheDocument()
      },
      { timeout: 6000 }
    )

    // Verify todo is permanently deleted
    expect(screen.queryAllByRole('listitem').find((el) =>
      el.textContent?.includes('Temporary todo')
    )).toBeUndefined()
  }, 10000) // Increase test timeout to 10 seconds

  it('should replace undo notification when deleting another todo', () => {
    render(<App />)

    // Add two todos
    const input = screen.getByRole('textbox')
    const form = screen.getByRole('textbox').closest('form')!

    fireEvent.change(input, { target: { value: 'First todo' } })
    fireEvent.submit(form)

    fireEvent.change(input, { target: { value: 'Second todo' } })
    fireEvent.submit(form)

    // Delete first todo
    const deleteButton1 = screen.getByLabelText(/delete.*first todo/i)
    fireEvent.click(deleteButton1)

    // Delete second todo (should replace notification)
    const deleteButton2 = screen.getByLabelText(/delete.*second todo/i)
    fireEvent.click(deleteButton2)

    // Should only see one undo notification
    const undoNotifications = screen.getAllByText(/undo/i)
    expect(undoNotifications).toHaveLength(1)

    // Undoing should restore the second todo
    const undoButton = screen.getByText(/undo/i)
    fireEvent.click(undoButton)

    // Use listitem role to find the correct element
    expect(screen.getAllByRole('listitem').find((el) =>
      el.textContent?.includes('Second todo')
    )).toBeInTheDocument()
    expect(screen.queryAllByRole('listitem').find((el) =>
      el.textContent?.includes('First todo')
    )).toBeUndefined()
  })

  it('should delete completed todos as well', () => {
    render(<App />)

    // Add and complete a todo
    const input = screen.getByRole('textbox')
    const form = screen.getByRole('textbox').closest('form')!

    fireEvent.change(input, { target: { value: 'Completed todo' } })
    fireEvent.submit(form)

    const checkbox = screen.getByRole('checkbox')
    fireEvent.click(checkbox)

    // Delete the completed todo
    const deleteButton = screen.getByLabelText(/delete.*completed todo/i)
    fireEvent.click(deleteButton)

    // Verify it's removed
    expect(screen.queryAllByRole('listitem').find((el) =>
      el.textContent?.includes('Completed todo')
    )).toBeUndefined()

    // Verify undo notification appears
    expect(screen.getByText(/undo/i)).toBeInTheDocument()
  })
})
