// Cart Logic

const cartKey = 'cart';

function getCart() {
    return JSON.parse(localStorage.getItem(cartKey)) || [];
}

function saveCart(cart) {
    localStorage.setItem(cartKey, JSON.stringify(cart));
}

function addToCart(productId) {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
        alert('Please login to add items to cart.');
        window.location.href = 'login.html';
        return;
    }

    let cart = getCart();
    const existingItem = cart.find(item => item.productId === productId);

    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({ productId, qty: 1 });
    }

    saveCart(cart);
    alert('Product added to cart!');
}

function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.productId !== productId);
    saveCart(cart);
    renderCart();
}

function renderCart() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalElement = document.getElementById('cartTotal');

    if (!cartItemsContainer) return;

    const cart = getCart();
    const products = JSON.parse(localStorage.getItem('products')) || [];

    cartItemsContainer.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        cartTotalElement.innerText = '$0';
        return;
    }

    cart.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
            const itemTotal = product.price * item.qty;
            total += itemTotal;

            const itemElement = document.createElement('div');
            itemElement.className = 'card mb-3';
            itemElement.innerHTML = `
                <div class="row g-0">
                    <div class="col-md-2">
                        <img src="${product.image || 'https://via.placeholder.com/100'}" class="img-fluid rounded-start" alt="${product.name}" style="height: 100px; object-fit: cover;">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text">Price: $${product.price} | Qty: ${item.qty}</p>
                            <p class="card-text"><small class="text-muted">Subtotal: $${itemTotal}</small></p>
                        </div>
                    </div>
                    <div class="col-md-2 d-flex align-items-center justify-content-center">
                        <button class="btn btn-danger btn-sm removeCartBtn" data-id="${product.id}">
                            <i class="material-icons">delete</i>
                        </button>
                    </div>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
        }
    });

    cartTotalElement.innerText = '$' + total.toFixed(2);

    // Event Listeners
    document.querySelectorAll('.removeCartBtn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Find the button element even if icon is clicked
            const button = e.target.closest('button');
            const id = parseInt(button.getAttribute('data-id'));
            removeFromCart(id);
        });
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('cartItems')) {
        // Check auth
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (!user) {
            window.location.href = 'login.html';
            return;
        }
        renderCart();
    }
});
