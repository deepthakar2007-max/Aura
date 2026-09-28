import { API_BASE_URL } from '../config'

const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem('admin_token')}` })

export const getDashboardStats = async () => {
    const [products, orders, users, categories] = await Promise.all([
        fetch(`${API_BASE_URL}/admin/products`, { headers: authHeader() }).then(r => r.json()),
        fetch(`${API_BASE_URL}/admin/orders`, { headers: authHeader() }).then(r => r.json()),
        fetch(`${API_BASE_URL}/admin/customers`, { headers: authHeader() }).then(r => r.json()),
        fetch(`${API_BASE_URL}/admin/categories`, { headers: authHeader() }).then(r => r.json()),
    ])
    return { products: products.data || [], orders: orders.data || [], users: users.data || [], categories: categories.data || [] }
}