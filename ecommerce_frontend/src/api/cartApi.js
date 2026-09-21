import apiClient from './apiClient'

export const getCart = () => apiClient.get('/auth/cart', { auth: true })
export const addToCart = (product, quantity = 1) =>
    apiClient.post('/auth/cart', { product, quantity }, { auth: true })
export const updateCartItem = (id, quantity) =>
    apiClient.put(`/auth/cart/${id}`, { quantity }, { auth: true })
export const toggleSaveItem = (id) =>
    apiClient.put(`/auth/cart/${id}/save`, {}, { auth: true })
export const removeCartItem = (id) =>
    apiClient.delete(`/auth/cart/${id}`, { auth: true })
export const clearCart = () =>
    apiClient.delete('/auth/cart', { auth: true })