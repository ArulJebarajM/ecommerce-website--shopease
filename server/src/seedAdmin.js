
import 'dotenv/config'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import User from './models/User.js'

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  const password = process.env.ADMIN_PASSWORD
  const mongoUri = process.env.MONGODB_URI

  if (!email || !password || !mongoUri) {
    throw new Error(
      'ADMIN_EMAIL, ADMIN_PASSWORD, and MONGODB_URI must be configured'
    )
  }

  if (password.length < 12 || password.length > 72) {
    throw new Error('ADMIN_PASSWORD must contain 12–72 characters')
  }

  await mongoose.connect(mongoUri)

  const hashedPassword = await bcrypt.hash(password, 12)

  const existingUser = await User.findOne({ email })

  if (existingUser) {
    existingUser.name = 'ShopEase Administrator'
    existingUser.password = hashedPassword
    existingUser.role = 'admin'
    await existingUser.save()
    console.log('Existing account updated to admin.')
  } else {
    await User.create({
      name: 'ShopEase Administrator',
      email,
      password: hashedPassword,
      role: 'admin'
    })
    console.log('Admin account created successfully.')
  }
}

seedAdmin()
  .catch((error) => {
    console.error('Admin setup failed:', error.message)
    process.exitCode = 1
  })
  .finally(async () => {
    await mongoose.disconnect()
  })
