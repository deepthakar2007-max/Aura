import apiClient from './apiClient'

export const registerUser = (payload) => apiClient.post('/auth/user/register', payload)
export const loginUser = (payload) => apiClient.post('/auth/user/login', payload)
export const fetchCurrentUser = () => apiClient.get('/auth/user/user', { auth: true })
export const updateProfile = (payload) => apiClient.put('/auth/user/user', payload, { auth: true })
export const deleteAccount = () => apiClient.delete('/auth/user/user', { auth: true })