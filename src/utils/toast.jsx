import { toast } from 'react-toastify'

function ToastMsg({ message, closeToast }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, width: '100%' }}>
      <span style={{ fontSize: 14, fontWeight: 600 }}>{message}</span>
      <button
        onClick={closeToast}
        style={{
          background: '#28a745',
          border: '1.5px solid rgba(255,255,255,0.6)',
          color: '#fff',
          borderRadius: 3,
          padding: '3px 12px',
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
          flexShrink: 0,
          lineHeight: 1.6,
          boxShadow: 'none',
          fontFamily: 'inherit',
        }}
      >
        Close
      </button>
    </div>
  )
}

export function showSuccess(message) {
  return toast.success(
    ({ closeToast }) => <ToastMsg message={message} closeToast={closeToast} />,
    { theme: 'colored', autoClose: false, hideProgressBar: true, closeButton: false, style: { background: '#28a745' } }
  )
}

export function showError(message) {
  toast.error(
    ({ closeToast }) => <ToastMsg message={message} closeToast={closeToast} />,
    { theme: 'colored', autoClose: false, hideProgressBar: true, closeButton: false }
  )
}
