import apiClient from './apiClient'

export const getInventory = () => apiClient.get('/admin/inventory', { auth: true })
export const adjustStock = (id, payload) => apiClient.put(`/admin/inventory/${id}/adjust`, payload, { auth: true })