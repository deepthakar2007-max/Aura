import { API_BASE_URL } from '../config'

const getToken = () => localStorage.getItem('token')

async function request(endpoint, { method = 'GET', body, auth = false, headers = {} } = {}) {
    const finalHeaders = { 'Content-Type': 'application/json', ...headers }
    if (auth) {
        const token = getToken()
        if (token) finalHeaders['Authorization'] = `Bearer ${token}`
    }

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers: finalHeaders,
        body: body ? JSON.stringify(body) : undefined,
    })

    let data
    try {
        data = await res.json()
    } catch {
        data = { success: false, message: 'Invalid server response' }
    }

    if (!res.ok || data.success === false) {
        throw new Error(data.message || 'Something went wrong')
    }
    return data
}

export default {
    get: (endpoint, opts) => request(endpoint, { ...opts, method: 'GET' }),
    post: (endpoint, body, opts) => request(endpoint, { ...opts, method: 'POST', body }),
    put: (endpoint, body, opts) => request(endpoint, { ...opts, method: 'PUT', body }),
    patch: (endpoint, body, opts) => request(endpoint, { ...opts, method: 'PATCH', body }),
    delete: (endpoint, opts) => request(endpoint, { ...opts, method: 'DELETE' }),
}