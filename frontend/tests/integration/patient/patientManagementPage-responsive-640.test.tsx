import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { PatientManagementPage } from '@/components/patients/PatientManagementPage'

// Mock child components
vi.mock('@/components/patients/PatientRegistrationForm', () => ({
  PatientRegistrationForm: () => <div data-testid="registration-form">Form</div>,
}))

vi.mock('@/components/patients/PatientSearchForm', () => ({
  PatientSearchForm: () => <div data-testid="search-form">Search</div>,
}))

vi.mock('@/components/patients/PatientsTable', () => ({
  PatientsTable: () => <div data-testid="patients-table">Table</div>,
}))

describe('PatientManagementPage Responsive Design - 640px', () => {
  it('should stack components vertically at 640px breakpoint', () => {
    // Simulate 640px viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 640,
    })

    const { container } = render(<PatientManagementPage />)
    const grid = container.querySelector('[class*="grid"]')
    
    // Grid should use single column at 640px
    expect(grid).toHaveClass('grid-cols-1')
  })

  it('should maintain functionality at 640px', () => {
    const { container } = render(<PatientManagementPage />)
    
    // All components should be accessible
    expect(container.querySelector('[data-testid="registration-form"]')).toBeInTheDocument()
    expect(container.querySelector('[data-testid="search-form"]')).toBeInTheDocument()
    expect(container.querySelector('[data-testid="patients-table"]')).toBeInTheDocument()
  })

  it('should have appropriate padding at 640px', () => {
    const { container } = render(<PatientManagementPage />)
    const main = container.querySelector('main')
    
    // Should have responsive padding
    expect(main).toHaveClass('p-4')
  })
})

