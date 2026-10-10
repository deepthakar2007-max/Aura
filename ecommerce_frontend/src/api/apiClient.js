import { API_BASE_URL } from '../config'

const getToken = () => localStorage.getItem('token')
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const RETRY_STATUSES = [502, 503, 504]

async function attempt(url, init, timeoutMs) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    try {
        return await fetch(url, { ...init, signal: controller.signal })
    } finally {
        clearTimeout(timer)
    }
}

async function request(endpoint, { method = 'GET', body, auth = false, headers = {} } = {}) {
    const finalHeaders = { 'Content-Type': 'application/json', ...headers }
    if (auth) {
        const token = getToken()
        if (token) finalHeaders['Authorization'] = `Bearer ${token}`
    }

    const init = { method, headers: finalHeaders, body: body ? JSON.stringify(body) : undefined }
    const maxTries = method === 'GET' ? 3 : 1

    let res = null
    let lastError = null

    for (let i = 0; i < maxTries; i++) {
        res = null
        try {
            res = await attempt(`${API_BASE_URL}${endpoint}`, init, 45000)
            if (!RETRY_STATUSES.includes(res.status) || i === maxTries - 1) break
        } catch (err) {
            lastError = err
            if (i === maxTries - 1) break
        }
        await sleep(1500 * (i + 1))
    }

    if (!res) {
        const message =
            lastError && lastError.name === 'AbortError'
                ? 'The server is taking too long to respond. Please try again.'
                : 'Cannot reach the server. Check your internet connection and try again.'
        const err = new Error(message)
        err.network = true
        throw err
    }

    let data
    try {
        data = await res.json()
    } catch {
        data = { success: false, message: 'Invalid server response' }
    }

    if (!res.ok || data.success === false) {
        const err = new Error(data.message || 'Something went wrong')
        err.field = data.field
        err.status = res.status
        throw err
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