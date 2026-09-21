import apiClient from './apiClient'

export const getReviews = (productId) => apiClient.get(`/auth/review?product=${productId}`)
export const addReview = (payload) => apiClient.post('/auth/review', payload, { auth: true })
export const updateReview = (id, payload) => apiClient.put(`/auth/review/${id}`, payload, { auth: true })
export const deleteReview = (id) => apiClient.delete(`/auth/review/${id}`, { auth: true })