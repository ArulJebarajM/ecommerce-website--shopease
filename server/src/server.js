import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import mongoose from 'mongoose'
import productRoutes from './routes/products.js'
import reviewsRouter from './routes/reviews.js'
import orderRoutes from './routes/orders.js'
import adminRoutes from './routes/admin.js'
import authRoutes from './routes/auth.js'

const app = express()
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
app.use(express.json({ limit: '1mb' }))
app.use(morgan('dev'))

app.get('/api/health', (_req,res) => res.json({ status:'ok', service:'ShopEase API' }))
app.use('/api/auth', authRoutes)
app.use('/api/reviews', reviewsRouter)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/admin', adminRoutes)

app.use((req,res) => res.status(404).json({ message:`Route not found: ${req.method} ${req.originalUrl}` }))
app.use((err,_req,res,_next) => {
  console.error(err)
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' })
})

const port = process.env.PORT || 5000
try {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/shopease')
  console.log('MongoDB connected')
  app.listen(port, () => console.log(`ShopEase API listening on http://localhost:${port}`))
} catch (error) {
  console.error('Database connection failed:', error.message)
  process.exit(1)
}
