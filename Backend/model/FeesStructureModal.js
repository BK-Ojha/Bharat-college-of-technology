const mongoose = require('mongoose')
const feesStructureSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Courses',
      required: true,
    },
    fees_name: {
      type: String,
      enum: ['Exam', 'Registration', 'Admission', 'Course', 'Other'],
      required: true,
    },
    frequency: {
      type: String,
      enum: ['One Time', 'Monthly', 'Quarterly', 'Yearly'],
      required: true,
    },
    amount: { type: Number, required: true, min: 0 },
    custom_fees_name: { type: String, default: null, trim: true },
  },
  { timestamps: true },
)

const FeesStructureModal = mongoose.model('FeesStructures', feesStructureSchema)
module.exports = FeesStructureModal
