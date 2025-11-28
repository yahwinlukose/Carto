# Carto Documentation

## Purpose
Carto is a simple e-commerce website featuring a dark theme, product management, and cart functionality, built with vanilla JavaScript and Bootstrap 5.

## Pages Description
1.  **index.html**: Home page with a welcome message and link to shop.
2.  **login.html**: User login form.
3.  **register.html**: User registration form.
4.  **products.html**: Displays a grid of products. Admins (logged-in users) can see Edit/Delete buttons.
5.  **add-product.html**: Form to add a new product (requires login).
6.  **edit-product.html**: Form to edit an existing product (requires login).
7.  **cart.html**: Shows items in the cart with total price and remove option.

## LocalStorage Usage
Data is persisted using the browser's LocalStorage:
-   `users`: Array of user objects `{ name, email, password, role }`.
-   `products`: Array of product objects `{ id, name, price, desc, image }`.
-   `cart`: Array of cart items `{ productId, qty }`.
-   `currentUser`: Object storing the currently logged-in user.

## CRUD Explanation
-   **Create**: `addProduct` function adds a new object to the `products` array.
-   **Read**: `renderProducts` reads from the `products` array and displays cards.
-   **Update**: `updateProduct` finds a product by ID and updates its properties.
-   **Delete**: `deleteProduct` filters out the product with the specified ID.

## Bootstrap Features Used
-   **Navbar**: Responsive navigation bar.
-   **Cards**: For displaying products and forms.
-   **Grid System**: `row` and `col-*` classes for layout.
-   **Forms**: Styled inputs and buttons.
-   **Utilities**: Spacing (`m-`, `p-`), Text (`text-center`, `text-muted`), Flexbox (`d-flex`).

## Material Components Used
-   **Material Icons**: Used for "Add", "Edit", "Delete" icons in buttons.
