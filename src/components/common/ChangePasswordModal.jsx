import { useState } from 'react'
import { sendChangePasswordOtp } from '../../api/userOnboarding'
import { toast } from 'react-toastify'

const PRIMARY = '#8b0304'

function PasswordField({ placeholder, value, onChange }) {
  const [show, setShow] = useState(false)
  return (
    <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3 gap-3">
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="flex-1 text-sm text-gray-700 focus:outline-none bg-transparent"
      />
      <button type="button" onClick={() => setShow((s) => !s)} className="text-gray-400 hover:text-gray-600 transition">
        <i className={`fas ${show ? 'fa-eye' : 'fa-eye-slash'} text-sm`} />
      </button>
    </div>
  )
}

export default function ChangePasswordModal({ onClose }) {
  const [oldPass, setOldPass]         = useState('')
  const [newPass, setNewPass]         = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [loading, setLoading]         = useState(false)

  const handleVerifyOtp = async () => {
    if (!oldPass || !newPass || !confirmPass) {
      toast.error('All fields are required')
      return
    }
    if (newPass !== confirmPass) {
      toast.error('New password and confirm password do not match')
      return
    }
    setLoading(true)
    try {
      await sendChangePasswordOtp(oldPass, newPass)
      toast.success('OTP sent successfully')
      onClose()
    } catch {
      /* handled by interceptor */
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.4)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 px-8 py-8">
        {/* Title */}
        <h2 className="text-xl font-bold text-gray-800 text-center mb-1">Change Password</h2>
        <p className="text-sm text-gray-500 text-center mb-6">Enter your old password and new password</p>

        {/* Fields */}
        <div className="space-y-4">
          <PasswordField
            placeholder="Old Password*"
            value={oldPass}
            onChange={(e) => setOldPass(e.target.value)}
          />
          <PasswordField
            placeholder="New Password*"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
          />
          <PasswordField
            placeholder="Confirm Password*"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-7">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-lg text-sm font-bold border-2 transition"
            style={{ color: PRIMARY, borderColor: PRIMARY }}
          >
            Cancel
          </button>
          <button
            onClick={handleVerifyOtp}
            disabled={loading}
            className="flex-1 py-3 rounded-lg text-sm font-bold text-white disabled:opacity-60 transition"
            style={{ background: PRIMARY }}
          >
            {loading ? <i className="fas fa-spinner fa-spin" /> : 'Verify Otp'}
          </button>
        </div>
      </div>
    </div>
  )
}
