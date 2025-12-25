export type Gender = 'Male' | 'Female' | 'Other'

export interface Patient {
  id?: number
  patientID: string
  name: string
  age: number
  gender: Gender
  medicalCondition: string
  lastVisit: string // ISO date string (YYYY-MM-DD)
}

export type PatientInput = Omit<Patient, 'id'>

export interface PatientValidationError {
  field: keyof PatientInput
  message: string
}

/**
 * Validate a patient payload according to business rules.
 */
export function validatePatient(
  input: Partial<PatientInput>
): PatientValidationError[] {
  const errors: PatientValidationError[] = []
  if (!input.patientID || input.patientID.trim().length === 0) {
    errors.push({ field: 'patientID', message: 'Patient ID is required.' })
  }
  if (!input.name || input.name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Name is required.' })
  }
  if (input.age == null || Number.isNaN(Number(input.age))) {
    errors.push({ field: 'age', message: 'Age is required.' })
  } else if (Number(input.age) <= 0) {
    errors.push({ field: 'age', message: 'Age must be greater than zero.' })
  }
  if (!input.gender) {
    errors.push({ field: 'gender', message: 'Gender is required.' })
  }
  if (!input.medicalCondition || input.medicalCondition.trim().length === 0) {
    errors.push({
      field: 'medicalCondition',
      message: 'Medical condition is required.',
    })
  }
  if (!input.lastVisit || input.lastVisit.trim().length === 0) {
    errors.push({ field: 'lastVisit', message: 'Last visit date is required.' })
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(input.lastVisit)) {
    errors.push({
      field: 'lastVisit',
      message: 'Last visit must be in YYYY-MM-DD format.',
    })
  }
  return errors
}
