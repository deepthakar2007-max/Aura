import apiClient from './apiClient'
import { cached } from './cache'

export const getBanners = async (position) => {
    const res = await cached('banners', () => apiClient.get('/auth/banner'), 120000)
    if (!position) return res
    return { ...res, data: res.data.filter((b) => b.position === position) }
}