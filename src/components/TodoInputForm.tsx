import { useState } from 'react'
import './TodoInputForm.css'

interface TodoInputFormProps {
  onAdd: (description: string) => void
}

export function TodoInputForm({ onAdd }: TodoInputFormProps) {
  const [inputValue, setInputValue] = useState('')

  const handleSubmit = () => {
    // Validate input is not empty or whitespace-only
    const trimmedValue = inputValue.trim()
    if (!trimmedValue) {
      return
    }

    // Trigger onAdd event with the description
    onAdd(trimmedValue)

    // Clear input after successful addition
    setInputValue('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle Enter key
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <div className="todo-input-form">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add a new todo..."
        aria-label="Add new todo"
      />
      <button onClick={handleSubmit} aria-label="Add todo button">
        Add
      </button>
    </div>
  )
}
