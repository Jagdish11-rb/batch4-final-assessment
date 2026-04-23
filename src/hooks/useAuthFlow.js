import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import { login as performLoginApi, getDashboard, sendForgotOtp, verifyForgotOtp, sendFirstLoginOtp, changePasswordWithOtp } from '../api/auth'
import { decodeJwt } from '../utils/helpers'
import { showLoader, hideLoader } from '../utils/loader'
import { ROLES_PERMITTED, MSGS } from '../utils/authConstants'

/**
 * Custom Feature for the Login Process
 * This holds all the complicated rules for logging in, resetting passwords, and checking secret codes (OTPs).
 * We keep this separate from the visual screen component so the screen file doesn't get too messy.
 */
export function useAuthenticationFlow(authForm, forgotPassForm, resetPassForm, createPassForm) {
  const { loginUser } = useAuth()
  const redirect = useNavigate()
  
  const [currentStep, setCurrentStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [pinCode, setPinCode] = useState('')
  const [pinMessage, setPinMessage] = useState('')
  const [countdown, setCountdown] = useState(60)
  const [isFirstTime, setIsFirstTime] = useState(false)
  const [onboardedUser, setOnboardedUser] = useState('')
  const [validatedPin, setValidatedPin] = useState('')
  const [authSessionToken, setAuthSessionToken] = useState(null)
  
  const [failureDialog, setFailureDialog] = useState('')
  const [showSuccessNotification, setShowSuccessNotification] = useState(false)
  const [pinSentBanner, setPinSentBanner] = useState('')
  const [failureBanner, setFailureBanner] = useState('')

  useEffect(() => {
    if (currentStep !== 4) return
    setCountdown(60)
    const intervalId = setInterval(() => setCountdown(time => {
      if (time <= 1) { clearInterval(intervalId); return 0 }
      return time - 1
    }), 1000)
    return () => clearInterval(intervalId)
  }, [currentStep])

  // Take the person to the main dashboard after they click the OK button on the success popup
  const acceptLogin = () => {
    if (!authSessionToken) return
    setIsProcessing(true)
    setTimeout(() => {
      loginUser(authSessionToken.token)
      redirect('/dashboard')
    }, 800)
  }

  // Stop the login attempt if they click the NO button on the success popup
  const rejectLogin = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setAuthSessionToken(null)
      setShowSuccessNotification(false)
      setIsProcessing(false)
    }, 800)
  }

  // Return to the first login form and clear out any typed text or errors
  const resetToStart = () => {
    setCurrentStep(1)
    authForm.reset(); forgotPassForm.reset(); resetPassForm.reset(); createPassForm.reset()
    setPinCode(''); setPinMessage(''); setOnboardedUser(''); setValidatedPin('')
    setPinSentBanner(''); setFailureBanner('')
  }

  // Attempt to sign in the person using their provided username and password
  const handleStandardLogin = async ({ agentid, password }) => {
    setIsProcessing(true)
    showLoader()
    try {
      const response = await performLoginApi(agentid, password)
      const jwtToken = response?.access_token
      if (!jwtToken) {
        const errorText = response?.error_description || response?.message || 'Login failed'
        setFailureBanner(errorText); setFailureDialog(errorText); return
      }

      const decodedInfo = decodeJwt(jwtToken)
      const userLevel = decodedInfo?.authorities?.[0]
      const sysAdminName = response.adminName

      if (sysAdminName === 'iserveu' || sysAdminName === 'iserveu2') {
        toast.warn(MSGS.UNAUTH_ACCESS); setFailureDialog(MSGS.UNAUTH_ACCESS); setFailureBanner(MSGS.UNAUTH_ACCESS); return
      }
      if (!userLevel || !ROLES_PERMITTED.includes(userLevel)) {
        setFailureBanner(MSGS.DENIED_ACCESS); setFailureDialog(MSGS.DENIED_ACCESS); return
      }

      let dData = {}
      try { dData = await getDashboard(jwtToken) } catch { }

      sessionStorage.setItem('refresh_token', response.refresh_token ?? '')
      sessionStorage.setItem('access_token', jwtToken)
      sessionStorage.setItem('exp', response.expires_in ?? '')
      sessionStorage.setItem('loginInfo', JSON.stringify(response))
      sessionStorage.setItem('CORE_SESSION', jwtToken)
      sessionStorage.setItem('userType', userLevel)
      sessionStorage.setItem('loginCount', '0')
      sessionStorage.setItem('dashboardData', JSON.stringify(dData))
      localStorage.setItem('admin_name', sysAdminName ?? '')
      localStorage.setItem('isPasswordResetRequired', response.isPasswordResetRequired ?? '')
      localStorage.setItem('user_name', decodedInfo?.user_name ?? agentid)

      if (rememberMe) {
        localStorage.setItem('rememberUser', agentid)
        localStorage.setItem('rememberPass', password)
      }

      setAuthSessionToken({ token: jwtToken })
      setShowSuccessNotification(true)
    } catch (err) {
      const respData = err.response?.data
      const txt = respData?.error_description || respData?.message || (err.code === 'ERR_NETWORK' ? MSGS.NETWORK_ERR : null) || MSGS.SERVER_ERR
      setFailureBanner(txt); setFailureDialog(txt)
    } finally {
      hideLoader()
      setIsProcessing(false)
    }
  }

  // Send a secret code (OTP) to their phone if they have forgotten their password
  const triggerForgotPasswordOtp = async ({ agentid }) => {
    setIsProcessing(true)
    try {
      const response = await sendForgotOtp(agentid)
      if (response.statusCode == 0) {
        setPinMessage(response.statusDesc)
        setPinSentBanner(response.statusDesc)
        setIsFirstTime(false)
        setPinCode('')
        setCurrentStep(4)
      } else {
        setFailureBanner(response.statusDesc)
        setFailureDialog(response.statusDesc)
      }
    } catch (e) {
      const txt = e.response?.data?.statusDesc || MSGS.GENERIC_ERR
      setFailureBanner(txt); setFailureDialog(txt)
    } finally { setIsProcessing(false) }
  }

  // Send a secret code (OTP) to a brand new person so they can set up their very first password
  const triggerNewUserOtp = async ({ username, mobileno }) => {
    setIsProcessing(true)
    try {
      const response = await sendFirstLoginOtp(username, mobileno)
      if (response.statusCode == 0) {
        toast.success(response.statusDesc)
        setOnboardedUser(username)
        setIsFirstTime(true)
        setPinMessage(response.statusDesc)
        setPinSentBanner(response.statusDesc)
        setPinCode('')
        setCurrentStep(4)
      } else {
        toast.error(response.statusDesc)
        setFailureDialog(response.statusDesc)
      }
    } catch (e) {
      const txt = e.response?.data?.statusDesc || MSGS.GENERIC_ERR
      toast.error(txt); setFailureDialog(txt)
    } finally { setIsProcessing(false) }
  }

  // Verify if the secret code (OTP) they typed is correct to recover a lost password
  const validateForgotFlowPin = async () => {
    if (pinCode.length < 6) { toast.warn(MSGS.OTP_INCOMPLETE); return }
    setIsProcessing(true)
    try {
      const usr = forgotPassForm.getValues('agentid')
      const response = await verifyForgotOtp(usr, pinCode)
      if (response.statusCode == 0) {
        toast.success(response.statusDesc || MSGS.TEMP_PASS_SENT)
        forgotPassForm.reset(); setPinCode(''); setPinSentBanner(''); setCurrentStep(6)
      } else { setFailureBanner(response.statusDesc); setFailureDialog(response.statusDesc) }
    } catch (e) {
      const txt = e.response?.data?.statusDesc || MSGS.GENERIC_ERR
      setFailureBanner(txt); setFailureDialog(txt)
    } finally { setIsProcessing(false) }
  }

  // Keep the new person's secret code (OTP) and take them to the next form to create a password
  const validateNewUserPin = () => {
    if (pinCode.length < 6) { toast.warn(MSGS.OTP_INCOMPLETE); return }
    setValidatedPin(pinCode); setPinCode(''); setPinSentBanner(''); resetPassForm.reset(); setCurrentStep(3)
  }

  // Save the brand new password securely after confirming the secret code was correct
  const commitNewPassword = async ({ newpassword, confirmPassword }) => {
    if (newpassword !== confirmPassword) { toast.error(MSGS.PASS_MISMATCH); return }
    setIsProcessing(true)
    try {
      const response = await changePasswordWithOtp(onboardedUser, validatedPin, newpassword, confirmPassword)
      if (response.statusCode !== -1) {
        toast.success(response.statusDesc || MSGS.PASS_SUCCESS); resetToStart()
      } else { setFailureBanner(response.statusDesc); setFailureDialog(response.statusDesc) }
    } catch (e) {
      const txt = e.response?.data?.statusDesc || MSGS.GENERIC_ERR
      setFailureBanner(txt); setFailureDialog(txt)
    } finally { setIsProcessing(false) }
  }

  return {
    state: { currentStep, isProcessing, rememberMe, pinCode, pinMessage, countdown, isFirstTime, onboardedUser, validatedPin, authSessionToken, failureDialog, showSuccessNotification, pinSentBanner, failureBanner },
    actions: { setCurrentStep, setRememberMe, setPinCode, setFailureDialog, setShowSuccessNotification, setPinSentBanner, setFailureBanner, acceptLogin, rejectLogin, resetToStart, handleStandardLogin, triggerForgotPasswordOtp, triggerNewUserOtp, validateForgotFlowPin, validateNewUserPin, commitNewPassword }
  }
}
