
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const TOKEN_KEY = 'shopease_token'
const USER_KEY = 'shopease_user'

// Save authentication details for the current browser session.
export function saveAuth(data) {
  sessionStorage.setItem(TOKEN_KEY, data.token)
  sessionStorage.setItem(USER_KEY, JSON.stringify(data.user))
}

export function getToken() {
  return sessionStorage.getItem(TOKEN_KEY)
}

export function getCurrentUser() {
  const user = sessionStorage.getItem(USER_KEY)

  try {
    return user ? JSON.parse(user) : null
  } catch {
    return null
  }
}

export function logout() {
  sessionStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(USER_KEY)
}

// Reusable API request function.
async function request(path, options = {}) {
  const token = getToken()

  const headers = {
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong')
  }

  return data
}

// Existing product listing function.
export async function getProducts() {
  return request('/products')
}

// Existing demo checkout function.
export async function createOrder(payload) {
  return request('/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

// Register a new customer.
export async function registerUser(payload) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

// Log in an existing user.
export async function loginUser(payload) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

// Get the currently authenticated user's details.
export async function getMe() {
  return request('/auth/me')
}

/* Admin product management */

// Create a product
export async function createProduct(payload) {
  return request('/admin/products', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

// Update an existing product
export async function updateProduct(productId, payload) {
  return request(`/admin/products/${productId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

// Delete a product
export async function deleteProduct(productId) {
  return request(`/admin/products/${productId}`, {
    method: 'DELETE',
  })
}

// Get orders for the logged-in customer
export async function getMyOrders() {
  return request('/orders/my-orders')
}

// Get all orders (admin only)
export async function getAdminOrders() {
  return request('/admin/orders')
}

// Update an order's status (admin only)
export async function updateOrderStatus(orderId, status) {
  return request(`/admin/orders/${orderId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  })
}

// Get reviews for a product
export async function getProductReviews(productId) {
  return request(`/reviews/${productId}`)
}

// Submit a product review
export async function submitProductReview(productId, payload) {
  return request(`/reviews/${productId}`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function mockPayment(orderId, outcome) {
  return request(`/orders/${encodeURIComponent(orderId)}/mock-payment`, {
    method: 'PATCH',
    body: JSON.stringify({ outcome })
  })
}