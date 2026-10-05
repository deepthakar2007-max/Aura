import apiClient from './apiClient'


// export const getBanners = (position) => apiClient.get(`/auth/banner${position ? `?position=${position}` : ''}`)
export const getBrands = () => apiClient.get('/admin/brands', { auth: true })
export const createBrand = (payload) => apiClient.post('/admin/brands', payload, { auth: true })
export const updateBrand = (id, payload) => apiClient.put(`/admin/brands/${id}`, payload, { auth: true })
export const deleteBrand = (id) => apiClient.delete(`/admin/brands/${id}`, { auth: true })