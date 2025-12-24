import { useEffect, useState } from 'react'
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Patient } from '@/lib/models/patient'
import { getPatients } from '@/lib/api/patientService'

export function PatientsTable() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadPatients = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getPatients()
      setPatients(data)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load patients.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPatients()
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          View and manage all registered patients
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={loadPatients}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </>
          )}
        </Button>
      </div>
      <div>
        {error && (
          <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 mb-4">
            <p className="text-sm font-medium text-destructive flex items-center gap-2" role="alert">
              <AlertCircle className="h-4 w-4" />
              {error}
            </p>
          </div>
        )}
        {loading && patients.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : patients.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg font-medium">No patients found</p>
            <p className="text-sm">Register a new patient to get started</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Patient ID
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Name
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Age
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Gender
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Medical Condition
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Last Visit
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient) => (
                    <tr
                      key={patient.id}
                      className="border-b transition-colors hover:bg-muted/50"
                    >
                      <td className="p-4 align-middle font-medium">
                        {patient.patientID}
                      </td>
                      <td className="p-4 align-middle">{patient.name}</td>
                      <td className="p-4 align-middle">{patient.age}</td>
                      <td className="p-4 align-middle">{patient.gender}</td>
                      <td className="p-4 align-middle">{patient.medicalCondition}</td>
                      <td className="p-4 align-middle">{patient.lastVisit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 text-sm text-muted-foreground border-t">
              Showing {patients.length} patient{patients.length !== 1 ? 's' : ''}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

