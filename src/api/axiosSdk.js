import axios from 'axios'
import { SDK_BASE_URL, PASS_KEY } from '../utils/constants'
import { showLoader, hideLoader } from '../utils/loader'
import { showErrorModal } from '../context/ModalContext'

const apiSdk = axios.create({ baseURL: SDK_BASE_URL })

apiSdk.interceptors.request.use((config) => {
  showLoader()
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = token
  config.headers['pass_key'] = PASS_KEY
  return config
})

apiSdk.interceptors.response.use(
  (res) => {
    hideLoader()
    return res
  },
  (err) => {
    hideLoader()
    if (err.response?.status === 401) {
      localStorage.clear()
      window.location.href = '/login'
    } else {
      const msg = err.response?.data?.error_description
        || err.response?.data?.message
        || err.response?.data?.statusDesc
        || (err.code === 'ERR_NETWORK' ? 'Network error — check connection or VPN.' : null)
        || 'Server Error, Please try again.'
      showErrorModal(msg)
    }
    return Promise.reject(err)
  }
)

export default apiSdk
