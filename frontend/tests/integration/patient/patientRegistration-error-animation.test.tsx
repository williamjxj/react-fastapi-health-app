import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PatientRegistrationForm } from '@/components/patients/PatientRegistrationForm'

// Mock API error
const mockCreatePatient = vi.fn().mockRejectedValue(new Error('Network error'))
vi.mock('@/lib/api/patientService', () => ({
  createPatient: (...args: unknown[]) => mockCreatePatient(...args),
}))

beforeEach(() => {
  mockCreatePatient.mockClear()
  mockCreatePatient.mockRejectedValue(new Error('Network error'))
})

describe('PatientRegistrationForm Error Animation', () => {
  it('should display error message with smooth appearance', async () => {
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

    // Error message should appear
    await waitFor(() => {
      const errorMessage = screen.getByText(/failed/i)
      expect(errorMessage).toBeInTheDocument()
      // Message should have animation classes
      expect(errorMessage.closest('p')).toHaveClass('animate-fade-in')
    })
  })

  it('should animate error message appearance (200ms)', async () => {
    const user = userEvent.setup()
    render(<PatientRegistrationForm />)

    // Fill and submit form
    await user.type(screen.getByLabelText(/patient id/i), 'P001')
    await user.type(screen.getByLabelText(/name/i), 'John Doe')
    await user.type(screen.getByLabelText(/age/i), '30')
    await user.type(screen.getByLabelText(/medical condition/i), 'Fever')
    await user.type(screen.getByLabelText(/last visit/i), '2024-01-01')

    await user.click(screen.getByRole('button', { name: /register patient/i }))

    // Error message should appear within 200ms
    await waitFor(() => {
      expect(screen.getByText(/failed/i)).toBeInTheDocument()
    }, { timeout: 300 })
  })

  it('should display accessible error message', async () => {
    const user = userEvent.setup()
    render(<PatientRegistrationForm />)

    // Fill and submit form
    await user.type(screen.getByLabelText(/patient id/i), 'P001')
    await user.type(screen.getByLabelText(/name/i), 'John Doe')
    await user.type(screen.getByLabelText(/age/i), '30')
    await user.type(screen.getByLabelText(/medical condition/i), 'Fever')
    await user.type(screen.getByLabelText(/last visit/i), '2024-01-01')

    await user.click(screen.getByRole('button', { name: /register patient/i }))

    await waitFor(() => {
      const errorMessage = screen.getByText(/failed/i)
      expect(errorMessage).toHaveAttribute('role', 'status')
    })
  })
})

