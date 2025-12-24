import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PatientManagementPage } from '@/components/patients/PatientManagementPage'

// Mock child components to avoid API calls
vi.mock('@/components/patients/PatientRegistrationForm', () => ({
  PatientRegistrationForm: () => <div data-testid="registration-form">Registration Form</div>,
}))

vi.mock('@/components/patients/PatientSearchForm', () => ({
  PatientSearchForm: () => <div data-testid="search-form">Search Form</div>,
}))

describe('PatientManagementPage Integration', () => {
  it('should render both registration and search sections', () => {
    render(<PatientManagementPage />)

    expect(screen.getByTestId('registration-form')).toBeInTheDocument()
    expect(screen.getByTestId('search-form')).toBeInTheDocument()
  })

  it('should have proper layout structure', () => {
    const { container } = render(<PatientManagementPage />)

    const main = container.querySelector('main')
    expect(main).toBeInTheDocument()
    expect(main).toHaveClass('min-h-screen')
  })

  it('should render without full page reload', () => {
    const { container } = render(<PatientManagementPage />)

    // Verify it's a single-page component (no navigation elements)
    expect(container.querySelector('main')).toBeInTheDocument()
    expect(container.querySelectorAll('a[href]')).toHaveLength(0)
  })
})

