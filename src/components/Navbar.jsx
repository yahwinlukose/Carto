import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Menu, X, Shield, LogOut, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import gsap from 'gsap'

const NAV_LINKS = [
    { path: '/', label: 'Home' },
    { path: '/products', label: 'Products' },
]

export default function Navbar() {
    const { user, logout, isAdmin } = useAuth()
    const { cartCount } = useCart()
    const location = useLocation()
    const [mobileOpen, setMobileOpen] = useState(false)
    const logoRef = useRef(null)
    const navRef = useRef(null)

    useEffect(() => {
        gsap.fromTo(navRef.current,
            { y: -80, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.2 }
        )
        gsap.fromTo(logoRef.current,
            { scale: 0.5, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)', delay: 0.5 }
        )
    }, [])

    useEffect(() => {
        setMobileOpen(false)
    }, [location.pathname])

    return (
        <nav ref={navRef} style={styles.nav}>
            <div style={styles.inner}>
                {/* Logo */}
                <Link to="/" style={styles.logoLink}>
                    <span ref={logoRef} style={styles.logo}>Carto</span>
                </Link>

                {/* Desktop Links */}
                <div style={styles.desktopLinks}>
                    {NAV_LINKS.map(link => (
                        <Link
                            key={link.path}
                            to={link.path}
                            style={{
                                ...styles.link,
                                ...(location.pathname === link.path ? styles.linkActive : {})
                            }}
                        >
                            {link.label}
                            {location.pathname === link.path && (
                                <motion.div
                                    layoutId="nav-underline"
                                    style={styles.underline}
                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                />
                            )}
                        </Link>
                    ))}

                    {isAdmin && (
                        <Link
                            to="/admin"
                            style={{
                                ...styles.link,
                                ...styles.adminLink,
                                ...(location.pathname === '/admin' ? styles.linkActive : {})
                            }}
                        >
                            <Shield size={16} />
                            Admin
                        </Link>
                    )}
                </div>

                {/* Right Section */}
                <div style={styles.rightSection}>
                    {user && (
                        <Link to="/cart" style={styles.cartBtn}>
                            <ShoppingCart size={20} />
                            {cartCount > 0 && (
                                <motion.span
                                    key={cartCount}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    style={styles.cartBadge}
                                >
                                    {cartCount}
                                </motion.span>
                            )}
                        </Link>
                    )}

                    {user ? (
                        <div style={styles.userSection}>
                            <span style={styles.userName}>
                                <User size={14} />
                                {user.name}
                                {isAdmin && <span style={styles.adminBadge}>Admin</span>}
                            </span>
                            <button onClick={logout} style={styles.logoutBtn}>
                                <LogOut size={16} />
                            </button>
                        </div>
                    ) : (
                        <div style={styles.authLinks}>
                            <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
                            <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
                        </div>
                    )}

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        style={styles.mobileToggle}
                    >
                        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={styles.mobileMenu}
                    >
                        {NAV_LINKS.map(link => (
                            <Link
                                key={link.path}
                                to={link.path}
                                style={{
                                    ...styles.mobileLink,
                                    ...(location.pathname === link.path ? styles.mobileLinkActive : {})
                                }}
                            >
                                {link.label}
                            </Link>
                        ))}
                        {isAdmin && (
                            <Link to="/admin" style={{ ...styles.mobileLink, ...styles.adminLink }}>
                                <Shield size={16} /> Admin Dashboard
                            </Link>
                        )}
                        {user ? (
                            <>
                                <Link to="/cart" style={styles.mobileLink}>
                                    Cart {cartCount > 0 && `(${cartCount})`}
                                </Link>
                                <button onClick={logout} style={{ ...styles.mobileLink, background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', width: '100%' }}>
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" style={styles.mobileLink}>Login</Link>
                                <Link to="/register" style={styles.mobileLink}>Sign Up</Link>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}

const styles = {
    nav: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: 'rgba(10, 10, 15, 0.8)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(139, 92, 246, 0.1)',
        height: 'var(--nav-height)',
    },
    inner: {
        maxWidth: 1200,
        margin: '0 auto',
        padding: '0 24px',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    logoLink: {
        textDecoration: 'none',
    },
    logo: {
        fontFamily: "'Outfit', sans-serif",
        fontSize: '1.8rem',
        fontWeight: 800,
        background: 'linear-gradient(135deg, #8b5cf6 0%, #06d6a0 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        display: 'inline-block',
    },
    desktopLinks: {
        display: 'flex',
        gap: 8,
        alignItems: 'center',
    },
    link: {
        position: 'relative',
        padding: '8px 16px',
        color: '#a0a0b5',
        textDecoration: 'none',
        fontSize: '0.9rem',
        fontWeight: 500,
        borderRadius: 8,
        transition: 'color 0.3s',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
    },
    linkActive: {
        color: '#f0f0f5',
    },
    underline: {
        position: 'absolute',
        bottom: 0,
        left: '20%',
        right: '20%',
        height: 2,
        background: 'linear-gradient(90deg, #8b5cf6, #06d6a0)',
        borderRadius: 1,
    },
    adminLink: {
        color: '#a78bfa',
    },
    rightSection: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
    },
    cartBtn: {
        position: 'relative',
        padding: 8,
        color: '#a0a0b5',
        textDecoration: 'none',
        borderRadius: 10,
        transition: 'all 0.3s',
        display: 'flex',
        alignItems: 'center',
    },
    cartBadge: {
        position: 'absolute',
        top: 0,
        right: 0,
        background: '#8b5cf6',
        color: '#fff',
        fontSize: '0.65rem',
        fontWeight: 700,
        width: 18,
        height: 18,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    userSection: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
    },
    userName: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        fontSize: '0.85rem',
        color: '#a0a0b5',
        padding: '6px 12px',
        background: 'rgba(255,255,255,0.04)',
        borderRadius: 8,
    },
    adminBadge: {
        fontSize: '0.65rem',
        fontWeight: 700,
        padding: '2px 6px',
        background: 'rgba(139, 92, 246, 0.2)',
        color: '#a78bfa',
        borderRadius: 4,
        marginLeft: 4,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
    },
    logoutBtn: {
        background: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid rgba(239, 68, 68, 0.2)',
        color: '#ef4444',
        padding: 8,
        borderRadius: 8,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        transition: 'all 0.3s',
    },
    authLinks: {
        display: 'flex',
        gap: 8,
        alignItems: 'center',
    },
    mobileToggle: {
        display: 'none',
        background: 'none',
        border: 'none',
        color: '#a0a0b5',
        padding: 4,
        cursor: 'pointer',
    },
    mobileMenu: {
        overflow: 'hidden',
        background: 'rgba(10, 10, 15, 0.95)',
        borderBottom: '1px solid rgba(139, 92, 246, 0.1)',
        padding: '8px 24px 16px',
    },
    mobileLink: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '12px 16px',
        color: '#a0a0b5',
        textDecoration: 'none',
        fontSize: '0.95rem',
        borderRadius: 8,
        transition: 'all 0.2s',
    },
    mobileLinkActive: {
        color: '#f0f0f5',
        background: 'rgba(139, 92, 246, 0.1)',
    },
}

// CSS for mobile toggle visibility
const mobileCSS = document.createElement('style')
mobileCSS.textContent = `
  @media (max-width: 768px) {
    nav > div:first-child > div:nth-child(2) { display: none !important; }
    nav button[style*="display: none"] { display: flex !important; }
  }
`
if (typeof document !== 'undefined') document.head.appendChild(mobileCSS)
