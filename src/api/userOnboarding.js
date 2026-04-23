import api from './axios'
import apiSdk from './axiosSdk'
import { encryptRequest, decryptResponse } from '../utils/encryption'

export const onboardCBC = (data) =>
  api.post('/user_onboarding/cbc-onboard', data)

export const onboardCBCMaker = (data) =>
  api.post('/user_onboarding/cbc-maker-onboard', data)

export const onboardAgent = (data) =>
  api.post('/user_onboarding/agent-onboard', data)

export const checkDuplicacy = (dataObj, role) =>
  api.post('/user_onboarding/check-duplicacy', { dataObj, role })

export const fetchUserDetails = (username, userRole, config = {}) =>
  api.post('/user_onboarding/fetch-user-details', { username, userRole }, config)

export const fetchUserList = (payload) =>
  api.post('/user_onboarding/fetch-user-list', payload)

export const updateUserDetails = (payload) =>
  api.patch('/user_onboarding/update-user-details', payload)

export const fetchAccountDetails = (searchType, searchValue) =>
  api.get('/user_onboarding/fetch-account-details', {
    params: { searchType, searchValue },
  })

export const changeActiveStatus = (payload) =>
  api.patch('/user_onboarding/change-active-status', payload)

export const updateFeaturesRequest = (payload) =>
  api.patch('/user_onboarding/update-features-request', payload)

export const fetchBlacklist = (data) =>
  api.post('/black_list_db/fetch-details', { data })

export const sendChangePasswordOtp = (oldPassword, newPassword) =>
  api.post('/user-mgmt-internal/user/send-change-password-otp', { oldPassword, newPassword })

export const fetchUserOnboardingReport = async (payload) => {
  const res = await apiSdk.post('/user_onboarding_report/fetch-user-list', encryptRequest(payload))
  const raw = res.data?.ResponseData || res.data?.responseData
  if (raw) return JSON.parse(decryptResponse(raw))
  return res.data
}
