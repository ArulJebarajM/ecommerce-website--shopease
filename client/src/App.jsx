import AdminDashboard from './AdminDashboard.jsx'
import { useEffect, useMemo, useState } from 'react'

import { Search, ShoppingBag, ArrowRight, Plus, Minus, X, CheckCircle2, Menu, UserRound, LogOut, ShieldCheck, Package, Truck, Clock3, XCircle, RefreshCw, Heart } from 'lucide-react'


import {
  getProducts,
  createOrder,
  mockPayment,
  registerUser,
  loginUser,
  getMe,
  getToken,
  getCurrentUser,
  saveAuth,
  logout,
  getMyOrders,
  getProductReviews,
  submitProductReview,
} from './api'

const fallbackProducts = [
  {_id:'local-1',name:'Everyday Backpack',category:'Accessories',price:1299,description:'A lightweight everyday backpack for work, college, and weekend trips.',image:'/images/backpack.png',badge:'BESTSELLER'},
  {_id:'local-2',name:'Minimal Sneakers',category:'Footwear',price:2199,description:'Clean, versatile sneakers designed for everyday comfort.',image:'/images/sneakers.png',badge:'NEW'},
  {_id:'local-3',name:'Ceramic Coffee Set',category:'Home',price:899,description:'A simple ceramic set for slow mornings and coffee breaks.',image:'/images/coffee.png',badge:'POPULAR'},
  {_id:'local-4',name:'Wireless Headphones',category:'Electronics',price:2499,description:'Comfortable over-ear headphones for music, calls, and study.',image:'/images/headphones.png',badge:'TOP PICK'},
  {_id:'local-5',name:'Classic Watch',category:'Accessories',price:1799,description:'A timeless watch with a clean face and comfortable strap.',image:'/images/watch.png',badge:'LIMITED'},
  {_id:'local-6',name:'Desk Lamp',category:'Home',price:1099,description:'A warm, adjustable desk lamp for focused evenings.',image:'/images/lamp.png',badge:'ESSENTIAL'}
]
const money = n => new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(n)

export default function App() {
  const [showAdminDashboard, setShowAdminDashboard] = useState(false)
  const [myOrdersOpen, setMyOrdersOpen] = useState(false)
const [myOrders, setMyOrders] = useState([])
const [productReviews, setProductReviews] = useState([])
const [averageRating, setAverageRating] = useState(0)
const [reviewCount, setReviewCount] = useState(0)
const [reviewLoading, setReviewLoading] = useState(false)
const [reviewError, setReviewError] = useState('')
const [reviewRating, setReviewRating] = useState(5)
const [reviewComment, setReviewComment] = useState('')
const [reviewSubmitting, setReviewSubmitting] = useState(false)
const loadProductReviews = async (productId) => {
  setReviewLoading(true)
  setReviewError('')

  try {
    const data = await getProductReviews(productId)

    setProductReviews(data.reviews || [])
    setAverageRating(data.averageRating || 0)
    setReviewCount(data.reviewCount || 0)
  } catch (error) {
    setReviewError(error.message || 'Unable to load reviews.')
  } finally {
    setReviewLoading(false)
  }
}
const [showFilters, setShowFilters] = useState(false)
const [wishlist, setWishlist] = useState(() => {
  try {
    const savedWishlist = localStorage.getItem('shopease_wishlist')
    return savedWishlist ? JSON.parse(savedWishlist) : []
  } catch {
    return []
  }
})
useEffect(() => {
  localStorage.setItem('shopease_wishlist', JSON.stringify(wishlist))
}, [wishlist])
const [showWishlistOnly, setShowWishlistOnly] = useState(false)
const [myOrdersLoading, setMyOrdersLoading] = useState(false)
const [myOrdersError, setMyOrdersError] = useState('')
  const [products,setProducts] = useState(fallbackProducts)
  const [query,setQuery] = useState('')
  const [category,setCategory] = useState('All')
  const [sortBy, setSortBy] = useState('featured')
  const [minPrice, setMinPrice] = useState('')
const [maxPrice, setMaxPrice] = useState('')
const [inStockOnly, setInStockOnly] = useState(false)
  const [cart,setCart] = useState([])
  const [orderSubmitting, setOrderSubmitting] = useState(false)
  const [selected,setSelected] = useState(null)
  const [cartOpen,setCartOpen] = useState(false)
  const [notice,setNotice] = useState('')
  const [loading,setLoading] = useState(true)
  const [checkout,setCheckout] = useState(false)
  const [customer,setCustomer] = useState({name:'',email:'',address:''})
  const [orderDone,setOrderDone] = useState(null)
  // Authentication state
const [authUser, setAuthUser] = useState(() => getCurrentUser())
const [authOpen, setAuthOpen] = useState(false)
const [authMode, setAuthMode] = useState('login')
const [authForm, setAuthForm] = useState({
  name: '',
  email: '',
  password: '',
})
const [authError, setAuthError] = useState('')
const [authLoading, setAuthLoading] = useState(false)

  useEffect(() => {
  getProducts()
    .then(data => {
      const productList = Array.isArray(data)
        ? data
        : data.products

      if (Array.isArray(productList)) {
        setProducts(productList)
      } else {
        console.error('Unexpected products API response:', data)
      }
    })
    .catch(error => {
      console.error('Failed to load products:', error)
    })
    .finally(() => setLoading(false))
}, [])
  // Verify the saved session with the backend.
useEffect(() => {
  if (!getToken()) {
    setAuthUser(null)
    return
  }

  getMe()
    .then(data => {
      const user = data.user || data
      setAuthUser(user)
    })
    .catch(() => {
      logout()
      setAuthUser(null)
    })
}, [])
  const categories = ['All', ...new Set(products.map(p => p.category))]
  
const visible = useMemo(() => {
  
let result = products.filter(p => {
  const matchesCategory =
    category === 'All' || p.category === category

  const matchesSearch =
    p.name.toLowerCase().includes(query.toLowerCase())

  const matchesMinPrice =
    minPrice === '' || p.price >= Number(minPrice)

  const matchesMaxPrice =
    maxPrice === '' || p.price <= Number(maxPrice)

  const matchesStock =
    !inStockOnly || p.stock > 0

    const matchesWishlist =
  !showWishlistOnly ||
  wishlist.some(item => item._id === p._id)
  return (
  matchesCategory &&
  matchesSearch &&
  matchesMinPrice &&
  matchesMaxPrice &&
  matchesStock &&
  matchesWishlist
)
})


  switch (sortBy) {
    case 'price-low':
      result.sort((a, b) => a.price - b.price)
      break

    case 'price-high':
      result.sort((a, b) => b.price - a.price)
      break

    case 'name':
      result.sort((a, b) => a.name.localeCompare(b.name))
      break

    default:
      // Keep the original product order.
      break
  }

  return result
}, [
  products,
  category,
  query,
  sortBy,
  minPrice,
  maxPrice,
  inStockOnly,
  wishlist,
  showWishlistOnly
])

  const count = cart.reduce((n,item)=>n+item.qty,0)
  const subtotal = cart.reduce((n,item)=>n+item.price*item.qty,0)
const add = (product) => {
  const availableStock = product.stock ?? Infinity

  const existingItem = cart.find(
    (item) => item._id === product._id
  )

  const currentQty = existingItem ? existingItem.qty : 0

  if (currentQty >= availableStock) {
    setNotice(`Only ${availableStock} items available in stock`)
    setTimeout(() => setNotice(''), 2500)
    return
  }

  setCart((old) => {
    const found = old.find((item) => item._id === product._id)

    return found
      ? old.map((item) =>
          item._id === product._id
            ? { ...item, qty: item.qty + 1 }
            : item
        )
      : [...old, { ...product, qty: 1 }]
  })

  setNotice(`${product.name} added to your bag`)
  setTimeout(() => setNotice(''), 2200)
}
  const changeQty = (id, delta) => {
  const item = cart.find((item) => item._id === id)

  if (!item) return

  const availableStock = item.stock ?? Infinity
  const newQty = item.qty + delta

  if (newQty > availableStock) {
    setNotice(`Only ${availableStock} items available in stock`)
    setTimeout(() => setNotice(''), 2500)
    return
  }

  setCart((old) =>
    old
      .map((item) =>
        item._id === id
          ? { ...item, qty: item.qty + delta }
          : item
      )
      .filter((item) => item.qty > 0)
  )
}
  
const placeOrder = async e => {
  e.preventDefault()

  if (orderSubmitting) return

  if (!cart.length) {
    setOrderDone({
      error: 'Your cart is empty. Please add a product before checkout.'
    })
    return
  }

  if (!authUser || !getToken()) {
    setCheckout(false)
    setAuthMode('login')
    setAuthError('Please sign in before placing an order.')
    setAuthOpen(true)
    return
  }

  if (
    !customer.name.trim() ||
    !customer.email.trim() ||
    !customer.address.trim()
  ) {
    return
  }

  if (cart.some(item => !/^[a-f\d]{24}$/i.test(String(item._id)))) {
    setOrderDone({
      error: 'Some products are demo fallback items. Please refresh the collection and try again.'
    })
    return
  }

  setOrderSubmitting(true)

  const payload = {
    customer,
    items: cart.map(item => ({
      productId: item._id,
      quantity: item.qty
    }))
  }

  // Keep your existing try/catch/finally block below.


  

  try {
  const result = await createOrder(payload)
const order = result.order || result

setOrderDone({
  ...order,
  total: order.total ?? subtotal,
  status: order.status || 'Placed',
  paymentStatus: order.paymentStatus || 'Pending',
})

setCart([])
setCheckout(false)

// Refresh product stock after the order succeeds.
try {
  const data = await getProducts()
  const productList = Array.isArray(data)
    ? data
    : data.products

  if (Array.isArray(productList)) {
    setProducts(productList)
  }
} catch (refreshError) {
  console.error('Unable to refresh product stock:', refreshError)
}
} catch (error) {
  setOrderDone({
    error: error.message || 'Unable to place your order. Please try again.'
  })
} finally {
  setOrderSubmitting(false)
}
}

const handleMockPayment = async outcome => {
  if (!orderDone?._id && !orderDone?.orderNumber) {
    return
  }

  try {
    const orderId = orderDone._id || orderDone.orderNumber
    const result = await mockPayment(orderId, outcome)
    const updatedOrder = result.order

    setOrderDone(previous => ({
      ...previous,
      ...updatedOrder,
      paymentStatus: updatedOrder.paymentStatus,
    }))
  } catch (error) {
    alert(error.message || 'Unable to update payment status.')
  }
}

  const handleAuthSubmit = async e => {
  e.preventDefault()
  setAuthError('')
  setAuthLoading(true)

  try {
    const payload = authMode === 'register'
      ? {
          name: authForm.name.trim(),
          email: authForm.email.trim(),
          password: authForm.password,
        }
      : {
          email: authForm.email.trim(),
          password: authForm.password,
        }

    const result = authMode === 'register'
      ? await registerUser(payload)
      : await loginUser(payload)

    saveAuth(result)
    setAuthUser(result.user)
    setAuthOpen(false)
    setAuthForm({ name: '', email: '', password: '' })
    setNotice(`Welcome${result.user.name ? `, ${result.user.name}` : ''}!`)
    setTimeout(() => setNotice(''), 2500)
  } catch (error) {
    setAuthError(error.message || 'Unable to authenticate. Please try again.')
  } finally {
    setAuthLoading(false)
  }
}

const handleLogout = () => {
  logout()
  setAuthUser(null)
  setNotice('You have been logged out.')
  setTimeout(() => setNotice(''), 2500)
}
  const handleOpenMyOrders = async () => {
  setMyOrdersOpen(true)
  setMyOrdersLoading(true)
  setMyOrdersError('')

  try {
    const data = await getMyOrders()
    const orders = Array.isArray(data) ? data : data.orders
    setMyOrders(Array.isArray(orders) ? orders : [])
  } catch (error) {
    setMyOrdersError(error.message || 'Unable to load your orders.')
  } finally {
    setMyOrdersLoading(false)
  }
}


const getOrderStatusInfo = status => {
  switch (status?.toLowerCase()) {
    case 'placed':
      return { label: 'Placed', className: 'placed', Icon: Clock3 }
    case 'processing':
      return { label: 'Processing', className: 'processing', Icon: Package }
    case 'shipped':
      return { label: 'Shipped', className: 'shipped', Icon: Truck }
    case 'delivered':
      return { label: 'Delivered', className: 'delivered', Icon: CheckCircle2 }
    case 'cancelled':
      return { label: 'Cancelled', className: 'cancelled', Icon: XCircle }
    default:
      return { label: status || 'Unknown', className: 'unknown', Icon: Package }
  }
}

const OrderProgress = ({ status }) => {
  const steps = [
    { label: 'Placed', Icon: CheckCircle2 },
    { label: 'Processing', Icon: Package },
    { label: 'Shipped', Icon: Truck },
    { label: 'Delivered', Icon: CheckCircle2 },
  ]

  const currentIndex = steps.findIndex(
    step => step.label.toLowerCase() === status?.toLowerCase()
  )

  if (status?.toLowerCase() === 'cancelled') {
    return (
      <div className="order-progress-cancelled">
        <XCircle size={17} />
        <span>This order was cancelled.</span>
      </div>
    )
  }

  return (
    <div
      className="order-progress"
      aria-label={`Order status: ${status}`}
    >
      {steps.map((step, index) => {
        const StepIcon = step.Icon
        const completed = currentIndex >= 0 && index <= currentIndex

        return (
          <div className="order-progress-step" key={step.label}>
            <div
              className={`order-progress-icon ${completed ? 'completed' : ''}`}
            >
              <StepIcon size={16} />
            </div>

            <span className={completed ? 'completed-label' : ''}>
              {step.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

if (showAdminDashboard && authUser?.role === 'admin') {
  return (
    <AdminDashboard
      onBack={() => setShowAdminDashboard(false)}
      onLogout={() => {
        handleLogout()
        setShowAdminDashboard(false)
      }}
    />
  )
}

  return <div className="app">
    <div className="announcement">Thoughtful finds for everyday living <span>✦</span> Free delivery on demo orders over ₹1,500</div>
    <header className="header">
      <a className="brand" href="#"><span className="brand-mark">s.</span><span>shop<span className="brand-light">ease</span><small>EVERYDAY, BETTER.</small></span></a>
      <nav><a href="#shop">Shop all</a><a href="#story">Our story</a><a href="#footer">Contact</a></nav>
      
<div className="header-actions">
  <button
    className="icon-btn mobile-menu"
    aria-label="Menu"
    type="button"
  >
    <Menu size={20} />
  </button>

  {authUser ? (
    <>
      <span className="user-chip">
        <UserRound size={16} />
        {authUser.name || authUser.email}
      </span>

      {authUser.role === 'admin' && (
        <span className="admin-chip">
          <ShieldCheck size={15} />
          Admin
        </span>
      )}

     
      {authUser.role === 'admin' && (
        <button
          className="auth-header-btn"
          type="button"
          onClick={() => setShowAdminDashboard(true)}
        >
          <ShieldCheck size={16} />
          Dashboard
        </button>
      )}
      {authUser.role !== 'admin' && (
  <button
    className="auth-header-btn"
    type="button"
    onClick={handleOpenMyOrders}
  >
    <ShoppingBag size={16} />
    My Orders
  </button>
)}

      <button
        className="auth-header-btn"
        type="button"
        onClick={handleLogout}
      >
        <LogOut size={16} />
        Logout
      </button>

    </>
  ) : (
    <button
      className="auth-header-btn"
      type="button"
      onClick={() => {
        setAuthMode('login')
        setAuthError('')
        setAuthOpen(true)
      }}
    >
      <UserRound size={16} />
      Login / Register
    </button>
  )}

  <button
    className="icon-btn"
    aria-label="Shopping bag"
    type="button"
    onClick={() => setCartOpen(true)}
  >
    <ShoppingBag size={20} />
    <span className="cart-count">{count}</span>
  </button>
  
</div>
</header>

    <main>
      <section className="hero">
        <div className="hero-copy"><p className="eyebrow"><span className="eyebrow-line"/> THE EVERYDAY EDIT</p><h1>Good things.<br/><em>Well chosen.</em></h1><p className="hero-description">Useful objects, considered design, and little upgrades that make every day feel a bit more special.</p><a href="#shop" className="primary-btn">Explore the collection <ArrowRight size={17}/></a><div className="hero-note"><span className="avatar-stack"><b>J</b><b>M</b><b>A</b></span><span><strong>Made for real life</strong><small>Simple picks. Lasting value.</small></span></div></div>
        <div className="hero-visual"><div className="hero-sun"/><div className="hero-image-card"><img src="/images/hero.png" alt="Illustrated collection of everyday products"/></div><span className="hero-index">COLLECTION N° 01 / 2026</span></div>
      </section>
      <section className="benefits"><div><span>✳</span><p><strong>Thoughtfully selected</strong><small>Useful, everyday essentials</small></p></div><div><span>♧</span><p><strong>Made for daily life</strong><small>Style meets function</small></p></div><div><span>↗</span><p><strong>Easy, friendly shopping</strong><small>A simple checkout experience</small></p></div></section>
      <section className="shop-section" id="shop"><div className="section-heading"><div><p className="eyebrow">THE SHOP</p><h2>Find your <em>favourite.</em></h2></div><p className="section-note">A considered collection of useful things<br/>for home, work, and everywhere between.</p></div>
        <div className="shop-tools"><div className="filters">{categories.map(c=><button key={c} className={category===c?'filter active':'filter'} onClick={()=>setCategory(c)}>{c}</button>)}</div>
<div className="wishlist-filter-row">
  <button
    type="button"
    className={`wishlist-filter-btn ${showWishlistOnly ? 'active' : ''}`}
    onClick={() => setShowWishlistOnly(prev => !prev)}
  >
    <Heart
      size={17}
      fill={showWishlistOnly ? 'currentColor' : 'none'}
    />
    {showWishlistOnly ? 'Show All Products' : 'My Wishlist'}
    <span>({wishlist.length})</span>
  </button>
</div>
<div className="filter-toggle-row">
  <button
    type="button"
    className="filter-toggle-btn"
    onClick={() => setShowFilters(!showFilters)}
  >
    <span>☷</span>
    Filters
    <span>{showFilters ? '−' : '+'}</span>
  </button>
</div>

{showFilters && (
  <div className="advanced-filters">
  <label>
    Minimum price (₹)
    <input
      type="number"
      min="0"
      value={minPrice}
      onChange={e => setMinPrice(e.target.value)}
      placeholder="0"
    />
  </label>

  <label>
    Maximum price (₹)
    <input
      type="number"
      min="0"
      value={maxPrice}
      onChange={e => setMaxPrice(e.target.value)}
      placeholder="No limit"
    />
  </label>

  <label className="stock-filter">
    <input
      type="checkbox"
      checked={inStockOnly}
      onChange={e => setInStockOnly(e.target.checked)}
    />
    In stock only
  </label>

  <button
    type="button"
    className="clear-filters-btn"
    onClick={() => {
      setMinPrice('')
      setMaxPrice('')
      setInStockOnly(false)
      setQuery('')
      setCategory('All')
      setSortBy('featured')
    }}
  >
    Clear filters
  </button>
</div>
)}
<label className="search-box"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Find something..." aria-label="Search products"/></label>
<label className="sort-box">
  <span>Sort by</span>
  <select
    value={sortBy}
    onChange={e => setSortBy(e.target.value)}
    aria-label="Sort products"
  >
    <option value="featured">Featured</option>
    <option value="price-low">Price: Low to High</option>
    <option value="price-high">Price: High to Low</option>
    <option value="name">Name: A to Z</option>
  </select>
</label>
</div>
        {loading && <p className="muted">Checking the latest collection…</p>}
        <div className="product-grid">{visible.map((p,i)=><article className="product-card" key={p._id}><button
  className="product-image"
  onClick={() => {
    setSelected(p)
    setProductReviews([])
    setAverageRating(0)
    setReviewCount(0)
    setReviewComment('')
    setReviewRating(5)
    setReviewError('')

    if (/^[a-f\d]{24}$/i.test(String(p._id))) {
      loadProductReviews(p._id)
    } else {
      setReviewError(
        'Reviews are available for products saved in the database.'
      )
    }
  }}
  aria-label={`View ${p.name}`}
><img src={p.image || '/images/backpack.png'} alt={p.name}/><span className="product-badge">{p.badge || 'EVERYDAY PICK'}</span><span className="quick-view">Quick view <ArrowRight size={14}/></span></button>

<button
  type="button"
  className={`wishlist-btn ${
    wishlist.some(item => item._id === p._id) ? 'wishlisted' : ''
  }`}
  onClick={() => {
    setWishlist(prev =>
      prev.some(item => item._id === p._id)
        ? prev.filter(item => item._id !== p._id)
        : [...prev, p]
    )
  }}
  aria-label="Toggle wishlist"
>
  <Heart
    size={20}
    fill={
      wishlist.some(item => item._id === p._id)
        ? 'currentColor'
        : 'none'
    }
  />
</button>

<div className="product-info"><div><p className="product-category">{p.category}</p><h3>{p.name}</h3></div> <button
  className="add-btn"
  onClick={() => add(p)}
  disabled={p.stock !== undefined && p.stock <= 0}
  aria-label={
    p.stock !== undefined && p.stock <= 0
      ? `${p.name} is out of stock`
      : `Add ${p.name} to bag`
  }
  title={
    p.stock !== undefined && p.stock <= 0
      ? 'Out of stock'
      : 'Add to bag'
  }
>
  {p.stock !== undefined && p.stock <= 0
    ? <X size={18} />
    : <Plus size={18} />}
</button></div><p className="product-bottom">
  <strong>{money(p.price)}</strong>
  <span>Inclusive of taxes</span>
</p>

{p.stock !== undefined && (
  <p
    className={`product-stock ${
      p.stock > 0 ? 'in-stock' : 'out-of-stock'
    }`}
  >
    {p.stock > 0
      ? `${p.stock} items in stock`
      : 'Out of stock'}
  </p>
)}</article>)}</div>
        {!visible.length && <div className="empty-state"><Search size={25}/><h3>No matches just yet</h3><p>Try another search or category.</p><button className="text-btn" onClick={()=>{setQuery('');setCategory('All')}}>Clear filters</button></div>}
      </section>
      <section className="story" id="story"><div className="story-art"><img src="/images/story.png" alt="Illustration of calm, useful everyday objects"/></div><div><p className="eyebrow">A SMALLER, BETTER WAY</p><h2>Make room for<br/><em>what matters.</em></h2><p>We believe the best things don't need to be complicated. ShopEase is a student-built e-commerce concept focused on simple discovery, clear product details, and a friendly shopping experience.</p><a href="#shop" className="text-btn">Meet the collection <ArrowRight size={16}/></a></div></section>
    </main>
    

<footer id="footer" className="site-footer">
  <div className="footer-main">
    {/* Brand and introduction */}
    <div className="footer-brand-area">
      <a
        className="brand footer-brand"
        href="#"
        aria-label="ShopEase home"
      >
        <span className="brand-mark">s.</span>
        <span>
          shop<span className="brand-light">ease</span>
          <small>EVERYDAY, BETTER.</small>
        </span>
      </a>

      <p className="footer-description">
        A considered collection of useful things.
        Discover everyday products through a simple,
        thoughtful shopping experience.
      </p>

      <a
        className="footer-social-link"
        href="https://github.com/ArulJebarajM/ecommerce-website--shopease"
        target="_blank"
        rel="noreferrer"
      >
        <span aria-hidden="true">↗</span>
        View project on GitHub
      </a>
    </div>

    {/* Shopping navigation */}
    <div className="footer-column">
      <h3>Explore</h3>
      <a href="#shop">All Products</a>
      <a href="#story">Our Story</a>
      <a href="#shop">Footwear</a>
      <a href="#shop">Accessories</a>
    </div>

    {/* Contact information */}
    <div className="footer-column">
      <h3>Contact Us</h3>

      <a href="mailto:arul40083@gmail.com">
        Email: arul40083@gmail.com
      </a>

      <a href="tel:+919677751832">
        Phone: 96777 51832
      </a>

      <p>
        <strong>Address</strong>
        <span>317, Road Street, Irungalur, Trichy</span>
      </p>

      <p className="footer-small-text">
        Questions or feedback? Feel free to contact us.
      </p>
    </div>

    {/* Demo-store information */}
    <div className="footer-column">
      <h3>Shopping Information</h3>

      <p>
        <strong>Payment</strong>
        <span>
          Demo checkout for this portfolio project.
        </span>
      </p>

      <p>
        <strong>Delivery</strong>
        <span>
          No real delivery service is represented here.
        </span>
      </p>
    </div>
  </div>

  {/* Footer bottom */}
  <div className="footer-bottom">
    <span>© 2026 ShopEase · Portfolio Project</span>

    <span>
      Designed with care · Built with the MERN Stack
    </span>

    <a href="#shop" className="footer-link">
      Back to shop ↑
    </a>
  </div>
</footer>


    {notice && <div className="toast"><CheckCircle2 size={17}/>{notice}</div>}
   {selected && (
  <div
    className="overlay"
    onClick={() => setSelected(null)}
  >
    
    <section
      className="modal product-modal"
      onClick={e => e.stopPropagation()}
    >
      <button
        className="close-btn"
        onClick={() => setSelected(null)}
        aria-label="Close"
      >
        <X />
      </button>

      <img
        src={selected.image || '/images/backpack.png'}
        alt={selected.name}
      />

      <div>
        <p className="eyebrow">{selected.category}</p>
        <h2>{selected.name}</h2>
        <p>{selected.description}</p>
        <h3>{money(selected.price)}</h3>

        <button
          className="primary-btn"
          disabled={
            selected.stock !== undefined &&
            (
              selected.stock <= 0 ||
              (cart.find(item => item._id === selected._id)?.qty ?? 0) >= selected.stock
            )
          }
          onClick={() => {
            const currentQty =
              cart.find(item => item._id === selected._id)?.qty ?? 0

            if (
              selected.stock !== undefined &&
              currentQty >= selected.stock
            ) {
              return
            }

            add(selected)
            setSelected(null)
          }}
        >
          {selected.stock !== undefined && selected.stock <= 0
            ? 'Out of stock'
            : selected.stock !== undefined &&
              (cart.find(item => item._id === selected._id)?.qty ?? 0) >= selected.stock
              ? 'Stock limit reached'
              : 'Add to bag'}

          <ShoppingBag size={17} />
        </button>
           </div>

      <div className="product-reviews">
        <div className="reviews-heading">
          <div>
            <p className="eyebrow">CUSTOMER FEEDBACK</p>
            <h3>Ratings & Reviews</h3>
          </div>

          <div className="reviews-summary">
            <strong>★ {averageRating.toFixed(1)}</strong>
            <span>{reviewCount} reviews</span>
          </div>
        </div>

        {reviewLoading && (
          <p className="muted">Loading reviews...</p>
        )}

        {reviewError && (
          <p className="auth-error" role="alert">
            {reviewError}
          </p>
        )}

        {!reviewLoading && !reviewError && productReviews.length === 0 && (
          <p className="muted">
            No reviews yet. Be the first to review this product.
          </p>
        )}

        {!reviewLoading && productReviews.map(review => (
          <article className="product-review" key={review._id}>
            <div className="review-stars">
              {'★'.repeat(review.rating)}
              {'☆'.repeat(5 - review.rating)}
            </div>
            <strong>{review.user?.name || 'Customer'}</strong>
            <p>{review.comment}</p>
            <small>
              {review.createdAt
                ? new Date(review.createdAt).toLocaleDateString('en-IN')
                : ''}
            </small>
          </article>
        ))}

        <form
          className="review-form"
          onSubmit={async event => {
            event.preventDefault()
            setReviewError('')

            if (!authUser || !getToken()) {
              setReviewError('Please sign in to submit a review.')
              return
            }

            if (!/^[a-f\d]{24}$/i.test(String(selected?._id))) {
              setReviewError(
                'Reviews are available for products saved in the database.'
              )
              return
            }

            setReviewSubmitting(true)

            try {
              await submitProductReview(selected._id, {
                rating: reviewRating,
                comment: reviewComment.trim(),
              })

              setReviewComment('')
              await loadProductReviews(selected._id)
            } catch (error) {
              setReviewError(error.message || 'Unable to submit review.')
            } finally {
              setReviewSubmitting(false)
            }
          }}
        >
          <h4>Write a review</h4>

          <label>
            Your rating
            <select
              value={reviewRating}
              onChange={event =>
                setReviewRating(Number(event.target.value))
              }
            >
              <option value={5}>5 - Excellent</option>
              <option value={4}>4 - Very good</option>
              <option value={3}>3 - Good</option>
              <option value={2}>2 - Fair</option>
              <option value={1}>1 - Poor</option>
            </select>
          </label>

          <label>
            Your comment
            <textarea
              required
              minLength={3}
              maxLength={1000}
              rows={3}
              value={reviewComment}
              onChange={event => setReviewComment(event.target.value)}
              placeholder="Share your experience with this product..."
            />
          </label>

          <button
            type="submit"
            className="primary-btn"
            disabled={reviewSubmitting || !authUser}
          >
            {reviewSubmitting ? 'Submitting...' : 'Submit review'}
          </button>

          {!authUser && (
            <small>Sign in to write a review.</small>
          )}
        </form>
      </div>
    </section>
  </div>
)}
    {cartOpen && <div className="overlay" onClick={()=>setCartOpen(false)}><section className="drawer" onClick={e=>e.stopPropagation()}><div className="drawer-heading"><div><p className="eyebrow">YOUR SELECTION</p><h2>Your bag <span>({count})</span></h2></div><button className="close-btn" onClick={()=>setCartOpen(false)} aria-label="Close cart"><X/></button></div>
      {!cart.length ? <div className="empty-state"><ShoppingBag size={28}/><h3>Your bag is taking a break</h3><p>Find something you'll love.</p><button className="primary-btn" onClick={()=>setCartOpen(false)}>Continue shopping <ArrowRight size={16}/></button></div> :
      <><div className="cart-items">{cart.map(i=><div className="cart-item" key={i._id}><img src={i.image || '/images/backpack.png'} alt={i.name}/><div className="cart-item-info"><strong>{i.name}</strong><span>{money(i.price)}</span><div className="qty"><button onClick={()=>changeQty(i._id,-1)} aria-label="Decrease quantity"><Minus size={13}/></button><span>{i.qty}</span> <button
  type="button"
  onClick={() => changeQty(i._id, 1)}
  disabled={i.stock !== undefined && i.qty >= i.stock}
  aria-label={`Increase quantity of ${i.name}`}
>
  <Plus size={13} />
</button></div></div><strong>{money(i.price*i.qty)}</strong></div>)}</div><div className="cart-summary"><div><span>Subtotal</span><strong>{money(subtotal)}</strong></div><p>Shipping and taxes are calculated at checkout.</p><button className="primary-btn full" onClick={()=>{setCheckout(true);setCartOpen(false)}}>Continue to checkout <ArrowRight size={17}/></button></div></>}
    </section></div>}
    {checkout && <div className="overlay" onClick={()=>setCheckout(false)}><section className="modal checkout-modal" onClick={e=>e.stopPropagation()}><button className="close-btn" onClick={()=>setCheckout(false)} aria-label="Close"><X/></button><p className="eyebrow">ALMOST YOURS</p><h2>Demo checkout</h2><p className="muted">No payment is collected. This creates a test order for the project demonstration.</p><form onSubmit={placeOrder}><label>Full name<input required value={customer.name} onChange={e=>setCustomer({...customer,name:e.target.value})} placeholder="Your name"/></label><label>Email address<input required type="email" value={customer.email} onChange={e=>setCustomer({...customer,email:e.target.value})} placeholder="you@example.com"/></label><label>Delivery address<textarea required value={customer.address} onChange={e=>setCustomer({...customer,address:e.target.value})} placeholder="Street, city, PIN code"/></label><div className="checkout-total"><span>Order total</span><strong>{money(subtotal)}</strong></div> <button
  className="primary-btn full"
  type="submit"
  disabled={orderSubmitting}
>
  {orderSubmitting ? 'Placing order...' : 'Place demo order'}
  {!orderSubmitting && <ArrowRight size={17} />}
</button></form></section></div>}
    {orderDone && <div className="overlay">
<section className="modal success-modal">
  <span className="success-icon">
    {orderDone.error
      ? <X size={30} />
      : <CheckCircle2 size={30} />}
  </span>

  <p className="eyebrow">
    {orderDone.error ? 'ORDER NOT COMPLETED' : 'ORDER CONFIRMED'}
  </p>

  <h2>
    {orderDone.error ? 'Unable to place your order.' : 'Thanks for your order.'}
  </h2>

  {orderDone.error ? (
    <p role="alert">{orderDone.error}</p>
  ) : (
    <>
      <p>
  Your demo order number is{' '}
  <strong>
    {orderDone.orderNumber || orderDone._id || 'created'}
  </strong>.
</p>

<div className="checkout-total">
  <span>Order total</span>
  <strong>{money(orderDone.total)}</strong>
</div>

<p>
  Order status: <strong>{orderDone.status}</strong>
</p>

<div className="payment-status-row">
  <span>Payment status</span>

  <span
    className={`payment-status-badge ${(orderDone.paymentStatus || 'Pending').toLowerCase()}`}
  >
    {orderDone.paymentStatus || 'Pending'}
  </span>
</div>

{orderDone.paymentStatus === 'Pending' && (
  <div className="payment-demo-actions">
    <button
      type="button"
      className="primary-btn"
      onClick={() => handleMockPayment('success')}
    >
      Simulate Successful Payment
    </button>

    <button
      type="button"
      className="secondary-btn"
      onClick={() => handleMockPayment('failure')}
    >
      Simulate Failed Payment
    </button>

    <button
      type="button"
      className="secondary-btn"
      onClick={() => handleMockPayment('cancel')}
    >
      Cancel Payment
    </button>
  </div>
)}
<p className="muted">
  This is a  project demonstration. No payment was taken.
</p>
    </>
  )}

  <button
    className="primary-btn"
    onClick={() => setOrderDone(null)}
  >
    Continue browsing <ArrowRight size={16} />
  </button>
</section>
 </div>
} 
{myOrdersOpen && (
  <div
    className="overlay"
    onClick={() => setMyOrdersOpen(false)}
  >
    <section
      className="modal my-orders-modal"
      onClick={e => e.stopPropagation()}
    >
      <button
        className="close-btn"
        type="button"
        onClick={() => setMyOrdersOpen(false)}
        aria-label="Close orders"
      >
        <X />
      </button>

      <div className="my-orders-heading">
  <div>
    <p className="eyebrow">YOUR SHOPPING HISTORY</p>
    <h2>My Orders</h2>
  </div>

  <button
    type="button"
    className="my-orders-refresh"
    onClick={handleOpenMyOrders}
    disabled={myOrdersLoading}
  >
    <RefreshCw
      size={16}
      className={myOrdersLoading ? 'refresh-spinning' : ''}
    />
    {myOrdersLoading ? 'Refreshing...' : 'Refresh'}
  </button>
</div>

      {myOrdersLoading && (
        <p className="muted">Loading your orders...</p>
      )}

      {myOrdersError && (
        <p className="auth-error" role="alert">
          {myOrdersError}
        </p>
      )}

      {!myOrdersLoading &&
        !myOrdersError &&
        myOrders.length === 0 && (
          <div className="empty-state">
            <ShoppingBag size={28} />
            <h3>No orders yet</h3>
            <p>Your orders will appear here after checkout.</p>
          </div>
        )}

      {!myOrdersLoading &&
        !myOrdersError &&
        myOrders.length > 0 && (
          <div className="my-orders-list">
            {myOrders.map(order => (
              <article
                className="my-order-card"
                key={order._id}
              >
                <div className="my-order-top">
                  <strong>
                    {order.orderNumber || order._id}
                  </strong>
                  
{(() => {
  const statusInfo = getOrderStatusInfo(order.status)
  const StatusIcon = statusInfo.Icon

  return (
    <span className={`my-order-status status-${statusInfo.className}`}>
      <StatusIcon size={14} />
      {statusInfo.label}
    </span>
  )
})()}

                </div>

                <p className="muted">
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString('en-IN')
                    : 'Date unavailable'}
                </p>

                
<div className="my-order-items">
  {order.items?.map((item, index) => {
    const product = products.find(
      p => String(p._id) === String(item.productId)
    )

    return (
      <div
        className="my-order-product"
        key={item._id || `${order._id}-${index}`}
      >
        <img
          className="my-order-product-image"
          src={product?.image || '/images/backpack.png'}
          alt={item.name}
        />

        <div className="my-order-product-details">
          <strong>{item.name}</strong>
          <span>Quantity: {item.quantity}</span>
          <span>{money(item.price)}</span>
        </div>

        <strong className="my-order-line-total">
          {money(item.price * item.quantity)}
        </strong>
      </div>
    )
  })}
</div>


                <div className="my-order-total">
                  <span>Total</span>
                  <strong>{money(order.total)}</strong>
                </div>
                
<div className="order-tracking">
  <h3>Order Tracking</h3>

  {order.statusHistory?.length > 0 ? (
    <div className="tracking-timeline">
      {order.statusHistory.map((event, index) => (
        <div
          className="tracking-event"
          key={`${event.status}-${index}`}
        >
          <span className="tracking-dot" />

          <div className="tracking-event-content">
            <strong>{event.status}</strong>

            {event.note && <p>{event.note}</p>}

            <small>
              {event.updatedAt
                ? new Date(event.updatedAt).toLocaleString('en-IN')
                : 'Time unavailable'}
            </small>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <p className="muted">
      Tracking history is not available for this order yet.
    </p>
  )}
</div>

                <button
  type="button"
  className="buy-again-btn"
onClick={() => {
  const unavailable = []
  const limitedStock = []
  const nextCart = [...cart]

  order.items?.forEach(item => {
    const product = products.find(
      p => String(p._id) === String(item.productId)
    )

    if (!product || product.stock === 0) {
      unavailable.push(item.name)
      return
    }

    const existingIndex = nextCart.findIndex(
      cartItem => cartItem._id === product._id
    )

    const currentQty =
      existingIndex >= 0 ? nextCart[existingIndex].qty : 0

    const availableStock = product.stock ?? Infinity

    const quantityToAdd = Math.min(
      item.quantity,
      Math.max(0, availableStock - currentQty)
    )

    if (quantityToAdd <= 0) {
      limitedStock.push(item.name)
      return
    }

    if (existingIndex >= 0) {
      nextCart[existingIndex] = {
        ...nextCart[existingIndex],
        qty: currentQty + quantityToAdd
      }
    } else {
      nextCart.push({
        ...product,
        qty: quantityToAdd
      })
    }

    if (quantityToAdd < item.quantity) {
      limitedStock.push(item.name)
    }
  })

  setCart(nextCart)
  setMyOrdersOpen(false)
  setCartOpen(true)

  const messages = []

  if (unavailable.length) {
    messages.push(`Unavailable: ${unavailable.join(', ')}`)
  }

  if (limitedStock.length) {
    messages.push(
      `Stock limit reached for: ${limitedStock.join(', ')}`
    )
  }

  if (messages.length) {
    setNotice(messages.join('. '))
    setTimeout(() => setNotice(''), 4000)
  }
}}
>
  <ShoppingBag size={16} />
  Buy Again
  <ArrowRight size={15} />
</button>
                <OrderProgress status={order.status} />
              </article>
            ))}
          </div>
        )}
    </section>
  </div>
)}
{authOpen && (
  <div
    className="overlay"
    onClick={() => {
      setAuthOpen(false)
      setAuthError('')
    }}
  >
    <section
      className="modal auth-modal"
      onClick={e => e.stopPropagation()}
    >
      <button
        className="close-btn"
        type="button"
        onClick={() => {
          setAuthOpen(false)
          setAuthError('')
        }}
        aria-label="Close authentication"
      >
        <X />
      </button>

      <p className="eyebrow">
        {authMode === 'login' ? 'WELCOME BACK' : 'JOIN SHOPEASE'}
      </p>

      <h2>
        {authMode === 'login'
          ? 'Sign in to your account'
          : 'Create your account'}
      </h2>

      <p className="muted">
        {authMode === 'login'
          ? 'Sign in to continue to ShopEase.'
          : 'Create an account to get started.'}
      </p>

      <form onSubmit={handleAuthSubmit}>
        {authMode === 'register' && (
          <label>
            Full name
            <input
              type="text"
              required
              minLength={2}
              autoComplete="name"
              value={authForm.name}
              onChange={e =>
                setAuthForm({ ...authForm, name: e.target.value })
              }
              placeholder="Your full name"
            />
          </label>
        )}

        <label>
          Email address
          <input
            type="email"
            required
            autoComplete="email"
            value={authForm.email}
            onChange={e =>
              setAuthForm({ ...authForm, email: e.target.value })
            }
            placeholder="you@example.com"
          />
        </label>

        <label>
          Password
          <input
            type="password"
            required
            minLength={8}
            autoComplete={
              authMode === 'login'
                ? 'current-password'
                : 'new-password'
            }
            value={authForm.password}
            onChange={e =>
              setAuthForm({ ...authForm, password: e.target.value })
            }
            placeholder="Enter your password"
          />
        </label>

        {authError && (
          <p className="auth-error" role="alert">
            {authError}
          </p>
        )}

        <button
          className="primary-btn full"
          type="submit"
          disabled={authLoading}
        >
          {authLoading
            ? 'Please wait...'
            : authMode === 'login'
              ? 'Sign in'
              : 'Create account'}

          <ArrowRight size={17} />
        </button>
      </form>

      <p className="auth-switch">
        {authMode === 'login'
          ? "Don't have an account?"
          : 'Already have an account?'}

        <button
          type="button"
          onClick={() => {
            setAuthMode(authMode === 'login' ? 'register' : 'login')
            setAuthError('')
          }}
        >
          {authMode === 'login' ? 'Register' : 'Sign in'}
        </button>
      </p>
    </section>
  </div>
)}

  </div>
}