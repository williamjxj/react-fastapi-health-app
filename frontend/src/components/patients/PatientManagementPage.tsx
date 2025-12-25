import { useState, useRef } from 'react'
import { Activity } from 'lucide-react'
import { PatientRegistrationForm } from '@/components/patients/PatientRegistrationForm'
import { PatientSearchForm } from '@/components/patients/PatientSearchForm'
import { PatientsTable, type PatientsTableRef } from '@/components/patients/PatientsTable'

export function PatientManagementPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const tableRef = useRef<PatientsTableRef>(null)

  const handleSearchChange = (search: string) => {
    setSearchQuery(search)
    tableRef.current?.setSearch(search)
  }

  const handlePatientCreated = () => {
    // Refresh the table after patient creation
    tableRef.current?.setSearch(searchQuery)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="text-center space-y-4 pb-6 md:pb-8">
          <div className="flex items-center justify-center gap-3">
            <img 
              src="/logo.svg" 
              alt="Patient Management System Logo" 
              className="h-10 w-10 md:h-12 md:w-12"
            />
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              Patient Management System
            </h1>
          </div>
          <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 flex items-center justify-center gap-2">
            <Activity className="h-5 w-5" />
            Register and manage healthcare patients
          </p>
        </header>
        
        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Left Column: Patient Registration */}
          <div className="space-y-4">
            <div className="border rounded-lg p-4 md:p-6 bg-card shadow-sm">
              <h2 className="text-xl md:text-2xl font-semibold mb-4">Patient Registration</h2>
              <PatientRegistrationForm onCreated={handlePatientCreated} />
            </div>
          </div>

          {/* Right Column: Search and Patient List */}
          <div className="space-y-4">
            <div className="border rounded-lg p-4 md:p-6 bg-card shadow-sm">
              <h2 className="text-xl md:text-2xl font-semibold mb-4">Patient Search</h2>
              <PatientSearchForm onSearchChange={handleSearchChange} />
            </div>
            <div className="border rounded-lg p-4 md:p-6 bg-card shadow-sm">
              <h2 className="text-xl md:text-2xl font-semibold mb-4">All Patients</h2>
              <PatientsTable ref={tableRef} initialSearch={searchQuery} />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
