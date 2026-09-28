import apiClient from './apiClient'

export const getPayments = () => apiClient.get('/admin/payments', { auth: true })