import apiClient from './apiClient'

export const getBanners = () => apiClient.get('/admin/banners', { auth: true })
export const createBanner = (payload) => apiClient.post('/admin/banners', payload, { auth: true })
export const updateBanner = (id, payload) => apiClient.put(`/admin/banners/${id}`, payload, { auth: true })
export const deleteBanner = (id) => apiClient.delete(`/admin/banners/${id}`, { auth: true })