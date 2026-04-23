import axios from 'axios'
import { BASE_URL } from '../utils/constants'
import { showLoader, hideLoader } from '../utils/loader'
import { showErrorModal } from '../context/ModalContext'

const api = axios.create({ baseURL: BASE_URL })

api.interceptors.request.use((config) => {
  showLoader()
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = token
  return config
})

api.interceptors.response.use(
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

export default api
