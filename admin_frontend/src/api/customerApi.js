import apiClient from './apiClient'

export const getCustomers = () => apiClient.get('/admin/customers', { auth: true })
export const getCustomer = (id) => apiClient.get(`/admin/customers/${id}`, { auth: true })