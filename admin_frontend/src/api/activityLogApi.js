import apiClient from './apiClient'

export const getActivityLogs = () => apiClient.get('/admin/activity-logs', { auth: true })