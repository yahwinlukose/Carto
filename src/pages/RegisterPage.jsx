import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, User, UserPlus, Shield } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('user')
    const [loading, setLoading] = useState(false)
    const { register } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (password.length < 4) {
            return
        }
        setLoading(true)
        await new Promise(r => setTimeout(r, 500))
        const result = register(name, email, password, role)
        setLoading(false)
        if (result.success) {
            navigate('/login')
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
                        <UserPlus size={24} />
                    </div>
                    <h1 style={styles.title}>Create Account</h1>
                    <p style={styles.subtitle}>Join Carto and start shopping</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label><User size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />Full Name</label>
                        <input
                            className="input-field"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Doe"
                            required
                        />
                    </div>
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
                            placeholder="Min. 4 characters"
                            minLength={4}
                            required
                        />
                    </div>

                    {/* Role Selection */}
                    <div className="input-group">
                        <label><Shield size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />Account Type</label>
                        <div className="role-toggle">
                            <button
                                type="button"
                                className={role === 'user' ? 'active' : ''}
                                onClick={() => setRole('user')}
                            >
                                <User size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                                Customer
                            </button>
                            <button
                                type="button"
                                className={role === 'admin' ? 'active' : ''}
                                onClick={() => setRole('admin')}
                            >
                                <Shield size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                                Admin
                            </button>
                        </div>
                        <p style={styles.roleHint}>
                            {role === 'admin'
                                ? 'Admins can add, edit, and delete products.'
                                : 'Customers can browse and purchase products.'}
                        </p>
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
                            <>Create Account <UserPlus size={16} /></>
                        )}
                    </motion.button>
                </form>

                <p style={styles.bottomText}>
                    Already have an account?{' '}
                    <Link to="/login" style={styles.link}>Sign in</Link>
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
        background: 'rgba(6, 214, 160, 0.12)',
        color: '#06d6a0',
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
    roleHint: {
        fontSize: '0.78rem',
        color: '#6b6b80',
        marginTop: 8,
        fontStyle: 'italic',
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
