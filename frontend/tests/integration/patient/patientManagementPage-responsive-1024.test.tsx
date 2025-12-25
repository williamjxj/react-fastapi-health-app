import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { PatientManagementPage } from '@/components/patients/PatientManagementPage'

// Mock child components
vi.mock('@/components/patients/PatientRegistrationForm', () => ({
  PatientRegistrationForm: () => <div>Form</div>,
}))

vi.mock('@/components/patients/PatientSearchForm', () => ({
  PatientSearchForm: () => <div>Search</div>,
}))

vi.mock('@/components/patients/PatientsTable', () => ({
  PatientsTable: () => <div>Table</div>,
}))

describe('PatientManagementPage Responsive Design - 1024px', () => {
  it('should use two-column layout at 1024px', () => {
    const { container } = render(<PatientManagementPage />)
    const grid = container.querySelector('[class*="grid"]')
    
    // Should use lg:grid-cols-2 at 1024px+
    expect(grid).toHaveClass('lg:grid-cols-2')
  })

  it('should have optimal spacing at 1024px', () => {
    const { container } = render(<PatientManagementPage />)
    const grid = container.querySelector('[class*="grid"]')
    
    // Should have appropriate gap
    expect(grid).toHaveClass('gap-6', 'md:gap-8')
  })
})

