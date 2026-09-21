import apiClient from './apiClient'

export const getAddresses = (userId) => apiClient.get(`/auth/address/address?user=${userId}`, { auth: true })
export const getAddressById = (id) => apiClient.get(`/auth/address/address/${id}`, { auth: true })
export const addAddress = (payload) => apiClient.post('/auth/address/address', payload, { auth: true })
export const updateAddress = (id, payload) => apiClient.put(`/auth/address/address/${id}`, payload, { auth: true })
export const deleteAddress = (id) => apiClient.delete(`/auth/address/address/${id}`, { auth: true })