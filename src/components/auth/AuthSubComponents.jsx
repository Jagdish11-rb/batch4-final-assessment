import { useState, useEffect, useRef } from 'react'

// Icon for hiding a password (closed eye shape)

export const VisibilityHiddenIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width={20} height={20}>
    <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113Z" />
    <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM12.53 15.713l-4.243-4.244a3.75 3.75 0 0 0 4.244 4.243Z" />
    <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 0 0-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 0 1 6.75 12Z" />
  </svg>
)

// Icon for showing a password (open eye shape)
export const VisibilityVisibleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width={20} height={20}>
    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
    <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clipRule="evenodd" />
  </svg>
)

// Icon for going back to the previous screen (arrow pointing left)
export const GoBackSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" width={18} height={18}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
  </svg>
)

// A popup box used to show large error messages on the screen
export const AlertPopup = ({ alertText, dismissAction }) => {
  if (!alertText) return null
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 12, padding: '36px 40px 32px', minWidth: 340, maxWidth: 420, width: '90%', textAlign: 'center', position: 'relative', boxShadow: '0 8px 32px rgba(0,0,0,0.18)', fontFamily: 'Roboto, Inter, sans-serif' }}>
        <button onClick={dismissAction} style={{ position: 'absolute', top: 14, right: 16, background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#888', lineHeight: 1, padding: 4 }}>✕</button>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', border: '3px solid #e74c3c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" width={36} height={36}>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </div>
        </div>
        <h3 style={{ fontSize: 22, fontWeight: 700, color: '#e74c3c', margin: '0 0 14px', letterSpacing: 1 }}>FAILED</h3>
        <p style={{ fontSize: 15, color: '#333', margin: '0 0 28px', lineHeight: 1.5, fontWeight: 400 }}>{alertText}</p>
        <button onClick={dismissAction} style={{ backgroundColor: '#8b0304', color: '#fff', border: 'none', borderRadius: 6, padding: '10px 44px', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'Roboto, Inter, sans-serif' }}>Okay</button>
      </div>
    </div>
  )
}

// A text box container that moves its label to the top edge when you click on it
export const FloatingInputContainer = ({ labelText, errorMsg, children }) => {
  const [active, setActive] = useState(false)
  const [filled, setFilled] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    const el = containerRef.current?.querySelector('input')
    if (el) {
      setFilled(!!el.value)
      const updater = () => setFilled(!!el.value)
      el.addEventListener('input', updater)
      el.addEventListener('change', updater)
      return () => {
        el.removeEventListener('input', updater)
        el.removeEventListener('change', updater)
      }
    }
  }, [children])

  const liftLabel = active || filled
  const edgeColor = errorMsg ? '#d32f2f' : (active ? '#3f51b5' : 'rgba(0, 0, 0, 0.23)')
  const txtColor = errorMsg ? '#d32f2f' : (active ? '#3f51b5' : 'rgba(0, 0, 0, 0.6)')

  return (
    <div style={{ width: '100%', '--mat-caret-color': errorMsg ? '#d32f2f' : (active ? '#3f51b5' : '#212121') }} ref={containerRef}>
      <div
        onFocus={() => setActive(true)}
        onBlur={(e) => { setActive(false); setFilled(!!e.target.value) }}
        style={{ position: 'relative', border: `1.5px solid ${edgeColor}`, borderRadius: 4, background: '#fff', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: active && !errorMsg ? '0 0 0 0.5px #3f51b5' : 'none' }}>
        <label style={{ position: 'absolute', left: 12, top: liftLabel ? 0 : '50%', transform: liftLabel ? 'translateY(-50%) scale(0.85)' : 'translateY(-50%)', transformOrigin: 'left top', background: liftLabel ? '#fff' : 'transparent', padding: '0 4px', fontSize: liftLabel ? 12 : 15, color: txtColor, transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)', pointerEvents: 'none', whiteSpace: 'nowrap', fontFamily: 'Roboto, Inter, sans-serif', zIndex: 2 }}>
          {labelText}
        </label>
        {children}
      </div>
      {errorMsg && <p style={{ margin: '4px 14px 0', fontSize: 12, color: '#d32f2f', fontWeight: 500 }}>{errorMsg}</p>}
    </div>
  )
}

export const coreInputStyles = { width: '100%', height: 38, padding: '12px 14px 0', fontSize: 13, border: 'none', background: 'transparent', outline: 'none', color: '#212121', caretColor: 'var(--mat-caret-color)', boxSizing: 'border-box', transition: 'all 0.2s', fontFamily: 'Roboto, Inter, sans-serif' }

// A password text box that lets the user click an eye icon to view the hidden letters
export const SecureInput = ({ formBind, hint }) => {
  const [unmasked, setUnmasked] = useState(false)
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <input type={unmasked ? 'text' : 'password'} placeholder={hint} autoComplete="off" {...formBind} style={{ ...coreInputStyles, paddingRight: 44 }} />
      <button type="button" onClick={() => setUnmasked(v => !v)} style={{ position: 'absolute', right: 12, background: 'none', border: 'none', cursor: 'pointer', color: '#555', display: 'flex', padding: 0 }}>
        {unmasked ? <VisibilityVisibleIcon /> : <VisibilityHiddenIcon />}
      </button>
    </div>
  )
}

// A group of small input boxes used to type a secret code (OTP)
export const PinCodeBox = ({ size = 6, updateValue }) => {
  const [digits, setDigits] = useState(Array(size).fill(''))
  const inputRefs = []
  const onInput = (idx, char) => {
    if (!/^\d*$/.test(char)) return
    const cloned = [...digits]; cloned[idx] = char.slice(-1); setDigits(cloned)
    updateValue(cloned.join(''))
    if (char && idx < size - 1) inputRefs[idx + 1]?.focus()
  }
  const onKeyDown = (idx, event) => { if (event.key === 'Backspace' && !digits[idx] && idx > 0) inputRefs[idx - 1]?.focus() }
  return (
    <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
      {digits.map((digit, idx) => (
        <input key={idx} ref={el => inputRefs[idx] = el} type="text" inputMode="numeric" maxLength={1} value={digit} onChange={ev => onInput(idx, ev.target.value)} onKeyDown={ev => onKeyDown(idx, ev)} style={{ width: 42, height: 44, textAlign: 'center', fontSize: 20, fontWeight: 600, border: '1px solid rgba(0,0,0,0.38)', borderRadius: 4, outline: 'none', background: '#f1f1f1' }} />
      ))}
    </div>
  )
}

// Turns a number of seconds into a minutes:seconds format, like '01:30'
export const generateTimeStr = (totalSeconds) => {
  const mins = Math.floor(totalSeconds / 60).toString().padStart(2, '0')
  const secs = (totalSeconds % 60).toString().padStart(2, '0')
  return `${mins}:${secs}`
}

export const commonBtnStyle = { height: 44, backgroundColor: '#8b0304', color: '#fff', border: 'none', borderRadius: 4, fontSize: 13, fontWeight: 700, cursor: 'pointer', width: '100%', fontFamily: 'Roboto, Inter, sans-serif', letterSpacing: 0.5 }
export const commonLinkStyle = { background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#212121', fontSize: 15, fontWeight: 700, padding: '10px 0', fontFamily: 'Roboto, Inter, sans-serif', width: '100%' }
export const layoutGrid = { display: 'flex', flexDirection: 'column', gap: 22, width: '100%' }
export const headTitleStyle = { fontSize: 34, fontWeight: 800, color: '#111', margin: '0 0 6px', lineHeight: 1.2 }
export const subHeadStyle = { fontSize: 15, color: '#666', margin: 0, fontWeight: 400 }
