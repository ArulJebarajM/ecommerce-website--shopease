import 'dotenv/config'
import mongoose from 'mongoose'
import Product from './models/Product.js'
const products = [
{name:'Everyday Backpack',category:'Accessories',price:1299,description:'A lightweight everyday backpack for work, college, and weekend trips.',image:'/images/backpack.png',badge:'BESTSELLER',stock:18},
{name:'Minimal Sneakers',category:'Footwear',price:2199,description:'Clean, versatile sneakers designed for everyday comfort.',image:'/images/sneakers.png',badge:'NEW',stock:24},
{name:'Ceramic Coffee Set',category:'Home',price:899,description:'A simple ceramic set for slow mornings and coffee breaks.',image:'/images/coffee.png',badge:'POPULAR',stock:32},
{name:'Wireless Headphones',category:'Electronics',price:2499,description:'Comfortable over-ear headphones for music, calls, and study.',image:'/images/headphones.png',badge:'TOP PICK',stock:12},
{name:'Classic Watch',category:'Accessories',price:1799,description:'A timeless watch with a clean face and comfortable strap.',image:'/images/watch.png',badge:'LIMITED',stock:9},
{name:'Desk Lamp',category:'Home',price:1099,description:'A warm, adjustable desk lamp for focused evenings.',image:'/images/lamp.png',badge:'ESSENTIAL',stock:15}
]
await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/shopease')
await Product.deleteMany({})
await Product.insertMany(products)
console.log(`Seeded ${products.length} products`)
await mongoose.disconnect()
