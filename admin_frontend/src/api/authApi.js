import apiClient from './apiClient'

export const adminLogin = (payload) => apiClient.post('/admin/auth/login', payload)
export const getAdminProfile = () => apiClient.get('/admin/auth/profile', { auth: true })
export const updateAdminProfile = (payload) => apiClient.put('/admin/auth/profile', payload, { auth: true })
export const changePassword = (payload) => apiClient.put('/admin/auth/change-password', payload, { auth: true })