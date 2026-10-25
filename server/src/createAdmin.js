
import 'dotenv/config'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import User from './models/User.js'

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  const password = process.env.ADMIN_PASSWORD

  if (!email || !password || password.length < 12 || password.length > 72) {
    throw new Error(
      'Set ADMIN_EMAIL and a 12–72 character ADMIN_PASSWORD in server/.env'
    )
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('ADMIN_EMAIL is not valid')
  }

  await mongoose.connect(process.env.MONGODB_URI)

  const hashedPassword = await bcrypt.hash(password, 12)

  const existing = await User.findOne({ email })

  if (existing) {
    // Explicitly promote this configured account to admin and
    // reset its password to the value in .env.
    existing.name = 'ShopEase Administrator'
    existing.password = hashedPassword
    existing.role = 'admin'
    await existing.save()

    console.log(`Updated administrator account: ${email}`)
  } else {
    await User.create({
      name: 'ShopEase Administrator',
      email,
      password: hashedPassword,
      role: 'admin'
    })

    console.log(`Created administrator account: ${email}`)
  }
}

main()
  .catch(error => {
    console.error('Administrator setup failed:', error.message)
    process.exitCode = 1
  })
  .finally(async () => {
    await mongoose.disconnect()
  })
