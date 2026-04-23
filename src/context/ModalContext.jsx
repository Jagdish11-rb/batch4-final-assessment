import { createContext, useContext, useState } from 'react'

const ModalContext = createContext(null)
const PRIMARY = '#8b0304'

let _showError = null
export const showErrorModal = (message) => _showError?.(message)

// The main provider component that wraps our app and shows the error popup when needed
export function ModalProvider({ children }) {
  const [modal, setModal] = useState(null)

  _showError = (message) => setModal({ message })

  // Function to hide the error popup
  const close = () => setModal(null)

  return (
    <ModalContext.Provider value={{ showError: _showError }}>
      {children}
      {modal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.35)' }}>
          <div className="bg-white rounded-xl shadow-2xl relative flex flex-col items-center gap-4"
            style={{ width: 420, padding: '40px 48px 36px' }}>

            {/* X close */}
            <button onClick={close}
              className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-lg font-bold">
              ✕
            </button>

            {/* Red circle X icon */}
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              border: `3px solid ${PRIMARY}`, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: 28, color: PRIMARY, fontWeight: 700, lineHeight: 1 }}>✕</span>
            </div>

            {/* FAILED label */}
            <p style={{ color: PRIMARY, fontWeight: 800, fontSize: 18, margin: 0 }}>FAILED</p>

            {/* Message */}
            <p className="text-sm text-gray-700 text-center" style={{ margin: 0 }}>
              {modal.message}
            </p>

            {/* Okay button */}
            <button onClick={close}
              className="mt-2 px-10 py-2 rounded-md text-sm font-bold text-white"
              style={{ background: PRIMARY }}>
              Okay
            </button>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  )
}

// A handy shortcut to use the popup features from anywhere
export const useModal = () => useContext(ModalContext)