import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Plus, X } from 'lucide-react'
import { useProducts } from '../context/ProductContext'
import { useAuth } from '../context/AuthContext'
import ProductCard from '../components/ProductCard'
import toast from 'react-hot-toast'

function ProductModal({ product, onClose, onSave }) {
    const isEdit = !!product
    const [form, setForm] = useState({
        name: product?.name || '',
        price: product?.price || '',
        desc: product?.desc || '',
        image: product?.image || '',
        category: product?.category || 'Apparel',
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!form.name || !form.price) {
            toast.error('Name and price are required')
            return
        }
        onSave({ ...form, price: parseFloat(form.price) }, product?.id)
        onClose()
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="modal-content"
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.5rem' }}>
                        {isEdit ? 'Edit Product' : 'Add New Product'}
                    </h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#a0a0b5', cursor: 'pointer' }}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Product Name</label>
                        <input
                            className="input-field"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="Enter product name"
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Price ($)</label>
                        <input
                            className="input-field"
                            type="number"
                            step="0.01"
                            value={form.price}
                            onChange={(e) => setForm({ ...form, price: e.target.value })}
                            placeholder="0.00"
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Category</label>
                        <select
                            className="input-field"
                            value={form.category}
                            onChange={(e) => setForm({ ...form, category: e.target.value })}
                        >
                            <option value="Apparel">Apparel</option>
                            <option value="Footwear">Footwear</option>
                            <option value="Accessories">Accessories</option>
                            <option value="Outerwear">Outerwear</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="input-group">
                        <label>Description</label>
                        <textarea
                            className="input-field"
                            value={form.desc}
                            onChange={(e) => setForm({ ...form, desc: e.target.value })}
                            placeholder="Describe the product..."
                            rows={3}
                        />
                    </div>
                    <div className="input-group">
                        <label>Image URL</label>
                        <input
                            className="input-field"
                            value={form.image}
                            onChange={(e) => setForm({ ...form, image: e.target.value })}
                            placeholder="https://..."
                        />
                    </div>
                    <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                        <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
                        <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                            {isEdit ? 'Update' : 'Add Product'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    )
}

export default function ProductsPage() {
    const { products, addProduct, updateProduct } = useProducts()
    const { isAdmin } = useAuth()
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('All')
    const [modal, setModal] = useState({ open: false, product: null })

    const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))]

    const filtered = products.filter(p => {
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.desc.toLowerCase().includes(search.toLowerCase())
        const matchCat = category === 'All' || p.category === category
        return matchSearch && matchCat
    })

    const handleSave = (data, id) => {
        if (id) {
            updateProduct(id, data)
            toast.success('Product updated!')
        } else {
            addProduct(data)
            toast.success('Product added!')
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
        >
            <section className="section">
                <div className="container">
                    {/* Header */}
                    <div style={styles.header}>
                        <div>
                            <h1 className="section-title">Our Collection</h1>
                            <p className="section-subtitle">Browse our curated selection of premium products</p>
                        </div>
                        {isAdmin && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setModal({ open: true, product: null })}
                                className="btn btn-primary"
                            >
                                <Plus size={18} /> Add Product
                            </motion.button>
                        )}
                    </div>

                    {/* Filters */}
                    <div style={styles.filters}>
                        <div style={styles.searchWrapper}>
                            <Search size={18} style={styles.searchIcon} />
                            <input
                                className="input-field"
                                style={styles.searchInput}
                                placeholder="Search products..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div style={styles.categoryFilters}>
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setCategory(cat)}
                                    style={{
                                        ...styles.catBtn,
                                        ...(category === cat ? styles.catBtnActive : {})
                                    }}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Products Grid */}
                    {filtered.length > 0 ? (
                        <div className="grid grid-3">
                            {filtered.map((product, i) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    index={i}
                                    onEdit={(p) => setModal({ open: true, product: p })}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <Search size={64} />
                            <h3>No products found</h3>
                            <p>Try adjusting your search or filters</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Add/Edit Modal */}
            <AnimatePresence>
                {modal.open && (
                    <ProductModal
                        product={modal.product}
                        onClose={() => setModal({ open: false, product: null })}
                        onSave={handleSave}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    )
}

const styles = {
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 32,
        flexWrap: 'wrap',
        gap: 16,
    },
    filters: {
        marginBottom: 40,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
    },
    searchWrapper: {
        position: 'relative',
        maxWidth: 400,
    },
    searchIcon: {
        position: 'absolute',
        left: 16,
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#6b6b80',
        pointerEvents: 'none',
    },
    searchInput: {
        paddingLeft: 44,
    },
    categoryFilters: {
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap',
    },
    catBtn: {
        padding: '8px 18px',
        borderRadius: 20,
        border: '1px solid rgba(139, 92, 246, 0.15)',
        background: 'transparent',
        color: '#a0a0b5',
        fontSize: '0.85rem',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all 0.3s',
        fontFamily: "'Inter', sans-serif",
    },
    catBtnActive: {
        background: 'rgba(139, 92, 246, 0.15)',
        color: '#a78bfa',
        borderColor: 'rgba(139, 92, 246, 0.4)',
    },
}
