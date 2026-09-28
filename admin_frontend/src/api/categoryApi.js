import apiClient from './apiClient'

export const getCategories = () => apiClient.get('/admin/categories', { auth: true })
export const createCategory = (payload) => apiClient.post('/admin/categories', payload, { auth: true })
export const updateCategory = (id, payload) => apiClient.put(`/admin/categories/${id}`, payload, { auth: true })
export const deleteCategory = (id) => apiClient.delete(`/admin/categories/${id}`, { auth: true })