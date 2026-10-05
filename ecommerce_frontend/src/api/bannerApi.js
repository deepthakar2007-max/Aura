import apiClient from './apiClient'

export const getBanners = (position) => apiClient.get(`/auth/banner${position ? `?position=${position}` : ''}`)