const mongoose = require('mongoose')
const CourseSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  duration: { type: Number, required: true },
  fees: { type: Number, required: true },
  description: { type: String, required: true },
})

const CourseModal = mongoose.model('Courses', CourseSchema)
module.exports = CourseModal
