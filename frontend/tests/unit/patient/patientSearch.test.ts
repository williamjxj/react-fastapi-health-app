import { describe, it, expect } from 'vitest'
import type { Patient } from '@/lib/models/patient'

/**
 * Helper function to find patient by ID (case-insensitive)
 * This mirrors the logic in PatientSearchForm
 */
function findPatientById(patients: Patient[], patientID: string): Patient | undefined {
  return patients.find((p) => p.patientID.toLowerCase() === patientID.toLowerCase())
}

describe('Patient Search Helpers', () => {
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

  describe('findPatientById', () => {
    it('should find patient by exact patientID match', () => {
      const result = findPatientById(mockPatients, 'P001')
      expect(result).toBeDefined()
      expect(result?.patientID).toBe('P001')
      expect(result?.name).toBe('John Doe')
    })

    it('should find patient by case-insensitive patientID', () => {
      const result1 = findPatientById(mockPatients, 'p001')
      expect(result1).toBeDefined()
      expect(result1?.patientID).toBe('P001')

      const result2 = findPatientById(mockPatients, 'P002')
      expect(result2).toBeDefined()
      expect(result2?.patientID).toBe('P002')
    })

    it('should return undefined for non-existent patientID', () => {
      const result = findPatientById(mockPatients, 'P999')
      expect(result).toBeUndefined()
    })

    it('should return undefined for empty patientID', () => {
      const result = findPatientById(mockPatients, '')
      expect(result).toBeUndefined()
    })

    it('should handle empty patients array', () => {
      const result = findPatientById([], 'P001')
      expect(result).toBeUndefined()
    })
  })
})

