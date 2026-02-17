import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, LogIn } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        // Simulate network delay for UX
        await new Promise(r => setTimeout(r, 500))
        const result = login(email, password)
        setLoading(false)
        if (result.success) {
            navigate(result.user.role === 'admin' ? '/admin' : '/')
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={styles.page}
        >
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                style={styles.card}
            >
                {/* Header */}
                <div style={styles.header}>
                    <div style={styles.iconWrapper}>
                        <LogIn size={24} />
                    </div>
                    <h1 style={styles.title}>Welcome Back</h1>
                    <p style={styles.subtitle}>Sign in to your Carto account</p>
                </div>

                {/* Demo Credentials */}
                <div style={styles.demoBox}>
                    <p style={styles.demoTitle}>Demo Admin Account</p>
                    <p style={styles.demoText}>admin@carto.com / admin123</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label><Mail size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />Email</label>
                        <input
                            className="input-field"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label><Lock size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />Password</label>
                        <input
                            className="input-field"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="btn btn-primary"
                        style={styles.submitBtn}
                        disabled={loading}
                    >
                        {loading ? (
                            <span style={styles.spinner} />
                        ) : (
                            <>Sign In <LogIn size={16} /></>
                        )}
                    </motion.button>
                </form>

                <p style={styles.bottomText}>
                    Don't have an account?{' '}
                    <Link to="/register" style={styles.link}>Create one</Link>
                </p>
            </motion.div>
        </motion.div>
    )
}

const styles = {
    page: {
        minHeight: 'calc(100vh - var(--nav-height))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
    },
    card: {
        width: '100%',
        maxWidth: 420,
        background: 'rgba(18, 18, 26, 0.8)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(139, 92, 246, 0.15)',
        borderRadius: 20,
        padding: 36,
        boxShadow: '0 8px 40px rgba(0, 0, 0, 0.4), 0 0 60px rgba(139, 92, 246, 0.08)',
    },
    header: {
        textAlign: 'center',
        marginBottom: 28,
    },
    iconWrapper: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 56,
        height: 56,
        borderRadius: 16,
        background: 'rgba(139, 92, 246, 0.12)',
        color: '#a78bfa',
        marginBottom: 16,
    },
    title: {
        fontFamily: "'Outfit', sans-serif",
        fontSize: '1.8rem',
        fontWeight: 700,
        color: '#f0f0f5',
        marginBottom: 6,
    },
    subtitle: {
        fontSize: '0.9rem',
        color: '#a0a0b5',
    },
    demoBox: {
        background: 'rgba(139, 92, 246, 0.08)',
        border: '1px solid rgba(139, 92, 246, 0.2)',
        borderRadius: 12,
        padding: '12px 16px',
        marginBottom: 24,
        textAlign: 'center',
    },
    demoTitle: {
        fontSize: '0.75rem',
        fontWeight: 600,
        color: '#a78bfa',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: 4,
    },
    demoText: {
        fontSize: '0.85rem',
        color: '#a0a0b5',
        fontFamily: 'monospace',
    },
    submitBtn: {
        width: '100%',
        padding: '14px',
        fontSize: '1rem',
        marginTop: 4,
    },
    spinner: {
        display: 'inline-block',
        width: 20,
        height: 20,
        border: '2px solid rgba(255,255,255,0.3)',
        borderTop: '2px solid #fff',
        borderRadius: '50%',
        animation: 'spin 0.6s linear infinite',
    },
    bottomText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: '0.9rem',
        color: '#a0a0b5',
    },
    link: {
        color: '#a78bfa',
        fontWeight: 600,
    },
}

// Spinner keyframe
const spinCSS = document.createElement('style')
spinCSS.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`
if (typeof document !== 'undefined') document.head.appendChild(spinCSS)
