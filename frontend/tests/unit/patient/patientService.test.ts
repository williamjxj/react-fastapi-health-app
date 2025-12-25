import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getPatients, createPatient } from '@/lib/api/patientService'
import type { Patient, PatientInput } from '@/lib/models/patient'

// Mock fetch globally
global.fetch = vi.fn()

describe('PatientService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getPatients', () => {
    it('should fetch all patients successfully', async () => {
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

      ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockPatients,
      })

      const result = await getPatients()

      expect(global.fetch).toHaveBeenCalledWith('http://localhost:8000/patients')
      expect(result).toEqual(mockPatients)
      expect(result).toHaveLength(2)
    })

    it('should throw an error when fetch fails', async () => {
      ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: async () => 'Internal Server Error',
      })

      await expect(getPatients()).rejects.toThrow()
    })

    it('should throw an error on network failure', async () => {
      ;(global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error('Network error')
      )

      await expect(getPatients()).rejects.toThrow('Network error')
    })
  })

  describe('createPatient', () => {
    it('should create a patient successfully', async () => {
      const newPatient: PatientInput = {
        patientID: 'P003',
        name: 'Bob Johnson',
        age: 35,
        gender: 'Male',
        medicalCondition: 'Diabetes',
        lastVisit: '2024-12-10',
      }

      const createdPatient: Patient = {
        id: 3,
        ...newPatient,
      }

      ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => createdPatient,
      })

      const result = await createPatient(newPatient)

      expect(global.fetch).toHaveBeenCalledWith('http://localhost:8000/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPatient),
      })
      expect(result).toEqual(createdPatient)
      expect(result.id).toBe(3)
    })

    it('should throw an error when creation fails', async () => {
      const newPatient: PatientInput = {
        patientID: 'P003',
        name: 'Bob Johnson',
        age: 35,
        gender: 'Male',
        medicalCondition: 'Diabetes',
        lastVisit: '2024-12-10',
      }

      ;(global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: async () => 'Bad Request',
      })

      await expect(createPatient(newPatient)).rejects.toThrow()
    })

    it('should throw an error on network failure', async () => {
      const newPatient: PatientInput = {
        patientID: 'P003',
        name: 'Bob Johnson',
        age: 35,
        gender: 'Male',
        medicalCondition: 'Diabetes',
        lastVisit: '2024-12-10',
      }

      ;(global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error('Network error')
      )

      await expect(createPatient(newPatient)).rejects.toThrow('Network error')
    })
  })
})

