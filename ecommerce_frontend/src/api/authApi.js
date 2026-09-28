import apiClient from './apiClient'

export const registerUser = (payload) => apiClient.post('/auth/user/register', payload)
export const loginUser = (payload) => apiClient.post('/auth/user/login', payload)
export const fetchCurrentUser = () => apiClient.get('/auth/user/user', { auth: true })
export const updateProfile = (payload) => apiClient.put('/auth/user/user', payload, { auth: true })
export const deleteAccount = () => apiClient.delete('/auth/user/user', { auth: true })

// Ye dono naye functions add kar do:
export const sendOtp = (email) => apiClient.post('/auth/user/send-otp', { email })
export const verifyOtp = (email, otp) => apiClient.post('/auth/user/verify-otp', { email, otp })