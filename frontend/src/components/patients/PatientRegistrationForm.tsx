import { FormEvent, useState } from 'react'
import { UserPlus, Calendar, User, Hash, Stethoscope, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Gender, PatientInput, PatientValidationError } from '@/lib/models/patient'
import { validatePatient } from '@/lib/models/patient'
import { createPatient } from '@/lib/api/patientService'

interface Props {
  onCreated?: () => void
}

const genders: Gender[] = ['Male', 'Female', 'Other']

export function PatientRegistrationForm({ onCreated }: Props) {
  const [form, setForm] = useState<PatientInput>({
    patientID: '',
    name: '',
    age: 0,
    gender: 'Male',
    medicalCondition: '',
    lastVisit: '',
  })
  const [errors, setErrors] = useState<PatientValidationError[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const updateField = (field: keyof PatientInput, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setMessage(null)
    const validation = validatePatient(form)
    setErrors(validation)
    if (validation.length > 0) return

    setSubmitting(true)
    try {
      await createPatient(form)
      setMessage('Patient registered successfully.')
      setForm({
        patientID: '',
        name: '',
        age: 0,
        gender: 'Male',
        medicalCondition: '',
        lastVisit: '',
      })
      onCreated?.()
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to register patient.'
      setMessage(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const errorFor = (field: keyof PatientInput) =>
    errors.find((e) => e.field === field)?.message

  return (
    <div aria-labelledby="patient-registration-heading">
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          Register a new patient by filling out the form below
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="patientID" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2">
                <Hash className="h-4 w-4" />
                Patient ID <span className="text-destructive">*</span>
              </label>
              <input
                id="patientID"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive"
                value={form.patientID}
                onChange={(e) => updateField('patientID', e.target.value)}
                aria-invalid={!!errorFor('patientID')}
                aria-describedby={errorFor('patientID') ? 'patientID-error' : undefined}
                placeholder="e.g., P001"
              />
              {errorFor('patientID') && (
                <p id="patientID-error" className="text-sm font-medium text-destructive flex items-center gap-1" role="alert">
                  <AlertCircle className="h-4 w-4" />
                  {errorFor('patientID')}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2">
                <User className="h-4 w-4" />
                Name <span className="text-destructive">*</span>
              </label>
              <input
                id="name"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive"
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                aria-invalid={!!errorFor('name')}
                aria-describedby={errorFor('name') ? 'name-error' : undefined}
                placeholder="Full name"
              />
              {errorFor('name') && (
                <p id="name-error" className="text-sm font-medium text-destructive flex items-center gap-1" role="alert">
                  <AlertCircle className="h-4 w-4" />
                  {errorFor('name')}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="age" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2">
                <User className="h-4 w-4" />
                Age <span className="text-destructive">*</span>
              </label>
              <input
                id="age"
                type="number"
                min="1"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive"
                value={form.age || ''}
                onChange={(e) => updateField('age', Number(e.target.value) || 0)}
                aria-invalid={!!errorFor('age')}
                aria-describedby={errorFor('age') ? 'age-error' : undefined}
                placeholder="Age"
              />
              {errorFor('age') && (
                <p id="age-error" className="text-sm font-medium text-destructive flex items-center gap-1" role="alert">
                  <AlertCircle className="h-4 w-4" />
                  {errorFor('age')}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="gender" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2">
                <User className="h-4 w-4" />
                Gender <span className="text-destructive">*</span>
              </label>
              <select
                id="gender"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={form.gender}
                onChange={(e) => updateField('gender', e.target.value)}
              >
                {genders.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2 space-y-2">
              <label htmlFor="medicalCondition" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2">
                <Stethoscope className="h-4 w-4" />
                Medical Condition <span className="text-destructive">*</span>
              </label>
              <textarea
                id="medicalCondition"
                rows={3}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive"
                value={form.medicalCondition}
                onChange={(e) => updateField('medicalCondition', e.target.value)}
                aria-invalid={!!errorFor('medicalCondition')}
                aria-describedby={
                  errorFor('medicalCondition') ? 'medicalCondition-error' : undefined
                }
                placeholder="Describe the medical condition"
              />
              {errorFor('medicalCondition') && (
                <p
                  id="medicalCondition-error"
                  className="text-sm font-medium text-destructive flex items-center gap-1"
                  role="alert"
                >
                  <AlertCircle className="h-4 w-4" />
                  {errorFor('medicalCondition')}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="lastVisit" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Last Visit <span className="text-destructive">*</span>
              </label>
              <input
                id="lastVisit"
                type="date"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive"
                value={form.lastVisit}
                onChange={(e) => updateField('lastVisit', e.target.value)}
                aria-invalid={!!errorFor('lastVisit')}
                aria-describedby={errorFor('lastVisit') ? 'lastVisit-error' : undefined}
              />
              {errorFor('lastVisit') && (
                <p id="lastVisit-error" className="text-sm font-medium text-destructive flex items-center gap-1" role="alert">
                  <AlertCircle className="h-4 w-4" />
                  {errorFor('lastVisit')}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button type="submit" disabled={submitting} className="min-w-[160px]">
              {submitting ? (
                <>
                  <UserPlus className="mr-2 h-4 w-4 animate-pulse" />
                  Registering…
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Register Patient
                </>
              )}
            </Button>
            {message && (
              <p
                className={`text-sm font-medium flex items-center gap-2 animate-fade-in ${
                  message.includes('successfully')
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-destructive'
                }`}
                role="status"
              >
                {message.includes('successfully') ? (
                  <UserPlus className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                {message}
              </p>
            )}
          </div>
        </form>
    </div>
  )
}


