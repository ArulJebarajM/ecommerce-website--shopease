
import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  Package,
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  RefreshCw,
  ClipboardList,
  Truck,
} from 'lucide-react'

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAdminOrders,
  updateOrderStatus,
} from './api'

const emptyProduct = {
  name: '',
  category: 'Accessories',
  price: '',
  description: '',
  image: '',
  badge: '',
  stock: '',
}

const money = value =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)

  const getOrderStats = (orders) => {
  const activeOrders = orders.filter(
    order => order.status !== 'Cancelled'
  )

  const totalSales = activeOrders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  )

  return {
    totalSales,
    totalOrders: activeOrders.length,
  }
}

export default function AdminDashboard({ onBack, onLogout }) {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [ordersError, setOrdersError] = useState('')
  const [updatingOrderId, setUpdatingOrderId] = useState(null)
  const [form, setForm] = useState(emptyProduct)
  const [editingId, setEditingId] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const { totalSales, totalOrders } = getOrderStats(orders)

const lowStockProducts = products.filter(
  product => Number(product.stock ?? 0) <= 5
).length

  const loadProducts = async () => {
    setLoading(true)
    setError('')

    try {
      const data = await getProducts()
      setProducts(Array.isArray(data) ? data : data.products || [])
    } catch (err) {
      setError(err.message || 'Could not load products.')
    } finally {
      setLoading(false)
    }
  }
  const loadOrders = async () => {
  setOrdersLoading(true)
  setOrdersError('')

  try {
    const data = await getAdminOrders()

    setOrders(
      Array.isArray(data) ? data : data.orders || []
    )
  } catch (err) {
    setOrdersError(err.message || 'Could not load orders.')
  } finally {
    setOrdersLoading(false)
  }
}

  useEffect(() => {
  loadProducts()
  loadOrders()
}, [])

  const openAddForm = () => {
    setEditingId(null)
    setForm(emptyProduct)
    setError('')
    setFormOpen(true)
  }

  const openEditForm = product => {
    setEditingId(product._id)
    setForm({
      name: product.name || '',
      category: product.category || 'Accessories',
      price: String(product.price ?? ''),
      description: product.description || '',
      image: product.image || '',
      badge: product.badge || '',
      stock: String(product.stock ?? 0),
    })
    setError('')
    setFormOpen(true)
  }

  const handleSubmit = async event => {
    event.preventDefault()
    setError('')
    setNotice('')

    const price = Number(form.price)
    const stock = Number(form.stock)

    if (!form.name.trim()) {
      setError('Enter a product name.')
      return
    }

    if (!Number.isFinite(price) || price < 0) {
      setError('Price must be a valid non-negative number.')
      return
    }

    if (!Number.isInteger(stock) || stock < 0) {
      setError('Stock must be a non-negative whole number.')
      return
    }

    const payload = {
      name: form.name.trim(),
      category: form.category,
      price,
      description: form.description.trim(),
      image: form.image.trim(),
      badge: form.badge.trim(),
      stock,
    }

    setSaving(true)

    try {
      if (editingId) {
        await updateProduct(editingId, payload)
        setNotice('Product updated successfully.')
      } else {
        await createProduct(payload)
        setNotice('Product added successfully.')
      }

      setFormOpen(false)
      setForm(emptyProduct)
      setEditingId(null)
      await loadProducts()
    } catch (err) {
      setError(err.message || 'Unable to save the product.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async product => {
    const confirmed = window.confirm(
      `Delete "${product.name}"? This action cannot be undone.`
    )

    if (!confirmed) return

    setError('')
    setNotice('')

    try {
      await deleteProduct(product._id)
      setNotice('Product deleted successfully.')
      await loadProducts()
    } catch (err) {
      setError(err.message || 'Unable to delete the product.')
    }
  }
  
  const handleOrderStatusChange = async (orderId, status) => {
  setOrdersError('')
  setNotice('')
  setUpdatingOrderId(orderId)

  try {
    const updatedOrder = await updateOrderStatus(orderId, status)

    setOrders(previousOrders =>
      previousOrders.map(order =>
        order._id === orderId
          ? { ...order, ...updatedOrder }
          : order
      )
    )

    setNotice(`Order status updated to ${status}.`)
  } catch (err) {
    setOrdersError(err.message || 'Unable to update order status.')
  } finally {
    setUpdatingOrderId(null)
  }
}

  return (
    <main className="admin-page">
      <header className="admin-topbar">
        <button className="admin-back-btn" onClick={onBack} type="button">
          <ArrowLeft size={17} />
          Back to store
        </button>

        <div className="admin-heading">
          <span className="admin-heading-icon">
            <Package size={23} />
          </span>
          <div>
            <p className="eyebrow">SHOPEASE MANAGEMENT</p>
            <h1>Admin dashboard</h1>
          </div>
        </div>

        <button className="admin-logout-btn" onClick={onLogout} type="button">
          Log out
        </button>
      </header>

      <section className="admin-content">
        <div className="admin-analytics-grid">
  <article className="admin-analytics-card">
    <span>Total sales</span>
    <strong>{money(totalSales)}</strong>
    <small>Excluding cancelled orders</small>
  </article>

  <article className="admin-analytics-card">
    <span>Active orders</span>
    <strong>{totalOrders}</strong>
    <small>Orders not cancelled</small>
  </article>

  <article className="admin-analytics-card">
    <span>Total products</span>
    <strong>{products.length}</strong>
    <small>Products in your collection</small>
  </article>

  <article className="admin-analytics-card">
    <span>Low-stock products</span>
    <strong>{lowStockProducts}</strong>
    <small>Five or fewer units remaining</small>
  </article>
</div>
        <div className="admin-section-heading">
          <div>
            <p className="eyebrow">INVENTORY</p>
            <h2>Products</h2>
            <p className="muted">
              Add new products and manage your existing collection.
            </p>
          </div>

          <div className="admin-heading-actions">
            <button
              className="admin-secondary-btn"
              type="button"
              onClick={loadProducts}
              disabled={loading}
            >
              <RefreshCw size={16} />
              Refresh
            </button>

            <button
              className="admin-primary-btn"
              type="button"
              onClick={openAddForm}
            >
              <Plus size={17} />
              Add product
            </button>
          </div>
        </div>

        {notice && <p className="admin-notice" role="status">{notice}</p>}
        {error && <p className="admin-error" role="alert">{error}</p>}

        {formOpen && (
          <section className="admin-form-card">
            <div className="admin-form-heading">
              <div>
                <p className="eyebrow">
                  {editingId ? 'EDIT PRODUCT' : 'NEW PRODUCT'}
                </p>
                <h3>{editingId ? 'Update product' : 'Add a product'}</h3>
              </div>

              <button
                type="button"
                className="admin-icon-btn"
                onClick={() => {
                  setFormOpen(false)
                  setError('')
                }}
                aria-label="Close product form"
              >
                <X size={19} />
              </button>
            </div>

            <form className="admin-product-form" onSubmit={handleSubmit}>
              <label>
                Product name *
                <input
                  required
                  maxLength={120}
                  value={form.name}
                  onChange={event =>
                    setForm({ ...form, name: event.target.value })
                  }
                  placeholder="e.g. Everyday Backpack"
                />
              </label>

              <label>
                Category *
                <select
                  required
                  value={form.category}
                  onChange={event =>
                    setForm({ ...form, category: event.target.value })
                  }
                >
                  <option>Accessories</option>
                  <option>Footwear</option>
                  <option>Home</option>
                  <option>Electronics</option>
                  <option>Clothing</option>
                  <option>Beauty</option>
                  <option>Other</option>
                </select>
              </label>

              <label>
                Price (₹) *
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={event =>
                    setForm({ ...form, price: event.target.value })
                  }
                  placeholder="1299"
                />
              </label>

              <label>
                Stock quantity *
                <input
                  type="number"
                  required
                  min="0"
                  step="1"
                  value={form.stock}
                  onChange={event =>
                    setForm({ ...form, stock: event.target.value })
                  }
                  placeholder="10"
                />
              </label>

              <label className="admin-full-field">
                Description
                <textarea
                  rows="3"
                  maxLength={2000}
                  value={form.description}
                  onChange={event =>
                    setForm({ ...form, description: event.target.value })
                  }
                  placeholder="Describe the product..."
                />
              </label>

              <label className="admin-full-field">
                Image path or URL
                <input
                  value={form.image}
                  onChange={event =>
                    setForm({ ...form, image: event.target.value })
                  }
                  placeholder="/images/backpack.png"
                />
              </label>

              <label className="admin-full-field">
                Product badge
                <input
                  maxLength={40}
                  value={form.badge}
                  onChange={event =>
                    setForm({ ...form, badge: event.target.value })
                  }
                  placeholder="BESTSELLER, NEW, POPULAR..."
                />
              </label>

              <div className="admin-form-actions admin-full-field">
                <button
                  type="button"
                  className="admin-secondary-btn"
                  onClick={() => {
                    setFormOpen(false)
                    setError('')
                  }}
                >
                  Cancel
                </button>

                <button
                  className="admin-primary-btn"
                  type="submit"
                  disabled={saving}
                >
                  <Save size={16} />
                  {saving
                    ? 'Saving...'
                    : editingId
                      ? 'Save changes'
                      : 'Create product'}
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="admin-products-card">
          <div className="admin-table-heading">
            <h3>Product collection</h3>
            <span>{products.length} products</span>
          </div>

          {loading ? (
            <p className="muted admin-empty">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="muted admin-empty">
              No products found. Add your first product above.
            </p>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map(product => (
                    <tr key={product._id}>
                      <td>
                        <div className="admin-product-cell">
                          <img
                            src={product.image || '/images/backpack.png'}
                            alt=""
                          />
                          <div>
                            <strong>{product.name}</strong>
                            <small>{product.badge || 'Everyday pick'}</small>
                          </div>
                        </div>
                      </td>
                      <td>{product.category}</td>
                      <td>{money(product.price)}</td>
                      <td>
                        <span
                          className={
                            Number(product.stock) <= 5
                              ? 'stock-warning'
                              : 'stock-normal'
                          }
                        >
                          {product.stock ?? 0}
                        </span>
                      </td>
                      <td>
                        <div className="admin-row-actions">
                          <button
                            type="button"
                            className="admin-icon-btn"
                            onClick={() => openEditForm(product)}
                            aria-label={`Edit ${product.name}`}
                            title="Edit product"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            type="button"
                            className="admin-icon-btn admin-delete-btn"
                            onClick={() => handleDelete(product)}
                            aria-label={`Delete ${product.name}`}
                            title="Delete product"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
        <section className="admin-products-card admin-orders-card">
  <div className="admin-table-heading">
    <h3>
      <ClipboardList size={20} />
      Customer orders
    </h3>

    <button
      type="button"
      className="admin-refresh-btn"
      onClick={loadOrders}
      disabled={ordersLoading}
    >
      <RefreshCw size={15} />
      Refresh
    </button>
  </div>

  {ordersError && (
    <p className="admin-error" role="alert">
      {ordersError}
    </p>
  )}

  {ordersLoading ? (
    <p className="admin-empty">Loading orders...</p>
  ) : orders.length === 0 ? (
    <p className="admin-empty">No customer orders found.</p>
  ) : (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Order</th>
            <th>Customer</th>
            <th>Items</th>
            <th>Total</th>
            <th>Status</th>
            <th>Update status</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {orders.map(order => (
            <tr key={order._id}>
              <td>
                <strong>
                  {order.orderNumber || order._id}
                </strong>
              </td>

              <td>
                <div>{order.customer?.name || 'N/A'}</div>
                <small>{order.customer?.email || ''}</small>
              </td>

              <td>
                {(order.items || []).reduce(
                  (sum, item) => sum + Number(item.quantity || 0),
                  0
                )}
              </td>

              <td>{money(order.total)}</td>

              <td>{order.status}</td>

              <td>
                <select
                  value={order.status}
                  onChange={event =>
                    handleOrderStatusChange(
                      order._id,
                      event.target.value
                    )
                  }
                  disabled={updatingOrderId === order._id}
                  aria-label={`Update status for ${order.orderNumber}`}
                >
                  {[
                    'Placed',
                    'Processing',
                    'Shipped',
                    'Delivered',
                    'Cancelled',
                  ].map(status => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>

                {updatingOrderId === order._id && (
                  <small>Updating...</small>
                )}
              </td>

              <td>
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString('en-IN')
                  : 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</section>
      </section>
    </main>
  )
}
