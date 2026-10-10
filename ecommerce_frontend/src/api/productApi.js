import apiClient from './apiClient'
import { cached, invalidate } from './cache'

export const getProducts = (query = '') =>
    cached(`products${query}`, () => apiClient.get(`/auth/product/product${query}`), 60000)
export const getBestSellers = () =>
    cached('products:bestsellers', () => apiClient.get('/auth/product/bestsellers'), 60000)
export const getProductById = (id) => apiClient.get(`/auth/product/product/${id}`)
export const createProduct = (payload) =>
    apiClient.post('/auth/product/product', payload, { auth: true }).finally(() => invalidate('products'))
export const updateProduct = (id, payload) =>
    apiClient.put(`/auth/product/product/${id}`, payload, { auth: true }).finally(() => invalidate('products'))
export const deleteProduct = (id) =>
    apiClient.delete(`/auth/product/product/${id}`, { auth: true }).finally(() => invalidate('products'))