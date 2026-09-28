import apiClient from './apiClient'

export const getReviews = () => apiClient.get('/admin/reviews', { auth: true })
export const deleteReview = (id) => apiClient.delete(`/admin/reviews/${id}`, { auth: true })