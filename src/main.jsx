import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { ProductProvider } from './context/ProductContext'
import { CartProvider } from './context/CartContext'
import { Toaster } from 'react-hot-toast'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <ProductProvider>
                    <CartProvider>
                        <App />
                        <Toaster
                            position="bottom-right"
                            toastOptions={{
                                style: {
                                    background: 'rgba(30, 30, 40, 0.95)',
                                    color: '#e0e0e0',
                                    border: '1px solid rgba(139, 92, 246, 0.3)',
                                    backdropFilter: 'blur(10px)',
                                    borderRadius: '12px',
                                    fontFamily: 'Inter, sans-serif',
                                },
                                success: {
                                    iconTheme: { primary: '#10b981', secondary: '#1e1e28' },
                                },
                                error: {
                                    iconTheme: { primary: '#ef4444', secondary: '#1e1e28' },
                                },
                            }}
                        />
                    </CartProvider>
                </ProductProvider>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
)
