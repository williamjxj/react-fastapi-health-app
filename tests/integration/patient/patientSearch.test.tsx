import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PatientSearchForm } from '@/components/patients/PatientSearchForm'
import type { Patient } from '@/lib/models/patient'

// Mock the patientService
vi.mock('@/lib/api/patientService', () => ({
  getPatients: vi.fn(),
}))

const { getPatients } = await import('@/lib/api/patientService')

describe('Patient Search Integration', () => {
  const mockPatients: Patient[] = [
    {
      id: 1,
      patientID: 'P001',
      name: 'John Doe',
      age: 45,
      gender: 'Male',
      medicalCondition: 'Hypertension',
      lastVisit: '2024-11-15',
    },
    {
      id: 2,
      patientID: 'P002',
      name: 'Jane Smith',
      age: 30,
      gender: 'Female',
      medicalCondition: 'Asthma',
      lastVisit: '2024-12-01',
    },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getPatients).mockResolvedValue(mockPatients)
  })

  it('should display patient details when existing ID is searched', async () => {
    const user = userEvent.setup()

    render(<PatientSearchForm />)

    // Wait for patients to load
    await waitFor(() => {
      expect(getPatients).toHaveBeenCalled()
    })

    // Search for existing patient
    const searchInput = screen.getByLabelText(/patient id/i)
    await user.type(searchInput, 'P001')
    await user.click(screen.getByRole('button', { name: /search/i }))

    // Verify patient details are displayed
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText(/P001/i)).toBeInTheDocument()
      expect(screen.getByText(/45/i)).toBeInTheDocument()
      expect(screen.getByText(/Male/i)).toBeInTheDocument()
      expect(screen.getByText(/Hypertension/i)).toBeInTheDocument()
      expect(screen.getByText(/2024-11-15/i)).toBeInTheDocument()
    })
  })

  it('should display "not found" message for non-existing ID', async () => {
    const user = userEvent.setup()

    render(<PatientSearchForm />)

    // Wait for patients to load
    await waitFor(() => {
      expect(getPatients).toHaveBeenCalled()
    })

    // Search for non-existing patient
    const searchInputs = screen.getAllByLabelText(/patient id/i)
    const searchInput = searchInputs[0]
    await user.type(searchInput, 'P999')
    const searchButtons = screen.getAllByRole('button', { name: /search/i })
    const submitButton = searchButtons.find((btn) => btn.getAttribute('type') === 'submit')
    await user.click(submitButton!)

    // Verify "not found" message
    await waitFor(() => {
      expect(screen.getByText(/no patient found with that id/i)).toBeInTheDocument()
    })

    // Verify patient details are not displayed
    expect(screen.queryByText('John Doe')).not.toBeInTheDocument()
  })

  it('should handle case-insensitive search', async () => {
    const user = userEvent.setup()

    render(<PatientSearchForm />)

    await waitFor(() => {
      expect(getPatients).toHaveBeenCalled()
    })

    // Search with lowercase
    const searchInputs = screen.getAllByLabelText(/patient id/i)
    const searchInput = searchInputs[0]
    await user.type(searchInput, 'p001')
    const searchButtons = screen.getAllByRole('button', { name: /search/i })
    const submitButton = searchButtons.find((btn) => btn.getAttribute('type') === 'submit')
    await user.click(submitButton!)

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
  })

  it('should display error message when API call fails', async () => {
    vi.mocked(getPatients).mockRejectedValueOnce(new Error('Network error'))

    render(<PatientSearchForm />)

    await waitFor(() => {
      // The error message shows the actual error message from the catch block
      expect(screen.getByText(/network error/i)).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('should disable search button while loading', async () => {
    vi.mocked(getPatients).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(mockPatients), 100))
    )

    render(<PatientSearchForm />)

    const searchButton = screen.getByRole('button', { name: /loading/i })
    expect(searchButton).toBeDisabled()

    await waitFor(() => {
      expect(searchButton).not.toBeDisabled()
    })
  })
})

