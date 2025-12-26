import type { Patient, PatientInput } from '@/lib/models/patient'

// API Base URL - defaults to production Render.com URL
// Override with VITE_API_BASE_URL environment variable for local development
// Example: VITE_API_BASE_URL=http://localhost:8000 npm run dev
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'https://react-fastapi-health-app.onrender.com'
const PATIENTS_ENDPOINT = `${API_BASE_URL}/patients`

export interface PaginatedPatients {
  items: Patient[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export interface PatientQueryParams {
  search?: string
  page?: number
  page_size?: number
  sort_by?: 'patientID' | 'name' | 'age'
  sort_order?: 'asc' | 'desc'
}

export type PatientUpdateInput = Partial<PatientInput>

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text()
    let errorMessage = text || `Request failed with status ${res.status}`
    try {
      const errorJson = JSON.parse(text)
      errorMessage = errorJson.detail || errorMessage
    } catch {
      // Use text as-is if not JSON
    }
    throw new Error(errorMessage)
  }
  if (res.status === 204) {
    return undefined as T
  }
  return (await res.json()) as T
}

function buildQueryString(params: PatientQueryParams): string {
  const searchParams = new URLSearchParams()
  if (params.search) searchParams.set('search', params.search)
  if (params.page) searchParams.set('page', params.page.toString())
  if (params.page_size)
    searchParams.set('page_size', params.page_size.toString())
  if (params.sort_by) searchParams.set('sort_by', params.sort_by)
  if (params.sort_order) searchParams.set('sort_order', params.sort_order)
  return searchParams.toString()
}

/**
 * Fetch patients with search, pagination, and sorting.
 */
export async function getPatients(
  params?: PatientQueryParams
): Promise<PaginatedPatients> {
  const queryString = params ? buildQueryString(params) : ''
  const url = queryString
    ? `${PATIENTS_ENDPOINT}?${queryString}`
    : PATIENTS_ENDPOINT
  const res = await fetch(url)
  return handleResponse<PaginatedPatients>(res)
}

/**
 * Get a single patient by patientID.
 */
export async function getPatientById(patientId: string): Promise<Patient> {
  const res = await fetch(`${PATIENTS_ENDPOINT}/${patientId}`)
  return handleResponse<Patient>(res)
}

/**
 * Create a new patient.
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

/**
 * Update a patient by patientID.
 */
export async function updatePatient(
  patientId: string,
  payload: PatientUpdateInput
): Promise<Patient> {
  const res = await fetch(`${PATIENTS_ENDPOINT}/${patientId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  return handleResponse<Patient>(res)
}

/**
 * Delete a patient by patientID.
 */
export async function deletePatient(patientId: string): Promise<void> {
  const res = await fetch(`${PATIENTS_ENDPOINT}/${patientId}`, {
    method: 'DELETE',
  })

  return handleResponse<void>(res)
}
