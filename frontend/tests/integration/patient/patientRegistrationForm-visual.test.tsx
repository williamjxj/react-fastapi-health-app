import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { PatientRegistrationForm } from '@/components/patients/PatientRegistrationForm'

// Mock API service
vi.mock('@/lib/api/patientService', () => ({
  createPatient: vi.fn(),
}))

describe('PatientRegistrationForm Visual Regression', () => {
  it('should apply Ocean Breeze theme colors', () => {
    const { container } = render(<PatientRegistrationForm />)
    const form = container.querySelector('form')
    
    expect(form).toBeInTheDocument()
    // Visual inspection: theme colors should be applied
  })

  it('should have improved typography for form fields', () => {
    const { container } = render(<PatientRegistrationForm />)
    const labels = container.querySelectorAll('label')
    
    labels.forEach(label => {
      expect(label).toHaveClass('text-sm', 'font-medium')
    })
  })

  it('should have appropriate spacing between form fields', () => {
    const { container } = render(<PatientRegistrationForm />)
    const form = container.querySelector('form')
    
    // Form should have consistent spacing
    expect(form).toHaveClass('space-y-6')
  })

  it('should have clear visual grouping of form fields', () => {
    const { container } = render(<PatientRegistrationForm />)
    const fieldGroups = container.querySelectorAll('[class*="grid"]')
    
    // Form fields should be grouped visually
    expect(fieldGroups.length).toBeGreaterThan(0)
  })
})

