import { useRef } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, Edit, Trash2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useProducts } from '../context/ProductContext'
import gsap from 'gsap'
import toast from 'react-hot-toast'

export default function ProductCard({ product, index = 0, onEdit }) {
    const { user, isAdmin } = useAuth()
    const { addToCart } = useCart()
    const { deleteProduct } = useProducts()
    const cardRef = useRef(null)

    const handleMouseMove = (e) => {
        if (!cardRef.current) return
        const rect = cardRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const centerX = rect.width / 2
        const centerY = rect.height / 2
        const rotateX = ((y - centerY) / centerY) * -5
        const rotateY = ((x - centerX) / centerX) * 5

        gsap.to(cardRef.current, {
            rotateX,
            rotateY,
            duration: 0.3,
            ease: 'power2.out',
            transformPerspective: 800,
        })
    }

    const handleMouseLeave = () => {
        if (!cardRef.current) return
        gsap.to(cardRef.current, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.5,
            ease: 'elastic.out(1, 0.3)',
        })
    }

    const handleAddToCart = () => {
        if (!user) {
            toast.error('Please login to add items to cart')
            return
        }
        addToCart(product)
    }

    const handleDelete = () => {
        if (window.confirm(`Delete "${product.name}"?`)) {
            deleteProduct(product.id)
            toast.success('Product deleted')
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
            <div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={styles.card}
            >
                {/* Image */}
                <div style={styles.imageWrapper}>
                    <img
                        src={product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'}
                        alt={product.name}
                        style={styles.image}
                        loading="lazy"
                    />
                    <div style={styles.imageOverlay} />
                    {product.category && (
                        <span style={styles.category}>{product.category}</span>
                    )}
                </div>

                {/* Body */}
                <div style={styles.body}>
                    <h3 style={styles.name}>{product.name}</h3>
                    <p style={styles.desc}>{product.desc}</p>

                    <div style={styles.footer}>
                        <span style={styles.price}>${product.price.toFixed(2)}</span>

                        <div style={styles.actions}>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleAddToCart}
                                style={styles.cartButton}
                            >
                                <ShoppingCart size={16} />
                                Add
                            </motion.button>
                        </div>
                    </div>

                    {/* Admin Actions */}
                    {isAdmin && (
                        <div style={styles.adminActions}>
                            <button onClick={() => onEdit?.(product)} style={styles.editBtn}>
                                <Edit size={14} /> Edit
                            </button>
                            <button onClick={handleDelete} style={styles.deleteBtn}>
                                <Trash2 size={14} /> Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    )
}

const styles = {
    card: {
        background: 'rgba(20, 20, 30, 0.7)',
        border: '1px solid rgba(139, 92, 246, 0.12)',
        borderRadius: 16,
        overflow: 'hidden',
        transition: 'border-color 0.4s, box-shadow 0.4s',
        cursor: 'default',
        willChange: 'transform',
    },
    imageWrapper: {
        position: 'relative',
        overflow: 'hidden',
        height: 220,
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
    },
    imageOverlay: {
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, transparent 50%, rgba(10, 10, 15, 0.8) 100%)',
    },
    category: {
        position: 'absolute',
        top: 12,
        right: 12,
        padding: '4px 10px',
        background: 'rgba(139, 92, 246, 0.25)',
        backdropFilter: 'blur(8px)',
        color: '#e0e0e0',
        fontSize: '0.7rem',
        fontWeight: 600,
        borderRadius: 6,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
    },
    body: {
        padding: '20px',
    },
    name: {
        fontFamily: "'Outfit', sans-serif",
        fontSize: '1.15rem',
        fontWeight: 600,
        color: '#f0f0f5',
        marginBottom: 6,
    },
    desc: {
        fontSize: '0.85rem',
        color: '#a0a0b5',
        lineHeight: 1.5,
        marginBottom: 16,
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
    },
    footer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    price: {
        fontFamily: "'Outfit', sans-serif",
        fontSize: '1.3rem',
        fontWeight: 700,
        background: 'linear-gradient(135deg, #8b5cf6, #06d6a0)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
    },
    actions: {
        display: 'flex',
        gap: 8,
    },
    cartButton: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '8px 16px',
        background: 'linear-gradient(135deg, #8b5cf6, #06d6a0)',
        border: 'none',
        borderRadius: 10,
        color: '#fff',
        fontSize: '0.85rem',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'box-shadow 0.3s',
    },
    adminActions: {
        display: 'flex',
        gap: 8,
        marginTop: 12,
        paddingTop: 12,
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
    },
    editBtn: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        padding: '8px 12px',
        background: 'rgba(245, 158, 11, 0.1)',
        border: '1px solid rgba(245, 158, 11, 0.2)',
        borderRadius: 8,
        color: '#f59e0b',
        fontSize: '0.8rem',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.3s',
    },
    deleteBtn: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        padding: '8px 12px',
        background: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid rgba(239, 68, 68, 0.2)',
        borderRadius: 8,
        color: '#ef4444',
        fontSize: '0.8rem',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.3s',
    },
}
