import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PatientRegistrationForm } from '@/components/patients/PatientRegistrationForm'
import type { Patient } from '@/lib/models/patient'

// Mock the patientService
vi.mock('@/lib/api/patientService', () => ({
  createPatient: vi.fn(),
  getPatients: vi.fn(),
}))

const { createPatient } = await import('@/lib/api/patientService')

describe('Patient Registration Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should register a new patient with valid form input', async () => {
    const user = userEvent.setup()
    const mockCreatedPatient: Patient = {
      id: 1,
      patientID: 'P001',
      name: 'John Doe',
      age: 45,
      gender: 'Male',
      medicalCondition: 'Hypertension',
      lastVisit: '2024-11-15',
    }

    vi.mocked(createPatient).mockResolvedValueOnce(mockCreatedPatient)

    render(<PatientRegistrationForm />)

    // Fill out the form
    await user.type(screen.getByLabelText(/patient id/i), 'P001')
    await user.type(screen.getByLabelText(/^name/i), 'John Doe')
    await user.type(screen.getByLabelText(/^age/i), '45')
    await user.selectOptions(screen.getByLabelText(/^gender/i), 'Male')
    await user.type(screen.getByLabelText(/medical condition/i), 'Hypertension')
    await user.type(screen.getByLabelText(/last visit/i), '2024-11-15')

    // Submit the form
    const submitButton = screen.getAllByRole('button', { name: /register patient/i })[0]
    await user.click(submitButton)

    // Wait for success message
    await waitFor(() => {
      expect(screen.getByText(/patient registered successfully/i)).toBeInTheDocument()
    })

    // Verify API was called with correct data
    expect(createPatient).toHaveBeenCalledWith({
      patientID: 'P001',
      name: 'John Doe',
      age: 45,
      gender: 'Male',
      medicalCondition: 'Hypertension',
      lastVisit: '2024-11-15',
    })
  })

  it('should display validation errors for invalid input', async () => {
    const user = userEvent.setup()

    render(<PatientRegistrationForm />)

    // Try to submit empty form
    const submitButton = screen.getAllByRole('button', { name: /register patient/i })[0]
    await user.click(submitButton)

    // Wait for validation errors
    await waitFor(() => {
      expect(screen.getByText(/patient id is required/i)).toBeInTheDocument()
      expect(screen.getByText(/name is required/i)).toBeInTheDocument()
    })

    // Verify API was not called
    expect(createPatient).not.toHaveBeenCalled()
  })

  it('should clear form after successful registration', async () => {
    const user = userEvent.setup()
    const mockCreatedPatient: Patient = {
      id: 1,
      patientID: 'P001',
      name: 'John Doe',
      age: 45,
      gender: 'Male',
      medicalCondition: 'Hypertension',
      lastVisit: '2024-11-15',
    }

    vi.mocked(createPatient).mockResolvedValueOnce(mockCreatedPatient)

    render(<PatientRegistrationForm />)

    const patientIdInput = screen.getByLabelText(/patient id/i)
    const nameInput = screen.getByLabelText(/^name/i)

    await user.type(patientIdInput, 'P001')
    await user.type(nameInput, 'John Doe')
    await user.type(screen.getByLabelText(/^age/i), '45')
    await user.selectOptions(screen.getByLabelText(/^gender/i), 'Male')
    await user.type(screen.getByLabelText(/medical condition/i), 'Hypertension')
    await user.type(screen.getByLabelText(/last visit/i), '2024-11-15')

    const submitButton = screen.getAllByRole('button', { name: /register patient/i })[0]
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/patient registered successfully/i)).toBeInTheDocument()
    })

    // Verify form is cleared
    expect(patientIdInput).toHaveValue('')
    expect(nameInput).toHaveValue('')
  })

  it('should display error message when API call fails', async () => {
    const user = userEvent.setup()

    vi.mocked(createPatient).mockRejectedValueOnce(new Error('Network error'))

    render(<PatientRegistrationForm />)

    // Fill out valid form
    await user.type(screen.getByLabelText(/patient id/i), 'P001')
    await user.type(screen.getByLabelText(/^name/i), 'John Doe')
    await user.type(screen.getByLabelText(/^age/i), '45')
    await user.selectOptions(screen.getByLabelText(/^gender/i), 'Male')
    await user.type(screen.getByLabelText(/medical condition/i), 'Hypertension')
    await user.type(screen.getByLabelText(/last visit/i), '2024-11-15')

    const submitButton = screen.getAllByRole('button', { name: /register patient/i })[0]
    await user.click(submitButton)

    await waitFor(() => {
      // Error message uses role="status" in PatientRegistrationForm
      const statusMessages = screen.getAllByRole('status')
      expect(
        statusMessages.some((el) => el.textContent?.toLowerCase().includes('failed'))
      ).toBe(true)
    })
  })
})

