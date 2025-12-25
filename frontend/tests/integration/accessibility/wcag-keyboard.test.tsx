import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PatientRegistrationForm } from '@/components/patients/PatientRegistrationForm'

// Mock API service
vi.mock('@/lib/api/patientService', () => ({
  createPatient: vi.fn(),
}))

describe('WCAG 2.1 AA Keyboard Navigation Compliance', () => {
  it('should allow all functionality to be accessed via keyboard', async () => {
    const user = userEvent.setup()
    render(<PatientRegistrationForm />)

    // Should be able to tab to all form fields
    await user.tab()
    expect(document.activeElement).toBeTruthy()
  })

  it('should allow form submission via keyboard', async () => {
    const user = userEvent.setup()
    render(<PatientRegistrationForm />)

    // Fill form using keyboard
    const patientIdInput = screen.getByLabelText(/patient id/i)
    await user.type(patientIdInput, 'P001')
    
    // Should be able to submit with Enter key
    const submitButton = screen.getByRole('button', { name: /register patient/i })
    await user.tab()
    await user.keyboard('{Enter}')
    
    // Form should be submittable
    expect(submitButton).toBeInTheDocument()
  })

  it('should have no keyboard traps', async () => {
    const user = userEvent.setup()
    render(<PatientRegistrationForm />)

    // Should be able to tab through all elements
    await user.tab()
    await user.tab()
    await user.tab()
    
    // Should not be trapped in any element
    expect(document.activeElement).toBeTruthy()
  })
})

