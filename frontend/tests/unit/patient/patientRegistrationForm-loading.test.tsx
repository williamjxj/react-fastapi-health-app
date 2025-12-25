import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PatientRegistrationForm } from '@/components/patients/PatientRegistrationForm'

// Mock API service
const mockCreatePatient = vi.fn()
vi.mock('@/lib/api/patientService', () => ({
  createPatient: (...args: any[]) => mockCreatePatient(...args),
}))

beforeEach(() => {
  mockCreatePatient.mockClear()
})

describe('PatientRegistrationForm Loading States', () => {
  it('should show loading state during form submission', async () => {
    // Mock a delayed response
    mockCreatePatient.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({}), 100))
    )

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

    // Button should be disabled during submission
    expect(submitButton).toBeDisabled()
  })

  it('should display loading indicator during submission', async () => {
    mockCreatePatient.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({}), 100))
    )

    const user = userEvent.setup()
    render(<PatientRegistrationForm />)

    // Fill and submit form
    await user.type(screen.getByLabelText(/patient id/i), 'P001')
    await user.type(screen.getByLabelText(/name/i), 'John Doe')
    await user.type(screen.getByLabelText(/age/i), '30')
    await user.type(screen.getByLabelText(/medical condition/i), 'Fever')
    await user.type(screen.getByLabelText(/last visit/i), '2024-01-01')

    const submitButton = screen.getByRole('button', { name: /register patient/i })
    await user.click(submitButton)

    // Should show loading text or indicator
    await waitFor(() => {
      expect(screen.getByText(/registering/i)).toBeInTheDocument()
    })
  })

  it('should prevent multiple submissions during loading', async () => {
    mockCreatePatient.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({}), 100))
    )

    const user = userEvent.setup()
    render(<PatientRegistrationForm />)

    // Fill form
    await user.type(screen.getByLabelText(/patient id/i), 'P001')
    await user.type(screen.getByLabelText(/name/i), 'John Doe')
    await user.type(screen.getByLabelText(/age/i), '30')
    await user.type(screen.getByLabelText(/medical condition/i), 'Fever')
    await user.type(screen.getByLabelText(/last visit/i), '2024-01-01')

    const submitButton = screen.getByRole('button', { name: /register patient/i })
    
    // Click multiple times
    await user.click(submitButton)
    await user.click(submitButton)
    await user.click(submitButton)

    // Should only call API once (button disabled after first click)
    await waitFor(() => {
      expect(mockCreatePatient).toHaveBeenCalledTimes(1)
    })
  })
})

