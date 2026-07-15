import { formatDistanceToNow, format, parseISO } from 'date-fns'

// Date Formatters
export const formatDate = (date: string | Date, pattern = 'MMM d, yyyy') => {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, pattern)
}

export const formatDateTime = (date: string | Date) => {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, 'MMM d, yyyy h:mm a')
}

export const formatRelative = (date: string | Date) => {
  const d = typeof date === 'string' ? parseISO(date) : date
  return formatDistanceToNow(d, { addSuffix: true })
}

export const formatTime = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number)
  const period = hours >= 12 ? 'PM' : 'AM'
  const h = hours % 12 || 12
  return `${h}:${minutes.toString().padStart(2, '0')} ${period}`
}

// NUmber Formatters
export const formatCurrency = (amount: number, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export const formatNumber = (num: number | undefined) => {
  if (num === undefined || num === null) return '0'
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`
  return num.toString()
}

export const formatPercent = (value: number, decimals = 1) => {
  return `${value.toFixed(decimals)}%`
}

export const formatGpa = (gpa: number) => {
  return gpa.toFixed(2)
}

// Text Formatters
export const getInitials = (name?: string | null) => {
  if (!name) return '?'
  return name
    .split(' ')
    .filter(Boolean)
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export const getFullName = (enlastName: string, enFirstName: string) => {
  return `${enlastName} ${enFirstName}`
}

export const truncate = (str: string, length = 50) => {
  if (str.length <= length) return str
  return `${str.substring(0, length)}...`
}

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// Status Formatters
export const getStatusBadgeClass = (status: string): string => {
  const map: Record<string, string> = {
    active: 'badge-success',
    inactive: 'badge-muted',
    graduated: 'badge-info',
    suspended: 'badge-danger',
    pending: 'badge-warning',
    paid: 'badge-success',
    overdue: 'badge-danger',
    cancelled: 'badge-muted',
    upcoming: 'badge-info',
    completed: 'badge-muted',
    present: 'badge-success',
    absent: 'badge-danger',
    late: 'badge-warning',
    excused: 'badge-info',
    'on-leave': 'badge-warning',
  }
  return map[status] ?? 'badge-muted'
}

export const getStatusLabel = (status: string): string => {
  const map: Record<string, string> = {
    active: 'Active',
    inactive: 'Inactive',
    graduated: 'Graduated',
    suspended: 'Suspended',
    pending: 'Pending',
    paid: 'Paid',
    overdue: 'Overdue',
    cancelled: 'Cancelled',
    upcoming: 'Upcoming',
    completed: 'Completed',
    present: 'Present',
    absent: 'Absent',
    late: 'Late',
    excused: 'Excused',
    'on-leave': 'On Leave',
  }
  return map[status] ?? capitalize(status)
}

export const getGradeColor = (grade: string): string => {
  if (['A+', 'A', 'A-'].includes(grade)) return 'text-emerald-400'
  if (['B+', 'B', 'B-'].includes(grade)) return 'text-primary-400'
  if (['C+', 'C'].includes(grade)) return 'text-amber-400'
  return 'text-red-400'
}

// Day of Week
export const getDayName = (dayIndex: number): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return days[dayIndex] ?? 'Unknown'
}

export const getDayShort = (dayIndex: number): string => {
  return getDayName(dayIndex).substring(0, 3)
}
