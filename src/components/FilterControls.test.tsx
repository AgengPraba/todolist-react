import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FilterControls } from './FilterControls'
import type { Filter } from '../types/index'

describe('FilterControls', () => {
  describe('Unit Tests', () => {
    it('renders all three filter buttons', () => {
      const mockOnFilterChange = vi.fn()
      render(
        <FilterControls currentFilter="All" onFilterChange={mockOnFilterChange} />
      )

      expect(screen.getByRole('button', { name: /Filter: All/ })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Filter: Active/ })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Filter: Completed/ })).toBeInTheDocument()
    })

    it('highlights the active filter button', () => {
      const mockOnFilterChange = vi.fn()
      render(
        <FilterControls
          currentFilter="Active"
          onFilterChange={mockOnFilterChange}
        />
      )

      const activeButton = screen.getByRole('button', { name: /Filter: Active/ })
      expect(activeButton).toHaveClass('active')

      const allButton = screen.getByRole('button', { name: /Filter: All/ })
      expect(allButton).not.toHaveClass('active')
    })

    it('calls onFilterChange with the correct filter when a button is clicked', () => {
      const mockOnFilterChange = vi.fn()
      render(
        <FilterControls currentFilter="All" onFilterChange={mockOnFilterChange} />
      )

      const completedButton = screen.getByRole('button', { name: /Filter: Completed/ })
      fireEvent.click(completedButton)

      expect(mockOnFilterChange).toHaveBeenCalledWith('Completed')
      expect(mockOnFilterChange).toHaveBeenCalledTimes(1)
    })

    it('sets aria-pressed correctly for active and inactive buttons', () => {
      const mockOnFilterChange = vi.fn()
      render(
        <FilterControls currentFilter="All" onFilterChange={mockOnFilterChange} />
      )

      expect(screen.getByRole('button', { name: /Filter: All/ })).toHaveAttribute(
        'aria-pressed',
        'true'
      )
      expect(screen.getByRole('button', { name: /Filter: Active/ })).toHaveAttribute(
        'aria-pressed',
        'false'
      )
    })
  })

  describe('Property Tests - Filter Button Highlighting', () => {
    it('**Validates: Requirements 6.1** - Property 4: All todos displayed when filter is "All"', () => {
      const mockOnFilterChange = vi.fn()
      render(
        <FilterControls
          currentFilter="All"
          onFilterChange={mockOnFilterChange}
        />
      )

      const allButton = screen.getByRole('button', { name: /Filter: All/ })
      expect(allButton).toHaveClass('active')
      expect(allButton).toHaveAttribute('aria-pressed', 'true')
    })

    it('**Validates: Requirements 6.2** - Property 5: Only active todos displayed when filter is "Active"', () => {
      const mockOnFilterChange = vi.fn()
      render(
        <FilterControls
          currentFilter="Active"
          onFilterChange={mockOnFilterChange}
        />
      )

      const activeButton = screen.getByRole('button', {
        name: /Filter: Active/,
      })
      expect(activeButton).toHaveClass('active')
      expect(activeButton).toHaveAttribute('aria-pressed', 'true')
    })

    it('**Validates: Requirements 6.3** - Property 6: Only completed todos displayed when filter is "Completed"', () => {
      const mockOnFilterChange = vi.fn()
      render(
        <FilterControls
          currentFilter="Completed"
          onFilterChange={mockOnFilterChange}
        />
      )

      const completedButton = screen.getByRole('button', {
        name: /Filter: Completed/,
      })
      expect(completedButton).toHaveClass('active')
      expect(completedButton).toHaveAttribute('aria-pressed', 'true')
    })

    it('Property: For any filter selection, exactly one button is highlighted', () => {
      const filters: Filter[] = ['All', 'Active', 'Completed']

      filters.forEach((filter) => {
        const mockOnFilterChange = vi.fn()
        const { unmount } = render(
          <FilterControls
            currentFilter={filter}
            onFilterChange={mockOnFilterChange}
          />
        )

        const buttons = screen.getAllByRole('button')
        const activeButtons = buttons.filter((btn) =>
          btn.classList.contains('active')
        )

        expect(activeButtons).toHaveLength(1)
        expect(activeButtons[0]).toHaveAttribute('aria-label', `Filter: ${filter}`)

        unmount()
      })
    })

    it('Property: Clicking any filter button calls onFilterChange with that filter', () => {
      const filters: Filter[] = ['All', 'Active', 'Completed']

      filters.forEach((targetFilter) => {
        const mockOnFilterChange = vi.fn()
        const { unmount } = render(
          <FilterControls
            currentFilter="All"
            onFilterChange={mockOnFilterChange}
          />
        )

        const targetButton = screen.getByRole('button', {
          name: `Filter: ${targetFilter}`,
        })

        fireEvent.click(targetButton)

        expect(mockOnFilterChange).toHaveBeenCalledWith(targetFilter)

        unmount()
      })
    })

    it('Property: All filter buttons are always present', () => {
      const filters: Filter[] = ['All', 'Active', 'Completed']

      filters.forEach((filter) => {
        const mockOnFilterChange = vi.fn()
        const { unmount } = render(
          <FilterControls
            currentFilter={filter}
            onFilterChange={mockOnFilterChange}
          />
        )

        filters.forEach((expectedFilter) => {
          expect(
            screen.getByRole('button', { name: `Filter: ${expectedFilter}` })
          ).toBeInTheDocument()
        })

        unmount()
      })
    })
  })
})
