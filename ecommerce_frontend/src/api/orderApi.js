import apiClient from './apiClient'

export const placeOrder = (payload) => apiClient.post('/auth/order/order', payload, { auth: true })
export const getOrders = () => apiClient.get('/auth/order/order', { auth: true })
export const getOrderById = (id) => apiClient.get(`/auth/order/order/${id}`, { auth: true })
export const cancelOrder = (id) => apiClient.delete(`/auth/order/order/${id}`, { auth: true })