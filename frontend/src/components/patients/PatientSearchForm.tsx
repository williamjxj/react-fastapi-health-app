import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { useDebounce } from '@/lib/utils'

interface PatientSearchFormProps {
  onSearchChange?: (search: string) => void
}

export function PatientSearchForm({ onSearchChange }: PatientSearchFormProps) {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300) // Default debounce delay

  useEffect(() => {
    onSearchChange?.(debouncedSearch)
  }, [debouncedSearch, onSearchChange])

  return (
    <div className="space-y-2">
      <label
        htmlFor="patientSearch"
        className="text-sm font-medium text-foreground"
      >
        Search by Patient ID or Name
      </label>
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          id="patientSearch"
          type="text"
          className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by Patient ID or Name..."
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Search will query the API as you type
      </p>
    </div>
  )
}
