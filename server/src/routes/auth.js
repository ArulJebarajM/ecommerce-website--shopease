
import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import rateLimit from 'express-rate-limit'
import User from '../models/User.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    message: 'Too many login attempts. Please try again later.'
  }
})

function validEmail(email) {
  return (
    typeof email === 'string' &&
    email.length <= 254 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  )
}

function createToken(user) {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured')
  }

  return jwt.sign(
    { role: user.role },
    process.env.JWT_SECRET,
    {
      subject: user._id.toString(),
      expiresIn: '2h',
      issuer: 'shopease-api',
      audience: 'shopease-client',
      algorithm: 'HS256'
    }
  )
}

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  }
}

// Register a customer account.
router.post('/register', authLimiter, async (req, res, next) => {
  try {
    const { name, email, password } = req.body || {}

    if (
      typeof name !== 'string' ||
      name.trim().length < 2 ||
      name.trim().length > 80
    ) {
      return res.status(400).json({
        message: 'Name must contain 2 to 80 characters'
      })
    }

    if (!validEmail(email)) {
      return res.status(400).json({
        message: 'Enter a valid email address'
      })
    }

    if (
      typeof password !== 'string' ||
      password.length < 12 ||
      password.length > 72
    ) {
      return res.status(400).json({
        message: 'Password must contain 12 to 72 characters'
      })
    }

    const normalizedEmail = email.trim().toLowerCase()
    const existing = await User.findOne({ email: normalizedEmail })

    if (existing) {
      return res.status(409).json({
        message: 'An account with this email already exists'
      })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    // Never accept role from the registration request.
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: 'user'
    })

    res.status(201).json({
      message: 'Registration successful',
      token: createToken(user),
      user: publicUser(user)
    })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'An account with this email already exists'
      })
    }
    next(error)
  }
})

// Log in an existing customer or administrator.
router.post('/login', authLimiter, async (req, res, next) => {
  try {
    const { email, password } = req.body || {}

    if (
      !validEmail(email) ||
      typeof password !== 'string' ||
      password.length > 72
    ) {
      return res.status(400).json({
        message: 'Enter a valid email and password'
      })
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase()
    }).select('+password')

    if (
      !user ||
      !(await bcrypt.compare(password, user.password))
    ) {
      return res.status(401).json({
        message: 'Incorrect email or password'
      })
    }

    res.json({
      message: 'Login successful',
      token: createToken(user),
      user: publicUser(user)
    })
  } catch (error) {
    next(error)
  }
})

// Return the currently authenticated account.
router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.auth.userId)

    if (!user) {
      return res.status(401).json({
        message: 'Account no longer exists'
      })
    }

    res.json({ user: publicUser(user) })
  } catch (error) {
    next(error)
  }
})

export default router
