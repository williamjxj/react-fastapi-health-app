import { Activity, UserPlus, Search, Users } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { PatientRegistrationForm } from '@/components/patients/PatientRegistrationForm'
import { PatientSearchForm } from '@/components/patients/PatientSearchForm'
import { PatientsTable } from '@/components/patients/PatientsTable'

export function PatientManagementPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-8 lg:p-12">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="text-center space-y-4 pb-4">
          <div className="flex items-center justify-center gap-3">
            <img 
              src="/logo.svg" 
              alt="Patient Management System Logo" 
              className="h-12 w-12"
            />
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              Patient Management System
            </h1>
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-400 flex items-center justify-center gap-2">
            <Activity className="h-5 w-5" />
            Register and search for healthcare patients
          </p>
        </header>
        
        <Accordion type="multiple" defaultValue={['registration', 'search', 'table']} className="space-y-4">
          <AccordionItem value="registration" className="border rounded-lg px-4 bg-card">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              <div className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Patient Registration
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <PatientRegistrationForm />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="search" className="border rounded-lg px-4 bg-card">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Patient Search
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <PatientSearchForm />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="table" className="border rounded-lg px-4 bg-card">
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                All Patients
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <PatientsTable />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </main>
  )
}


