
import { Router } from 'express'
import Order from '../models/Order.js'
import Product from '../models/Product.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// Create an order using verified database prices and stock.
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { customer, items } = req.body

    if (
      !customer?.name?.trim() ||
      !/^\S+@\S+\.\S+$/.test(customer.email || '') ||
      !customer?.address?.trim()
    ) {
      return res.status(400).json({
        message: 'Enter a valid name, email, and address'
      })
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty' })
    }

    // Validate product IDs and quantities.
    const quantities = new Map()

    for (const item of items) {
      if (
        !item.productId ||
        !/^[a-f\d]{24}$/i.test(String(item.productId)) ||
        !Number.isInteger(Number(item.quantity)) ||
        Number(item.quantity) < 1
      ) {
        return res.status(400).json({ message: 'Invalid order item' })
      }

      const id = String(item.productId)
      quantities.set(
        id,
        (quantities.get(id) || 0) + Number(item.quantity)
      )
    }

    // Fetch the real products and prices from MongoDB.
    const productIds = [...quantities.keys()]
    const products = await Product.find({
      _id: { $in: productIds }
    })

    if (products.length !== productIds.length) {
      return res.status(400).json({
        message: 'One or more products no longer exist'
      })
    }

    const productMap = new Map(
      products.map(product => [String(product._id), product])
    )

    const safeItems = []

    for (const [productId, quantity] of quantities) {
      const product = productMap.get(productId)

    
const availableStock = Number(product.stock)

if (
  !Number.isInteger(quantity) ||
  quantity < 1 ||
  !Number.isFinite(availableStock) ||
  availableStock < quantity
) {
  return res.status(400).json({
    message: `Insufficient stock for ${product.name}`
  })
}


      safeItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity
      })
    }

    const total = safeItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )

    // Reserve stock atomically for each product.
    const reservedProducts = []

    try {
      for (const item of safeItems) {
        const updatedProduct = await Product.findOneAndUpdate(
          {
            _id: item.productId,
            stock: { $gte: item.quantity }
          },
          {
            $inc: { stock: -item.quantity }
          },
          { new: true }
        )

        if (!updatedProduct) {
          throw new Error(`Insufficient stock for ${item.name}`)
        }

        reservedProducts.push(item)
      }

      const order = await Order.create({
        orderNumber: `SE-${Date.now().toString().slice(-8)}`,
        userId: req.auth.userId,
        customer: {
          name: customer.name.trim(),
          email: customer.email.trim().toLowerCase(),
          address: customer.address.trim()
        },
        items: safeItems,
        total
      })

      return res.status(201).json(order)
    } catch (error) {
      // Restore reserved stock if order creation fails.
      for (const item of reservedProducts) {
        await Product.updateOne(
          { _id: item.productId },
          { $inc: { stock: item.quantity } }
        )
      }

      if (error.message.startsWith('Insufficient stock for')) {
        return res.status(400).json({ message: error.message })
      }

      throw error
    }
  } catch (error) {
    next(error)
  }
})

// Get orders belonging to the logged-in customer.
router.get('/my-orders', requireAuth, async (req, res, next) => {
  try {
    const orders = await Order.find({
  userId: req.auth.userId
}).sort({ createdAt: -1 })

    res.json(orders)
  } catch (error) {
    next(error)
  }
})

// Get an order by ID or order number.
router.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params
    const searchConditions = [{ orderNumber: id }]

    if (/^[a-f\d]{24}$/i.test(id)) {
      searchConditions.push({ _id: id })
    }

    const filter = { $or: searchConditions }

   if (req.auth.role !== 'admin') {
  filter.userId = req.auth.userId
}

    const order = await Order.findOne(filter)

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    res.json(order)
  } catch (error) {
    next(error)
  }
})

// Simulate a payment for the logged-in customer's order.
// Demo only: this does not process real money.
router.patch('/:id/mock-payment', requireAuth, async (req, res, next) => {
  try {
    const { outcome } = req.body

    if (!['success', 'failure', 'cancel'].includes(outcome)) {
      return res.status(400).json({
        message: 'Outcome must be success, failure, or cancel'
      })
    }

    const order = await Order.findOne({
      $or: [
        { orderNumber: req.params.id },
        ...( /^[a-f\d]{24}$/i.test(req.params.id)
          ? [{ _id: req.params.id }]
          : [])
      ],
      userId: req.auth.userId
    })

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    if (order.paymentStatus === 'Paid') {
      return res.status(400).json({
        message: 'This order has already been paid'
      })
    }

    if (order.paymentStatus !== 'Pending') {
      return res.status(400).json({
        message: 'This order payment has already been completed'
      })
    }

    if (outcome === 'success') {
      order.paymentStatus = 'Paid'
    } else if (outcome === 'failure') {
      order.paymentStatus = 'Failed'
    } else {
      order.paymentStatus = 'Cancelled'
    }

    await order.save()

    return res.json({
      message: `Mock payment ${outcome}`,
      order
    })
  } catch (error) {
    next(error)
  }
})

export default router
