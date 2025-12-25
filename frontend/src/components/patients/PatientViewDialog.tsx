import { X, Hash, User, Calendar, Stethoscope } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Patient } from '@/lib/models/patient'

interface PatientViewDialogProps {
  patient: Patient
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PatientViewDialog({ patient, open, onOpenChange }: PatientViewDialogProps) {
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
          <CardTitle className="text-2xl">Patient Details</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <dt className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Hash className="h-4 w-4" />
                Patient ID
              </dt>
              <dd className="text-base font-semibold">{patient.patientID}</dd>
            </div>
            <div className="space-y-1">
              <dt className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <User className="h-4 w-4" />
                Name
              </dt>
              <dd className="text-base font-semibold">{patient.name}</dd>
            </div>
            <div className="space-y-1">
              <dt className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <User className="h-4 w-4" />
                Age
              </dt>
              <dd className="text-base font-semibold">{patient.age}</dd>
            </div>
            <div className="space-y-1">
              <dt className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <User className="h-4 w-4" />
                Gender
              </dt>
              <dd className="text-base font-semibold">{patient.gender}</dd>
            </div>
            <div className="space-y-1 sm:col-span-2">
              <dt className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Stethoscope className="h-4 w-4" />
                Medical Condition
              </dt>
              <dd className="text-base font-semibold">{patient.medicalCondition}</dd>
            </div>
            <div className="space-y-1">
              <dt className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Last Visit
              </dt>
              <dd className="text-base font-semibold">{patient.lastVisit}</dd>
            </div>
          </dl>
          <div className="flex justify-end pt-4">
            <Button onClick={() => onOpenChange(false)}>Close</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

