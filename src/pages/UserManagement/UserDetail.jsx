import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchUserDetails, changeActiveStatus, updateFeaturesRequest, updateUserDetails } from '../../api/userOnboarding'
import { PRODUCT_FEATURES } from '../../utils/constants'
import PageHeader from '../../components/common/PageHeader'
import StatusBadge from '../../components/common/StatusBadge'
import Spinner from '../../components/common/Spinner'
import { formatDate } from '../../utils/helpers'
import { toast } from 'react-toastify'

const ROLE_MAP = {
  cbc:        'CBC',
  'cbc-maker':'CBC Maker',
  agent:      'Agent',
}

function Section({ title, data }) {
  if (!data) return null
  return (
    <div className="mb-6">
      <p className="section-title">{title}</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {Object.entries(data).map(([k, v]) => (
          <div key={k} className="bg-gray-50 rounded-md px-3 py-2">
            <p className="text-xs text-gray-400 capitalize">{k.replace(/([A-Z])/g, ' $1')}</p>
            <p className="text-sm font-medium text-gray-800 break-words">
              {Array.isArray(v) ? v.join(', ') || '—' : v || '—'}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function UserDetail() {
  const { type, id } = useParams()
  const navigate = useNavigate()
  const role = ROLE_MAP[type] || 'CBC'

  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)

  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [updateEmail, setUpdateEmail]         = useState('')
  const [updateMobile, setUpdateMobile]       = useState('')
  const [updatingContact, setUpdatingContact] = useState(false)

  const [showFeatureModal, setShowFeatureModal] = useState(false)
  const [newFeatures, setNewFeatures]           = useState([])
  const [featureComment, setFeatureComment]     = useState('')
  const [updatingFeature, setUpdatingFeature]   = useState(false)

  const [togglingStatus, setTogglingStatus] = useState(false)
  const [statusComment, setStatusComment]   = useState('')

  useEffect(() => {
    fetchUserDetails(id, role)
      .then((res) => setData(res.data?.resultObj?.data))
      .catch(() => toast.error('Failed to load user details'))
      .finally(() => setLoading(false))
  }, [id, role])

  const handleUpdateContact = async () => {
    setUpdatingContact(true)
    try {
      const res = await updateUserDetails({ username: id, email: updateEmail, mobileNumber: updateMobile, role })
      if (res.data?.success) {
        toast.success('Contact details updated')
        setShowUpdateModal(false)
      } else {
        toast.error(res.data?.message || 'Update failed')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating contact')
    } finally {
      setUpdatingContact(false)
    }
  }

  const handleToggleStatus = async (activeStatus) => {
    setTogglingStatus(true)
    try {
      const res = await changeActiveStatus({ username: id, activeStatus, role, comments: statusComment })
      if (res.data?.success) {
        toast.success(res.data.message)
        setStatusComment('')
      } else {
        toast.error(res.data?.message || 'Failed')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error')
    } finally {
      setTogglingStatus(false)
    }
  }

  const handleFeatureUpdate = async () => {
    setUpdatingFeature(true)
    try {
      const payload = {
        username: id,
        role,
        newProductFeatures: newFeatures,
        comments: featureComment,
      }
      const res = await updateFeaturesRequest(payload)
      if (res.data?.success) {
        toast.success('Feature update request submitted')
        setShowFeatureModal(false)
        setNewFeatures([])
      } else {
        toast.error(res.data?.message || 'Failed')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error')
    } finally {
      setUpdatingFeature(false)
    }
  }

  const toggleNewFeature = (feat) =>
    setNewFeatures((p) =>
      p.some((f) => f.id === feat.id) ? p.filter((f) => f.id !== feat.id) : [...p, feat]
    )

  if (loading) return <div className="flex justify-center items-center h-60"><Spinner /></div>
  if (!data) return <div className="text-center py-20 text-gray-400">User not found</div>

  const SECTION_KEYS = { '1': 'Basic Information', '2': 'Business Details', '3': 'Admin Details', '4': 'Bank Details', '5': 'Other Details' }

  return (
    <div>
      <PageHeader
        title={`${role}: ${data._id || id}`}
        subtitle={`Status: ${data.status || '—'} · Created by ${data.createdBy || '—'} · ${formatDate(data.createdAt)}`}
        action={
          <button onClick={() => navigate(-1)} className="btn-secondary">← Back</button>
        }
      />

      {/* Status banner */}
      <div className="card p-4 mb-6 flex flex-wrap items-center gap-4">
        <StatusBadge status={data.status} />
        <span className="text-xs text-gray-500">{data.approved_level || '—'}</span>
        {data.remarks?.comments && (
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            Remark: {data.remarks.comments}
          </span>
        )}
        <div className="ml-auto flex gap-2 flex-wrap">
          <button onClick={() => setShowUpdateModal(true)} className="btn-secondary text-xs">
            Update Contact
          </button>
          <button onClick={() => setShowFeatureModal(true)} className="btn-secondary text-xs">
            Update Features
          </button>
          {data.status === 'APPROVED' && (
            <>
              <button
                onClick={() => handleToggleStatus(0)}
                disabled={togglingStatus}
                className="btn-danger text-xs"
              >
                Disable
              </button>
              <button
                onClick={() => handleToggleStatus(1)}
                disabled={togglingStatus}
                className="btn-success text-xs"
              >
                Enable
              </button>
            </>
          )}
        </div>
      </div>

      {/* Data sections */}
      <div className="card p-6">
        {Object.entries(SECTION_KEYS).map(([k, title]) =>
          data[k] ? <Section key={k} title={title} data={data[k]} /> : null
        )}
      </div>

      {/* Update Contact Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="font-semibold text-gray-800 mb-4">Update Contact Details</h3>
            <div className="space-y-3">
              <div>
                <label className="form-label">Email</label>
                <input value={updateEmail} onChange={(e) => setUpdateEmail(e.target.value)} className="form-input" type="email" />
              </div>
              <div>
                <label className="form-label">Mobile Number</label>
                <input value={updateMobile} onChange={(e) => setUpdateMobile(e.target.value)} className="form-input" />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowUpdateModal(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleUpdateContact} disabled={updatingContact} className="btn-primary flex-1 flex items-center justify-center gap-2">
                {updatingContact ? <Spinner size="sm" /> : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feature Update Modal */}
      {showFeatureModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h3 className="font-semibold text-gray-800 mb-4">Update Product Features</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {PRODUCT_FEATURES.map((feat) => {
                const selected = newFeatures.some((f) => f.id === feat.id)
                return (
                  <button key={feat.id} type="button" onClick={() => toggleNewFeature(feat)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition
                      ${selected ? 'bg-nsdl-blue text-white border-nsdl-blue' : 'bg-white text-gray-600 border-gray-300'}`}>
                    {feat.featureName}
                  </button>
                )
              })}
            </div>
            <div>
              <label className="form-label">Comments</label>
              <input value={featureComment} onChange={(e) => setFeatureComment(e.target.value)} className="form-input" />
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowFeatureModal(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleFeatureUpdate} disabled={updatingFeature} className="btn-primary flex-1 flex items-center justify-center gap-2">
                {updatingFeature ? <Spinner size="sm" /> : 'Submit Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
