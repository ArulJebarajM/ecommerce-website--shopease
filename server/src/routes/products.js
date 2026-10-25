import { Router } from 'express'
import mongoose from 'mongoose'
import Product from '../models/Product.js'
const router = Router()
router.get('/', async (req,res,next) => {
  try {
    const { search, category, sort='newest', page='1', limit='50' } = req.query
    const filter = {}
    if (search) filter.name = { $regex: String(search).replace(/[.*+?^${}()|[\]\\]/g,'\\$&'), $options:'i' }
    if (category && category !== 'All') filter.category = category
    const sortMap = { priceAsc:{price:1}, priceDesc:{price:-1}, newest:{createdAt:-1} }
    const p = Math.max(1,Number(page)||1), l = Math.min(100,Math.max(1,Number(limit)||50))
    const [items,total] = await Promise.all([Product.find(filter).sort(sortMap[sort]||sortMap.newest).skip((p-1)*l).limit(l),Product.countDocuments(filter)])
    res.json(items)
  } catch(e){next(e)}
})
router.get('/:id', async (req,res,next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({message:'Invalid product ID'})
    const item = await Product.findById(req.params.id)
    if (!item) return res.status(404).json({message:'Product not found'})
    res.json(item)
  } catch(e){next(e)}
})
export default router
