import apiClient from './apiClient'

export const validateCoupon = (code) => apiClient.get(`/auth/coupon?code=${code.toUpperCase()}`, { auth: true })