import apiClient from './apiClient'

export const getNotifications = () => apiClient.get('/admin/notifications', { auth: true })
export const markAllRead = () => apiClient.put('/admin/notifications/read-all', {}, { auth: true })