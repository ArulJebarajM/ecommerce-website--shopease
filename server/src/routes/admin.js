
import { Router } from 'express'
import Product from '../models/Product.js'
import Order from '../models/Order.js'
import { requireAuth, requireAdmin } from '../middleware/auth.js'

const router = Router()

// Every route below requires a valid administrator login.
router.use(requireAuth, requireAdmin)

router.post('/products', async (req, res, next) => {
  try {
    const {
      name,
      category,
      price,
      description,
      image,
      badge,
      stock
    } = req.body || {}

    if (
      typeof name !== 'string' ||
      !name.trim() ||
      name.trim().length > 120 ||
      typeof category !== 'string' ||
      !category.trim() ||
      !Number.isFinite(Number(price)) ||
      Number(price) < 0 ||
      (stock !== undefined &&
        (!Number.isInteger(Number(stock)) || Number(stock) < 0))
    ) {
      return res.status(400).json({
        message: 'Enter a valid name, category, price, and stock'
      })
    }

    const product = await Product.create({
      name: name.trim(),
      category: category.trim(),
      price: Number(price),
      description:
        typeof description === 'string' ? description.trim() : '',
      image: typeof image === 'string' && image.trim()
        ? image.trim()
        : '/images/backpack.png',
      badge: typeof badge === 'string' ? badge.trim() : 'EVERYDAY PICK',
      stock: stock === undefined ? 10 : Number(stock)
    })

    res.status(201).json(product)
  } catch (error) {
    next(error)
  }
})

router.put('/products/:id', async (req, res, next) => {
  try {
    const allowed = [
      'name',
      'category',
      'price',
      'description',
      'image',
      'badge',
      'stock'
    ]

    // Do not allow updates to arbitrary fields.
    const updates = Object.fromEntries(
      Object.entries(req.body || {}).filter(([key]) =>
        allowed.includes(key)
      )
    )

    if (!Object.keys(updates).length) {
      return res.status(400).json({
        message: 'No valid product fields supplied'
      })
    }

    if (
      updates.name !== undefined &&
      (typeof updates.name !== 'string' ||
        !updates.name.trim() ||
        updates.name.trim().length > 120)
    ) {
      return res.status(400).json({ message: 'Invalid product name' })
    }

    if (
      updates.category !== undefined &&
      (typeof updates.category !== 'string' ||
        !updates.category.trim())
    ) {
      return res.status(400).json({ message: 'Invalid category' })
    }

    if (
      updates.price !== undefined &&
      (!Number.isFinite(Number(updates.price)) ||
        Number(updates.price) < 0)
    ) {
      return res.status(400).json({ message: 'Invalid price' })
    }

    if (
      updates.stock !== undefined &&
      (!Number.isInteger(Number(updates.stock)) ||
        Number(updates.stock) < 0)
    ) {
      return res.status(400).json({ message: 'Invalid stock quantity' })
    }

    if (updates.name !== undefined) updates.name = updates.name.trim()
    if (updates.category !== undefined) {
      updates.category = updates.category.trim()
    }
    if (updates.price !== undefined) updates.price = Number(updates.price)
    if (updates.stock !== undefined) updates.stock = Number(updates.stock)

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    )

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    res.json(product)
  } catch (error) {
    next(error)
  }
})

router.delete('/products/:id', async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    res.json({
      message: 'Product deleted',
      id: product._id
    })
  } catch (error) {
    next(error)
  }
})

// Get all orders (admin only)
router.get('/orders', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })

    res.json(orders)
  } catch (error) {
    next(error)
  }
})

// Update order status (admin only)
router.patch('/orders/:id/status', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const allowedStatuses = [
      'Placed',
      'Processing',
      'Shipped',
      'Delivered',
      'Cancelled'
    ]

    const { status } = req.body

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Invalid order status'
      })
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )

    if (!order) {
      return res.status(404).json({
        message: 'Order not found'
      })
    }

    res.json(order)
  } catch (error) {
    next(error)
  }
})

export default router
