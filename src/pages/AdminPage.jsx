import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Package, Users, Plus, Edit, Trash2, X } from 'lucide-react'
import { useProducts } from '../context/ProductContext'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

function ProductFormModal({ product, onClose, onSave }) {
    const isEdit = !!product
    const [form, setForm] = useState({
        name: product?.name || '', price: product?.price || '',
        desc: product?.desc || '', image: product?.image || '',
        category: product?.category || 'Apparel',
    })
    const handleSubmit = (e) => {
        e.preventDefault()
        if (!form.name || !form.price) { toast.error('Name and price required'); return }
        onSave({ ...form, price: parseFloat(form.price) }, product?.id)
        onClose()
    }
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="modal-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                    <h2 style={{ fontFamily: "'Outfit',sans-serif" }}>{isEdit ? 'Edit Product' : 'Add Product'}</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#a0a0b5', cursor: 'pointer' }}><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="input-group"><label>Name</label><input className="input-field" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div>
                    <div className="input-group"><label>Price ($)</label><input className="input-field" type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required /></div>
                    <div className="input-group"><label>Category</label>
                        <select className="input-field" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                            {['Apparel', 'Footwear', 'Accessories', 'Outerwear', 'Electronics', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="input-group"><label>Description</label><textarea className="input-field" value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} rows={3} /></div>
                    <div className="input-group"><label>Image URL</label><input className="input-field" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} /></div>
                    <div style={{ display: 'flex', gap: 12 }}>
                        <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
                        <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{isEdit ? 'Update' : 'Add'}</button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    )
}

export default function AdminPage() {
    const { products, addProduct, updateProduct, deleteProduct } = useProducts()
    const { users } = useAuth()
    const [modal, setModal] = useState({ open: false, product: null })

    const handleSave = (data, id) => {
        if (id) { updateProduct(id, data); toast.success('Updated!') }
        else { addProduct(data); toast.success('Added!') }
    }

    const handleDelete = (product) => {
        if (window.confirm(`Delete "${product.name}"?`)) {
            deleteProduct(product.id)
            toast.success('Deleted!')
        }
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <section className="section">
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
                        <div>
                            <h1 className="section-title">Admin Dashboard</h1>
                            <p className="section-subtitle">Manage products and view statistics</p>
                        </div>
                        <button onClick={() => setModal({ open: true, product: null })} className="btn btn-primary"><Plus size={18} /> Add Product</button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-3" style={{ marginBottom: 40 }}>
                        <div className="glass-card stat-card">
                            <Package size={28} style={{ color: '#a78bfa', marginBottom: 8 }} />
                            <div className="stat-value">{products.length}</div>
                            <div className="stat-label">Products</div>
                        </div>
                        <div className="glass-card stat-card">
                            <Users size={28} style={{ color: '#06d6a0', marginBottom: 8 }} />
                            <div className="stat-value">{users.length}</div>
                            <div className="stat-label">Users</div>
                        </div>
                        <div className="glass-card stat-card">
                            <Package size={28} style={{ color: '#3b82f6', marginBottom: 8 }} />
                            <div className="stat-value">${products.reduce((s, p) => s + p.price, 0).toFixed(0)}</div>
                            <div className="stat-label">Total Value</div>
                        </div>
                    </div>

                    {/* Product Table */}
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr><th>Product</th><th>Category</th><th>Price</th><th>Actions</th></tr>
                            </thead>
                            <tbody>
                                {products.map(p => (
                                    <tr key={p.id}>
                                        <td style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <img src={p.image || 'https://via.placeholder.com/40'} alt={p.name} style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} />
                                            <div>
                                                <div style={{ fontWeight: 600 }}>{p.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: '#6b6b80', maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.desc}</div>
                                            </div>
                                        </td>
                                        <td><span className="badge badge-user">{p.category || '—'}</span></td>
                                        <td style={{ fontWeight: 600, color: '#a78bfa' }}>${p.price.toFixed(2)}</td>
                                        <td>
                                            <div className="actions">
                                                <button onClick={() => setModal({ open: true, product: p })} className="btn btn-ghost btn-sm" style={{ color: '#f59e0b' }}><Edit size={14} /></button>
                                                <button onClick={() => handleDelete(p)} className="btn btn-ghost btn-sm" style={{ color: '#ef4444' }}><Trash2 size={14} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            <AnimatePresence>
                {modal.open && <ProductFormModal product={modal.product} onClose={() => setModal({ open: false, product: null })} onSave={handleSave} />}
            </AnimatePresence>
        </motion.div>
    )
}
