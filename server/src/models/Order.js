
import mongoose from 'mongoose'

const statusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: [
        'Placed',
        'Processing',
        'Shipped',
        'Delivered',
        'Cancelled'
      ],
      required: true
    },
    note: {
      type: String,
      default: ''
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
)

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true
    },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      address: { type: String, required: true }
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          default: null
        },
        name: String,
        price: { type: Number, min: 0 },
        quantity: { type: Number, min: 1 }
      }
    ],
    total: {
      type: Number,
      required: true,
      min: 0
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed', 'Cancelled'],
      default: 'Pending'
    },
    status: {
      type: String,
      enum: [
        'Placed',
        'Processing',
        'Shipped',
        'Delivered',
        'Cancelled'
      ],
      default: 'Placed'
    },
    statusHistory: {
      type: [statusHistorySchema],
      default: []
    }
  },
  { timestamps: true }
)

export default mongoose.model('Order', orderSchema)
