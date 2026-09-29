import apiClient from './apiClient'

export const adminRegister = (payload) => apiClient.post('/admin/auth/register', payload)
export const adminLogin = (payload) => apiClient.post('/admin/auth/login', payload)
export const sendResetOtp = (email) => apiClient.post('/admin/auth/forgot-password', { email })
export const resetPassword = (payload) => apiClient.post('/admin/auth/reset-password', payload)
export const getAdminProfile = () => apiClient.get('/admin/auth/profile', { auth: true })
export const updateAdminProfile = (payload) => apiClient.put('/admin/auth/profile', payload, { auth: true })
export const changePassword = (payload) => apiClient.put('/admin/auth/change-password', payload, { auth: true })