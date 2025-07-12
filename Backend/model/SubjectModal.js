const mongoose = require('mongoose')

const SubjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Courses',
      require: true,
    },
  },
  { timestamps: true },
)
module.exports = mongoose.model('Subjects', SubjectSchema)
