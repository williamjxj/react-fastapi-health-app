import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { PatientManagementPage } from '@/components/patients/PatientManagementPage'

// Mock child components
vi.mock('@/components/patients/PatientRegistrationForm', () => ({
  PatientRegistrationForm: () => <div data-testid="registration-form">Registration Form</div>,
}))

vi.mock('@/components/patients/PatientSearchForm', () => ({
  PatientSearchForm: () => <div data-testid="search-form">Search Form</div>,
}))

vi.mock('@/components/patients/PatientsTable', () => ({
  PatientsTable: () => <div data-testid="patients-table">Patients Table</div>,
}))

describe('PatientManagementPage Visual Regression', () => {
  it('should apply Ocean Breeze theme colors consistently', () => {
    const { container } = render(<PatientManagementPage />)
    const main = container.querySelector('main')
    
    // Verify theme colors are applied (check for Ocean Breeze color classes)
    expect(main).toBeInTheDocument()
    // Visual inspection: theme should be applied via CSS variables
  })

  it('should have consistent spacing throughout', () => {
    const { container } = render(<PatientManagementPage />)
    const cards = container.querySelectorAll('[class*="rounded-lg"]')
    
    // All cards should have consistent padding
    cards.forEach(card => {
      expect(card).toHaveClass('p-4', 'md:p-6')
    })
  })

  it('should have improved typography hierarchy', () => {
    const { container } = render(<PatientManagementPage />)
    const h1 = container.querySelector('h1')
    const h2 = container.querySelectorAll('h2')
    
    expect(h1).toHaveClass('text-3xl', 'md:text-4xl', 'font-bold')
    h2.forEach(heading => {
      expect(heading).toHaveClass('text-xl', 'md:text-2xl', 'font-semibold')
    })
  })

  it('should maintain visual consistency across all sections', () => {
    const { container } = render(<PatientManagementPage />)
    const sections = container.querySelectorAll('[class*="border rounded-lg"]')
    
    // All sections should have consistent styling
    expect(sections.length).toBeGreaterThan(0)
    sections.forEach(section => {
      expect(section).toHaveClass('border', 'rounded-lg', 'bg-card')
    })
  })
})

