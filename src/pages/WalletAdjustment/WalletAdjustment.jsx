import { useState } from 'react'
import { fetchUserDetails } from '../../api/userOnboarding'
import { toast } from 'react-toastify'
import nsdlLogo from '../../assets/nsdlheading.png'

const PRIMARY = '#8b0304'

const OPERATION_TYPES = ['Credit', 'Debit']

function FieldBox({ label, value }) {
  return (
    <div className="relative border border-gray-300 rounded px-3 pt-4 pb-2 bg-gray-50">
      <span className="absolute top-1 left-3 text-xs text-gray-400">{label}</span>
      <p className="text-sm text-gray-600 mt-1">{value || '—'}</p>
    </div>
  )
}

export default function WalletAdjustment() {
  const [searchUsername, setSearchUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [userData, setUserData] = useState(null)

  const [opType, setOpType] = useState('')
  const [amount, setAmount] = useState('')
  const [remark, setRemark] = useState('')
  const [errors, setErrors] = useState({})
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSearch = async () => {
    if (!searchUsername.trim()) return
    setLoading(true)
    setUserData(null)
    try {
      const res = await fetchUserDetails(searchUsername.trim(), 'Agent')
      const data = res.data?.resultObj?.data || res.data?.resultObj || res.data
      setUserData(data)
      toast.success('User details fetched successfully')
    } catch {
      // error handled by axios interceptor
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setUserData(null)
    setSearchUsername('')
    setOpType('')
    setAmount('')
    setRemark('')
    setErrors({})
  }

  const validate = () => {
    const e = {}
    if (!opType) e.opType = 'Types of Operations is required'
    if (!amount) e.amount = 'Amount is required'
    if (!remark.trim()) e.remark = 'Remark is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = () => {
    if (!validate()) return
    // TODO: call wallet adjustment save API
    setShowSuccess(true)
  }

  const handleDone = () => {
    setShowSuccess(false)
    setUserData(null)
    setSearchUsername('')
    setOpType('')
    setAmount('')
    setRemark('')
    setErrors({})
  }

  const basic = userData?.['1'] || userData
  const name = basic
    ? `${basic.firstName || ''} ${basic.lastName || ''}`.trim() || basic.name || ''
    : ''
  const wallet = userData?.walletType || userData?.wallet || 'Wallet 2'

  return (
    <div className="space-y-5">

      {/* Success modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.35)' }}>
          <div className="bg-white rounded-2xl shadow-2xl px-10 py-8 flex flex-col items-center gap-4 w-80">
            <img src={nsdlLogo} alt="NSDL" className="h-8 object-contain" />
            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
              <i className="fas fa-check text-white text-xl" />
            </div>
            <p className="text-base font-bold text-gray-800 text-center">Wallet Updated Successfully!</p>
            <button
              onClick={handleDone}
              className="w-full py-2.5 rounded-lg text-sm font-bold text-white mt-1"
              style={{ background: PRIMARY }}
            >
              Done
            </button>
          </div>
        </div>
      )}
      <h1 className="text-xl font-bold text-gray-800">Wallet Adjustment</h1>

      {/* Search */}
      <div className="card p-5">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-lg">
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-gray-500">
              User Name*
            </label>
            <input
              type="text"
              value={searchUsername}
              onChange={(e) => setSearchUsername(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-red-800"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading || !searchUsername.trim()}
            className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-60"
            style={{ background: PRIMARY }}
          >
            {loading ? <i className="fas fa-spinner fa-spin" /> : 'Search'}
          </button>
        </div>
      </div>

      {/* Details form — shown after successful search */}
      {userData && (
        <div className="card p-5 space-y-5">
          <h2 className="text-base font-bold text-gray-800">Please Enter all the Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldBox label="User Name" value={searchUsername} />
            <FieldBox label="Name" value={name} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Types of Operations */}
            <div className="flex flex-col gap-1">
              <div className={`relative border rounded ${errors.opType ? 'border-red-500' : 'border-gray-300'}`}>
                <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-gray-500">
                  Types of Operations*
                </label>
                <select
                  value={opType}
                  onChange={(e) => { setOpType(e.target.value); setErrors((p) => ({ ...p, opType: '' })) }}
                  className="w-full bg-transparent px-3 py-2.5 text-sm appearance-none focus:outline-none pr-8 text-gray-800"
                >
                  <option value="" disabled />
                  {OPERATION_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <i className="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
              </div>
              {errors.opType && <span className="text-xs text-red-600">{errors.opType}</span>}
            </div>

            {/* Amount */}
            <div className="flex flex-col gap-1">
              <input
                type="number"
                value={amount}
                onChange={(e) => { setAmount(e.target.value); setErrors((p) => ({ ...p, amount: '' })) }}
                placeholder="Amount*"
                className={`border rounded px-3 py-2.5 text-sm focus:outline-none ${errors.amount ? 'border-red-500' : 'border-gray-300 focus:border-red-800'
                  }`}
              />
              {errors.amount && <span className="text-xs text-red-600">{errors.amount}</span>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldBox label="Wallet" value={wallet} />

            {/* Remark */}
            <div className="flex flex-col gap-1">
              <input
                type="text"
                value={remark}
                onChange={(e) => { setRemark(e.target.value); setErrors((p) => ({ ...p, remark: '' })) }}
                placeholder="Remark*"
                className={`border rounded px-3 py-2.5 text-sm focus:outline-none ${errors.remark ? 'border-red-500' : 'border-gray-300 focus:border-red-800'
                  }`}
              />
              {errors.remark && <span className="text-xs text-red-600">{errors.remark}</span>}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={handleCancel}
              className="px-6 py-2 rounded border text-sm font-semibold"
              style={{ color: PRIMARY, borderColor: PRIMARY }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 rounded text-sm font-semibold text-white"
              style={{ background: PRIMARY }}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
