import { useEffect, useState } from 'react'
import AdminLayout from '../layout/AdminLayout'
import ConfirmModal from '../components/ConfirmModal'
import { getBrands, createBrand, updateBrand, deleteBrand } from '../api/brandApi'

export default function BrandList() {
    const [brands, setBrands] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editing, setEditing] = useState(null)
    const [deleteId, setDeleteId] = useState(null)
    const [form, setForm] = useState({ name: '', logo: '', description: '', status: 'active' })
    const [error, setError] = useState('')

    const load = () => {
        setLoading(true)
        getBrands().then((res) => setBrands(res.data)).finally(() => setLoading(false))
    }

    useEffect(() => { load() }, [])

    const openAdd = () => { setForm({ name: '', logo: '', description: '', status: 'active' }); setEditing(null); setShowForm(true) }
    const openEdit = (b) => { setForm(b); setEditing(b._id); setShowForm(true) }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        try {
            if (editing) await updateBrand(editing, form)
            else await createBrand(form)
            setShowForm(false)
            load()
        } catch (err) {
            setError(err.message)
        }
    }

    const handleDelete = async () => {
        await deleteBrand(deleteId)
        setDeleteId(null)
        load()
    }

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-5">
                <h1 className="text-xl font-semibold text-ink">Brands</h1>
                <button onClick={openAdd} className="bg-ink text-white px-4 py-2 rounded text-sm">+ Add Brand</button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white border border-ink/10 rounded p-5 mb-5 max-w-md space-y-3">
                    {error && <p className="text-sm text-danger">{error}</p>}
                    <input placeholder="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-ink/15 rounded px-3 py-2 text-sm" />
                    <input placeholder="Logo URL" value={form.logo} onChange={(e) => setForm({ ...form, logo: e.target.value })} className="w-full border border-ink/15 rounded px-3 py-2 text-sm" />
                    <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border border-ink/15 rounded px-3 py-2 text-sm" />
                    <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full border border-ink/15 rounded px-3 py-2 text-sm">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                    <div className="flex gap-2">
                        <button type="submit" className="bg-ink text-white px-4 py-2 rounded text-sm">{editing ? 'Update' : 'Create'}</button>
                        <button type="button" onClick={() => setShowForm(false)} className="border border-ink/15 px-4 py-2 rounded text-sm">Cancel</button>
                    </div>
                </form>
            )}

            <div className="bg-white border border-ink/10 rounded overflow-x-auto">
                {loading ? <p className="p-6 text-ink/50">Loading…</p> : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-ink/40 border-b border-ink/10">
                                <th className="py-3 px-4">Logo</th><th>Name</th><th>Products</th><th>Status</th><th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {brands.map((b) => (
                                <tr key={b._id} className="border-b border-ink/5">
                                    <td className="py-3 px-4"><img src={b.logo} alt="" className="w-10 h-10 object-cover rounded" /></td>
                                    <td>{b.name}</td>
                                    <td>{b.productCount}</td>
                                    <td>{b.status}</td>
                                    <td className="space-x-3">
                                        <button onClick={() => openEdit(b)} className="text-accent">Edit</button>
                                        <button onClick={() => setDeleteId(b._id)} className="text-danger">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {deleteId && <ConfirmModal message="Delete this brand?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />}
        </AdminLayout>
    )
}