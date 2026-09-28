import apiClient from './apiClient'

export const getProducts = () => apiClient.get('/admin/products', { auth: true })
export const getProduct = (id) => apiClient.get(`/admin/products/${id}`, { auth: true })
export const createProduct = (payload) => apiClient.post('/admin/products', payload, { auth: true })
export const updateProduct = (id, payload) => apiClient.put(`/admin/products/${id}`, payload, { auth: true })
export const deleteProduct = (id) => apiClient.delete(`/admin/products/${id}`, { auth: true })