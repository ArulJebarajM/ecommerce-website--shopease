import express from 'express'
import mongoose from 'mongoose'
import Review from '../models/Review.js'
import Product from '../models/Product.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

// Get reviews for a product
router.get('/:productId', async (req, res) => {
  try {
    const { productId } = req.params

    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({ message: 'Invalid product ID.' })
    }

    const reviews = await Review.find({ product: productId })
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .lean()

    const averageRating = reviews.length
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0

    res.json({
      reviews,
      averageRating: Number(averageRating.toFixed(1)),
      reviewCount: reviews.length,
    })
  } catch (error) {
    console.error('Get reviews error:', error)
    res.status(500).json({ message: 'Could not load reviews.' })
  }
})

// Submit a review (login required)
router.post('/:productId', requireAuth, async (req, res) => {
  try {
    const { productId } = req.params
    const rating = Number(req.body.rating)
    const comment = typeof req.body.comment === 'string'
      ? req.body.comment.trim()
      : ''

    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({ message: 'Invalid product ID.' })
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be from 1 to 5.' })
    }

    if (comment.length < 3 || comment.length > 1000) {
      return res.status(400).json({
        message: 'Comment must be between 3 and 1000 characters.',
      })
    }

    const productExists = await Product.exists({ _id: productId })

    if (!productExists) {
      return res.status(404).json({ message: 'Product not found.' })
    }

    const review = await Review.create({
  product: productId,
  user: req.auth.userId,
  rating,
  comment,
})

    const populatedReview = await Review.findById(review._id)
      .populate('user', 'name')
      .lean()

    res.status(201).json({
      message: 'Review submitted successfully.',
      review: populatedReview,
    })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'You have already reviewed this product.',
      })
    }

    console.error('Submit review error:', error)
    res.status(500).json({ message: 'Could not submit review.' })
  }
})

export default router