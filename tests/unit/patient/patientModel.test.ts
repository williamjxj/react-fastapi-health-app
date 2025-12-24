import { describe, it, expect } from 'vitest'
import { validatePatient, type PatientInput } from '@/lib/models/patient'

describe('Patient Model Validation', () => {
  describe('validatePatient', () => {
    it('should return no errors for valid patient input', () => {
      const validInput: PatientInput = {
        patientID: 'P001',
        name: 'John Doe',
        age: 45,
        gender: 'Male',
        medicalCondition: 'Hypertension',
        lastVisit: '2024-11-15',
      }

      const errors = validatePatient(validInput)
      expect(errors).toHaveLength(0)
    })

    it('should require patientID', () => {
      const input: Partial<PatientInput> = {
        name: 'John Doe',
        age: 45,
        gender: 'Male',
        medicalCondition: 'Hypertension',
        lastVisit: '2024-11-15',
      }

      const errors = validatePatient(input)
      expect(errors).toHaveLength(1)
      expect(errors[0].field).toBe('patientID')
      expect(errors[0].message).toContain('required')
    })

    it('should require name', () => {
      const input: Partial<PatientInput> = {
        patientID: 'P001',
        age: 45,
        gender: 'Male',
        medicalCondition: 'Hypertension',
        lastVisit: '2024-11-15',
      }

      const errors = validatePatient(input)
      expect(errors).toHaveLength(1)
      expect(errors[0].field).toBe('name')
    })

    it('should require age and validate it is greater than zero', () => {
      const input1: Partial<PatientInput> = {
        patientID: 'P001',
        name: 'John Doe',
        gender: 'Male',
        medicalCondition: 'Hypertension',
        lastVisit: '2024-11-15',
      }

      const errors1 = validatePatient(input1)
      expect(errors1.some((e) => e.field === 'age')).toBe(true)

      const input2: Partial<PatientInput> = {
        patientID: 'P001',
        name: 'John Doe',
        age: 0,
        gender: 'Male',
        medicalCondition: 'Hypertension',
        lastVisit: '2024-11-15',
      }

      const errors2 = validatePatient(input2)
      expect(errors2.some((e) => e.field === 'age' && e.message.includes('greater than zero'))).toBe(
        true
      )

      const input3: Partial<PatientInput> = {
        patientID: 'P001',
        name: 'John Doe',
        age: -5,
        gender: 'Male',
        medicalCondition: 'Hypertension',
        lastVisit: '2024-11-15',
      }

      const errors3 = validatePatient(input3)
      expect(errors3.some((e) => e.field === 'age' && e.message.includes('greater than zero'))).toBe(
        true
      )
    })

    it('should require gender', () => {
      const input: Partial<PatientInput> = {
        patientID: 'P001',
        name: 'John Doe',
        age: 45,
        medicalCondition: 'Hypertension',
        lastVisit: '2024-11-15',
      }

      const errors = validatePatient(input)
      expect(errors.some((e) => e.field === 'gender')).toBe(true)
    })

    it('should require medicalCondition', () => {
      const input: Partial<PatientInput> = {
        patientID: 'P001',
        name: 'John Doe',
        age: 45,
        gender: 'Male',
        lastVisit: '2024-11-15',
      }

      const errors = validatePatient(input)
      expect(errors.some((e) => e.field === 'medicalCondition')).toBe(true)
    })

    it('should require lastVisit and validate YYYY-MM-DD format', () => {
      const input1: Partial<PatientInput> = {
        patientID: 'P001',
        name: 'John Doe',
        age: 45,
        gender: 'Male',
        medicalCondition: 'Hypertension',
      }

      const errors1 = validatePatient(input1)
      expect(errors1.some((e) => e.field === 'lastVisit' && e.message.includes('required'))).toBe(
        true
      )

      const input2: Partial<PatientInput> = {
        patientID: 'P001',
        name: 'John Doe',
        age: 45,
        gender: 'Male',
        medicalCondition: 'Hypertension',
        lastVisit: '2024/11/15',
      }

      const errors2 = validatePatient(input2)
      expect(
        errors2.some((e) => e.field === 'lastVisit' && e.message.includes('YYYY-MM-DD'))
      ).toBe(true)

      const input3: Partial<PatientInput> = {
        patientID: 'P001',
        name: 'John Doe',
        age: 45,
        gender: 'Male',
        medicalCondition: 'Hypertension',
        lastVisit: '2024-11-15',
      }

      const errors3 = validatePatient(input3)
      expect(errors3.some((e) => e.field === 'lastVisit')).toBe(false)
    })

    it('should return multiple errors for multiple invalid fields', () => {
      const input: Partial<PatientInput> = {
        patientID: '',
        name: '',
        age: -1,
        lastVisit: 'invalid-date',
      }

      const errors = validatePatient(input)
      expect(errors.length).toBeGreaterThan(1)
      expect(errors.some((e) => e.field === 'patientID')).toBe(true)
      expect(errors.some((e) => e.field === 'name')).toBe(true)
      expect(errors.some((e) => e.field === 'age')).toBe(true)
      expect(errors.some((e) => e.field === 'lastVisit')).toBe(true)
    })
  })
})

