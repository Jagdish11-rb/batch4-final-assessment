import axios from 'axios'
import { encryptRequest, decryptResponse, buildGeoLocation } from '../utils/encryption'

// In dev, requests go through Vite proxy to avoid CORS (see vite.config.js)
const isDev = import.meta.env.DEV

const Base_Url = isDev
  ? '/api-encr/dev/nsdlab-internal'
  : 'https://services-encr.iserveu.online/dev/nsdlab-internal'

const Base_Url_Service = isDev
  ? '/api-svc/dev/nsdlab-internal/user-mgmt'
  : 'https://services.iserveu.online/dev/nsdlab-internal/user-mgmt'

const LOGIN_URL = `${Base_Url}/user-authorization/user/login`
const LOGOUT_URL = `${Base_Url}/user-authorization/logout`
const DASHBOARD_URL = `${Base_Url}/user-mgmt/user/dashboard`
const FORGOT_OTP_URL = `${Base_Url_Service}/utility/send-forgot-password-otp`
const SEND_TEMP_PASS_URL = `${Base_Url_Service}/utility/verify-otp-send-temporary-password`
const FIRST_LOGIN_OTP_URL = `${Base_Url_Service}/utility/send-first-login-otp`
const CHANGE_PASS_URL = `${Base_Url_Service}/utility/change-password-on-first-login-with-otp`

const LOGIN_BASIC_AUTH = 'Basic bnNkbGFiLWludGVybmFsLWNsaWVudDpuc2RsYWItaW50ZXJuYWwtcGFzc3dvcmQ='

// Server returns { ResponseData: "ENCRYPTED_STRING" } — decrypt that field
function parseEncryptedResponse(data) {
  if (data?.ResponseData) {
    return JSON.parse(decryptResponse(data.ResponseData))
  }
  // Fallback: plain JSON (e.g. error objects)
  return data
}

export async function login(username, password) {
  // Angular: JSON.stringify payload → encrypt → wrap in { RequestData: "..." }
  const body = encryptRequest({ grant_type: 'password', username, password })

  const { data } = await axios.post(LOGIN_URL, body, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': LOGIN_BASIC_AUTH,
      'User-Agent': 'Web',
      'Geo-Location': buildGeoLocation(),
    },
  })

  // Response: { ResponseData: "ENCRYPTED_STRING" }
  return parseEncryptedResponse(data)
}

export async function getDashboard(accessToken) {
  const { data } = await axios.get(DASHBOARD_URL, {
    headers: { Authorization: accessToken },
  })
  // Dashboard also returns { ResponseData: "ENCRYPTED_STRING" }
  return parseEncryptedResponse(data)
}

export async function sendForgotOtp(userName) {
  const { data } = await axios.post(
    `${FORGOT_OTP_URL}?userName=${encodeURIComponent(userName)}`, {}
  )
  return data
}

export async function verifyForgotOtp(userName, otp) {
  const { data } = await axios.post(SEND_TEMP_PASS_URL, { userName, otp })
  return data
}

export async function sendFirstLoginOtp(userName, mobileNumber) {
  const { data } = await axios.post(FIRST_LOGIN_OTP_URL, { userName, mobileNumber })
  return data
}

export async function changePasswordWithOtp(userName, otp, password, confirmPassword) {
  const { data } = await axios.put(CHANGE_PASS_URL, { userName, otp, password, confirmPassword })
  return data
}

export async function doLogout(accessToken) {
  const { data } = await axios.post(LOGOUT_URL, {}, {
    headers: { Authorization: accessToken },
  })
  return data
}
