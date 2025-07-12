const mongoose = require('mongoose')
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['admin', 'teacher', 'student'],
      required: true,
    },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    dob: { type: Date },
    address: { type: String },

    admin_name: {
      type: String,
      required: function () {
        return this.role === 'admin'
      },
    },
    name: {
      type: String,
      required: function () {
        return this.role === 'student'
      },
    },
    image: {
      type: String,
    },

    // To forget password
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
  },
  { timestamps: true },
)

module.exports = mongoose.model('Users', userSchema)
