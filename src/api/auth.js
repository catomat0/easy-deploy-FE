import axios from 'axios'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080' })

export const register = (email, password) =>
  api.post('/auth/register', { email, password })

export const login = (email, password) =>
  api.post('/auth/login', { email, password })

export const getToken = () => localStorage.getItem('token')
export const getEmail = () => localStorage.getItem('email')

export const saveAuth = ({ token, email }) => {
  localStorage.setItem('token', token)
  localStorage.setItem('email', email)
}

export const clearAuth = () => {
  localStorage.clear()
}
