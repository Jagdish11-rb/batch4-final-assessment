import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchUserList } from '../../api/userOnboarding'
import { useAuth } from '../../context/AuthContext'
import StatusBadge from '../../components/common/StatusBadge'
import { formatDate } from '../../utils/helpers'

const PRIMARY = '#8b0304'

const ROLE_MAP = {
  cbc:         'CBC',
  'cbc-maker': 'CBC Maker',
  agent:       'Agent',
}

const TITLE_MAP = {
  cbc:         'CBC List',
  'cbc-maker': 'CBC Maker List',
  agent:       'Agent List',
}

const ICON_MAP = {
  cbc:         'fas fa-university',
  'cbc-maker': 'fas fa-user-tie',
  agent:       'fas fa-handshake',
}

export default function UserList() {
  const { type } = useParams()
  const { user } = useAuth()
  const role   = ROLE_MAP[type]   || 'CBC'
  const title  = TITLE_MAP[type]  || 'User List'
  const icon   = ICON_MAP[type]   || 'fas fa-users'

  const today    = new Date()
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0]
  const todayStr = today.toISOString().split('T')[0]

  const [list, setList]         = useState([])
  const [loading, setLoading]   = useState(false)
  const [status, setStatus]     = useState('ALL')
  const [startDate, setStartDate] = useState(firstDay)
  const [endDate, setEndDate]   = useState(todayStr)
  const [searchUser, setSearchUser] = useState('')

  const username = user?.user_name || user?.username || user?.sub || ''

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetchUserList({
        status, username, startDate, endDate, role,
        searchUsername: searchUser || undefined,
      })
      setList(res.data?.resultObj?.result || [])
    } catch {
      setList([])
    } finally {
      setLoading(false)
    }
  }, [status, username, startDate, endDate, role, searchUser])

  useEffect(() => { load() }, [type])

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: '#fdf2f2' }}>
            <i className={`${icon} text-sm`} style={{ color: PRIMARY }} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800">{title}</h1>
            <p className="text-xs text-gray-400">Manage and review {role} onboarding requests</p>
          </div>
        </div>
        {type === 'cbc' && (
          <Link to="/onboard-cbc" className="btn-primary flex items-center gap-1.5">
            <i className="fas fa-plus text-xs" />
            Onboard CBC
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-wrap gap-4 items-end">
          {/* Status */}
          <div className="flex-shrink-0">
            <label className="form-label">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="form-input w-36">
              {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          {/* Start date */}
          <div className="flex-shrink-0">
            <label className="form-label">From</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="form-input" />
          </div>

          {/* End date */}
          <div className="flex-shrink-0">
            <label className="form-label">To</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="form-input" />
          </div>

          {/* Search */}
          <div className="flex-1 min-w-[160px]">
            <label className="form-label">Search</label>
            <div className="relative">
              <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
              <input
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && load()}
                className="form-input pl-8"
                placeholder="Username…"
              />
            </div>
          </div>

          <button onClick={load} className="btn-primary flex items-center gap-1.5 flex-shrink-0">
            <i className="fas fa-filter text-xs" />
            Apply
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex flex-col justify-center items-center h-48 gap-3 text-gray-400">
            <i className="fas fa-spinner fa-spin text-3xl" style={{ color: PRIMARY }} />
            <span className="text-sm">Loading records…</span>
          </div>
        ) : list.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <i className="fas fa-inbox text-5xl mb-3 block opacity-30" />
            <p className="font-medium text-sm">No records found for selected filters</p>
            <p className="text-xs mt-1">Try adjusting the date range or status filter</p>
          </div>
        ) : (
          <>
            {/* Record count */}
            <div className="px-4 py-2.5 border-b border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-500">{list.length} record{list.length !== 1 ? 's' : ''} found</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead style={{ background: '#fdf2f2' }}>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide w-8">#</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      {role === 'CBC' ? 'Company' : 'Name'}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Mobile / Email</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">State</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Approval Level</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Created</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {list.map((row, idx) => {
                    const basic = row['1'] || {}
                    const biz   = row['2'] || {}
                    const name  = role === 'CBC'
                      ? biz.companyName
                      : `${basic.firstName || ''} ${basic.lastName || ''}`.trim()
                    return (
                      <tr key={row._id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3 text-xs text-gray-400">{idx + 1}</td>
                        <td className="px-4 py-3 font-medium text-gray-800">{name || '—'}</td>
                        <td className="px-4 py-3">
                          <p className="text-xs text-gray-700">{basic.mobileNumber || '—'}</p>
                          <p className="text-xs text-gray-400 truncate max-w-[160px]">{basic.email || basic.emailAddress || '—'}</p>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500">{basic.state || '—'}</td>
                        <td className="px-4 py-3"><StatusBadge status={row.status} /></td>
                        <td className="px-4 py-3 text-xs text-gray-500">{row.approved_level || '—'}</td>
                        <td className="px-4 py-3 text-xs text-gray-400">{formatDate(row.createdAt)}</td>
                        <td className="px-4 py-3">
                          <Link
                            to={`/users/${type}/${row._id}`}
                            className="text-xs font-semibold hover:underline flex items-center gap-1"
                            style={{ color: PRIMARY }}
                          >
                            View <i className="fas fa-chevron-right text-xs" />
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
