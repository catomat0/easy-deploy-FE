import axios from 'axios'
import { getToken, clearAuth } from './auth'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'
const api = axios.create({ baseURL: BASE_URL })

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      clearAuth()
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export const startDeploy = (formData) => api.post('/deploy', formData)
export const getDeployStatus = (jobId) => api.get(`/deploy/${jobId}`)
export const cancelDeploy = (jobId) => api.delete(`/deploy/${jobId}`)

export const listVpcs = (creds) => api.post('/aws/vpcs', creds)
export const listSubnets = (creds) => api.post('/aws/subnets', creds)

export const getMyServers = () => api.get('/servers')
export const terminateServer = (id) => api.delete(`/servers/${id}`)

export const getTerraformFiles = (jobId) => api.get(`/deploy/${jobId}/terraform`)

/**
 * 배포 진행상황 SSE 구독
 * @param {string|number} jobId
 * @param {object} handlers - { onStep, onStatus, onComplete, onError }
 * @returns {EventSource} - cleanup 시 .close() 호출
 */
export const subscribeDeployStream = (jobId, { onStep, onStatus, onComplete, onError } = {}) => {
  const token = getToken()
  const url = `${BASE_URL}/deploy/${jobId}/stream${token ? `?token=${encodeURIComponent(token)}` : ''}`
  const es = new EventSource(url)

  // 연결 즉시 현재 상태
  es.addEventListener('status', (e) => {
    try {
      const data = JSON.parse(e.data)
      onStatus?.(data)
    } catch { /* ignore */ }
  })

  // Terraform 진행 단계
  es.addEventListener('step', (e) => {
    try {
      const data = JSON.parse(e.data)
      onStep?.(data.step)
    } catch { /* ignore */ }
  })

  // 완료 또는 실패
  es.addEventListener('complete', (e) => {
    try {
      const data = JSON.parse(e.data)
      onComplete?.(data)
    } catch { /* ignore */ }
    es.close()
  })

  es.onerror = (err) => {
    onError?.(err)
    es.close()
  }

  return es
}
