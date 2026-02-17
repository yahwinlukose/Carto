import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Particles({ count = 200 }) {
    const mesh = useRef()
    const light = useRef()

    const particles = useMemo(() => {
        const positions = new Float32Array(count * 3)
        const colors = new Float32Array(count * 3)
        const sizes = new Float32Array(count)

        const purple = new THREE.Color('#8b5cf6')
        const teal = new THREE.Color('#06d6a0')
        const blue = new THREE.Color('#3b82f6')
        const palette = [purple, teal, blue]

        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 20
            positions[i * 3 + 1] = (Math.random() - 0.5) * 20
            positions[i * 3 + 2] = (Math.random() - 0.5) * 20

            const color = palette[Math.floor(Math.random() * palette.length)]
            colors[i * 3] = color.r
            colors[i * 3 + 1] = color.g
            colors[i * 3 + 2] = color.b

            sizes[i] = Math.random() * 0.05 + 0.02
        }

        return { positions, colors, sizes }
    }, [count])

    useFrame((state) => {
        if (mesh.current) {
            mesh.current.rotation.y = state.clock.elapsedTime * 0.02
            mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1
        }
    })

    return (
        <group ref={mesh}>
            <points>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={particles.positions.length / 3}
                        array={particles.positions}
                        itemSize={3}
                    />
                    <bufferAttribute
                        attach="attributes-color"
                        count={particles.colors.length / 3}
                        array={particles.colors}
                        itemSize={3}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={0.06}
                    vertexColors
                    transparent
                    opacity={0.6}
                    sizeAttenuation
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </points>
        </group>
    )
}

function FloatingGeometry() {
    const groupRef = useRef()

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = state.clock.elapsedTime * 0.05
            groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.03) * 0.1
        }
    })

    return (
        <group ref={groupRef}>
            {/* Wireframe torus */}
            <mesh position={[3, 2, -5]} rotation={[0.5, 0, 0]}>
                <torusGeometry args={[1.2, 0.3, 16, 50]} />
                <meshBasicMaterial color="#8b5cf6" wireframe opacity={0.12} transparent />
            </mesh>

            {/* Wireframe icosahedron */}
            <mesh position={[-4, -1, -6]}>
                <icosahedronGeometry args={[1.5, 1]} />
                <meshBasicMaterial color="#06d6a0" wireframe opacity={0.08} transparent />
            </mesh>

            {/* Wireframe octahedron */}
            <mesh position={[0, -3, -4]}>
                <octahedronGeometry args={[0.8]} />
                <meshBasicMaterial color="#3b82f6" wireframe opacity={0.1} transparent />
            </mesh>
        </group>
    )
}

export default function ParticleBackground() {
    return (
        <div style={styles.container}>
            <Canvas
                camera={{ position: [0, 0, 8], fov: 60 }}
                gl={{ antialias: true, alpha: true }}
                style={{ background: 'transparent' }}
            >
                <ambientLight intensity={0.5} />
                <Particles count={150} />
                <FloatingGeometry />
            </Canvas>
        </div>
    )
}

const styles = {
    container: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.7,
    },
}
