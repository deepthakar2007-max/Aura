import apiClient from './apiClient'

export const getCoupons = () => apiClient.get('/admin/coupons', { auth: true })
export const createCoupon = (payload) => apiClient.post('/admin/coupons', payload, { auth: true })
export const updateCoupon = (id, payload) => apiClient.put(`/admin/coupons/${id}`, payload, { auth: true })
export const deleteCoupon = (id) => apiClient.delete(`/admin/coupons/${id}`, { auth: true })