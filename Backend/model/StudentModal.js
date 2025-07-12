const mongoose = require('mongoose')
const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    dob: { type: Date },
    mobile: { type: Number },
    alternate_number: { type: Number },
    father_name: { type: String },
    mother_name: { type: String },
    roll_no: { type: String },
    admission_date: { type: Date, default: Date.now },
    address: { type: String },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Courses',
    },

    image: { type: String, default: '' },
    isSeenByAdmin: { type: Boolean, default: false }, // all new students are unseen initially by admin
  },
  { timestamps: true }, // This adds createdAt and updatedAt
)

// "Students" refer to the title-name of collection in database
const StudentModal = mongoose.model('Students', studentSchema)
module.exports = StudentModal
