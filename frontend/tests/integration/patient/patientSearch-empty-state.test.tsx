import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PatientSearchForm } from '@/components/patients/PatientSearchForm'

describe('PatientSearchForm Empty State', () => {
  it('should display helpful placeholder text', () => {
    render(<PatientSearchForm />)
    
    const input = screen.getByPlaceholderText(/search by patient id or name/i)
    expect(input).toBeInTheDocument()
  })

  it('should display search guidance text', () => {
    render(<PatientSearchForm />)
    
    const guidance = screen.getByText(/search will query the api/i)
    expect(guidance).toBeInTheDocument()
  })

  it('should have accessible search input', () => {
    render(<PatientSearchForm />)
    
    const input = screen.getByLabelText(/search by patient id or name/i)
    expect(input).toBeInTheDocument()
    expect(input).toHaveAttribute('type', 'text')
  })
})

