const mongoose = require('mongoose')

const studentFeesSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Courses',
      required: true,
    },
    fees: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FeesStructures',
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Students',
      required: true,
    },
    original_amount: {
      type: Number,
    },
    final_amount: {
      type: Number,
    },
    discount: {
      type: Number,
      default: 0,
    },
    applied_at: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
)

const FeesApplyModal = mongoose.model('StudentFees', studentFeesSchema)
module.exports = FeesApplyModal
