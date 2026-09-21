import apiClient from './apiClient'

export const getProducts = (query = '') => apiClient.get(`/auth/product/product${query}`)
export const getProductById = (id) => apiClient.get(`/auth/product/product/${id}`)
export const createProduct = (payload) => apiClient.post('/auth/product/product', payload, { auth: true })
export const updateProduct = (id, payload) => apiClient.put(`/auth/product/product/${id}`, payload, { auth: true })
export const deleteProduct = (id) => apiClient.delete(`/auth/product/product/${id}`, { auth: true })