import { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

const CART_KEY = 'carto_cart'

export function CartProvider({ children }) {
    const { user } = useAuth()
    const [cart, setCart] = useState(() => {
        const raw = localStorage.getItem(CART_KEY)
        return raw ? JSON.parse(raw) : []
    })

    useEffect(() => {
        localStorage.setItem(CART_KEY, JSON.stringify(cart))
    }, [cart])

    // Clear cart on logout
    useEffect(() => {
        if (!user) setCart([])
    }, [user])

    const addToCart = (product) => {
        if (!user) {
            toast.error('Please login to add items to cart')
            return false
        }
        setCart(prev => {
            const existing = prev.find(item => item.productId === product.id)
            if (existing) {
                toast.success(`Added another ${product.name}`)
                return prev.map(item =>
                    item.productId === product.id
                        ? { ...item, qty: item.qty + 1 }
                        : item
                )
            }
            toast.success(`${product.name} added to cart!`)
            return [...prev, { productId: product.id, name: product.name, price: product.price, image: product.image, qty: 1 }]
        })
        return true
    }

    const removeFromCart = (productId) => {
        setCart(prev => prev.filter(item => item.productId !== productId))
        toast.success('Item removed from cart')
    }

    const updateQty = (productId, qty) => {
        if (qty < 1) {
            removeFromCart(productId)
            return
        }
        setCart(prev =>
            prev.map(item =>
                item.productId === productId ? { ...item, qty } : item
            )
        )
    }

    const clearCart = () => {
        setCart([])
    }

    const cartCount = cart.reduce((sum, item) => sum + item.qty, 0)
    const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart, cartCount, cartTotal }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const ctx = useContext(CartContext)
    if (!ctx) throw new Error('useCart must be used within CartProvider')
    return ctx
}
