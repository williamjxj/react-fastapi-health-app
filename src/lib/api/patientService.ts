import type { Patient, PatientInput } from '@/lib/models/patient'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'
const PATIENTS_ENDPOINT = `${API_BASE_URL}/patients`

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `Request failed with status ${res.status}`)
  }
  return (await res.json()) as T
}

/**
 * Fetch all patients from the mock API.
 */
export async function getPatients(): Promise<Patient[]> {
  const res = await fetch(PATIENTS_ENDPOINT)
  return handleResponse<Patient[]>(res)
}

/**
 * Create a new patient via the mock API.
 */
export async function createPatient(payload: PatientInput): Promise<Patient> {
  const res = await fetch(PATIENTS_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  return handleResponse<Patient>(res)
}
