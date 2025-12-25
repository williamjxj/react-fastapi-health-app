import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PatientRegistrationForm } from '@/components/patients/PatientRegistrationForm'

// Mock successful API response
const mockCreatePatient = vi.fn().mockResolvedValue({})
vi.mock('@/lib/api/patientService', () => ({
  createPatient: (...args: any[]) => mockCreatePatient(...args),
}))

beforeEach(() => {
  mockCreatePatient.mockClear()
  mockCreatePatient.mockResolvedValue({})
})

describe('PatientRegistrationForm Success Animation', () => {
  it('should display success message with smooth appearance', async () => {
    const user = userEvent.setup()
    render(<PatientRegistrationForm />)

    // Fill form
    await user.type(screen.getByLabelText(/patient id/i), 'P001')
    await user.type(screen.getByLabelText(/name/i), 'John Doe')
    await user.type(screen.getByLabelText(/age/i), '30')
    await user.type(screen.getByLabelText(/medical condition/i), 'Fever')
    await user.type(screen.getByLabelText(/last visit/i), '2024-01-01')

    // Submit form
    const submitButton = screen.getByRole('button', { name: /register patient/i })
    await user.click(submitButton)

    // Success message should appear
    await waitFor(() => {
      const successMessage = screen.getByText(/successfully/i)
      expect(successMessage).toBeInTheDocument()
      // Message should have animation classes
      expect(successMessage.closest('p')).toHaveClass('animate-fade-in')
    })
  })

  it('should animate success message appearance (200ms)', async () => {
    const user = userEvent.setup()
    render(<PatientRegistrationForm />)

    // Fill and submit form
    await user.type(screen.getByLabelText(/patient id/i), 'P001')
    await user.type(screen.getByLabelText(/name/i), 'John Doe')
    await user.type(screen.getByLabelText(/age/i), '30')
    await user.type(screen.getByLabelText(/medical condition/i), 'Fever')
    await user.type(screen.getByLabelText(/last visit/i), '2024-01-01')

    await user.click(screen.getByRole('button', { name: /register patient/i }))

    // Success message should appear within 200ms
    await waitFor(() => {
      expect(screen.getByText(/successfully/i)).toBeInTheDocument()
    }, { timeout: 300 })
  })
})

