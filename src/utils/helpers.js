export function getStatusBadgeClass(status) {
  switch ((status || '').toUpperCase()) {
    case 'APPROVED': return 'badge-approved'
    case 'REJECTED': return 'badge-rejected'
    default:         return 'badge-pending'
  }
}

export function formatDate(ts) {
  if (!ts) return '—'
  return new Date(ts).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

export function decodeJwt(token) {
  try {
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload))
  } catch {
    return null
  }
}
