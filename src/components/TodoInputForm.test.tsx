import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TodoInputForm } from './TodoInputForm'

describe('TodoInputForm', () => {
  describe('Unit Tests', () => {
    it('should render input field and add button', () => {
      const mockOnAdd = vi.fn()
      render(<TodoInputForm onAdd={mockOnAdd} />)

      const input = screen.getByRole('textbox', { name: /add new todo/i })
      const button = screen.getByRole('button', { name: /add todo button/i })

      expect(input).toBeInTheDocument()
      expect(button).toBeInTheDocument()
    })

    it('should update input value on user typing', () => {
      const mockOnAdd = vi.fn()
      render(<TodoInputForm onAdd={mockOnAdd} />)

      const input = screen.getByRole('textbox') as HTMLInputElement
      fireEvent.change(input, { target: { value: 'Buy milk' } })

      expect(input.value).toBe('Buy milk')
    })

    it('should call onAdd with trimmed input when Add button is clicked', () => {
      const mockOnAdd = vi.fn()
      render(<TodoInputForm onAdd={mockOnAdd} />)

      const input = screen.getByRole('textbox')
      const button = screen.getByRole('button', { name: /add todo button/i })

      fireEvent.change(input, { target: { value: '  Buy milk  ' } })
      fireEvent.click(button)

      expect(mockOnAdd).toHaveBeenCalledWith('Buy milk')
      expect(mockOnAdd).toHaveBeenCalledTimes(1)
    })

    it('should call onAdd with trimmed input when Enter key is pressed', () => {
      const mockOnAdd = vi.fn()
      render(<TodoInputForm onAdd={mockOnAdd} />)

      const input = screen.getByRole('textbox') as HTMLInputElement
      fireEvent.change(input, { target: { value: '  Buy milk  ' } })
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })

      expect(mockOnAdd).toHaveBeenCalledWith('Buy milk')
      expect(mockOnAdd).toHaveBeenCalledTimes(1)
    })

    it('should not call onAdd for empty input', () => {
      const mockOnAdd = vi.fn()
      render(<TodoInputForm onAdd={mockOnAdd} />)

      const button = screen.getByRole('button', { name: /add todo button/i })
      fireEvent.click(button)

      expect(mockOnAdd).not.toHaveBeenCalled()
    })

    it('should not call onAdd for whitespace-only input', () => {
      const mockOnAdd = vi.fn()
      render(<TodoInputForm onAdd={mockOnAdd} />)

      const input = screen.getByRole('textbox')
      fireEvent.change(input, { target: { value: '   ' } })

      const button = screen.getByRole('button', { name: /add todo button/i })
      fireEvent.click(button)

      expect(mockOnAdd).not.toHaveBeenCalled()
    })

    it('should not call onAdd when pressing Enter with whitespace-only input', () => {
      const mockOnAdd = vi.fn()
      render(<TodoInputForm onAdd={mockOnAdd} />)

      const input = screen.getByRole('textbox') as HTMLInputElement
      fireEvent.change(input, { target: { value: '   ' } })
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })

      expect(mockOnAdd).not.toHaveBeenCalled()
    })

    it('should clear input field after successful addition via button click', () => {
      const mockOnAdd = vi.fn()
      render(<TodoInputForm onAdd={mockOnAdd} />)

      const input = screen.getByRole('textbox') as HTMLInputElement
      const button = screen.getByRole('button', { name: /add todo button/i })

      fireEvent.change(input, { target: { value: 'Buy milk' } })
      fireEvent.click(button)

      expect(input.value).toBe('')
    })

    it('should clear input field after successful addition via Enter key', () => {
      const mockOnAdd = vi.fn()
      render(<TodoInputForm onAdd={mockOnAdd} />)

      const input = screen.getByRole('textbox') as HTMLInputElement
      fireEvent.change(input, { target: { value: 'Buy milk' } })
      fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })

      expect(input.value).toBe('')
    })

    it('should not clear input if validation fails (empty string)', () => {
      const mockOnAdd = vi.fn()
      render(<TodoInputForm onAdd={mockOnAdd} />)

      const input = screen.getByRole('textbox') as HTMLInputElement
      const button = screen.getByRole('button', { name: /add todo button/i })

      fireEvent.change(input, { target: { value: '' } })
      fireEvent.click(button)

      expect(input.value).toBe('')
      expect(mockOnAdd).not.toHaveBeenCalled()
    })

    it('should allow multiple consecutive additions', () => {
      const mockOnAdd = vi.fn()
      render(<TodoInputForm onAdd={mockOnAdd} />)

      const input = screen.getByRole('textbox') as HTMLInputElement
      const button = screen.getByRole('button', { name: /add todo button/i })

      fireEvent.change(input, { target: { value: 'Task 1' } })
      fireEvent.click(button)
      fireEvent.change(input, { target: { value: 'Task 2' } })
      fireEvent.click(button)

      expect(mockOnAdd).toHaveBeenCalledTimes(2)
      expect(mockOnAdd).toHaveBeenNthCalledWith(1, 'Task 1')
      expect(mockOnAdd).toHaveBeenNthCalledWith(2, 'Task 2')
    })

    it('should validate multiple types of whitespace', () => {
      const mockOnAdd = vi.fn()
      const { rerender } = render(<TodoInputForm onAdd={mockOnAdd} />)

      const whitespaceTests = ['', '   ', '\t', '\n', '\r', ' \t\n\r ']

      whitespaceTests.forEach((whitespace) => {
        mockOnAdd.mockClear()
        rerender(<TodoInputForm onAdd={mockOnAdd} />)

        const input = screen.getByRole('textbox') as HTMLInputElement
        const button = screen.getByRole('button', { name: /add todo button/i })

        fireEvent.change(input, { target: { value: whitespace } })
        fireEvent.click(button)

        expect(mockOnAdd).not.toHaveBeenCalled()
      })
    })
  })

  describe('Property-Based Tests', () => {
    describe('Property 2: Empty and whitespace-only inputs are rejected', () => {
      /**
       * Validates: Requirements 1.2
       *
       * For any string that is empty or composed entirely of whitespace characters,
       * attempting to add it to the todo list should be rejected, and the onAdd
       * callback should not be called.
       */
      it('should reject empty inputs', () => {
        const mockOnAdd = vi.fn()
        const { unmount } = render(<TodoInputForm onAdd={mockOnAdd} />)

        const input = screen.getByRole('textbox') as HTMLInputElement
        const button = screen.getByRole('button', { name: /add todo button/i })

        fireEvent.change(input, { target: { value: '' } })
        fireEvent.click(button)

        expect(mockOnAdd).not.toHaveBeenCalled()
        unmount()
      })

      it('should reject single space', () => {
        const mockOnAdd = vi.fn()
        const { unmount } = render(<TodoInputForm onAdd={mockOnAdd} />)

        const input = screen.getByRole('textbox') as HTMLInputElement
        const button = screen.getByRole('button', { name: /add todo button/i })

        fireEvent.change(input, { target: { value: ' ' } })
        fireEvent.click(button)

        expect(mockOnAdd).not.toHaveBeenCalled()
        unmount()
      })

      it('should reject multiple spaces', () => {
        const mockOnAdd = vi.fn()
        const { unmount } = render(<TodoInputForm onAdd={mockOnAdd} />)

        const input = screen.getByRole('textbox') as HTMLInputElement
        const button = screen.getByRole('button', { name: /add todo button/i })

        fireEvent.change(input, { target: { value: '     ' } })
        fireEvent.click(button)

        expect(mockOnAdd).not.toHaveBeenCalled()
        unmount()
      })

      it('should reject tabs', () => {
        const mockOnAdd = vi.fn()
        const { unmount } = render(<TodoInputForm onAdd={mockOnAdd} />)

        const input = screen.getByRole('textbox') as HTMLInputElement
        const button = screen.getByRole('button', { name: /add todo button/i })

        fireEvent.change(input, { target: { value: '\t\t\t' } })
        fireEvent.click(button)

        expect(mockOnAdd).not.toHaveBeenCalled()
        unmount()
      })

      it('should reject newlines', () => {
        const mockOnAdd = vi.fn()
        const { unmount } = render(<TodoInputForm onAdd={mockOnAdd} />)

        const input = screen.getByRole('textbox') as HTMLInputElement
        const button = screen.getByRole('button', { name: /add todo button/i })

        fireEvent.change(input, { target: { value: '\n\n\n' } })
        fireEvent.click(button)

        expect(mockOnAdd).not.toHaveBeenCalled()
        unmount()
      })

      it('should reject mixed whitespace', () => {
        const mockOnAdd = vi.fn()
        const { unmount } = render(<TodoInputForm onAdd={mockOnAdd} />)

        const input = screen.getByRole('textbox') as HTMLInputElement
        const button = screen.getByRole('button', { name: /add todo button/i })

        fireEvent.change(input, { target: { value: '  \t\n  ' } })
        fireEvent.click(button)

        expect(mockOnAdd).not.toHaveBeenCalled()
        unmount()
      })
    })
  })
})
