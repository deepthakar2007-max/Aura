import { API_BASE_URL } from '../config'

const getToken = () => localStorage.getItem('token')

async function request(endpoint, { method = 'GET', body, auth = false } = {}) {
    const headers = { 'Content-Type': 'application/json' }
    if (auth) {
        const token = getToken()
        if (token) headers['Authorization'] = `Bearer ${token}`
    }
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method, headers, body: body ? JSON.stringify(body) : undefined,
    })
    let data
    try { data = await res.json() } catch { data = { success: false, message: 'Invalid server response' } }
    if (!res.ok || data.success === false) throw new Error(data.message || 'Something went wrong')
    return data
}

export default {
    get: (e, o) => request(e, { ...o, method: 'GET' }),
    post: (e, b, o) => request(e, { ...o, method: 'POST', body: b }),
    put: (e, b, o) => request(e, { ...o, method: 'PUT', body: b }),
    delete: (e, o) => request(e, { ...o, method: 'DELETE' }),
}