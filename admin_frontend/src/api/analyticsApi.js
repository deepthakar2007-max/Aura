import apiClient from './apiClient'

export const getAnalytics = () => apiClient.get('/admin/analytics', { auth: true })