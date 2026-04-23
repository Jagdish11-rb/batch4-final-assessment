import { useState, useCallback } from 'react'
import { useAuth } from '../../context/AuthContext'
import { fetchUserList, fetchUserOnboardingReport } from '../../api/userOnboarding'
import StatusBadge from '../../components/common/StatusBadge'
import { formatDate } from '../../utils/helpers'

const PRIMARY = '#8b0304'
const STATUSES   = ['ALL', 'APPROVED', 'PENDING', 'REJECTED']
const USER_TYPES = ['ALL', 'CBC', 'CBC Maker', 'Master Distributor', 'Distributor', 'Agent']

export default function UserRequest() {
  const { user } = useAuth()

  const today = new Date().toISOString().split('T')[0]

  const addDays = (dateStr, days) => {
    const d = new Date(dateStr)
    d.setDate(d.getDate() + days)
    return d.toISOString().split('T')[0]
  }

  const loggedInUsername = user?.user_name || user?.username || user?.sub || ''
  const rawRole = (user?.authorities?.[0] || user?.roleName || user?.role || '')
    .toUpperCase().replace(/^ROLE_/, '')
  const isOpsChecker = rawRole === 'OPS_CHECKER'

  const [searchMode, setSearchMode] = useState('date')
  const [fromDate, setFromDate]     = useState(today)
  const [toDate, setToDate]         = useState(today)
  const [userType, setUserType]     = useState('ALL')
  const [status, setStatus]         = useState('ALL')
  const [username, setUsername]     = useState('')
  const [usernameError, setUsernameError] = useState(false)

  const [list, setList]         = useState([])
  const [loading, setLoading]   = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSubmit = useCallback(async () => {
    if (searchMode === 'username' && !username.trim()) {
      setUsernameError(true)
      return
    }
    setUsernameError(false)
    setLoading(true)
    setSearched(false)

    const role = isOpsChecker ? userType : 'CBC'
    const payload = searchMode === 'date'
      ? { status, username: loggedInUsername, startDate: fromDate, endDate: toDate, role }
      : { searchUsername: username.trim(), role }

    try {
      let result = []
      if (isOpsChecker) {
        const data = await fetchUserOnboardingReport(payload)
        result = data?.resultObj?.result ?? data?.result ?? (Array.isArray(data) ? data : [])
      } else {
        const res = await fetchUserList(payload)
        result = res.data?.resultObj?.result ?? res.data?.result ?? []
      }
      setList(result)
    } catch {
      setList([])
    } finally {
      setLoading(false)
      setSearched(true)
    }
  }, [searchMode, fromDate, toDate, status, userType, isOpsChecker, loggedInUsername, username])

  return (
    <div className="space-y-5">

      {/* Filters card */}
      <div className="card p-5">

        {/* Search mode toggle */}
        <div className="flex items-center gap-8 mb-6">
          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
            <input
              type="radio"
              name="searchMode"
              checked={searchMode === 'date'}
              onChange={() => { setSearchMode('date'); setList([]); setSearched(false); setUsername(''); setUsernameError(false) }}
              className="accent-red-800 w-4 h-4"
            />
            Search by Date Range
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
            <input
              type="radio"
              name="searchMode"
              checked={searchMode === 'username'}
              onChange={() => { setSearchMode('username'); setList([]); setSearched(false); setUsername(''); setUsernameError(false) }}
              className="accent-red-800 w-4 h-4"
            />
            Search by User Name
          </label>
        </div>

        {searchMode === 'date' ? (
          /* ── Date Range mode ── */
          <div className="flex flex-wrap items-center gap-4">

            {/* From Date */}
            <div className="relative">
              <span className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-gray-500 z-10">
                From Date*
              </span>
              <input
                type="date"
                value={fromDate}
                max={toDate}
                onChange={(e) => {
                  const val = e.target.value
                  setFromDate(val)
                  const cap = addDays(val, 15)
                  if (toDate > cap) setToDate(cap > today ? today : cap)
                }}
                className="border border-gray-300 rounded px-3 py-2.5 text-sm w-44 focus:outline-none focus:border-red-800 text-gray-800"
              />
            </div>

            {/* To Date */}
            <div className="relative">
              <span className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-gray-500 z-10">
                To Date*
              </span>
              <input
                type="date"
                value={toDate}
                min={fromDate}
                max={addDays(fromDate, 15) < today ? addDays(fromDate, 15) : today}
                onChange={(e) => setToDate(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2.5 text-sm w-44 focus:outline-none focus:border-red-800 text-gray-800"
              />
            </div>

            {/* User Type */}
            <div className="relative">
              <span className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-gray-500 z-10">
                User Type
              </span>
              <div className="relative">
                {isOpsChecker ? (
                  <>
                    <select
                      value={userType}
                      onChange={(e) => setUserType(e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2.5 text-sm w-44 appearance-none focus:outline-none focus:border-red-800 text-gray-800 pr-8"
                    >
                      {USER_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <i className="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
                  </>
                ) : (
                  <>
                    <select
                      className="border border-gray-300 rounded px-3 py-2.5 text-sm w-44 appearance-none focus:outline-none focus:border-red-800 text-gray-800 pr-8"
                    >
                      <option value="CBC">CBC</option>
                    </select>
                    <i className="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
                  </>
                )}
              </div>
            </div>

            {/* Status */}
            <div className="relative">
              <span className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-gray-500 z-10">
                Status
              </span>
              <div className="relative">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2.5 text-sm w-44 appearance-none focus:outline-none focus:border-red-800 text-gray-800 pr-8"
                >
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <i className="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-8 py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-60"
              style={{ background: PRIMARY }}
            >
              {loading ? <i className="fas fa-spinner fa-spin" /> : 'Submit'}
            </button>
          </div>
        ) : (
          /* ── Username search mode — unchanged ── */
          <div className="flex items-start gap-4">
            <div className="flex flex-col gap-1 flex-1 max-w-lg">
              <input
                type="text"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setUsernameError(false) }}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder="Username*"
                className={`border rounded px-4 py-2.5 text-sm focus:outline-none ${
                  usernameError ? 'border-red-500' : 'border-gray-300 focus:border-red-800'
                }`}
              />
              {usernameError && (
                <span className="text-xs" style={{ color: PRIMARY }}>Username is required</span>
              )}
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-60"
              style={{ background: PRIMARY }}
            >
              {loading ? <i className="fas fa-spinner fa-spin" /> : 'Submit'}
            </button>
          </div>
        )}
      </div>

      {/* Results */}
      {searched && (
        <div className="card overflow-hidden">
          {list.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-sm font-semibold text-gray-700">No Record Found !!</p>
            </div>
          ) : (
            <>
              <div className="px-4 py-2.5 border-b border-gray-100">
                <span className="text-xs text-gray-500">{list.length} record{list.length !== 1 ? 's' : ''} found</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead style={{ background: '#fdf2f2' }}>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide w-8">#</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Username</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Mobile / Email</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Created</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {list.map((row, idx) => {
                      const basic = row['1'] || row
                      const name  = `${basic.firstName || ''} ${basic.lastName || ''}`.trim()
                        || basic.companyName || '—'
                      return (
                        <tr key={row._id || idx} className="hover:bg-gray-50 transition">
                          <td className="px-4 py-3 text-xs text-gray-400">{idx + 1}</td>
                          <td className="px-4 py-3 font-medium text-gray-800">{name}</td>
                          <td className="px-4 py-3 text-xs text-gray-600">{row.username || row.userName || '—'}</td>
                          <td className="px-4 py-3">
                            <p className="text-xs text-gray-700">{basic.mobileNumber || '—'}</p>
                            <p className="text-xs text-gray-400 truncate max-w-[160px]">{basic.email || basic.emailAddress || '—'}</p>
                          </td>
                          <td className="px-4 py-3"><StatusBadge status={row.status} /></td>
                          <td className="px-4 py-3 text-xs text-gray-400">{formatDate(row.createdAt)}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
