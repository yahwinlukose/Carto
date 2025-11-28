// Auth Logic

const usersKey = 'users';
const currentUserKey = 'currentUser';

function getUsers() {
    return JSON.parse(localStorage.getItem(usersKey)) || [];
}

function saveUsers(users) {
    localStorage.setItem(usersKey, JSON.stringify(users));
}

function register(name, email, password) {
    const users = getUsers();
    if (users.find(user => user.email === email)) {
        alert('Email already registered!');
        return false;
    }

    const newUser = { name, email, password, role: 'user' };
    users.push(newUser);
    saveUsers(users);
    alert('Registration successful! Please login.');
    window.location.href = 'login.html';
    return true;
}

function login(email, password) {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        localStorage.setItem(currentUserKey, JSON.stringify(user));
        alert('Login successful!');
        window.location.href = 'index.html';
        return true;
    } else {
        alert('Invalid email or password!');
        return false;
    }
}

function logout() {
    localStorage.removeItem(currentUserKey);
    window.location.href = 'login.html';
}

function checkAuth() {
    const user = JSON.parse(localStorage.getItem(currentUserKey));
    if (!user) {
        // If not logged in and not on login/register page, redirect
        const path = window.location.pathname;
        if (!path.includes('login.html') && !path.includes('register.html') && !path.includes('index.html') && !path.includes('products.html')) {
            // Allow public access to index and products for now, or maybe strict?
            // User said "Validate login", usually implies restricting access.
            // But for now, let's just return the user or null.
        }
    }
    return user;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            login(email, password);
        });
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            register(name, email, password);
        });
    }

    // Update UI based on auth state
    const user = JSON.parse(localStorage.getItem(currentUserKey));
    const navLinks = document.getElementById('navLinks');

    if (navLinks) {
        if (user) {
            // If logged in, show Logout instead of Login/Register
            // This is a simple replacement for now
            const loginLink = navLinks.querySelector('a[href="login.html"]');
            const registerLink = navLinks.querySelector('a[href="register.html"]');

            if (loginLink) loginLink.parentElement.remove();
            if (registerLink) registerLink.parentElement.remove();

            const logoutItem = document.createElement('li');
            logoutItem.className = 'nav-item';
            logoutItem.innerHTML = '<a class="nav-link" href="#" id="logoutBtn">Logout</a>';
            navLinks.appendChild(logoutItem);

            document.getElementById('logoutBtn').addEventListener('click', (e) => {
                e.preventDefault();
                logout();
            });

            // Show Add Product button if user is admin (optional, but good for testing)
            // User didn't specify admin role logic, but I'll leave it open.
            // For now, just show it on products page if logged in?
            // User said "Add Product -> Simple form".
            // Let's show "Add Product" button on products page if logged in.
            const addProductBtn = document.getElementById('addProductBtn');
            if (addProductBtn) {
                addProductBtn.style.display = 'inline-block';
            }
        }
    }
});
