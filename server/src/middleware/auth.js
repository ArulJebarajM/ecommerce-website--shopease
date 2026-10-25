
import jwt from 'jsonwebtoken'

export function requireAuth(req, res, next) {
  const authorization = req.get('authorization') || ''
  const [scheme, token] = authorization.split(' ')

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({
      message: 'Please log in to continue'
    })
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({
      message: 'Authentication is not configured'
    })
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'],
      issuer: 'shopease-api',
      audience: 'shopease-client'
    })

    if (
      typeof payload.sub !== 'string' ||
      !['user', 'admin'].includes(payload.role)
    ) {
      return res.status(401).json({
        message: 'Invalid login token'
      })
    }

    // Make the authenticated user's details available to routes.
    req.auth = {
      userId: payload.sub,
      role: payload.role
    }

    return next()
  } catch {
    return res.status(401).json({
      message: 'Your session is invalid or expired. Please log in again.'
    })
  }
}

export function requireAdmin(req, res, next) {
  if (req.auth?.role !== 'admin') {
    return res.status(403).json({
      message: 'Administrator access required'
    })
  }

  return next()
}
