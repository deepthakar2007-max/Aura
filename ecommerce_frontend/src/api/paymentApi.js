import apiClient from './apiClient'

export const createPayment = (payload) => apiClient.post('/auth/payment', payload, { auth: true })