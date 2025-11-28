// Products Logic

const productsKey = 'products';

function getProducts() {
    return JSON.parse(localStorage.getItem(productsKey)) || [];
}

function saveProducts(products) {
    localStorage.setItem(productsKey, JSON.stringify(products));
}

function seedProducts() {
    const sampleProducts = [
        { id: 1, name: "Cool Shirt", price: 29.99, desc: "A very cool shirt.", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500" },
        { id: 2, name: "Denim Jeans", price: 49.99, desc: "Comfortable jeans.", image: "https://images.unsplash.com/photo-1542272617-08f086302436?w=500" },
        { id: 3, name: "Running Shoes", price: 89.99, desc: "Fast shoes.", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500" },
        { id: 4, name: "Leather Jacket", price: 120.00, desc: "Stylish jacket.", image: "https://images.unsplash.com/photo-1551028919-ac76c9085b67?w=500" }
    ];
    saveProducts(sampleProducts);
}

function renderProducts() {
    const productsList = document.getElementById('productsList');
    if (!productsList) return;

    let products = getProducts();

    if (products.length === 0) {
        seedProducts();
        products = getProducts();
    }

    productsList.innerHTML = '';

    if (products.length === 0) {
        productsList.innerHTML = '<p class="text-center">No products found.</p>';
        return;
    }

    const user = JSON.parse(localStorage.getItem('currentUser'));
    const isAdmin = !!user; // Simplified: any logged in user can edit/delete for now as per instructions

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'col-md-4 mb-4';
        card.innerHTML = `
            <div class="card h-100">
                <img src="${product.image || 'https://via.placeholder.com/300'}" class="card-img-top" alt="${product.name}" style="height: 200px; object-fit: cover;">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">${product.desc}</p>
                    <p class="card-text fw-bold">$${product.price}</p>
                    <button class="btn btn-primary btn-sm addToCartBtn" data-id="${product.id}">Add to Cart</button>
                    ${isAdmin ? `
                        <div class="mt-2">
                            <a href="edit-product.html?id=${product.id}" class="btn btn-warning btn-sm">Edit</a>
                            <button class="btn btn-danger btn-sm deleteProductBtn" data-id="${product.id}">Delete</button>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
        productsList.appendChild(card);
    });

    // Add Event Listeners for dynamic buttons
    document.querySelectorAll('.deleteProductBtn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            deleteProduct(id);
        });
    });

    document.querySelectorAll('.addToCartBtn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            addToCart(id); // Defined in cart.js
        });
    });
}

function addProduct(name, price, desc, image) {
    const products = getProducts();
    const newProduct = {
        id: Date.now(), // Simple ID generation
        name,
        price: parseFloat(price),
        desc,
        image
    };
    products.push(newProduct);
    saveProducts(products);
    alert('Product added successfully!');
    window.location.href = 'products.html';
}

function updateProduct(id, name, price, desc, image) {
    const products = getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
        products[index] = { ...products[index], name, price: parseFloat(price), desc, image };
        saveProducts(products);
        alert('Product updated successfully!');
        window.location.href = 'products.html';
    } else {
        alert('Product not found!');
    }
}

function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        let products = getProducts();
        products = products.filter(p => p.id !== id);
        saveProducts(products);
        renderProducts(); // Re-render
    }
}

function loadProductForEdit() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = parseInt(urlParams.get('id'));

    if (!id) return;

    const products = getProducts();
    const product = products.find(p => p.id === id);

    if (product) {
        document.getElementById('productId').value = product.id;
        document.getElementById('name').value = product.name;
        document.getElementById('price').value = product.price;
        document.getElementById('desc').value = product.desc;
        document.getElementById('image').value = product.image;
    } else {
        alert('Product not found!');
        window.location.href = 'products.html';
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Check if on products page
    if (document.getElementById('productsList')) {
        renderProducts();
    }

    // Check if on add product page
    const productForm = document.getElementById('productForm');
    if (productForm) {
        // Check auth
        if (!checkAuth()) {
            window.location.href = 'login.html';
            return;
        }

        productForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const price = document.getElementById('price').value;
            const desc = document.getElementById('desc').value;
            const image = document.getElementById('image').value;
            addProduct(name, price, desc, image);
        });
    }

    // Check if on edit product page
    const editProductForm = document.getElementById('editProductForm');
    if (editProductForm) {
        // Check auth
        if (!checkAuth()) {
            window.location.href = 'login.html';
            return;
        }

        loadProductForEdit();

        editProductForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = parseInt(document.getElementById('productId').value);
            const name = document.getElementById('name').value;
            const price = document.getElementById('price').value;
            const desc = document.getElementById('desc').value;
            const image = document.getElementById('image').value;
            updateProduct(id, name, price, desc, image);
        });
    }
});
