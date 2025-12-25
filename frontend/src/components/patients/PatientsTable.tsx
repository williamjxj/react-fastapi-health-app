import { useEffect, useState, useCallback, forwardRef, useImperativeHandle } from 'react'
import { Loader2, AlertCircle, ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, Eye, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import type { Patient } from '@/lib/models/patient'
import { getPatients, deletePatient, type PatientQueryParams } from '@/lib/api/patientService'
import { PatientEditDialog } from './PatientEditDialog'
import { PatientViewDialog } from './PatientViewDialog'

type SortField = 'patientID' | 'name' | 'age'
type SortOrder = 'asc' | 'desc'

interface PatientsTableProps {
  initialSearch?: string
}

export interface PatientsTableRef {
  setSearch: (search: string) => void
}

export const PatientsTable = forwardRef<PatientsTableRef, PatientsTableProps>(
  ({ initialSearch = '' }, ref) => {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [search, setSearch] = useState(initialSearch)
  const [sortBy, setSortBy] = useState<SortField>('patientID')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  useImperativeHandle(ref, () => ({
    setSearch: (newSearch: string) => {
      setSearch(newSearch)
      setPage(1) // Reset to first page when search changes
    },
  }))

  const pageSize = 20

  const loadPatients = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const params: PatientQueryParams = {
        page,
        page_size: pageSize,
        sort_by: sortBy,
        sort_order: sortOrder,
      }
      if (search.trim()) {
        params.search = search.trim()
      }
      const data = await getPatients(params)
      setPatients(data.items)
      setTotal(data.total)
      setTotalPages(data.total_pages)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load patients.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [page, search, sortBy, sortOrder, pageSize])

  useEffect(() => {
    loadPatients()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, sortBy, sortOrder])

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
    setPage(1) // Reset to first page when sorting changes
  }

  const handleDelete = async (patientId: string) => {
    if (!confirm(`Are you sure you want to delete patient ${patientId}?`)) {
      return
    }
    try {
      await deletePatient(patientId)
      await loadPatients() // Refresh the list
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to delete patient.'
      alert(msg)
    }
  }

  const handleView = (patient: Patient) => {
    setSelectedPatient(patient)
    setViewDialogOpen(true)
  }

  const handleEdit = (patient: Patient) => {
    setSelectedPatient(patient)
    setEditDialogOpen(true)
  }

  const handleEditSuccess = () => {
    setEditDialogOpen(false)
    setSelectedPatient(null)
    loadPatients()
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortBy !== field) {
      return <ArrowUpDown className="ml-1 h-3 w-3" />
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className="ml-1 h-3 w-3" />
    ) : (
      <ArrowDown className="ml-1 h-3 w-3" />
    )
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3">
          <p className="text-sm font-medium text-destructive flex items-center gap-2" role="alert">
            <AlertCircle className="h-4 w-4" />
            {error}
          </p>
        </div>
      )}

      {loading && patients.length === 0 ? (
        <div className="space-y-4 py-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Loading patients...</p>
          </div>
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="h-12 px-4 text-left"><Skeleton className="h-4 w-20" /></th>
                    <th className="h-12 px-4 text-left"><Skeleton className="h-4 w-24" /></th>
                    <th className="h-12 px-4 text-left"><Skeleton className="h-4 w-16" /></th>
                    <th className="h-12 px-4 text-left"><Skeleton className="h-4 w-20" /></th>
                    <th className="h-12 px-4 text-left"><Skeleton className="h-4 w-32" /></th>
                    <th className="h-12 px-4 text-left"><Skeleton className="h-4 w-24" /></th>
                    <th className="h-12 px-4 text-left"><Skeleton className="h-4 w-20" /></th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b">
                      <td className="p-4"><Skeleton className="h-4 w-16" /></td>
                      <td className="p-4"><Skeleton className="h-4 w-32" /></td>
                      <td className="p-4"><Skeleton className="h-4 w-12" /></td>
                      <td className="p-4"><Skeleton className="h-4 w-20" /></td>
                      <td className="p-4"><Skeleton className="h-4 w-40" /></td>
                      <td className="p-4"><Skeleton className="h-4 w-24" /></td>
                      <td className="p-4"><Skeleton className="h-4 w-16" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : patients.length === 0 ? (
        <EmptyState
          title="No patients found"
          description={
            search
              ? 'Try adjusting your search criteria to find patients.'
              : 'Get started by registering your first patient.'
          }
          actionLabel={search ? undefined : 'Register First Patient'}
          onAction={search ? undefined : () => {
            // Scroll to registration form or trigger registration
            const registrationSection = document.querySelector('[aria-labelledby="patient-registration-heading"]')
            registrationSection?.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }}
        />
      ) : (
        <>
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      <button
                        onClick={() => handleSort('patientID')}
                        className="flex items-center hover:text-foreground"
                      >
                        Patient ID
                        <SortIcon field="patientID" />
                      </button>
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      <button
                        onClick={() => handleSort('name')}
                        className="flex items-center hover:text-foreground"
                      >
                        Name
                        <SortIcon field="name" />
                      </button>
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      <button
                        onClick={() => handleSort('age')}
                        className="flex items-center hover:text-foreground"
                      >
                        Age
                        <SortIcon field="age" />
                      </button>
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
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient) => (
                    <tr
                      key={patient.id}
                      className="border-b transition-colors duration-200 hover:bg-muted/50"
                    >
                      <td className="p-4 align-middle font-medium text-foreground">
                        {patient.patientID}
                      </td>
                      <td className="p-4 align-middle text-foreground">{patient.name}</td>
                      <td className="p-4 align-middle text-foreground">{patient.age}</td>
                      <td className="p-4 align-middle text-muted-foreground">{patient.gender}</td>
                      <td className="p-4 align-middle text-foreground">{patient.medicalCondition}</td>
                      <td className="p-4 align-middle text-muted-foreground">{patient.lastVisit}</td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0"
                            onClick={() => handleView(patient)}
                            title="View details"
                            aria-label="View patient details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0"
                            onClick={() => handleEdit(patient)}
                            title="Edit"
                            aria-label="Edit patient"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 text-destructive hover:text-destructive"
                            onClick={() => handleDelete(patient.patientID)}
                            title="Delete"
                            aria-label="Delete patient"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              Showing {patients.length} of {total} patient{total !== 1 ? 's' : ''} 
              {search && ` (filtered)`}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="min-h-[44px] sm:min-h-0"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Previous</span>
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (page <= 3) {
                    pageNum = i + 1
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = page - 2 + i
                  }
                  return (
                    <Button
                      key={pageNum}
                      variant={page === pageNum ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPage(pageNum)}
                      disabled={loading}
                      className="min-w-[44px] min-h-[44px] sm:min-h-0"
                    >
                      {pageNum}
                    </Button>
                  )
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="min-h-[44px] sm:min-h-0"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || loading}
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}

      {/* View Dialog */}
      {selectedPatient && (
        <PatientViewDialog
          patient={selectedPatient}
          open={viewDialogOpen}
          onOpenChange={setViewDialogOpen}
        />
      )}

      {/* Edit Dialog */}
      {selectedPatient && (
        <PatientEditDialog
          patient={selectedPatient}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  )
})

PatientsTable.displayName = 'PatientsTable'
