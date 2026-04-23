import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const PRIMARY = '#8b0304'

function InfoRow({ label, value }) {
  return (
    <div className="flex py-2.5 border-b border-gray-100 last:border-0">
      <span className="w-32 text-sm text-gray-500 flex-shrink-0">{label}</span>
      <span className="text-sm text-gray-800 font-medium">{value || '—'}</span>
    </div>
  )
}

export default function Profile() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const info = (() => {
    try {
      const raw = JSON.parse(sessionStorage.getItem('dashboardData') || '{}')
      return raw?.userInfo || {}
    } catch { return {} }
  })()

  const p = info.userProfile || {}
  const name = `${p.firstName || ''} ${p.lastName || ''}`.trim()
  const userType = info.userType || user?.authorities?.[0] || '—'

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.25)' }}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="px-8 pt-7 pb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">User Profile</h2>
          <p className="text-sm text-gray-400 mb-4">View personal information</p>

          <div>
            <InfoRow label="Name"      value={name} />
            <InfoRow label="Phone No." value={p.mobileNumber} />
            <InfoRow label="Email ID"  value={p.email} />
            <InfoRow label="Address"   value={p.address} />
            <InfoRow label="State"     value={p.state} />
            <InfoRow label="User ID"   value={info.userName} />
            <InfoRow label="Pan ID"    value={p.panCard} />
            <InfoRow label="User Type" value={userType} />
          </div>

          <button
            onClick={() => navigate(-1)}
            className="mt-6 w-full py-3 rounded-lg text-sm font-semibold text-white"
            style={{ background: PRIMARY }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
