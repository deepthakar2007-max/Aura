import apiClient from './apiClient'

export const getAdminUsers = () => apiClient.get('/admin/admin-users', { auth: true })
export const createAdminUser = (payload) => apiClient.post('/admin/admin-users', payload, { auth: true })
export const deleteAdminUser = (id) => apiClient.delete(`/admin/admin-users/${id}`, { auth: true })