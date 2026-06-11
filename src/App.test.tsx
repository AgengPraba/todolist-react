import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { describe, it, expect, beforeEach } from 'vitest'

describe('App Component Integration', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
  })

  it('renders app title and all sub-components', () => {
    render(<App />)
    
    expect(screen.getByText('My Todo List')).toBeInTheDocument()
    expect(screen.getByLabelText('Add new todo')).toBeInTheDocument()
    expect(screen.getByText('All')).toBeInTheDocument()
    expect(screen.getByText('Active')).toBeInTheDocument()
    expect(screen.getByText('Completed')).toBeInTheDocument()
  })

  it('adds a new todo when user submits form', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    const input = screen.getByLabelText('Add new todo') as HTMLInputElement
    const addButton = screen.getByLabelText('Add todo button')
    
    await user.type(input, 'Buy groceries')
    await user.click(addButton)
    
    expect(screen.getByText('Buy groceries')).toBeInTheDocument()
    expect(input.value).toBe('')
  })

  it('toggles todo completion status', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    const input = screen.getByLabelText('Add new todo') as HTMLInputElement
    await user.type(input, 'Learn React')
    await user.keyboard('{Enter}')
    
    const checkbox = screen.getByLabelText('Toggle completion for Learn React')
    await user.click(checkbox)
    
    const description = screen.getByText('Learn React')
    expect(description).toHaveClass('completed')
  })

  it('deletes a todo', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    const input = screen.getByLabelText('Add new todo') as HTMLInputElement
    await user.type(input, 'Delete me')
    await user.keyboard('{Enter}')
    
    expect(screen.getByText('Delete me')).toBeInTheDocument()
    
    const deleteButton = screen.getByLabelText('Delete Delete me')
    await user.click(deleteButton)
    
    expect(screen.queryByText('Delete me')).not.toBeInTheDocument()
  })

  it('filters todos by status', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    const input = screen.getByLabelText('Add new todo') as HTMLInputElement
    
    // Add two todos
    await user.type(input, 'Todo 1')
    await user.keyboard('{Enter}')
    
    await user.type(input, 'Todo 2')
    await user.keyboard('{Enter}')
    
    // Mark first one as complete
    const checkbox1 = screen.getAllByRole('checkbox')[0]
    await user.click(checkbox1)
    
    // Filter to Active
    const activeButton = screen.getByLabelText('Filter: Active')
    await user.click(activeButton)
    
    expect(screen.getByText('Todo 2')).toBeInTheDocument()
    expect(screen.queryByText('Todo 1')).not.toBeInTheDocument()
    
    // Filter to Completed
    const completedButton = screen.getByLabelText('Filter: Completed')
    await user.click(completedButton)
    
    expect(screen.getByText('Todo 1')).toBeInTheDocument()
    expect(screen.queryByText('Todo 2')).not.toBeInTheDocument()
    
    // Filter to All
    const allButton = screen.getByLabelText('Filter: All')
    await user.click(allButton)
    
    expect(screen.getByText('Todo 1')).toBeInTheDocument()
    expect(screen.getByText('Todo 2')).toBeInTheDocument()
  })

  it('clears all completed todos', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    const input = screen.getByLabelText('Add new todo') as HTMLInputElement
    
    // Add three todos
    await user.type(input, 'Todo 1')
    await user.keyboard('{Enter}')
    
    await user.type(input, 'Todo 2')
    await user.keyboard('{Enter}')
    
    await user.type(input, 'Todo 3')
    await user.keyboard('{Enter}')
    
    // Mark two as complete
    const checkboxes = screen.getAllByRole('checkbox')
    await user.click(checkboxes[0])
    await user.click(checkboxes[1])
    
    // Clear Completed button should be visible
    const clearButton = screen.getByLabelText('Clear all completed tasks')
    expect(clearButton).toBeInTheDocument()
    
    await user.click(clearButton)
    
    // Only uncompleted todo should remain
    expect(screen.getByText('Todo 3')).toBeInTheDocument()
    expect(screen.queryByText('Todo 1')).not.toBeInTheDocument()
    expect(screen.queryByText('Todo 2')).not.toBeInTheDocument()
  })

  it('hides clear completed button when no completed todos', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    const input = screen.getByLabelText('Add new todo') as HTMLInputElement
    
    // Add and complete a todo
    await user.type(input, 'Todo')
    await user.keyboard('{Enter}')
    
    const checkbox = screen.getByRole('checkbox')
    await user.click(checkbox)
    
    // Clear Completed button should exist
    let clearButton = screen.queryByLabelText('Clear all completed tasks')
    expect(clearButton).toBeInTheDocument()
    
    // Clear completed
    await user.click(clearButton!)
    
    // Button should be hidden
    clearButton = screen.queryByLabelText('Clear all completed tasks')
    expect(clearButton).not.toBeInTheDocument()
  })

  it('persists todos to localStorage', async () => {
    const user = userEvent.setup()
    const { unmount } = render(<App />)
    
    const input = screen.getByLabelText('Add new todo') as HTMLInputElement
    await user.type(input, 'Persistent todo')
    await user.keyboard('{Enter}')
    
    // Verify it's displayed
    expect(screen.getByText('Persistent todo')).toBeInTheDocument()
    
    // Unmount and re-render
    unmount()
    render(<App />)
    
    // Verify todo is still there
    await waitFor(() => {
      expect(screen.getByText('Persistent todo')).toBeInTheDocument()
    })
  })

  it('displays empty state when no todos', () => {
    render(<App />)
    expect(screen.getByText('No todos yet. Add one to get started!')).toBeInTheDocument()
  })

  it('handles empty input validation', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    const addButton = screen.getByLabelText('Add todo button')
    
    // Try to add empty todo
    await user.click(addButton)
    
    // Should still show empty state
    expect(screen.getByText('No todos yet. Add one to get started!')).toBeInTheDocument()
  })
})
