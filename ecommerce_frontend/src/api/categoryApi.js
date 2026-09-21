import apiClient from './apiClient'

export const getCategories = () => apiClient.get('/auth/category')
export const getCategoryById = (id) => apiClient.get(`/auth/category/${id}`)
export const createCategory = (payload) => apiClient.post('/auth/category', payload, { auth: true })
export const updateCategory = (id, payload) => apiClient.put(`/auth/category/${id}`, payload, { auth: true })
export const deleteCategory = (id) => apiClient.delete(`/auth/category/${id}`, { auth: true })