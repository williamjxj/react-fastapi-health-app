import { FormEvent, useEffect, useState } from 'react'
import { Search, Loader2, User, Hash, Calendar, Stethoscope, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { Patient } from '@/lib/models/patient'
import { getPatients } from '@/lib/api/patientService'

export function PatientSearchForm() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const data = await getPatients()
        setPatients(data)
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to load patients.'
        setError(msg)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    
    // Trim whitespace from query
    const trimmedQuery = query.trim()
    
    if (!trimmedQuery) {
      setError('Please enter a Patient ID to search.')
      setSelected(null)
      return
    }
    
    // Case-insensitive search with trimmed query
    const patient = patients.find((p) => p.patientID.trim().toLowerCase() === trimmedQuery.toLowerCase())
    
    if (!patient) {
      setSelected(null)
      setError(`No patient found with ID "${trimmedQuery}".`)
      return
    }
    
    setSelected(patient)
    setError(null) // Clear any previous errors
  }

  return (
    <div aria-labelledby="patient-search-heading" className="space-y-4">
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          Search for a patient by entering their Patient ID
        </p>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:flex-row md:items-end">
          <div className="flex-1 space-y-2">
            <label htmlFor="patientSearch" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2">
              <Hash className="h-4 w-4" />
              Patient ID
            </label>
            <input
              id="patientSearch"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., P001"
            />
          </div>
          <Button type="submit" disabled={loading || !patients.length} className="min-w-[120px]">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading…
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Search
              </>
            )}
          </Button>
      </form>
      {error && (
          <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3">
            <p className="text-sm font-medium text-destructive flex items-center gap-2" role="alert">
              <AlertCircle className="h-4 w-4" />
              {error}
            </p>
          </div>
        )}
        {selected && (
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                {selected.name}
              </CardTitle>
              <CardDescription>Patient Details</CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <dt className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Hash className="h-3 w-3" />
                    Patient ID
                  </dt>
                  <dd className="text-sm font-semibold">{selected.patientID}</dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <User className="h-3 w-3" />
                    Age
                  </dt>
                  <dd className="text-sm font-semibold">{selected.age}</dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <User className="h-3 w-3" />
                    Gender
                  </dt>
                  <dd className="text-sm font-semibold">{selected.gender}</dd>
                </div>
                <div className="space-y-1">
                  <dt className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    Last Visit
                  </dt>
                  <dd className="text-sm font-semibold">{selected.lastVisit}</dd>
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <dt className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Stethoscope className="h-3 w-3" />
                    Medical Condition
                  </dt>
                  <dd className="text-sm font-semibold">{selected.medicalCondition}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        )}
    </div>
  )
}


