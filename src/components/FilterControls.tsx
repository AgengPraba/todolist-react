import type { Filter } from '../types/index'
import './FilterControls.css'

interface FilterControlsProps {
  /**
   * The currently active filter
   */
  currentFilter: Filter
  /**
   * Callback triggered when the filter selection changes
   */
  onFilterChange: (filter: Filter) => void
}

/**
 * FilterControls Component
 *
 * Displays filter buttons allowing users to view All, Active, or Completed todos.
 * Validates: Requirements 6.1, 6.2, 6.3, 6.4
 */
export function FilterControls({
  currentFilter,
  onFilterChange,
}: FilterControlsProps) {
  const filters: Filter[] = ['All', 'Active', 'Completed']

  return (
    <div className="filter-controls">
      {filters.map((filter) => (
        <button
          key={filter}
          className={`filter-button ${currentFilter === filter ? 'active' : ''}`}
          onClick={() => onFilterChange(filter)}
          aria-label={`Filter: ${filter}`}
          aria-pressed={currentFilter === filter}
        >
          {filter}
        </button>
      ))}
    </div>
  )
}
