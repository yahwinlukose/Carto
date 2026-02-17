import { Heart } from 'lucide-react'

export default function Footer() {
    return (
        <footer style={styles.footer}>
            <div style={styles.inner}>
                <div style={styles.brand}>
                    <span style={styles.logo}>Carto</span>
                    <p style={styles.tagline}>Premium shopping experience</p>
                </div>
                <div style={styles.right}>
                    <p style={styles.copy}>
                        Made with <Heart size={14} style={{ color: '#ef4444', verticalAlign: 'middle' }} fill="#ef4444" /> for modern shoppers
                    </p>
                    <p style={styles.year}>© {new Date().getFullYear()} Carto. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

const styles = {
    footer: {
        position: 'relative',
        zIndex: 1,
        borderTop: '1px solid rgba(139, 92, 246, 0.1)',
        background: 'rgba(10, 10, 15, 0.8)',
        backdropFilter: 'blur(10px)',
        padding: '32px 0',
    },
    inner: {
        maxWidth: 1200,
        margin: '0 auto',
        padding: '0 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16,
    },
    brand: {},
    logo: {
        fontFamily: "'Outfit', sans-serif",
        fontSize: '1.3rem',
        fontWeight: 700,
        background: 'linear-gradient(135deg, #8b5cf6, #06d6a0)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
    },
    tagline: {
        fontSize: '0.8rem',
        color: '#6b6b80',
        marginTop: 4,
    },
    right: { textAlign: 'right' },
    copy: {
        fontSize: '0.85rem',
        color: '#a0a0b5',
    },
    year: {
        fontSize: '0.75rem',
        color: '#6b6b80',
        marginTop: 4,
    },
}
