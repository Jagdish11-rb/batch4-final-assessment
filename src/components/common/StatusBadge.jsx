import { getStatusBadgeClass } from '../../utils/helpers'

export default function StatusBadge({ status }) {
  return <span className={getStatusBadgeClass(status)}>{status || 'PENDING'}</span>
}
