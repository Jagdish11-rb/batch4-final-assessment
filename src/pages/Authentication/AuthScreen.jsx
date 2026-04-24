import { useForm } from 'react-hook-form'
import { REGEX_SECURE_PASS } from '../../utils/authConstants'
import { useAuthenticationFlow } from '../../hooks/useAuthFlow'
import { AlertPopup, FloatingInputContainer, SecureInput, PinCodeBox, generateTimeStr, GoBackSvg, coreInputStyles, commonBtnStyle, commonLinkStyle, layoutGrid, headTitleStyle, subHeadStyle } from '../../components/auth/AuthSubComponents'
import brandLogo from '../../assets/nsdlheading.png'
import graphicRecover from '/nsdl_fgtp.svg'
import graphicFinance from '/bank.png'
import bgWatermark from '/nsdl_watermark.png'

/**
 * The main visual page where people sign in, change their passwords, or type secret codes.
 * We use a "step by step" system to switch between different small forms on this one page.
 */
export default function AuthScreen() {
  const primaryAuthForm = useForm({ mode: 'onChange' })
  const recoverAuthForm = useForm({ mode: 'onChange' })
  const modifyPassForm = useForm({ mode: 'onChange' })
  const createPassForm = useForm({ mode: 'onChange' })

  const { state, actions } = useAuthenticationFlow(primaryAuthForm, recoverAuthForm, modifyPassForm, createPassForm)
  const { currentStep, isProcessing, rememberMe, pinCode, pinMessage, countdown, isFirstTime, authSessionToken, failureDialog, showSuccessNotification, pinSentBanner, failureBanner } = state

  // Compare the new password and confirm password to see if they are different
  const assessMismatch = () => {
    const fresh = modifyPassForm.watch('newpassword')
    const confirm = modifyPassForm.watch('confirmPassword')
    return !!(confirm && fresh !== confirm)
  }

  const loginErrors = primaryAuthForm.formState.errors
  const recoverErrors = recoverAuthForm.formState.errors
  const modifyErrors = modifyPassForm.formState.errors
  const createErrors = createPassForm.formState.errors

  const activeIllustration = currentStep === 2 || currentStep === 4 ? graphicRecover : currentStep === 5 ? graphicFinance : null

  if (currentStep === 6) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, background: '#fff', fontFamily: 'Roboto, Inter, sans-serif' }}>
      <img src={brandLogo} alt="Logo" style={{ height: 56, objectFit: 'contain' }} />
      <img src={graphicRecover} alt="Success" style={{ maxWidth: 300, objectFit: 'contain' }} />
      <div style={{ textAlign: 'center', maxWidth: 360 }}>
        <h3 style={{ fontSize: 22, fontWeight: 700, color: '#212121', marginBottom: 8 }}>Password Sent!</h3>
        <p style={{ fontSize: 14, color: '#555', lineHeight: 1.6 }}>A temporary password has been sent to your registered mobile number. Please login with the temporary password.</p>
      </div>
      <button onClick={actions.resetToStart} style={{ ...commonBtnStyle, maxWidth: 240 }}>Back to Login</button>
    </div>
  )

  return (
    <div style={{ height: '100vh', display: 'flex', background: '#fff', overflowY: 'auto', fontFamily: 'Roboto, Inter, sans-serif' }}>
      <AlertPopup alertText={failureDialog} dismissAction={() => actions.setFailureDialog('')} />

      {showSuccessNotification && (
        <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 999999, background: '#3a9e4f', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px 10px 16px', boxShadow: '0 4px 16px rgba(0,0,0,0.22)' }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round" width={20} height={20} style={{ flexShrink: 0 }}>
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span style={{ color: '#fff', fontSize: 15, fontWeight: 700, fontFamily: 'Roboto, Inter, sans-serif', whiteSpace: 'nowrap' }}>Login Successful!!</span>
          <button onClick={() => actions.setShowSuccessNotification(false)} style={{ background: 'rgba(255,255,255,0.22)', border: '1.5px solid rgba(255,255,255,0.45)', borderRadius: 6, color: '#fff', fontSize: 13, fontWeight: 700, padding: '4px 14px', cursor: 'pointer', fontFamily: 'Roboto, Inter, sans-serif', marginLeft: 4 }}>Close</button>
        </div>
      )}

      {pinSentBanner && currentStep === 4 && (
        <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 999999, background: '#3a9e4f', borderRadius: 8, display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px 12px 16px', boxShadow: '0 4px 16px rgba(0,0,0,0.22)', maxWidth: 360 }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round" width={20} height={20} style={{ flexShrink: 0, marginTop: 2 }}>
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span style={{ color: '#fff', fontSize: 14, fontWeight: 600, fontFamily: 'Roboto, Inter, sans-serif', lineHeight: 1.5, flex: 1 }}>{pinSentBanner}</span>
          <button onClick={() => actions.setPinSentBanner('')} style={{ background: 'rgba(255,255,255,0.22)', border: '1.5px solid rgba(255,255,255,0.45)', borderRadius: 6, color: '#fff', fontSize: 13, fontWeight: 700, padding: '4px 14px', cursor: 'pointer', fontFamily: 'Roboto, Inter, sans-serif', marginLeft: 4, flexShrink: 0, alignSelf: 'flex-start' }}>Close</button>
        </div>
      )}

      {failureBanner && (
        <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 999999, background: '#d32f2f', borderRadius: 8, display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px 12px 16px', boxShadow: '0 4px 16px rgba(0,0,0,0.22)', maxWidth: 360 }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round" width={20} height={20} style={{ flexShrink: 0, marginTop: 2 }}>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
          <span style={{ color: '#fff', fontSize: 14, fontWeight: 600, fontFamily: 'Roboto, Inter, sans-serif', lineHeight: 1.5, flex: 1 }}>{failureBanner}</span>
          <button onClick={() => actions.setFailureBanner('')} style={{ background: 'rgba(255,255,255,0.22)', border: '1.5px solid rgba(255,255,255,0.45)', borderRadius: 6, color: '#fff', fontSize: 13, fontWeight: 700, padding: '4px 14px', cursor: 'pointer', fontFamily: 'Roboto, Inter, sans-serif', marginLeft: 4, flexShrink: 0, alignSelf: 'flex-start' }}>Close</button>
        </div>
      )}

      <div style={{ width: '50%', display: 'flex', flexDirection: 'column', padding: '40px 48px', background: '#fff' }}>
        <style>{`@keyframes appearView { 0% { transform: scale(0.4); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }`}</style>
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'center' }}>
          <img src={brandLogo} alt="Bank Logo" style={{ height: 60, objectFit: 'contain', animation: 'appearView 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' }} />
        </div>
        <div style={{ flex: 1, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative', minHeight: 360 }}>
          <img src={bgWatermark} alt="" style={{ width: '100%', objectFit: 'contain', animation: 'appearView 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' }} />
          {activeIllustration && <img src={bgWatermark} alt="graphic" style={{ position: 'absolute', width: '80%', maxHeight: '80%', objectFit: 'contain', zIndex: 1 }} />}
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 48px', background: '#fff' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>

          {currentStep === 1 && (
            <form onSubmit={primaryAuthForm.handleSubmit(actions.handleStandardLogin)} style={layoutGrid}>
              <div style={{ marginBottom: 8 }}>
                <h3 style={headTitleStyle}>Welcome Back!</h3>
                <p style={subHeadStyle}>Please enter your details</p>
              </div>
              <FloatingInputContainer labelText="Username *" errorMsg={loginErrors.agentid?.type === 'required' ? 'Username is required.' : loginErrors.agentid?.type === 'minLength' ? 'Username must be at least 4 characters long.' : loginErrors.agentid?.type === 'maxLength' ? 'Username cannot be longer than 100 characters.' : ''}>
                <input placeholder="" autoComplete="new-username" {...primaryAuthForm.register('agentid', { required: true, minLength: 4, maxLength: 100 })} style={coreInputStyles} />
              </FloatingInputContainer>
              <FloatingInputContainer labelText="Password *" errorMsg={loginErrors.password?.type === 'required' ? 'Password is required.' : loginErrors.password?.type === 'minLength' ? 'Password must be at least 8 characters long.' : loginErrors.password?.type === 'maxLength' ? 'Password cannot be longer than 30 characters.' : loginErrors.password?.type === 'pattern' ? 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.' : ''}>
                <SecureInput hint="" formBind={primaryAuthForm.register('password', { required: true, minLength: 8, maxLength: 30, pattern: REGEX_SECURE_PASS })} />
              </FloatingInputContainer>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, cursor: 'pointer' }}>
                  <input type="checkbox" checked={rememberMe} onChange={e => actions.setRememberMe(e.target.checked)} style={{ width: 16, height: 16, accentColor: '#8b0304', cursor: 'pointer' }} />
                  Remember Me
                </label>
                <span style={{ fontSize: 14, color: '#212121', cursor: 'pointer', fontWeight: 700 }} onClick={() => { actions.setCurrentStep(2); recoverAuthForm.reset() }}>Forgot Password?</span>
              </div>
              <button type="submit" disabled={isProcessing} style={{ ...commonBtnStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                {isProcessing ? <i className="fas fa-spinner fa-spin" /> : 'Login'}
              </button>
            </form>
          )}

          {currentStep === 2 && (
            <form onSubmit={recoverAuthForm.handleSubmit(actions.triggerForgotPasswordOtp)} style={layoutGrid}>
              <div style={{ marginBottom: 8 }}>
                <h3 style={headTitleStyle}>Forgot Password?</h3>
                <p style={{ ...subHeadStyle, color: '#444', fontSize: 13, lineHeight: 1.6, maxWidth: 340 }}>Put your Login ID and verify OTP then you will receive a new password in your inbox</p>
              </div>
              <FloatingInputContainer labelText="Username *" errorMsg={recoverErrors.agentid?.type === 'required' ? 'Username is required.' : recoverErrors.agentid?.type === 'minLength' ? 'Username must be at least 4 characters long.' : recoverErrors.agentid?.type === 'maxLength' ? 'Username cannot be longer than 100 characters.' : ''}>
                <input placeholder="" autoComplete="new-username" {...recoverAuthForm.register('agentid', { required: true, minLength: 4, maxLength: 100 })} style={coreInputStyles} />
              </FloatingInputContainer>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <button type="submit" disabled={isProcessing || !recoverAuthForm.formState.isValid} style={{ ...commonBtnStyle, opacity: !recoverAuthForm.formState.isValid ? 0.5 : 1 }}>Send OTP</button>
                <button type="button" onClick={actions.resetToStart} style={commonLinkStyle}><GoBackSvg /> Back to Login</button>
              </div>
            </form>
          )}

          {currentStep === 3 && (
            <form onSubmit={modifyPassForm.handleSubmit(actions.commitNewPassword)} style={layoutGrid}>
              <div style={{ marginBottom: 8 }}>
                <h3 style={headTitleStyle}>Reset Password</h3>
                <p style={subHeadStyle}>Please enter your details</p>
              </div>
              <FloatingInputContainer labelText="New Password *" errorMsg={modifyErrors.newpassword?.type === 'required' ? 'Password is required.' : modifyErrors.newpassword?.type === 'minLength' ? 'Password must be at least 8 characters long.' : modifyErrors.newpassword?.type === 'maxLength' ? 'Password cannot be longer than 30 characters.' : modifyErrors.newpassword?.type === 'pattern' ? 'Password must contain at least one uppercase, lowercase, number, and special character.' : ''}>
                <SecureInput hint="" formBind={modifyPassForm.register('newpassword', { required: true, minLength: 8, maxLength: 30, pattern: REGEX_SECURE_PASS })} />
              </FloatingInputContainer>
              <FloatingInputContainer labelText="Confirm Password *" errorMsg={modifyErrors.confirmPassword?.type === 'required' ? 'Password is required.' : modifyErrors.confirmPassword?.type === 'minLength' ? 'Password must be at least 8 characters long.' : modifyErrors.confirmPassword?.type === 'maxLength' ? 'Password cannot be longer than 30 characters.' : modifyErrors.confirmPassword?.type === 'pattern' ? 'Password must contain at least one uppercase, lowercase, number, and special character.' : assessMismatch() ? "Password & Confirm Password doesn't match!" : ''}>
                <SecureInput hint="" formBind={modifyPassForm.register('confirmPassword', { required: true, minLength: 8, maxLength: 30, pattern: REGEX_SECURE_PASS })} />
              </FloatingInputContainer>
              {assessMismatch() && <p style={{ fontSize: 12, color: '#d32f2f', margin: '-10px 0 0' }}>Password & Confirm Password doesn't match!</p>}
              <button type="submit" disabled={isProcessing || !modifyPassForm.formState.isValid || assessMismatch()} style={{ ...commonBtnStyle, opacity: !modifyPassForm.formState.isValid || assessMismatch() ? 0.5 : 1 }}>
                {isProcessing ? 'Resetting…' : 'Reset Password'}
              </button>
            </form>
          )}

          {currentStep === 4 && (
            <div style={layoutGrid}>
              <div style={{ marginBottom: 4 }}>
                <h3 style={headTitleStyle}>Verify OTP</h3>
                <p style={{ ...subHeadStyle, color: '#555', fontSize: 14, lineHeight: 1.6, marginTop: 6 }}>{pinMessage || 'The OTP was sent to the following recipient'}</p>
              </div>
              <div>
                <PinCodeBox size={6} updateValue={v => actions.setPinCode(v)} />
              </div>
              <div style={{ fontSize: 14, color: '#212121', fontWeight: 500 }}>
                Go to previous page <span onClick={actions.resetToStart} style={{ color: '#c0392b', fontWeight: 700, cursor: 'pointer' }}>Click Here</span>
              </div>
              {isFirstTime ? (
                <button type="button" onClick={actions.validateNewUserPin} disabled={pinCode.length < 6} style={{ ...commonBtnStyle, opacity: pinCode.length < 6 ? 0.5 : 1 }}>Next</button>
              ) : (
                <button type="button" onClick={actions.validateForgotFlowPin} disabled={isProcessing || pinCode.length < 6} style={{ ...commonBtnStyle, opacity: pinCode.length < 6 ? 0.5 : 1 }}>Verify</button>
              )}
              <div style={{ textAlign: 'center', marginTop: -8 }}>
                {countdown > 0 ? (
                  <p style={{ fontSize: 15, color: '#555', margin: 0 }}>Remaining time: <strong>{generateTimeStr(countdown)}</strong></p>
                ) : (
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#c0392b', cursor: 'pointer' }} onClick={() => { actions.setPinSentBanner(''); recoverAuthForm.handleSubmit(actions.triggerForgotPasswordOtp)() }}>Resend OTP</span>
                )}
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <form onSubmit={createPassForm.handleSubmit(actions.triggerNewUserOtp)} style={layoutGrid}>
              <div style={{ marginBottom: 8 }}>
                <h3 style={headTitleStyle}>Set Your Password</h3>
                <p style={subHeadStyle}>Please enter your details</p>
              </div>
              <FloatingInputContainer labelText="Username *" errorMsg={createErrors.username?.type === 'required' ? 'Username is required.' : createErrors.username?.type === 'minLength' ? 'Username must be at least 4 characters long.' : createErrors.username?.type === 'maxLength' ? 'Username cannot be longer than 100 characters.' : ''}>
                <input placeholder="" autoComplete="new-username" {...createPassForm.register('username', { required: true, minLength: 4, maxLength: 100 })} style={coreInputStyles} />
              </FloatingInputContainer>
              <FloatingInputContainer labelText="Mobile Number *" errorMsg={createErrors.mobileno?.type === 'required' ? 'Mobile Number is required.' : createErrors.mobileno?.type === 'pattern' ? 'Please Enter a Valid Mobile Number.' : ''}>
                <input placeholder="" inputMode="numeric" maxLength={10} {...createPassForm.register('mobileno', { required: true, pattern: /^[6-9]\d{9}$/ })} style={coreInputStyles} onKeyDown={e => { if (!/\d/.test(e.key) && !['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'].includes(e.key)) e.preventDefault() }} />
              </FloatingInputContainer>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <button type="submit" disabled={isProcessing || !createPassForm.formState.isValid} style={{ ...commonBtnStyle, opacity: !createPassForm.formState.isValid ? 0.5 : 1 }}>Submit</button>
                <button type="button" onClick={actions.resetToStart} style={commonLinkStyle}><GoBackSvg /> Back</button>
              </div>
            </form>
          )}
        </div>
      </div>

      {authSessionToken && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 4, padding: '10px', minWidth: 420, textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}>
            <h2 style={{ fontSize: 18, fontWeight: 500, color: '#49454f', marginBottom: 20, fontFamily: 'Roboto, Inter, sans-serif' }}>Congratulations!!! Login Successful</h2>
            <div style={{ display: 'flex', gap: 60, justifyContent: 'center' }}>
              <button onClick={actions.acceptLogin} style={{ backgroundColor: '#8b0304', color: '#fff', border: 'none', borderRadius: 8, width: 80, height: 40, fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: 'Roboto, Inter, sans-serif' }}>OK</button>
              <button onClick={actions.rejectLogin} style={{ backgroundColor: 'transparent', color: '#8b0304', border: '1px solid #8b0304', borderRadius: 8, width: 80, height: 40, fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: 'Roboto, Inter, sans-serif' }}>NO</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
