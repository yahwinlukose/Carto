import { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

const USERS_KEY = 'carto_users'
const CURRENT_USER_KEY = 'carto_currentUser'

const DEFAULT_ADMIN = {
    id: 'admin-001',
    name: 'Admin',
    email: 'admin@carto.com',
    password: 'admin123',
    role: 'admin',
    createdAt: new Date().toISOString()
}

function getStoredUsers() {
    const raw = localStorage.getItem(USERS_KEY)
    if (!raw) {
        localStorage.setItem(USERS_KEY, JSON.stringify([DEFAULT_ADMIN]))
        return [DEFAULT_ADMIN]
    }
    const users = JSON.parse(raw)
    if (!users.find(u => u.email === DEFAULT_ADMIN.email)) {
        users.push(DEFAULT_ADMIN)
        localStorage.setItem(USERS_KEY, JSON.stringify(users))
    }
    return users
}

export function AuthProvider({ children }) {
    const [users, setUsers] = useState(() => getStoredUsers())
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem(CURRENT_USER_KEY)
        return stored ? JSON.parse(stored) : null
    })

    useEffect(() => {
        localStorage.setItem(USERS_KEY, JSON.stringify(users))
    }, [users])

    useEffect(() => {
        if (user) {
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
        } else {
            localStorage.removeItem(CURRENT_USER_KEY)
        }
    }, [user])

    const login = (email, password) => {
        const found = users.find(u => u.email === email && u.password === password)
        if (found) {
            setUser(found)
            toast.success(`Welcome back, ${found.name}!`)
            return { success: true, user: found }
        }
        toast.error('Invalid email or password')
        return { success: false }
    }

    const register = (name, email, password, role = 'user') => {
        if (users.find(u => u.email === email)) {
            toast.error('Email already registered!')
            return { success: false }
        }
        const newUser = {
            id: `user-${Date.now()}`,
            name,
            email,
            password,
            role,
            createdAt: new Date().toISOString()
        }
        setUsers(prev => [...prev, newUser])
        toast.success('Account created! Please log in.')
        return { success: true }
    }

    const logout = () => {
        setUser(null)
        toast.success('Logged out successfully')
    }

    const isAdmin = user?.role === 'admin'

    return (
        <AuthContext.Provider value={{ user, users, login, register, logout, isAdmin }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}
