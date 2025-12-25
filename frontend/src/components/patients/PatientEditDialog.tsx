import { FormEvent, useState, useEffect } from 'react'
import { X, Hash, User, Calendar, Stethoscope, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Patient, Gender, PatientInput } from '@/lib/models/patient'
import { validatePatient } from '@/lib/models/patient'
import { updatePatient, type PatientUpdateInput } from '@/lib/api/patientService'

interface PatientEditDialogProps {
  patient: Patient
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

const genders: Gender[] = ['Male', 'Female', 'Other']

export function PatientEditDialog({ patient, open, onOpenChange, onSuccess }: PatientEditDialogProps) {
  const [form, setForm] = useState<PatientInput>({
    patientID: patient.patientID,
    name: patient.name,
    age: patient.age,
    gender: patient.gender,
    medicalCondition: patient.medicalCondition,
    lastVisit: patient.lastVisit,
  })
  const [errors, setErrors] = useState<Array<{ field: keyof PatientInput; message: string }>>([])
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      // Reset form when dialog opens
      setForm({
        patientID: patient.patientID,
        name: patient.name,
        age: patient.age,
        gender: patient.gender,
        medicalCondition: patient.medicalCondition,
        lastVisit: patient.lastVisit,
      })
      setErrors([])
      setMessage(null)
    }
  }, [open, patient])

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
      const updateData: PatientUpdateInput = {
        patientID: form.patientID !== patient.patientID ? form.patientID : undefined,
        name: form.name !== patient.name ? form.name : undefined,
        age: form.age !== patient.age ? form.age : undefined,
        gender: form.gender !== patient.gender ? form.gender : undefined,
        medicalCondition: form.medicalCondition !== patient.medicalCondition ? form.medicalCondition : undefined,
        lastVisit: form.lastVisit !== patient.lastVisit ? form.lastVisit : undefined,
      }
      await updatePatient(patient.patientID, updateData)
      setMessage('Patient updated successfully.')
      setTimeout(() => {
        onSuccess?.()
        onOpenChange(false)
      }, 1000)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update patient.'
      setMessage(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const errorFor = (field: keyof PatientInput) =>
    errors.find((e) => e.field === field)?.message

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={() => onOpenChange(false)}
    >
      <Card
        className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl">Edit Patient</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="edit-patientID" className="text-sm font-medium flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  Patient ID <span className="text-red-500">*</span>
                </label>
                <input
                  id="edit-patientID"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-red-500"
                  value={form.patientID}
                  onChange={(e) => updateField('patientID', e.target.value)}
                  aria-invalid={!!errorFor('patientID')}
                />
                {errorFor('patientID') && (
                  <p className="text-sm font-medium text-destructive flex items-center gap-1" role="alert">
                    <AlertCircle className="h-4 w-4" />
                    {errorFor('patientID')}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-name" className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="edit-name"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-red-500"
                  value={form.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  aria-invalid={!!errorFor('name')}
                />
                {errorFor('name') && (
                  <p className="text-sm font-medium text-destructive flex items-center gap-1" role="alert">
                    <AlertCircle className="h-4 w-4" />
                    {errorFor('name')}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-age" className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Age <span className="text-red-500">*</span>
                </label>
                <input
                  id="edit-age"
                  type="number"
                  min="1"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-red-500"
                  value={form.age || ''}
                  onChange={(e) => updateField('age', Number(e.target.value) || 0)}
                  aria-invalid={!!errorFor('age')}
                />
                {errorFor('age') && (
                  <p className="text-sm font-medium text-destructive flex items-center gap-1" role="alert">
                    <AlertCircle className="h-4 w-4" />
                    {errorFor('age')}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-gender" className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  id="edit-gender"
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
                <label htmlFor="edit-medicalCondition" className="text-sm font-medium flex items-center gap-2">
                  <Stethoscope className="h-4 w-4" />
                  Medical Condition <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="edit-medicalCondition"
                  rows={3}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-red-500"
                  value={form.medicalCondition}
                  onChange={(e) => updateField('medicalCondition', e.target.value)}
                  aria-invalid={!!errorFor('medicalCondition')}
                />
                {errorFor('medicalCondition') && (
                  <p className="text-sm font-medium text-destructive flex items-center gap-1" role="alert">
                    <AlertCircle className="h-4 w-4" />
                    {errorFor('medicalCondition')}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-lastVisit" className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Last Visit <span className="text-red-500">*</span>
                </label>
                <input
                  id="edit-lastVisit"
                  type="date"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-red-500"
                  value={form.lastVisit}
                  onChange={(e) => updateField('lastVisit', e.target.value)}
                  aria-invalid={!!errorFor('lastVisit')}
                />
                {errorFor('lastVisit') && (
                  <p className="text-sm font-medium text-destructive flex items-center gap-1" role="alert">
                    <AlertCircle className="h-4 w-4" />
                    {errorFor('lastVisit')}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center justify-end gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Patient'
                )}
              </Button>
            </div>
            {message && (
              <p
                className={`text-sm font-medium flex items-center gap-2 ${
                  message.includes('successfully')
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-destructive'
                }`}
                role="status"
              >
                {message.includes('successfully') ? null : <AlertCircle className="h-4 w-4" />}
                {message}
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

