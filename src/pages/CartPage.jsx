import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function CartPage() {
    const { cart, removeFromCart, updateQty, cartTotal, clearCart } = useCart()

    if (cart.length === 0) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <section className="section">
                    <div className="container">
                        <h1 className="section-title" style={{ marginBottom: 40 }}>Your Cart</h1>
                        <div className="empty-state">
                            <ShoppingBag size={80} style={{ color: '#6b6b80' }} />
                            <h3>Your cart is empty</h3>
                            <p>Discover our amazing products and add some to your cart!</p>
                            <Link to="/products" className="btn btn-primary">Browse Products <ArrowRight size={16} /></Link>
                        </div>
                    </div>
                </section>
            </motion.div>
        )
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <section className="section">
                <div className="container">
                    <h1 className="section-title" style={{ marginBottom: 40 }}>Your Cart</h1>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32, alignItems: 'start' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {cart.map((item, i) => (
                                <motion.div key={item.productId} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                                    style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, background: 'rgba(20,20,30,0.7)', border: '1px solid rgba(139,92,246,0.12)', borderRadius: 14 }}>
                                    <img src={item.image || 'https://via.placeholder.com/72'} alt={item.name} style={{ width: 72, height: 72, borderRadius: 10, objectFit: 'cover' }} />
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: '1rem', fontWeight: 600, color: '#f0f0f5' }}>{item.name}</h3>
                                        <p style={{ fontSize: '0.85rem', color: '#a0a0b5' }}>${item.price.toFixed(2)}</p>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <button onClick={() => updateQty(item.productId, item.qty - 1)} style={qtyBtnStyle}><Minus size={14} /></button>
                                        <span style={{ fontSize: '1rem', fontWeight: 600, color: '#f0f0f5', minWidth: 24, textAlign: 'center' }}>{item.qty}</span>
                                        <button onClick={() => updateQty(item.productId, item.qty + 1)} style={qtyBtnStyle}><Plus size={14} /></button>
                                    </div>
                                    <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: '1.1rem', fontWeight: 700, color: '#f0f0f5', minWidth: 70, textAlign: 'right' }}>${(item.price * item.qty).toFixed(2)}</span>
                                    <button onClick={() => removeFromCart(item.productId)} style={{ padding: 8, border: 'none', borderRadius: 8, background: 'rgba(239,68,68,0.1)', color: '#ef4444', cursor: 'pointer', display: 'flex' }}><Trash2 size={16} /></button>
                                </motion.div>
                            ))}
                        </div>
                        <div style={{ position: 'sticky', top: 'calc(var(--nav-height) + 24px)', background: 'rgba(18,18,26,0.8)', backdropFilter: 'blur(16px)', border: '1px solid rgba(139,92,246,0.15)', borderRadius: 18, padding: 28 }}>
                            <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: '1.2rem', fontWeight: 600, marginBottom: 20 }}>Order Summary</h3>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', color: '#a0a0b5' }}><span>Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', color: '#a0a0b5' }}><span>Shipping</span><span style={{ color: '#06d6a0' }}>Free</span></div>
                            <div style={{ height: 1, background: 'rgba(139,92,246,0.15)', margin: '12px 0' }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, fontWeight: 600 }}>
                                <span>Total</span>
                                <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: '1.3rem', fontWeight: 800, background: 'linear-gradient(135deg,#8b5cf6,#06d6a0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>${cartTotal.toFixed(2)}</span>
                            </div>
                            <button className="btn btn-primary" style={{ width: '100%', padding: 14, fontSize: '1rem', marginTop: 20 }} onClick={() => { clearCart(); alert('🎉 Order placed!') }}>Checkout <ArrowRight size={16} /></button>
                            <button onClick={clearCart} style={{ width: '100%', padding: 10, marginTop: 10, background: 'none', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, color: '#ef4444', fontSize: '0.85rem', cursor: 'pointer' }}>Clear Cart</button>
                        </div>
                    </div>
                </div>
            </section>
        </motion.div>
    )
}

const qtyBtnStyle = { width: 32, height: 32, border: '1px solid rgba(139,92,246,0.2)', borderRadius: 8, background: 'rgba(139,92,246,0.08)', color: '#a78bfa', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }
