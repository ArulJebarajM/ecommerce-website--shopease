import { useEffect, useMemo, useState } from 'react'
import { Search, ShoppingBag, Heart, ArrowRight, Plus, Minus, X, CheckCircle2, Menu } from 'lucide-react'
import { getProducts, createOrder } from './api'

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
  const [products,setProducts] = useState(fallbackProducts)
  const [query,setQuery] = useState('')
  const [category,setCategory] = useState('All')
  const [cart,setCart] = useState([])
  const [selected,setSelected] = useState(null)
  const [cartOpen,setCartOpen] = useState(false)
  const [notice,setNotice] = useState('')
  const [loading,setLoading] = useState(true)
  const [checkout,setCheckout] = useState(false)
  const [customer,setCustomer] = useState({name:'',email:'',address:''})
  const [orderDone,setOrderDone] = useState(null)

  useEffect(() => { getProducts().then(data => { if (Array.isArray(data) && data.length) setProducts(data) }).catch(() => {}).finally(() => setLoading(false)) }, [])
  const categories = ['All', ...new Set(products.map(p => p.category))]
  const visible = useMemo(() => products.filter(p => (category==='All'||p.category===category) && p.name.toLowerCase().includes(query.toLowerCase())),[products,category,query])
  const count = cart.reduce((n,item)=>n+item.qty,0)
  const subtotal = cart.reduce((n,item)=>n+item.price*item.qty,0)
  const add = product => { setCart(old => { const found=old.find(i=>i._id===product._id); return found ? old.map(i=>i._id===product._id?{...i,qty:i.qty+1}:i) : [...old,{...product,qty:1}] }); setNotice(`${product.name} added to your bag`); setTimeout(()=>setNotice(''),2200) }
  const changeQty = (id,delta) => setCart(old=>old.map(i=>i._id===id?{...i,qty:i.qty+delta}:i).filter(i=>i.qty>0))
  const placeOrder = async e => {
    e.preventDefault()
    if (!customer.name.trim() || !customer.email.trim() || !customer.address.trim() || !cart.length) return
    const payload={customer,items:cart.map(i=>({productId:i._id.startsWith('local-')?null:i._id,name:i.name,price:i.price,quantity:i.qty})),total:subtotal}
    try { const order=await createOrder(payload); setOrderDone(order) }
    catch { setOrderDone({orderNumber:`DEMO-${Date.now().toString().slice(-6)}`,total:subtotal,localOnly:true}) }
    setCart([]); setCheckout(false)
  }
  return <div className="app">
    <div className="announcement">Thoughtful finds for everyday living <span>✦</span> Free delivery on demo orders over ₹1,500</div>
    <header className="header">
      <a className="brand" href="#"><span className="brand-mark">s.</span><span>shop<span className="brand-light">ease</span><small>EVERYDAY, BETTER.</small></span></a>
      <nav><a href="#shop">Shop all</a><a href="#story">Our story</a><a href="#footer">Contact</a></nav>
      <div className="header-actions"><button className="icon-btn mobile-menu" aria-label="Menu"><Menu size={20}/></button><button className="icon-btn" aria-label="Shopping bag" onClick={()=>setCartOpen(true)}><ShoppingBag size={20}/><span className="cart-count">{count}</span></button></div>
    </header>
    <main>
      <section className="hero">
        <div className="hero-copy"><p className="eyebrow"><span className="eyebrow-line"/> THE EVERYDAY EDIT</p><h1>Good things.<br/><em>Well chosen.</em></h1><p className="hero-description">Useful objects, considered design, and little upgrades that make every day feel a bit more special.</p><a href="#shop" className="primary-btn">Explore the collection <ArrowRight size={17}/></a><div className="hero-note"><span className="avatar-stack"><b>J</b><b>M</b><b>A</b></span><span><strong>Made for real life</strong><small>Simple picks. Lasting value.</small></span></div></div>
        <div className="hero-visual"><div className="hero-sun"/><div className="hero-image-card"><img src="/images/hero.png" alt="Illustrated collection of everyday products"/></div><div className="floating-tag"><span>✳</span><div><strong>Less, but better.</strong><small>A little everyday joy</small></div></div><span className="hero-index">COLLECTION N° 01 / 2026</span></div>
      </section>
      <section className="benefits"><div><span>✳</span><p><strong>Thoughtfully selected</strong><small>Useful, everyday essentials</small></p></div><div><span>♧</span><p><strong>Made for daily life</strong><small>Style meets function</small></p></div><div><span>↗</span><p><strong>Easy, friendly shopping</strong><small>A simple checkout experience</small></p></div></section>
      <section className="shop-section" id="shop"><div className="section-heading"><div><p className="eyebrow">THE SHOP</p><h2>Find your <em>favourite.</em></h2></div><p className="section-note">A considered collection of useful things<br/>for home, work, and everywhere between.</p></div>
        <div className="shop-tools"><div className="filters">{categories.map(c=><button key={c} className={category===c?'filter active':'filter'} onClick={()=>setCategory(c)}>{c}</button>)}</div><label className="search-box"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Find something..." aria-label="Search products"/></label></div>
        {loading && <p className="muted">Checking the latest collection…</p>}
        <div className="product-grid">{visible.map((p,i)=><article className="product-card" key={p._id}><button className="product-image" onClick={()=>setSelected(p)} aria-label={`View ${p.name}`}><img src={p.image || '/images/backpack.png'} alt={p.name}/><span className="product-badge">{p.badge || 'EVERYDAY PICK'}</span><span className="quick-view">Quick view <ArrowRight size={14}/></span></button><div className="product-info"><div><p className="product-category">{p.category}</p><h3>{p.name}</h3></div><button className="add-btn" onClick={()=>add(p)} aria-label={`Add ${p.name} to bag`}><Plus size={18}/></button></div><p className="product-bottom"><strong>{money(p.price)}</strong><span>Inclusive of taxes</span></p></article>)}</div>
        {!visible.length && <div className="empty-state"><Search size={25}/><h3>No matches just yet</h3><p>Try another search or category.</p><button className="text-btn" onClick={()=>{setQuery('');setCategory('All')}}>Clear filters</button></div>}
      </section>
      <section className="story" id="story"><div className="story-art"><img src="/images/story.png" alt="Illustration of calm, useful everyday objects"/></div><div><p className="eyebrow">A SMALLER, BETTER WAY</p><h2>Make room for<br/><em>what matters.</em></h2><p>We believe the best things don't need to be complicated. ShopEase is a student-built e-commerce concept focused on simple discovery, clear product details, and a friendly shopping experience.</p><a href="#shop" className="text-btn">Meet the collection <ArrowRight size={16}/></a></div></section>
    </main>
    <footer id="footer"><div className="footer-top"><a className="brand footer-brand" href="#"><span className="brand-mark">s.</span><span>shop<span className="brand-light">ease</span><small>EVERYDAY, BETTER.</small></span></a><p>A college project made to bring<br/>simple shopping to life.</p><a href="#shop" className="footer-link">Back to shop ↑</a></div><div className="footer-bottom"><span>© 2026 ShopEase Student Project</span><span>Built with the MERN Stack · Demo store</span></div></footer>
    {notice && <div className="toast"><CheckCircle2 size={17}/>{notice}</div>}
    {selected && <div className="overlay" onClick={()=>setSelected(null)}><section className="modal product-modal" onClick={e=>e.stopPropagation()}><button className="close-btn" onClick={()=>setSelected(null)} aria-label="Close"><X/></button><img src={selected.image || '/images/backpack.png'} alt={selected.name}/><div><p className="eyebrow">{selected.category}</p><h2>{selected.name}</h2><p>{selected.description}</p><h3>{money(selected.price)}</h3><button className="primary-btn" onClick={()=>{add(selected);setSelected(null)}}>Add to bag <ShoppingBag size={17}/></button></div></section></div>}
    {cartOpen && <div className="overlay" onClick={()=>setCartOpen(false)}><section className="drawer" onClick={e=>e.stopPropagation()}><div className="drawer-heading"><div><p className="eyebrow">YOUR SELECTION</p><h2>Your bag <span>({count})</span></h2></div><button className="close-btn" onClick={()=>setCartOpen(false)} aria-label="Close cart"><X/></button></div>
      {!cart.length ? <div className="empty-state"><ShoppingBag size={28}/><h3>Your bag is taking a break</h3><p>Find something you'll love.</p><button className="primary-btn" onClick={()=>setCartOpen(false)}>Continue shopping <ArrowRight size={16}/></button></div> :
      <><div className="cart-items">{cart.map(i=><div className="cart-item" key={i._id}><img src={i.image || '/images/backpack.png'} alt={i.name}/><div className="cart-item-info"><strong>{i.name}</strong><span>{money(i.price)}</span><div className="qty"><button onClick={()=>changeQty(i._id,-1)} aria-label="Decrease quantity"><Minus size={13}/></button><span>{i.qty}</span><button onClick={()=>changeQty(i._id,1)} aria-label="Increase quantity"><Plus size={13}/></button></div></div><strong>{money(i.price*i.qty)}</strong></div>)}</div><div className="cart-summary"><div><span>Subtotal</span><strong>{money(subtotal)}</strong></div><p>Shipping and taxes are calculated at checkout.</p><button className="primary-btn full" onClick={()=>{setCheckout(true);setCartOpen(false)}}>Continue to checkout <ArrowRight size={17}/></button></div></>}
    </section></div>}
    {checkout && <div className="overlay" onClick={()=>setCheckout(false)}><section className="modal checkout-modal" onClick={e=>e.stopPropagation()}><button className="close-btn" onClick={()=>setCheckout(false)} aria-label="Close"><X/></button><p className="eyebrow">ALMOST YOURS</p><h2>Demo checkout</h2><p className="muted">No payment is collected. This creates a test order for the project demonstration.</p><form onSubmit={placeOrder}><label>Full name<input required value={customer.name} onChange={e=>setCustomer({...customer,name:e.target.value})} placeholder="Your name"/></label><label>Email address<input required type="email" value={customer.email} onChange={e=>setCustomer({...customer,email:e.target.value})} placeholder="you@example.com"/></label><label>Delivery address<textarea required value={customer.address} onChange={e=>setCustomer({...customer,address:e.target.value})} placeholder="Street, city, PIN code"/></label><div className="checkout-total"><span>Order total</span><strong>{money(subtotal)}</strong></div><button className="primary-btn full" type="submit">Place demo order <ArrowRight size={17}/></button></form></section></div>}
    {orderDone && <div className="overlay"><section className="modal success-modal"><span className="success-icon"><CheckCircle2 size={30}/></span><p className="eyebrow">ORDER CONFIRMED</p><h2>Thanks for your order.</h2><p>Your demo order number is <strong>{orderDone.orderNumber || orderDone._id || 'created'}</strong>.</p><p className="muted">This is a college project demonstration. No payment was taken.</p><button className="primary-btn" onClick={()=>setOrderDone(null)}>Continue browsing <ArrowRight size={16}/></button></section></div>}
  </div>
}
