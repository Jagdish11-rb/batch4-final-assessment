import { useState } from 'react'

const PRIMARY = '#8b0304'
const PAGE_SIZE = 10

const today = () => {
  const d = new Date()
  const m = d.getMonth() + 1
  const day = d.getDate()
  const y = d.getFullYear()
  return `${m}/${day}/${y}`
}

const COLUMNS = [
  { key: 'sno',         label: 'Sno' },
  { key: 'fieldName',   label: 'Field Name' },
  { key: 'userName',    label: 'User Name' },
  { key: 'userId',      label: 'User ID' },
  { key: 'adminName',   label: 'Admin Name' },
  { key: 'adminId',     label: 'Admin ID' },
  { key: 'createdDate', label: 'Created Date' },
  { key: 'updatedDate', label: 'Updated Date' },
]

const COLORED_COLS = new Set(['fieldName', 'userName', 'adminName', 'adminId'])

const STATIC_DATA = [
  { sno:1,  fieldName:'kitchen',        userName:'Maker',   userId:'rYd306',  adminName:'Jonathan Velasquez',  adminId:'russellsamuel@yahoo.com',       createdDate:'2014-06-03', updatedDate:'2005-05-18' },
  { sno:2,  fieldName:'financial',      userName:'Checker', userId:'Vap282',  adminName:'Michael Nelson',      adminId:'jeffrey97@hotmail.com',         createdDate:'1978-10-25', updatedDate:'1988-03-10' },
  { sno:3,  fieldName:'until',          userName:'Maker',   userId:'AXE124',  adminName:'Christopher Ramirez', adminId:'ocarter@hughes-hughes.com',     createdDate:'1974-03-25', updatedDate:'1982-07-09' },
  { sno:4,  fieldName:'worry',          userName:'Maker',   userId:'sYF129',  adminName:'Sara Reed',           adminId:'montgomeryedward@gmail.com',    createdDate:'1979-06-22', updatedDate:'2006-06-22' },
  { sno:5,  fieldName:'happen',         userName:'Checker', userId:'kdX624',  adminName:'Joseph Oconnor',      adminId:'sandra96@alexander-coh.com',    createdDate:'1973-07-11', updatedDate:'2021-03-26' },
  { sno:6,  fieldName:'raise',          userName:'Checker', userId:'kHy216',  adminName:'Robert Dunn',         adminId:'elizabethgarcia@jones-fr.com',  createdDate:'2004-10-26', updatedDate:'2001-09-27' },
  { sno:7,  fieldName:'administration', userName:'Maker',   userId:'nll226',  adminName:'Michael Mann',        adminId:'crystalcolins@hotmail.com',     createdDate:'2005-08-26', updatedDate:'2018-06-24' },
  { sno:8,  fieldName:'be',             userName:'Checker', userId:'Ywf820',  adminName:'Angela Allen',        adminId:'jeff53@griffin-osborne.com',    createdDate:'1973-07-16', updatedDate:'2024-12-12' },
  { sno:9,  fieldName:'wind',           userName:'Checker', userId:'WQm445',  adminName:'Steven Blanchard',    adminId:'istewart@reyes.com',            createdDate:'2006-09-21', updatedDate:'1991-11-15' },
  { sno:10, fieldName:'computer',       userName:'Checker', userId:'rJa259',  adminName:'Jason Schmitt',       adminId:'coreyroberts@cannon-je.com',    createdDate:'2003-12-07', updatedDate:'1977-03-15' },
]

export default function AuditTrail() {
  const [fromDate, setFromDate]   = useState(today())
  const [toDate, setToDate]       = useState(today())
  const [username, setUsername]   = useState('')
  const [search, setSearch]       = useState('')
  const [loading, setLoading]     = useState(false)
  const [records, setRecords]     = useState(STATIC_DATA)
  const [total, setTotal]         = useState(50)
  const [page, setPage]           = useState(1)

  const totalPages = Math.ceil(total / PAGE_SIZE) || 1
  const start = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1
  const end   = Math.min(page * PAGE_SIZE, total)

  const handleSubmit = async () => {
    setLoading(true)
    setPage(1)
    try {
      // TODO: replace with real API call
      // const res = await fetchAuditTrail({ fromDate, toDate, username, page: 1, pageSize: PAGE_SIZE })
      // setRecords(res.data?.resultObj?.result || [])
      // setTotal(res.data?.resultObj?.total || 0)
      setRecords([])
      setTotal(0)
    } catch {
      /* handled by interceptor */
    } finally {
      setLoading(false)
    }
  }

  const filtered = records.filter((r) =>
    !search ||
    Object.values(r).some((v) =>
      String(v).toLowerCase().includes(search.toLowerCase())
    )
  )

  return (
    <div className="space-y-4">
      {/* Filter card */}
      <div className="card p-4">
        <div className="flex flex-wrap items-end gap-4">
          {/* From Date */}
          <div className="relative border border-gray-300 rounded min-w-[160px]">
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-gray-500">
              From Date*
            </label>
            <div className="flex items-center px-3 py-2.5 gap-2">
              <input
                type="text"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="text-sm flex-1 focus:outline-none bg-transparent"
              />
              <i className="fas fa-calendar-alt text-gray-400 text-sm" />
            </div>
          </div>

          {/* To Date */}
          <div className="relative border border-gray-300 rounded min-w-[160px]">
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-gray-500">
              To Date*
            </label>
            <div className="flex items-center px-3 py-2.5 gap-2">
              <input
                type="text"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="text-sm flex-1 focus:outline-none bg-transparent"
              />
              <i className="fas fa-calendar-alt text-gray-400 text-sm" />
            </div>
          </div>

          {/* Username */}
          <div className="relative border border-gray-300 rounded flex-1 min-w-[180px]">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full px-3 py-2.5 text-sm focus:outline-none bg-transparent"
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2.5 rounded text-sm font-semibold text-white disabled:opacity-60"
            style={{ background: PRIMARY }}
          >
            {loading ? <i className="fas fa-spinner fa-spin" /> : 'Submit'}
          </button>
        </div>
      </div>

      {/* Table card */}
      <div className="card">
        {/* Search + Download */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div className="relative">
            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Here"
              className="pl-8 pr-4 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-red-800 w-56"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded text-sm font-semibold text-white bg-gray-600 hover:bg-gray-700 transition">
            <i className="fas fa-download text-xs" />
            Download Sample File
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead>
              <tr className="border-b border-gray-100">
                {COLUMNS.map((col, i) => (
                  <th
                    key={col.key}
                    className="px-4 py-3 text-center text-sm font-medium text-gray-700"
                  >
                    <div className="flex items-center justify-center gap-2">
                      {col.label}
                      {i < COLUMNS.length - 1 && (
                        <span className="text-gray-300 font-light">|</span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={COLUMNS.length} className="py-16 text-center">
                    <i className="fas fa-spinner fa-spin text-3xl" style={{ color: PRIMARY }} />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={COLUMNS.length} className="py-16 text-center text-gray-400">
                    <i className="fas fa-inbox text-4xl mb-3 block opacity-30" />
                    <p className="text-sm">No records found. Use filters and click Submit.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((row, idx) => (
                  <tr key={idx} className="border-t border-gray-50 hover:bg-gray-50 transition">
                    {COLUMNS.map((col) => (
                      <td
                        key={col.key}
                        className="px-4 py-3 text-center text-sm"
                        style={COLORED_COLS.has(col.key) ? { color: PRIMARY } : { color: '#374151' }}
                      >
                        {row[col.key] ?? '—'}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {total > 0 && (
          <div className="flex items-center justify-end gap-4 px-4 py-3 border-t border-gray-100 text-sm text-gray-500">
            <span>Page Size:</span>
            <span className="font-medium text-gray-700">
              {start} to {end} of {total}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 disabled:opacity-40 hover:border-red-800 transition"
              >
                <i className="fas fa-chevron-left text-xs" />
              </button>
              <span className="px-2 font-medium text-gray-700">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 disabled:opacity-40 hover:border-red-800 transition"
              >
                <i className="fas fa-chevron-right text-xs" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
