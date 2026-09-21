import apiClient from './apiClient'

export const getWishlist = (userId) => apiClient.get(`/auth/wishlist?user=${userId}`, { auth: true })
export const addToWishlist = (user, product) =>
    apiClient.post('/auth/wishlist', { user, product }, { auth: true })
export const removeFromWishlist = (id) =>
    apiClient.delete(`/auth/wishlist/${id}`, { auth: true })