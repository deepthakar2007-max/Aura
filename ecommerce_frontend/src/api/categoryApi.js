import apiClient from './apiClient'
import { cached, invalidate } from './cache'

export const getCategories = () => cached('categories', () => apiClient.get('/auth/category'), 120000)
export const getCategoryById = (id) => apiClient.get(`/auth/category/${id}`)
export const createCategory = (payload) =>
    apiClient.post('/auth/category', payload, { auth: true }).finally(() => invalidate('categories'))
export const updateCategory = (id, payload) =>
    apiClient.put(`/auth/category/${id}`, payload, { auth: true }).finally(() => invalidate('categories'))
export const deleteCategory = (id) =>
    apiClient.delete(`/auth/category/${id}`, { auth: true }).finally(() => invalidate('categories'))