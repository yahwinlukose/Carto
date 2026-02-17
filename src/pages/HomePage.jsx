import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial } from '@react-three/drei'
import { ArrowRight, Sparkles, Shield, ShoppingBag } from 'lucide-react'
import gsap from 'gsap'
import { useProducts } from '../context/ProductContext'
import ProductCard from '../components/ProductCard'

function HeroSphere() {
    const meshRef = useRef()

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.elapsedTime * 0.15
            meshRef.current.rotation.y = state.clock.elapsedTime * 0.2
        }
    })

    return (
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
            <mesh ref={meshRef} scale={2.2}>
                <torusKnotGeometry args={[1, 0.35, 128, 32]} />
                <MeshDistortMaterial
                    color="#8b5cf6"
                    roughness={0.2}
                    metalness={0.8}
                    distort={0.25}
                    speed={2}
                    wireframe
                />
            </mesh>
        </Float>
    )
}

function HeroGlowSphere() {
    return (
        <Float speed={2} rotationIntensity={0.3} floatIntensity={0.8}>
            <mesh position={[-3, 1, -2]} scale={0.8}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshBasicMaterial color="#06d6a0" wireframe opacity={0.15} transparent />
            </mesh>
        </Float>
    )
}

export default function HomePage() {
    const { products } = useProducts()
    const heroTextRef = useRef(null)
    const featuresRef = useRef(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo('.hero-title',
                { opacity: 0, y: 60 },
                { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.3 }
            )
            gsap.fromTo('.hero-subtitle',
                { opacity: 0, y: 40 },
                { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.6 }
            )
            gsap.fromTo('.hero-cta',
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.9 }
            )
            gsap.fromTo('.feature-card',
                { opacity: 0, y: 40 },
                {
                    opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'power3.out', delay: 1.2,
                    scrollTrigger: featuresRef.current
                }
            )
        })
        return () => ctx.revert()
    }, [])

    const featured = products.slice(0, 3)

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
        >
            {/* Hero Section */}
            <section style={styles.hero}>
                {/* 3D Scene */}
                <div style={styles.heroCanvas}>
                    <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
                        <ambientLight intensity={0.4} />
                        <directionalLight position={[5, 5, 5]} intensity={1} />
                        <pointLight position={[-5, -5, 5]} intensity={0.5} color="#06d6a0" />
                        <HeroSphere />
                        <HeroGlowSphere />
                    </Canvas>
                </div>

                {/* Hero Content */}
                <div ref={heroTextRef} style={styles.heroContent}>
                    <div style={styles.heroTag}>
                        <Sparkles size={14} />
                        Premium E-Commerce Experience
                    </div>
                    <h1 className="hero-title" style={styles.heroTitle}>
                        Discover the{' '}
                        <span style={styles.heroGradient}>Future</span>{' '}
                        of Shopping
                    </h1>
                    <p className="hero-subtitle" style={styles.heroSubtitle}>
                        Curated collections with an immersive experience. Explore premium products
                        crafted for the modern lifestyle.
                    </p>
                    <div className="hero-cta" style={styles.heroActions}>
                        <Link to="/products" className="btn btn-primary" style={{ fontSize: '1rem', padding: '14px 32px' }}>
                            Explore Collection <ArrowRight size={18} />
                        </Link>
                        <Link to="/register" className="btn btn-secondary" style={{ fontSize: '1rem', padding: '14px 32px' }}>
                            Get Started
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section ref={featuresRef} style={styles.features}>
                <div className="container">
                    <div style={styles.featureGrid}>
                        {[
                            { icon: <ShoppingBag size={28} />, title: 'Curated Products', desc: 'Hand-picked selection of premium items for every style and occasion.' },
                            { icon: <Shield size={28} />, title: 'Secure Shopping', desc: 'Your data is safe with role-based access and secure authentication.' },
                            { icon: <Sparkles size={28} />, title: 'Premium Experience', desc: 'Immersive 3D visuals, smooth animations, and intuitive navigation.' },
                        ].map((f, i) => (
                            <div key={i} className="feature-card glass-card" style={styles.featureCard}>
                                <div style={styles.featureIcon}>{f.icon}</div>
                                <h3 style={styles.featureTitle}>{f.title}</h3>
                                <p style={styles.featureDesc}>{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section style={styles.featuredSection}>
                <div className="container">
                    <div style={styles.sectionHeader}>
                        <div>
                            <h2 className="section-title">Featured Products</h2>
                            <p className="section-subtitle">Our most popular picks this season</p>
                        </div>
                        <Link to="/products" className="btn btn-secondary btn-sm">
                            View All <ArrowRight size={14} />
                        </Link>
                    </div>
                    <div className="grid grid-3">
                        {featured.map((product, i) => (
                            <ProductCard key={product.id} product={product} index={i} />
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section style={styles.ctaSection}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 style={styles.ctaTitle}>Ready to Start?</h2>
                        <p style={styles.ctaSubtitle}>
                            Create an account and unlock the full shopping experience.
                        </p>
                        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 32 }}>
                            <Link to="/register" className="btn btn-primary" style={{ padding: '14px 36px', fontSize: '1rem' }}>
                                Create Account
                            </Link>
                            <Link to="/products" className="btn btn-secondary" style={{ padding: '14px 36px', fontSize: '1rem' }}>
                                Browse Products
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </motion.div>
    )
}

const styles = {
    hero: {
        position: 'relative',
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
    },
    heroCanvas: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: '55%',
        height: '100%',
        opacity: 0.8,
    },
    heroContent: {
        position: 'relative',
        zIndex: 2,
        maxWidth: 1200,
        margin: '0 auto',
        padding: '0 24px',
        width: '100%',
    },
    heroTag: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 16px',
        background: 'rgba(139, 92, 246, 0.15)',
        border: '1px solid rgba(139, 92, 246, 0.25)',
        borderRadius: 20,
        fontSize: '0.8rem',
        fontWeight: 600,
        color: '#a78bfa',
        marginBottom: 24,
        letterSpacing: '0.03em',
    },
    heroTitle: {
        fontFamily: "'Outfit', sans-serif",
        fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
        fontWeight: 800,
        lineHeight: 1.1,
        color: '#f0f0f5',
        marginBottom: 20,
        maxWidth: 600,
    },
    heroGradient: {
        background: 'linear-gradient(135deg, #8b5cf6 0%, #06d6a0 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
    },
    heroSubtitle: {
        fontSize: '1.15rem',
        color: '#a0a0b5',
        maxWidth: 480,
        lineHeight: 1.7,
        marginBottom: 32,
    },
    heroActions: {
        display: 'flex',
        gap: 12,
        flexWrap: 'wrap',
    },
    features: {
        padding: '80px 0',
    },
    featureGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 24,
    },
    featureCard: {
        padding: 32,
        textAlign: 'center',
    },
    featureIcon: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 56,
        height: 56,
        borderRadius: 14,
        background: 'rgba(139, 92, 246, 0.12)',
        color: '#a78bfa',
        marginBottom: 16,
    },
    featureTitle: {
        fontFamily: "'Outfit', sans-serif",
        fontSize: '1.2rem',
        fontWeight: 600,
        color: '#f0f0f5',
        marginBottom: 8,
    },
    featureDesc: {
        fontSize: '0.9rem',
        color: '#a0a0b5',
        lineHeight: 1.6,
    },
    featuredSection: {
        padding: '40px 0 80px',
    },
    sectionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 40,
        flexWrap: 'wrap',
        gap: 16,
    },
    ctaSection: {
        padding: '80px 0 100px',
    },
    ctaTitle: {
        fontFamily: "'Outfit', sans-serif",
        fontSize: '2.5rem',
        fontWeight: 700,
        color: '#f0f0f5',
        marginBottom: 12,
    },
    ctaSubtitle: {
        fontSize: '1.1rem',
        color: '#a0a0b5',
        maxWidth: 400,
        margin: '0 auto',
    },
}

// Responsive CSS
const responsiveCSS = document.createElement('style')
responsiveCSS.textContent = `
  @media (max-width: 768px) {
    section[style*="heroCanvas"] > div:first-child { display: none; }
  }
`
if (typeof document !== 'undefined') document.head.appendChild(responsiveCSS)
