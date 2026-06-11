import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ClearCompletedButton } from './ClearCompletedButton'

describe('ClearCompletedButton', () => {
  it('should render the button when show prop is true', () => {
    const mockOnClearCompleted = vi.fn()
    render(
      <ClearCompletedButton show={true} onClearCompleted={mockOnClearCompleted} />
    )

    expect(screen.getByRole('button', { name: /clear all completed tasks/i })).toBeInTheDocument()
  })

  it('should not render the button when show prop is false', () => {
    const mockOnClearCompleted = vi.fn()
    const { container } = render(
      <ClearCompletedButton show={false} onClearCompleted={mockOnClearCompleted} />
    )

    expect(container.firstChild).toBeNull()
  })

  it('should call onClearCompleted when button is clicked', async () => {
    const user = userEvent.setup()
    const mockOnClearCompleted = vi.fn()
    render(
      <ClearCompletedButton show={true} onClearCompleted={mockOnClearCompleted} />
    )

    const button = screen.getByRole('button', { name: /clear all completed tasks/i })
    await user.click(button)

    expect(mockOnClearCompleted).toHaveBeenCalledOnce()
  })

  it('should display correct button text', () => {
    const mockOnClearCompleted = vi.fn()
    render(
      <ClearCompletedButton show={true} onClearCompleted={mockOnClearCompleted} />
    )

    expect(screen.getByText('Clear Completed')).toBeInTheDocument()
  })
})
