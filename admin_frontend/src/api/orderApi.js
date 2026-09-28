import apiClient from './apiClient'

export const getOrders = () => apiClient.get('/admin/orders', { auth: true })
export const getOrder = (id) => apiClient.get(`/admin/orders/${id}`, { auth: true })
export const updateOrderStatus = (id, orderstatus) => apiClient.put(`/admin/orders/${id}`, { orderstatus }, { auth: true })