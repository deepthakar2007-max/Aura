import apiClient from './apiClient'

export const getReturns = () => apiClient.get('/admin/returns', { auth: true })
export const updateReturnStatus = (id, status) => apiClient.put(`/admin/returns/${id}`, { status }, { auth: true })