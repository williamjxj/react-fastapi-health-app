import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PatientRegistrationForm } from '@/components/patients/PatientRegistrationForm'
import { PatientSearchForm } from '@/components/patients/PatientSearchForm'

// Mock API calls
vi.mock('@/lib/api/patientService', () => ({
  createPatient: vi.fn(),
  getPatients: vi.fn().mockResolvedValue([]),
}))

describe('Patient Forms Accessibility', () => {
  describe('PatientRegistrationForm', () => {
    it('should have proper labels for all form fields', () => {
      render(<PatientRegistrationForm />)

      expect(screen.getByLabelText(/patient id/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/^name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/^age/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/^gender/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/medical condition/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/last visit/i)).toBeInTheDocument()
    })

    it('should associate error messages with form fields using aria-describedby', async () => {
      const user = userEvent.setup()
      render(<PatientRegistrationForm />)

      // Try to submit empty form
      const submitButton = screen.getAllByRole('button', { name: /register patient/i })[0]
      await user.click(submitButton)

      const patientIdInput = screen.getByLabelText(/patient id/i)
      expect(patientIdInput).toHaveAttribute('aria-invalid', 'true')
      expect(patientIdInput).toHaveAttribute('aria-describedby')
    })

    it('should have proper ARIA roles for error messages', async () => {
      const user = userEvent.setup()
      render(<PatientRegistrationForm />)

      const submitButton = screen.getAllByRole('button', { name: /register patient/i })[0]
      await user.click(submitButton)

      const errorMessages = screen.getAllByRole('alert')
      expect(errorMessages.length).toBeGreaterThan(0)
    })

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup()
      render(<PatientRegistrationForm />)

      const patientIdInput = screen.getByLabelText(/patient id/i)
      patientIdInput.focus()
      expect(document.activeElement).toBe(patientIdInput)

      await user.tab()
      expect(document.activeElement).toBe(screen.getByLabelText(/^name/i))
    })
  })

  describe('PatientSearchForm', () => {
    it('should have proper label for search input', () => {
      render(<PatientSearchForm />)

      const labels = screen.getAllByLabelText(/patient id/i)
      expect(labels.length).toBeGreaterThan(0)
    })

    it('should have accessible submit button', async () => {
      render(<PatientSearchForm />)

      // Wait for initial load
      await new Promise((resolve) => setTimeout(resolve, 100))

      const searchButtons = screen.getAllByRole('button', { name: /search/i })
      const searchButton = searchButtons.find((btn) => btn.getAttribute('type') === 'submit')
      expect(searchButton).toBeInTheDocument()
      expect(searchButton).toHaveAttribute('type', 'submit')
    })

    it('should have proper ARIA roles for error messages', async () => {
      const user = userEvent.setup()
      render(<PatientSearchForm />)

      // Wait for initial load
      await new Promise((resolve) => setTimeout(resolve, 100))

      const searchInputs = screen.getAllByLabelText(/patient id/i)
      const searchInput = searchInputs[0]
      await user.type(searchInput, 'P999')
      const searchButtons = screen.getAllByRole('button', { name: /search/i })
      const searchButton = searchButtons.find((btn) => btn.getAttribute('type') === 'submit')
      await user.click(searchButton!)

      await waitFor(() => {
        const errorMessages = screen.getAllByRole('alert')
        const errorMessage = errorMessages.find((el) =>
          el.textContent?.toLowerCase().includes('no patient found')
        )
        expect(errorMessage).toBeInTheDocument()
        expect(errorMessage).toHaveTextContent(/no patient found/i)
      })
    })

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup()
      render(<PatientSearchForm />)

      await new Promise((resolve) => setTimeout(resolve, 100))

      const searchInputs = screen.getAllByLabelText(/patient id/i)
      const searchInput = searchInputs[0]
      searchInput.focus()
      expect(document.activeElement).toBe(searchInput)

      await user.tab()
      // After tabbing, focus should move to the next focusable element
      // The button should be focused (but there might be other focusable elements)
      const focusedElement = document.activeElement
      // Check that we've moved away from the input
      expect(focusedElement).not.toBe(searchInput)
      // The focused element should be a button or another form element
      expect(['button', 'input'].includes(focusedElement?.tagName.toLowerCase() || '')).toBe(true)
    })
  })
})

