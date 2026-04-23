import { useState } from 'react'
import { fetchAccountDetails } from '../../api/userOnboarding'
import PageHeader from '../../components/common/PageHeader'
import Spinner from '../../components/common/Spinner'
import { toast } from 'react-toastify'

export default function AccountLookup() {
  const [searchType, setSearchType] = useState('MOBILE')
  const [searchValue, setSearchValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const handleSearch = async () => {
    if (!searchValue.trim()) { toast.warn('Enter a search value'); return }
    setLoading(true)
    setResult(null)
    try {
      const res = await fetchAccountDetails(searchType, searchValue.trim())
      if (res.data?.success) {
        setResult(res.data.resultObj?.data)
        toast.success('Account found')
      } else {
        toast.error(res.data?.message || 'Not found')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Account not found')
    } finally {
      setLoading(false)
    }
  }

  const fields = result
    ? [
        ['Account Number', result.accountnumber],
        ['Customer Name', `${result.customerfirstname || ''} ${result.customermiddlename || ''} ${result.customerlastname || ''}`.trim()],
        ['Mobile Number', result.mobilenumber],
        ['Email', result.customeremail],
        ['PAN', result.pan],
        ['Aadhaar', result.aadhaar],
        ['Account Type', result.accounttype],
        ['Address', [result.permanentaddress1, result.permanentaddress2, result.permanentaddress3].filter(Boolean).join(', ')],
        ['City', result.permanentaddresscity],
        ['State', result.permanentaddressstate],
        ['Pin Code', result.permanentaddresspincode],
        ['Country', result.permanentaddresscountry],
      ]
    : []

  return (
    <div>
      <PageHeader title="Account Lookup" subtitle="Search bank account by mobile number or PAN" />

      <div className="card p-6 mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="form-label">Search By</label>
            <div className="flex gap-2">
              {['MOBILE', 'PAN'].map((t) => (
                <button key={t} type="button" onClick={() => setSearchType(t)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition
                    ${searchType === t ? 'bg-nsdl-blue text-white border-nsdl-blue' : 'bg-white text-gray-600 border-gray-300'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="form-label">{searchType === 'MOBILE' ? 'Mobile Number' : 'PAN Number'}</label>
            <input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="form-input"
              placeholder={searchType === 'MOBILE' ? '10-digit mobile number' : 'ABCDE1234F'}
            />
          </div>
          <button onClick={handleSearch} disabled={loading} className="btn-primary flex items-center gap-2">
            {loading ? <><Spinner size="sm" /> Searching…</> : '🔍 Search'}
          </button>
        </div>
      </div>

      {result && (
        <div className="card p-6">
          <p className="section-title">Account Details</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {fields.map(([label, value]) => (
              <div key={label} className="bg-gray-50 rounded-md px-3 py-2">
                <p className="text-xs text-gray-400">{label}</p>
                <p className="text-sm font-medium text-gray-800 break-words">{value || '—'}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
