import './ClearCompletedButton.css'

interface ClearCompletedButtonProps {
  /**
   * Whether to show the button (shown only when completed items exist)
   */
  show: boolean
  /**
   * Callback triggered when the button is clicked
   */
  onClearCompleted: () => void
}

/**
 * ClearCompletedButton Component
 *
 * Displays a button that allows users to remove all completed todo items at once.
 * The button is conditionally hidden when no completed items exist.
 * Validates: Requirements 7.1, 7.2
 */
export function ClearCompletedButton({
  show,
  onClearCompleted,
}: ClearCompletedButtonProps) {
  if (!show) {
    return null
  }

  return (
    <button
      className="clear-completed-btn"
      onClick={onClearCompleted}
      aria-label="Clear all completed tasks"
    >
      Clear Completed
    </button>
  )
}
