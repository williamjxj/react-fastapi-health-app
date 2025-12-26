import { useState, useRef, useEffect } from 'react'
import { Activity, UserPlus, Users, RefreshCw } from 'lucide-react'
import { gsap } from 'gsap'
import { Logo } from '@/components/ui/logo'
import { Button } from '@/components/ui/button'
import { PatientRegistrationForm } from '@/components/patients/PatientRegistrationForm'
import { PatientSearchForm } from '@/components/patients/PatientSearchForm'
import {
  PatientsTable,
  type PatientsTableRef,
} from '@/components/patients/PatientsTable'

export function PatientManagementPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [patientCount, setPatientCount] = useState<number | null>(null)
  const tableRef = useRef<PatientsTableRef>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)

  const handleSearchChange = (search: string) => {
    setSearchQuery(search)
    tableRef.current?.setSearch(search)
  }

  const handleDataChange = (total: number, search: string) => {
    // Update count when data changes
    // If search is empty, reset to null to show "All Patients"
    if (search.trim() === '' && searchQuery.trim() === '') {
      setPatientCount(null)
    } else if (search.trim() !== '' && search === searchQuery.trim()) {
      // Only update count if the search matches current search query
      setPatientCount(total)
    }
  }

  const handlePatientCreated = () => {
    // Auto-refresh the table after patient creation
    tableRef.current?.refresh()
  }

  const handleRefresh = () => {
    // Manual refresh button handler
    tableRef.current?.refresh()
  }

  useEffect(() => {
    if (!headlineRef.current) return

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReducedMotion) {
      // Skip animation if user prefers reduced motion
      return
    }

    const words = headlineRef.current.querySelectorAll('.headline-word')

    // Set initial state
    gsap.set(words, {
      opacity: 0,
      y: 20,
    })

    // Animate with stagger
    gsap.to(words, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power3.out',
      stagger: 0.1,
      delay: 0.2,
    })
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="text-center space-y-4 pb-6 md:pb-8">
          <div className="flex items-center justify-center gap-3">
            <Logo />
            <h1
              ref={headlineRef}
              className="text-3xl md:text-4xl font-bold tracking-tight text-foreground"
            >
              <span className="headline-word font-sans inline-block">
                Patient
              </span>
              <span className="headline-word font-serif italic inline-block ml-2">
                Management
              </span>
              <span className="headline-word font-serif italic inline-block ml-2">
                System
              </span>
            </h1>
          </div>
          <p className="text-base md:text-lg text-muted-foreground flex items-center justify-center gap-2">
            <Activity className="h-5 w-5" />
            Register and manage healthcare patients
          </p>
        </header>

        {/* Responsive Layout: 1 column < 1024px, 40/60 split >= 1024px */}
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 md:gap-8">
          {/* Left Column: Patient Registration - 40% */}
          <div className="space-y-4 lg:w-[40%]">
            <div className="border rounded-lg p-4 sm:p-5 md:p-6 bg-card shadow-sm">
              <h2
                id="patient-registration-heading"
                className="text-xl md:text-2xl font-semibold mb-4 text-foreground flex items-center gap-2"
              >
                <UserPlus className="h-5 w-5 text-primary" aria-hidden="true" />
                <span className="font-sans">Patient</span>{' '}
                <span className="font-serif italic">Registration</span>
              </h2>
              <PatientRegistrationForm onCreated={handlePatientCreated} />
            </div>
          </div>

          {/* Right Column: Patient List with Search - 60% */}
          <div className="space-y-4 lg:w-[60%]">
            <div className="border rounded-lg p-4 sm:p-5 md:p-6 bg-card shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2
                  id="all-patients-heading"
                  className="text-xl md:text-2xl font-semibold text-foreground flex items-center gap-2"
                >
                  <Users className="h-5 w-5 text-primary" aria-hidden="true" />
                  {searchQuery.trim() && patientCount !== null ? (
                    <>
                      <span className="font-sans">{patientCount}</span>{' '}
                      <span className="font-serif italic">
                        {patientCount === 1 ? 'Patient' : 'Patients'}
                        {' '}Found
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="font-sans">All</span>{' '}
                      <span className="font-serif italic">Patients</span>
                    </>
                  )}
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  className="min-h-[44px] sm:min-h-0"
                  aria-label="Refresh patients list"
                  title="Refresh patients list"
                >
                  <RefreshCw className="h-4 w-4 mr-2 text-primary" aria-hidden="true" />
                  <span className="hidden sm:inline">Refresh</span>
                </Button>
              </div>
              <div className="mb-4">
                <PatientSearchForm onSearchChange={handleSearchChange} />
              </div>
              <PatientsTable 
                ref={tableRef} 
                initialSearch={searchQuery}
                onDataChange={handleDataChange}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
