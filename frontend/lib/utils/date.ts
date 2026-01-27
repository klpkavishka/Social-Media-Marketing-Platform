import { format, formatDistance, formatRelative, isAfter, isBefore, parseISO } from 'date-fns'

export function formatDate(date: string | Date, formatStr: string = 'PPP'): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, formatStr)
}

export function formatRelativeDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return formatRelative(dateObj, new Date())
}

export function formatTimeAgo(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return formatDistance(dateObj, new Date(), { addSuffix: true })
}

export function isDateInPast(date: string | Date): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return isBefore(dateObj, new Date())
}

export function isDateInFuture(date: string | Date): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return isAfter(dateObj, new Date())
}
