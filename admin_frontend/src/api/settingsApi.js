import apiClient from './apiClient'

export const getSettings = () => apiClient.get('/admin/settings', { auth: true })
export const updateSettings = (payload) => apiClient.put('/admin/settings', payload, { auth: true })