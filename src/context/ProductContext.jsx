import { createContext, useContext, useState, useEffect } from 'react'

const ProductContext = createContext(null)

const PRODUCTS_KEY = 'carto_products'

const SEED_PRODUCTS = [
    {
        id: 1,
        name: 'Classic White Tee',
        price: 29.99,
        desc: 'Premium cotton crew-neck tee with a clean, modern fit. Perfect for everyday layering.',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
        category: 'Apparel'
    },
    {
        id: 2,
        name: 'Selvedge Denim Jeans',
        price: 89.99,
        desc: 'Japanese selvedge denim with a slim-straight cut. Raw indigo wash that ages beautifully.',
        image: 'https://images.unsplash.com/photo-1542272617-08f086302436?w=500',
        category: 'Apparel'
    },
    {
        id: 3,
        name: 'Ultra Boost Runners',
        price: 149.99,
        desc: 'Engineered mesh upper with responsive cushioning. Designed for performance and style.',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
        category: 'Footwear'
    },
    {
        id: 4,
        name: 'Moto Leather Jacket',
        price: 249.00,
        desc: 'Full-grain lambskin leather with asymmetric zip. A timeless statement piece.',
        image: 'https://images.unsplash.com/photo-1551028919-ac76c9085b67?w=500',
        category: 'Outerwear'
    },
    {
        id: 5,
        name: 'Canvas Crossbody Bag',
        price: 59.99,
        desc: 'Waxed canvas with leather trim. Multiple compartments for everyday carry.',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
        category: 'Accessories'
    },
    {
        id: 6,
        name: 'Aviator Sunglasses',
        price: 79.99,
        desc: 'Titanium frame with polarized lenses. UV400 protection with classic styling.',
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500',
        category: 'Accessories'
    }
]

function getStoredProducts() {
    const raw = localStorage.getItem(PRODUCTS_KEY)
    if (!raw) {
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(SEED_PRODUCTS))
        return SEED_PRODUCTS
    }
    const parsed = JSON.parse(raw)
    return parsed.length > 0 ? parsed : SEED_PRODUCTS
}

export function ProductProvider({ children }) {
    const [products, setProducts] = useState(() => getStoredProducts())

    useEffect(() => {
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products))
    }, [products])

    const addProduct = (product) => {
        const newProduct = { ...product, id: Date.now() }
        setProducts(prev => [...prev, newProduct])
        return newProduct
    }

    const updateProduct = (id, updates) => {
        setProducts(prev =>
            prev.map(p => (p.id === id ? { ...p, ...updates } : p))
        )
    }

    const deleteProduct = (id) => {
        setProducts(prev => prev.filter(p => p.id !== id))
    }

    return (
        <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct }}>
            {children}
        </ProductContext.Provider>
    )
}

export function useProducts() {
    const ctx = useContext(ProductContext)
    if (!ctx) throw new Error('useProducts must be used within ProductProvider')
    return ctx
}
