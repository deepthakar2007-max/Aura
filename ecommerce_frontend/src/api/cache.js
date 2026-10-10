const store = new Map()
const inflight = new Map()

export function cached(key, fetcher, ttl = 60000) {
    const hit = store.get(key)
    if (hit && hit.expires > Date.now()) return Promise.resolve(hit.value)
    if (inflight.has(key)) return inflight.get(key)

    const promise = fetcher()
        .then((value) => {
            store.set(key, { value, expires: Date.now() + ttl })
            return value
        })
        .finally(() => inflight.delete(key))

    inflight.set(key, promise)
    return promise
}

export function invalidate(prefix = '') {
    for (const key of store.keys()) {
        if (key.startsWith(prefix)) store.delete(key)
    }
}